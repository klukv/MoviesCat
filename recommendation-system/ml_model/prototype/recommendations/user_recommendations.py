"""Рекомендации для конкретного пользователя."""

from __future__ import annotations

import pandas as pd
from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix

from ml_model.prototype.preprocessing.id_keys import resolve_encoder_key


def get_recommendations(
    model: AlternatingLeastSquares,
    train_csr: csr_matrix,
    user_enc: dict,
    item_dec: dict,
    movies: pd.DataFrame,
    original_user_id: str | int,
    n: int = 10,
    verbose: bool = True,
) -> pd.DataFrame:
    """
    Возвращает топ-N рекомендаций для пользователя.
    Уже просмотренные фильмы исключены (filter_already_liked_items=True).
    """
    user_key = resolve_encoder_key(original_user_id, user_enc)
    if user_key is None:
        print(f"! Пользователь {original_user_id} не найден в матрице.")
        return pd.DataFrame()

    uid = user_enc[user_key]
    item_ids, scores = model.recommend(
        uid,
        train_csr[uid],
        N=n,
        filter_already_liked_items=True,
    )

    recs = pd.DataFrame({
        "item_id": [item_dec[i] for i in item_ids],
        "score": scores,
    }).merge(movies, on="item_id", how="left")

    if verbose:
        print(f"\nТоп-{n} рекомендаций для пользователя {original_user_id}:")
        cols = [c for c in ("item_id", "title", "genre", "genres", "score") if c in recs.columns]
        print(recs[cols].to_string(index=False))

    return recs
