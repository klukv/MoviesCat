"""Модуль рекомендаций."""

from .popularity import get_popularity_baseline
from .similar_items import get_similar_items
from .user_recommendations import get_recommendations

__all__ = [
    "get_popularity_baseline",
    "get_recommendations",
    "get_similar_items",
]
