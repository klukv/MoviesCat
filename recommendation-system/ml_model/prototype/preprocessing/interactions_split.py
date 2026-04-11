"""
Предобработка неявных событий (user_id, item_id, weight, timestamp) и train/test split.

Leave-last-out по timestamp для каждого пользователя.
"""

from __future__ import annotations

import pandas as pd
from scipy.sparse import csr_matrix

from .encoders import build_csr_from_pairs


def interactions_to_implicit(interactions_df: pd.DataFrame) -> pd.DataFrame:
    """
    Агрегирует повторяющиеся пары (user, item) в один вес.
    Ожидаются колонки: user_id, item_id, weight.
    """
    implicit_df = (
        interactions_df.groupby(["user_id", "item_id"], as_index=False)
        .agg(weight=("weight", "sum"))
    )
    n_u = implicit_df["user_id"].nunique()
    n_i = implicit_df["item_id"].nunique()
    sparsity = 1 - len(implicit_df) / max(n_u * n_i, 1)
    print(f"\nВзаимодействий после агрегации : {len(implicit_df):,}")
    print(f"Разреженность матрицы           : {sparsity:.4f}")
    return implicit_df


def leave_last_out_interactions(
    interactions_df: pd.DataFrame,
    user_enc: dict,
    item_enc: dict,
    min_interactions: int = 3,
):
    """
    Последнее событие пользователя (по timestamp) → тест; остальное → train.
    Только пользователи с числом агрегированных событий >= min_interactions.

    interactions_df: сырые события с колонками user_id, item_id, weight, timestamp.
    """
    if interactions_df["timestamp"].max() == 0 and len(interactions_df) > 1:
        print(
            "! Все timestamp == 0: временной split недоступен, "
            "используем полный train без теста (метрики будут пропущены)."
        )
        train_pairs = (
            interactions_df.groupby(["user_id", "item_id"], as_index=False)
            .agg(weight=("weight", "sum"), timestamp=("timestamp", "max"))
        )
        train_csr = build_csr_from_pairs(train_pairs, user_enc, item_enc)
        empty = csr_matrix(train_csr.shape, dtype=train_csr.dtype)
        return train_csr, empty, pd.Index([], dtype=str)

    df = interactions_df.sort_values(["user_id", "timestamp", "item_id"]).copy()

    last_per_pair = (
        df.groupby(["user_id", "item_id"], as_index=False)
        .agg(timestamp=("timestamp", "max"), weight=("weight", "sum"))
    )

    last_per_pair["rank"] = last_per_pair.groupby("user_id")["timestamp"].rank(
        method="first",
        ascending=False,
    )

    user_counts = last_per_pair.groupby("user_id")["item_id"].count()
    active_users = user_counts[user_counts >= min_interactions].index

    test_pairs = last_per_pair[
        (last_per_pair["rank"] == 1) & (last_per_pair["user_id"].isin(active_users))
    ]
    train_pairs = last_per_pair[last_per_pair["rank"] > 1]

    train_csr = build_csr_from_pairs(train_pairs, user_enc, item_enc)
    test_csr = build_csr_from_pairs(test_pairs, user_enc, item_enc)

    print(f"\nTrain ненулевых : {train_csr.nnz:,}")
    print(f"Test  ненулевых : {test_csr.nnz:,}")
    if test_csr.nnz:
        print(f"Тестовых юзеров : {test_csr.getnnz(axis=1).astype(bool).sum():,}")

    return train_csr, test_csr, active_users
