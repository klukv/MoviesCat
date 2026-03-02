"""Сохранение и загрузка артефактов модели.

В продакшне: сохраняйте модель + энкодеры вместе — без энкодеров
модель бесполезна (индексы не соответствуют оригинальным ID).
"""

import pickle
from pathlib import Path

import pandas as pd
from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix


def save_artifacts(
    model: AlternatingLeastSquares,
    user_enc: dict,
    item_enc: dict,
    user_dec: dict,
    item_dec: dict,
    movies: pd.DataFrame,
    train_csr: csr_matrix | None = None,
    path: str | Path = "als_model_artifacts.pkl",
) -> None:
    """Сохраняет артефакты модели в pickle-файл."""
    artifacts = {
        "model": model,
        "user_enc": user_enc,
        "item_enc": item_enc,
        "user_dec": user_dec,
        "item_dec": item_dec,
        "movies": movies,
    }
    if train_csr is not None:
        artifacts["train_csr"] = train_csr

    with open(path, "wb") as f:
        pickle.dump(artifacts, f)

    # Без Unicode-стрелок, чтобы не падать на Windows-кодировках консоли.
    print(f"\nАртефакты сохранены -> {path}")
    print("Содержимое: model, user_enc, item_enc, user_dec, item_dec, movies")


def load_artifacts(path: str | Path = "als_model_artifacts.pkl") -> dict:
    """Загружает артефакты модели из pickle-файла."""
    with open(path, "rb") as f:
        return pickle.load(f)
