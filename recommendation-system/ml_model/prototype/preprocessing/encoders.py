"""Энкодеры и CSR-матрица."""

import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix


def build_encoders(implicit_df: pd.DataFrame) -> tuple[dict, dict, dict, dict]:
    """
    Строит энкодеры user_id/item_id ↔ matrix indices.
    Возвращает (user_enc, item_enc, user_dec, item_dec).

    Ключи user_enc / item_enc — str (совместимость с JSON/API и сущностью Movies.id).
    """
    users = implicit_df["user_id"].astype(str).unique().tolist()
    items = implicit_df["item_id"].astype(str).unique().tolist()

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
    rows = implicit_df["user_id"].astype(str).map(user_enc).values
    cols = implicit_df["item_id"].astype(str).map(item_enc).values
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
    """Строит CSR из DataFrame с колонками user_id, item_id; опционально weight."""
    u_col = df["user_id"].astype(str)
    i_col = df["item_id"].astype(str)
    mask = u_col.isin(user_enc) & i_col.isin(item_enc)
    r = u_col.loc[mask].map(user_enc).values
    c = i_col.loc[mask].map(item_enc).values
    if "weight" in df.columns:
        d = df.loc[mask, "weight"].values.astype(np.float32)
    else:
        d = np.ones(int(mask.sum()), dtype=np.float32)
    return csr_matrix(
        (d, (r, c)),
        shape=(len(user_enc), len(item_enc)),
        dtype=np.float32,
    )
