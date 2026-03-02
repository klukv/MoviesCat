"""Загрузка и парсинг MovieLens 1M."""

import os
import zipfile
import urllib.request

import numpy as np
import pandas as pd

from .config import DATA_DIR, ML1M_URL


def download_movielens(url: str = ML1M_URL, target_dir: str = DATA_DIR) -> None:
    """Скачивает и распаковывает MovieLens 1M, если ещё не скачан."""
    if os.path.exists(target_dir):
        print("Датасет уже скачан, пропускаем загрузку.")
        return
    print("Скачиваем MovieLens 1M (~6 МБ)...")
    zip_path = "ml-1m.zip"
    urllib.request.urlretrieve(url, zip_path)
    with zipfile.ZipFile(zip_path, "r") as zf:
        zf.extractall(".")
    os.remove(zip_path)
    print("Готово.")


def load_ratings(data_dir: str = DATA_DIR) -> pd.DataFrame:
    """
    Загружает ratings.dat.
    Формат: UserID::MovieID::Rating::Timestamp
    """
    path = os.path.join(data_dir, "ratings.dat")
    df = pd.read_csv(
        path,
        sep="::",
        engine="python",
        names=["user_id", "item_id", "rating", "timestamp"],
        dtype={"user_id": np.int32, "item_id": np.int32,
               "rating": np.float32, "timestamp": np.int64},
    )
    print(f"Загружено рейтингов : {len(df):,}")
    print(f"Уникальных юзеров  : {df.user_id.nunique():,}")
    print(f"Уникальных фильмов : {df.item_id.nunique():,}")
    return df


def load_movies(data_dir: str = DATA_DIR) -> pd.DataFrame:
    """Загружает movies.dat. Формат: MovieID::Title::Genres"""
    path = os.path.join(data_dir, "movies.dat")
    df = pd.read_csv(
        path,
        sep="::",
        engine="python",
        names=["item_id", "title", "genres"],
        encoding="latin-1",
        dtype={"item_id": np.int32},
    )
    return df
