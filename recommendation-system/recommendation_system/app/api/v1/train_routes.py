from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from recommendation_system.app.clients.backend import BackendAuthError, BackendFetchError
from recommendation_system.app.ml.training import (
    TrainingDataError,
    TrainingFetchSummary,
    train_model_from_backend,
)


router = APIRouter(prefix="/v1", tags=["model-training"])


class PaginatedFetchStatsResponse(BaseModel):
    pages_fetched: int
    items_fetched: int
    total_elements: Optional[int] = None


class TrainingFetchSummaryResponse(BaseModel):
    movies: PaginatedFetchStatsResponse
    interactions: Optional[PaginatedFetchStatsResponse] = None


class TrainModelResponse(BaseModel):
    status: str = "ok"
    artifacts_path: str
    metrics: Optional[dict[str, Any]] = None
    fetch: TrainingFetchSummaryResponse


def _stats_to_response(stats: TrainingFetchSummary) -> TrainingFetchSummaryResponse:
    return TrainingFetchSummaryResponse(
        movies=PaginatedFetchStatsResponse(
            pages_fetched=stats.movies.pages_fetched,
            items_fetched=stats.movies.items_fetched,
            total_elements=stats.movies.total_elements,
        ),
        interactions=(
            PaginatedFetchStatsResponse(
                pages_fetched=stats.interactions.pages_fetched,
                items_fetched=stats.interactions.items_fetched,
                total_elements=stats.interactions.total_elements,
            )
            if stats.interactions is not None
            else None
        ),
    )


@router.post(
    "/model/train",
    response_model=TrainModelResponse,
    status_code=status.HTTP_200_OK,
    summary="Обучить ALS на данных с основного бекенда",
)
async def post_train_model(
    metrics_k: int = Query(10, ge=1, le=50, description="K для офлайн-метрик leave-last-out"),
):
    """
    Пагинированно загружает каталог с `GET /api/movies` основного бекенда,
    при наличии `REC_SERVICE_BACKEND_INTERACTIONS_PATH` — также взаимодействия,
    обучает ALS и сохраняет артефакты.

    Авторизация на бекенде: логин/пароль в `recommendation-system/.env`
    (`REC_SERVICE_BACKEND_AUTH_USERNAME`, `REC_SERVICE_BACKEND_AUTH_PASSWORD`).
    """
    try:
        result = await train_model_from_backend(metrics_k=metrics_k)
    except BackendAuthError as exc:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"error": "backend_auth_failed", "detail": str(exc)},
        )
    except TrainingDataError as exc:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": "insufficient_training_data", "detail": str(exc)},
        )
    except BackendFetchError as exc:
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "error": "backend_fetch_failed",
                "detail": str(exc),
                "status_code": exc.status_code,
            },
        )
    except ValueError as exc:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": "training_failed", "detail": str(exc)},
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "training_failed"},
        )

    return TrainModelResponse(
        artifacts_path=result.artifacts_path,
        metrics=result.metrics,
        fetch=_stats_to_response(result.fetch),
    )
