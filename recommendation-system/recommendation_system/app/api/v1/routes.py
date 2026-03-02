from __future__ import annotations

from enum import Enum
from typing import Optional

from fastapi import APIRouter, Query, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, constr
from redis.exceptions import RedisError

from recommendation_system.app.core.redis import cache_del, cache_get, cache_set
from recommendation_system.app.messaging.kafka_producer import publish_user_activity_event
from recommendation_system.app.ml.model import (
    RecommendationContext,
    RecommendationItem,
    predict_recommendations,
)


router = APIRouter(prefix="/v1", tags=["recommendations"])


class RecommendationResponse(BaseModel):
    user_id: str
    cache_hit: bool
    recommendations: list[RecommendationItem]


class FeedbackActionEnum(str, Enum):
    watch = "watch"
    rate = "rate"
    skip = "skip"


class FeedbackRequest(BaseModel):
    user_id: constr(strip_whitespace=True, min_length=1)
    movie_id: constr(strip_whitespace=True, min_length=1)
    action: FeedbackActionEnum


class FeedbackResponse(BaseModel):
    cache_invalidated: bool


@router.get("/recommendations/{user_id}", response_model=RecommendationResponse)
async def get_recommendations(
    user_id: constr(strip_whitespace=True, min_length=1),
    limit: int = Query(20, ge=1, le=100),
    context: RecommendationContext = Query("homepage"),
    genre: Optional[str] = Query(None),
    exclude_watched: bool = Query(True),
):
    """
    Sequence-логика:
    1) GET rec:{user_id} из Redis
    2) cache HIT -> вернуть {cache_hit: true, recommendations: [...]}
    3) cache MISS -> predict(user_id) -> SET rec:{user_id} EX 3600 -> вернуть {cache_hit: false, ...}

    Fallback:
    - если Redis недоступен, не падаем: идём напрямую в модель
      и возвращаем 503 с {"error": "cache unavailable", "fallback": true, ...}
    """

    # 1) Пробуем кэш
    try:
        cached = await cache_get(user_id)
    except RedisError:
        # Redis недоступен -> fallback в модель
        try:
            recs = await predict_recommendations(
                user_id=user_id,
                limit=limit,
                context=context,
                genre=genre,
                exclude_watched=exclude_watched,
            )
        except Exception:
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"error": "model inference failed"},
            )

        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "error": "cache unavailable",
                "fallback": True,
                "user_id": user_id,
                "cache_hit": False,
                "recommendations": [r.dict() for r in recs],
            },
        )

    # 2) HIT
    if cached is not None:
        return RecommendationResponse(
            user_id=user_id,
            cache_hit=True,
            recommendations=[RecommendationItem(**it) for it in cached],
        )

    # 3) MISS -> модель
    try:
        recs = await predict_recommendations(
            user_id=user_id,
            limit=limit,
            context=context,
            genre=genre,
            exclude_watched=exclude_watched,
        )
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": "model inference failed"},
        )

    # 4) Пишем в кэш (если упадёт — не ломаем ответ)
    try:
        await cache_set(user_id, [r.dict() for r in recs])
    except RedisError:
        pass

    return RecommendationResponse(
        user_id=user_id,
        cache_hit=False,
        recommendations=recs,
    )


@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_202_ACCEPTED)
async def post_feedback(payload: FeedbackRequest):
    """
    Sequence-логика:
    1) DEL rec:{user_id} (инвалидация кэша)
    2) Publish event в Kafka (заглушка)
    3) return 202 {cache_invalidated: true}
    """
    cache_invalidated = True
    try:
        await cache_del(payload.user_id)
    except RedisError:
        cache_invalidated = False

    await publish_user_activity_event(
        {
            "user_id": payload.user_id,
            "movie_id": payload.movie_id,
            "action": payload.action.value,
        }
    )

    return FeedbackResponse(cache_invalidated=cache_invalidated)

