"""
Загрузка данных для обучения в формате, совместимом с сущностью Movies (Java backend).

Ожидаемый JSON (тот же контракт, что позже отдаст GET эндпоинт бекенда):

{
  "movies": [
    {
      "id": 1,
      "title": "...",
      "description": "...",
      "year": 2020,
      "country": "...",
      "genre": "...",
      "director": "...",
      "time": 120.0,
      "budget": 1000000,
      "imgUrl": "...",
      "type": "movie",
      "rating": 8.5
    }
  ],
  "interactions": [
    { "user_id": "42", "movie_id": "1", "weight": 1.0, "timestamp": 1710000000 }
  ]
}

Поддерживаются camelCase-алиасы: userId, movieId (частый стиль Jackson на бекенде).
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd


def _first(d: dict[str, Any], *keys: str) -> Any:
    for k in keys:
        if k in d and d[k] is not None:
            return d[k]
    return None


def _movie_row_to_record(raw: dict[str, Any]) -> dict[str, Any]:
    mid = _first(raw, "id", "movieId", "movie_id")
    if mid is None:
        raise ValueError("Каждый объект movies должен содержать id (или movieId).")

    return {
        "item_id": str(mid),
        "title": _first(raw, "title") or "",
        "description": _first(raw, "description"),
        "year": _first(raw, "year"),
        "country": _first(raw, "country"),
        "genre": _first(raw, "genre"),
        "director": _first(raw, "director"),
        "time": _first(raw, "time"),
        "budget": _first(raw, "budget"),
        "imgUrl": _first(raw, "imgUrl", "img_url"),
        "type": _first(raw, "type"),
        "rating": _first(raw, "rating"),
    }


def _interaction_row_to_record(raw: dict[str, Any]) -> dict[str, Any]:
    uid = _first(raw, "user_id", "userId")
    mid = _first(raw, "movie_id", "movieId")
    if uid is None or mid is None:
        raise ValueError("Каждый interaction должен содержать user_id/userId и movie_id/movieId.")

    ts = _first(raw, "timestamp", "ts", "createdAt", "created_at")
    w = _first(raw, "weight", "implicit_weight", "score")
    if w is None:
        w = 1.0

    return {
        "user_id": str(uid).strip(),
        "item_id": str(mid).strip(),
        "weight": float(w),
        "timestamp": int(ts) if ts is not None else 0,
    }


def load_training_payload(path: str | Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    """
    Читает JSON-файл с каталогом фильмов и событиями взаимодействий.

    Возвращает:
      movies_df — колонка item_id (str) + поля как в Movies.java
      interactions_df — user_id (str), item_id (str), weight, timestamp
    """
    path = Path(path)
    with open(path, encoding="utf-8") as f:
        payload = json.load(f)

    if not isinstance(payload, dict):
        raise ValueError("Корень JSON должен быть объектом с ключами movies и interactions.")

    movies_raw = payload.get("movies") or []
    inter_raw = payload.get("interactions") or []

    if not movies_raw:
        raise ValueError("Список movies пуст — без каталога обучать ALS некорректно.")
    if not inter_raw:
        raise ValueError("Список interactions пуст — нет неявных сигналов для обучения.")

    movies_records = [_movie_row_to_record(m) for m in movies_raw]
    inter_records = [_interaction_row_to_record(x) for x in inter_raw]

    movies_df = pd.DataFrame(movies_records)
    interactions_df = pd.DataFrame(inter_records)

    # Типы для стабильных merge / матрицы
    movies_df["item_id"] = movies_df["item_id"].astype(str)
    interactions_df["user_id"] = interactions_df["user_id"].astype(str)
    interactions_df["item_id"] = interactions_df["item_id"].astype(str)
    interactions_df["weight"] = interactions_df["weight"].astype(np.float32)
    interactions_df["timestamp"] = interactions_df["timestamp"].astype(np.int64)

    # Фильтруем «битые» ссылки на несуществующие фильмы (как при частичной выгрузке)
    known = set(movies_df["item_id"].unique())
    before = len(interactions_df)
    interactions_df = interactions_df[interactions_df["item_id"].isin(known)].copy()
    dropped = before - len(interactions_df)
    if dropped:
        print(f"! Отброшено взаимодействий с неизвестным movie_id: {dropped:,}")

    if interactions_df.empty:
        raise ValueError("После фильтрации по каталогу movies не осталось взаимодействий.")

    print(f"Загружено фильмов из каталога : {len(movies_df):,}")
    print(f"Загружено событий             : {len(interactions_df):,}")
    print(f"Уникальных пользователей      : {interactions_df['user_id'].nunique():,}")
    print(f"Уникальных фильмов в событиях : {interactions_df['item_id'].nunique():,}")

    return movies_df, interactions_df
