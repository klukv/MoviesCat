"""
Оркестрация обучения: пагинированная выгрузка с бекенда → ALS → артефакты.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from ml_model.prototype.pipeline_db import train_from_raw_lists

from recommendation_system.app.clients.backend import (
    BackendAuthError,
    BackendFetchError,
    PaginatedFetchStats,
    create_authenticated_backend_client,
)
from recommendation_system.app.core.config import settings


@dataclass(frozen=True)
class TrainingFetchSummary:
    movies: PaginatedFetchStats
    interactions: PaginatedFetchStats | None


@dataclass(frozen=True)
class TrainingResult:
    artifacts_path: str
    metrics: dict[str, Any] | None
    fetch: TrainingFetchSummary


class TrainingDataError(ValueError):
    """Недостаточно данных для обучения ALS."""


async def fetch_training_data_from_backend() -> tuple[list[dict[str, Any]], list[dict[str, Any]], TrainingFetchSummary]:
    """
    Постранично загружает каталог фильмов и (опционально) взаимодействия с основного бекенда.
    """
    username = (settings.backend_auth_username or "").strip()
    password = settings.backend_auth_password or ""
    if not username or not password:
        raise BackendAuthError(
            "Не заданы REC_SERVICE_BACKEND_AUTH_USERNAME / REC_SERVICE_BACKEND_AUTH_PASSWORD."
        )

    client = await create_authenticated_backend_client(
        base_url=settings.backend_base_url,
        auth_username=username,
        auth_password=password,
        timeout_seconds=settings.backend_request_timeout_seconds,
    )
    page_size = settings.backend_movies_page_size
    max_pages = settings.backend_max_pages

    movies_raw, movies_stats = await client.fetch_all_movies(
        page_size=page_size,
        genre=settings.backend_movies_genre,
        sort=settings.backend_movies_sort,
        max_pages=max_pages,
    )

    interactions_raw: list[dict[str, Any]] = []
    interactions_stats: PaginatedFetchStats | None = None
    interactions_path = (settings.backend_interactions_path or "").strip()

    if interactions_path:
        interactions_raw, interactions_stats = await client.fetch_all_interactions(
            interactions_path=interactions_path,
            page_size=page_size,
            max_pages=max_pages,
        )

    summary = TrainingFetchSummary(movies=movies_stats, interactions=interactions_stats)
    return movies_raw, interactions_raw, summary


def _validate_training_data(
    movies_raw: list[dict[str, Any]],
    interactions_raw: list[dict[str, Any]],
) -> None:
    if not movies_raw:
        raise TrainingDataError(
            "Каталог фильмов пуст. Проверьте бекенд GET /api/movies и учётные данные в .env."
        )
    if not interactions_raw:
        raise TrainingDataError(
            "Нет взаимодействий для ALS. Задайте REC_SERVICE_BACKEND_INTERACTIONS_PATH "
            "(пагинированный GET на бекенде) или добавьте эндпоинт выгрузки implicit-событий."
        )


async def train_model_from_backend(
    *,
    artifacts_path: Path | None = None,
    metrics_k: int = 10,
) -> TrainingResult:
    """
    1) Пагинированная выгрузка с бекенда
    2) Обучение ALS в отдельном потоке (CPU-bound)
    3) Сброс кэша артефактов для инференса
    """
    movies_raw, interactions_raw, fetch_summary = await fetch_training_data_from_backend()
    _validate_training_data(movies_raw, interactions_raw)

    out_path = artifacts_path or Path(settings.model_artifacts_path)

    train_result = await asyncio.to_thread(
        train_from_raw_lists,
        movies_raw,
        interactions_raw,
        artifacts_path=out_path,
        metrics_k=metrics_k,
        show_progress=True,
    )

    from ml_model.inference import reload_artifacts_cache

    reload_artifacts_cache()

    return TrainingResult(
        artifacts_path=train_result["artifacts_path"],
        metrics=train_result.get("metrics"),
        fetch=fetch_summary,
    )


__all__ = [
    "BackendAuthError",
    "BackendFetchError",
    "TrainingDataError",
    "TrainingFetchSummary",
    "TrainingResult",
    "fetch_training_data_from_backend",
    "train_model_from_backend",
]
