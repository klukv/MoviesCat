"""Энкодеры и CSR-матрица."""

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix


def build_encoders(implicit_df: pd.DataFrame) -> tuple[dict, dict, dict, dict]:
    """
    Строит энкодеры user_id/item_id ↔ matrix indices.
    Возвращает (user_enc, item_enc, user_dec, item_dec).
    """
    users = implicit_df["user_id"].unique()
    items = implicit_df["item_id"].unique()

    user_enc = {u: i for i, u in enumerate(users)}
    item_enc = {it: i for i, it in enumerate(items)}
    user_dec = {i: u for u, i in user_enc.items()}
    item_dec = {i: it for it, i in item_enc.items()}

    return user_enc, item_enc, user_dec, item_dec


def build_csr_matrix(
    implicit_df: pd.DataFrame,
    user_enc: dict,
    item_enc: dict,
) -> csr_matrix:
    """Строит CSR-матрицу user_items[u, i] = weight взаимодействия."""
    rows = implicit_df["user_id"].map(user_enc).values
    cols = implicit_df["item_id"].map(item_enc).values
    data = implicit_df["weight"].values.astype(np.float32)

    user_items = csr_matrix(
        (data, (rows, cols)),
        shape=(len(user_enc), len(item_enc)),
        dtype=np.float32,
    )
    print(f"\nРазмер CSR-матрицы : {user_items.shape}")
    print(f"Ненулевых элементов: {user_items.nnz:,}")
    return user_items


def build_csr_from_pairs(
    df: pd.DataFrame,
    user_enc: dict,
    item_enc: dict,
) -> csr_matrix:
    """Строит CSR из DataFrame с колонками user_id, item_id."""
    valid = df[df["user_id"].isin(user_enc) & df["item_id"].isin(item_enc)]
    r = valid["user_id"].map(user_enc).values
    c = valid["item_id"].map(item_enc).values
    d = np.ones(len(valid), dtype=np.float32)
    return csr_matrix(
        (d, (r, c)),
        shape=(len(user_enc), len(item_enc)),
        dtype=np.float32,
    )
