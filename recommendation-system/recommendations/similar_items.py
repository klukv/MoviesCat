"""Похожие фильмы (item-to-item)."""

import pandas as pd
from implicit.als import AlternatingLeastSquares


def get_similar_items(
    model: AlternatingLeastSquares,
    item_enc: dict,
    item_dec: dict,
    movies: pd.DataFrame,
    original_item_id: int,
    n: int = 10,
    verbose: bool = True,
) -> pd.DataFrame:
    """Возвращает топ-N похожих фильмов по косинусному сходству латентных векторов."""
    if original_item_id not in item_enc:
        print(f"⚠️  Фильм {original_item_id} не найден в матрице.")
        return pd.DataFrame()

    iid = item_enc[original_item_id]
    similar_ids, scores = model.similar_items(iid, N=n + 1)  # +1 т.к. первый — сам фильм

    results = [
        {"item_id": item_dec[i], "score": s}
        for i, s in zip(similar_ids, scores)
        if i != iid
    ][:n]

    df = pd.DataFrame(results).merge(movies, on="item_id", how="left")

    if verbose:
        source_title = movies.loc[movies.item_id == original_item_id, "title"].values
        title_str = source_title[0] if len(source_title) else str(original_item_id)
        print(f"\nПохожие на «{title_str}»:")
        print(df[["item_id", "title", "genres", "score"]].to_string(index=False))

    return df
