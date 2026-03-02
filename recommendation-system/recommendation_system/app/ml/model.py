from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel

from ml_model import predict as prototype_predict


class RecommendationItem(BaseModel):
    movie_id: str
    score: float


RecommendationContext = Literal["homepage", "after_watch", "genre_page"]


async def predict_recommendations(
    user_id: str,
    limit: int,
    context: RecommendationContext,
    genre: Optional[str],
    exclude_watched: bool,
) -> list[RecommendationItem]:
    """
    Обёртка над ML-прототипом.

    Прототип синхронный, поэтому мы вызываем его напрямую.
    Если позже появится реальная async-инференс логика — можно заменить здесь,
    не трогая API-слой.
    """
    items: list[dict[str, Any]] = prototype_predict(
        user_id=user_id,
        limit=limit,
        context=context,
        genre=genre,
        exclude_watched=exclude_watched,
    )
    return [RecommendationItem(**it) for it in items]

