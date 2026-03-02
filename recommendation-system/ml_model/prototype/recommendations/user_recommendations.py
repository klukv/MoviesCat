"""Рекомендации для конкретного пользователя."""

import pandas as pd
from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix


def get_recommendations(
    model: AlternatingLeastSquares,
    train_csr: csr_matrix,
    user_enc: dict,
    item_dec: dict,
    movies: pd.DataFrame,
    original_user_id: int,
    n: int = 10,
    verbose: bool = True,
) -> pd.DataFrame:
    """
    Возвращает топ-N рекомендаций для пользователя.
    Уже просмотренные фильмы исключены (filter_already_liked_items=True).
    """
    if original_user_id not in user_enc:
        print(f"! Пользователь {original_user_id} не найден в матрице.")
        return pd.DataFrame()

    uid = user_enc[original_user_id]
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
        print(recs[["item_id", "title", "genres", "score"]].to_string(index=False))

    return recs
