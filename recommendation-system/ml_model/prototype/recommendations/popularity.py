"""Popularity Baseline (холодный старт).

Для новых пользователей без истории взаимодействий —
возвращаем топ-N самых популярных фильмов.
"""

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix


def get_popularity_baseline(
    train_csr: csr_matrix,
    item_dec: dict,
    movies: pd.DataFrame,
    n: int = 10,
    verbose: bool = True,
) -> pd.DataFrame:
    """Топ-N фильмов по числу взаимодействий в трейне (popularity baseline)."""
    item_popularity = np.asarray(train_csr.sum(axis=0)).flatten()
    top_indices = np.argsort(item_popularity)[::-1][:n]

    df = pd.DataFrame({
        "item_id": [item_dec[i] for i in top_indices],
        "popularity": item_popularity[top_indices],
    }).merge(movies, on="item_id", how="left")

    if verbose:
        print(f"\nPopularity Baseline — топ-{n} фильмов:")
        print(df[["item_id", "title", "genres", "popularity"]].to_string(index=False))
    return df
