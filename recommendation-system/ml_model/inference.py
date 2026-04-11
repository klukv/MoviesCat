"""
Инференс ML-модели для Recommendation Service.

Задача: не переписывать текущий ML-прототип, а аккуратно "обернуть" его,
чтобы микросервис вызывал единый интерфейс `predict(...)`.

Обучение (отдельный job): ALS (implicit), артефакты в pickle (`als_model_artifacts.pkl`).
Инференс: персональные рекомендации или popularity baseline для новых пользователей.

В API есть параметры context/genre/exclude_watched — прототип их пока не поддерживает.
Мы принимаем их, но в этой версии они не влияют на выдачу (явное допущение).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any
import random

import pandas as pd

from ml_model.prototype.preprocessing.id_keys import resolve_encoder_key


DEFAULT_ARTIFACTS_PATH = Path("als_model_artifacts.pkl")


@dataclass(frozen=True)
class RecommendationItem:
    movie_id: str
    score: float


def _stub_recommendations(limit: int) -> list[RecommendationItem]:
    return [
        RecommendationItem(movie_id=f"movie_{i}", score=round(random.uniform(0.7, 0.99), 4))
        for i in range(1, limit + 1)
    ]


def _df_to_items(df: pd.DataFrame, score_col: str) -> list[RecommendationItem]:
    if df is None or df.empty:
        return []

    # Если это popularity baseline — нормализуем в 0..1
    if score_col == "popularity" and score_col in df.columns:
        max_val = float(df[score_col].max()) if len(df) else 0.0
        if max_val > 0:
            df = df.copy()
            df["score"] = df[score_col].astype(float) / max_val
            score_col = "score"

    items: list[RecommendationItem] = []
    for row in df.itertuples(index=False):
        movie_id = str(getattr(row, "item_id"))
        score = float(getattr(row, score_col))
        items.append(RecommendationItem(movie_id=movie_id, score=score))
    return items


_ARTIFACTS_CACHE: dict[str, Any] | None = None


def _load_artifacts_cached(path: Path) -> dict[str, Any]:
    global _ARTIFACTS_CACHE
    if _ARTIFACTS_CACHE is not None:
        return _ARTIFACTS_CACHE

    from ml_model.prototype.persistence import load_artifacts

    _ARTIFACTS_CACHE = load_artifacts(path)
    return _ARTIFACTS_CACHE


def predict(
    user_id: str,
    limit: int = 20,
    context: str = "homepage",
    genre: str | None = None,
    exclude_watched: bool = True,
    artifacts_path: Path = DEFAULT_ARTIFACTS_PATH,
) -> list[dict[str, Any]]:
    """
    Возвращает top-N в формате:
      [{"movie_id": "123", "score": 0.95}, ...]
    """
    _ = (context, genre, exclude_watched)  # интерфейсные параметры (пока без влияния)

    try:
        artifacts = _load_artifacts_cached(artifacts_path)
    except Exception:
        # Артефактов нет — отдаём заглушку, чтобы сервис работал "из коробки"
        return [item.__dict__ for item in _stub_recommendations(limit)]

    model = artifacts["model"]
    user_enc = artifacts["user_enc"]
    item_dec = artifacts["item_dec"]
    movies = artifacts["movies"]
    train_csr = artifacts.get("train_csr")

    if train_csr is None:
        return [item.__dict__ for item in _stub_recommendations(limit)]

    from ml_model.prototype.recommendations import get_popularity_baseline, get_recommendations

    if resolve_encoder_key(user_id, user_enc) is None:
        df = get_popularity_baseline(train_csr, item_dec, movies, n=limit, verbose=False)
        items = _df_to_items(df, "popularity")
        return [item.__dict__ for item in items]

    df = get_recommendations(
        model,
        train_csr,
        user_enc,
        item_dec,
        movies,
        user_id,
        n=limit,
        verbose=False,
    )
    items = _df_to_items(df, "score")
    return [item.__dict__ for item in items]

