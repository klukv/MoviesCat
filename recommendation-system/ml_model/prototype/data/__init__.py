"""Модуль загрузки данных."""

from .config import DATA_DIR, ML1M_URL, THRESHOLD
from .loaders import download_movielens, load_movies, load_ratings

__all__ = [
    "DATA_DIR",
    "ML1M_URL",
    "THRESHOLD",
    "download_movielens",
    "load_movies",
    "load_ratings",
]
