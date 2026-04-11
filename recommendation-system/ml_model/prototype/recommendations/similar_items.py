"""Похожие фильмы (item-to-item)."""

from __future__ import annotations

import pandas as pd
from implicit.als import AlternatingLeastSquares

from ml_model.prototype.preprocessing.id_keys import resolve_encoder_key


def get_similar_items(
    model: AlternatingLeastSquares,
    item_enc: dict,
    item_dec: dict,
    movies: pd.DataFrame,
    original_item_id: str | int,
    n: int = 10,
    verbose: bool = True,
) -> pd.DataFrame:
    """Возвращает топ-N похожих фильмов по косинусному сходству латентных векторов."""
    item_key = resolve_encoder_key(original_item_id, item_enc)
    if item_key is None:
        print(f"! Фильм {original_item_id} не найден в матрице.")
        return pd.DataFrame()

    iid = item_enc[item_key]
    similar_ids, scores = model.similar_items(iid, N=n + 1)  # +1 т.к. первый — сам фильм

    results = [
        {"item_id": item_dec[i], "score": s}
        for i, s in zip(similar_ids, scores)
        if i != iid
    ][:n]

    df = pd.DataFrame(results).merge(movies, on="item_id", how="left")

    if verbose:
        key = str(original_item_id)
        source_title = movies.loc[movies["item_id"].astype(str) == key, "title"].values
        title_str = source_title[0] if len(source_title) else str(original_item_id)
        print(f"\nПохожие на «{title_str}»:")
        cols = [c for c in ("item_id", "title", "genre", "genres", "score") if c in df.columns]
        print(df[cols].to_string(index=False))

    return df
