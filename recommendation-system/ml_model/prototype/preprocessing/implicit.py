"""Бинаризация и агрегация: Explicit → Implicit.

Оставляем только события с rating >= THRESHOLD.
weight = число таких событий (в 1M у каждой пары max 1 запись, но подход универсален).

Для реального онлайн-кинотеатра замените на SQL-агрегацию из Фазы 2.
"""

import pandas as pd

from ..data.config import THRESHOLD


def to_implicit(ratings: pd.DataFrame) -> pd.DataFrame:
    """Преобразует рейтинги в неявные взаимодействия (rating >= THRESHOLD)."""
    implicit_df = (
        ratings[ratings["rating"] >= THRESHOLD]
        .groupby(["user_id", "item_id"], as_index=False)
        .agg(weight=("rating", "count"))
    )
    print(f"\nВзаимодействий после фильтрации : {len(implicit_df):,}")
    print(
        f"Разреженность матрицы          : "
        f"{1 - len(implicit_df) / (implicit_df.user_id.nunique() * implicit_df.item_id.nunique()):.4f}"
    )
    return implicit_df
