"""Train / Test Split (leave-last-out по timestamp).

⚠️  Случайный split ЗАПРЕЩЁН — создаёт data leakage и завышает метрики.
    Используем временну́ю метку: последнее взаимодействие каждого юзера → тест.
"""

import pandas as pd

from data.config import THRESHOLD
from .encoders import build_csr_from_pairs


def leave_last_out_split(
    ratings: pd.DataFrame,
    user_enc: dict,
    item_enc: dict,
    min_interactions: int = 3,
):
    """
    Разбивает данные на train/test по timestamp.
    Последнее взаимодействие каждого пользователя → тест.
    Только для пользователей с min_interactions+ взаимодействиями.

    Возвращает (train_csr, test_csr, active_users).
    """
    filtered_ratings = ratings[ratings["rating"] >= THRESHOLD].copy()

    last_ts = (
        filtered_ratings
        .groupby(["user_id", "item_id"])["timestamp"]
        .max()
        .reset_index()
    )

    last_ts["rank"] = last_ts.groupby("user_id")["timestamp"].rank(
        method="first", ascending=False
    )

    user_counts = last_ts.groupby("user_id")["item_id"].count()
    active_users = user_counts[user_counts >= min_interactions].index

    test_pairs = last_ts[
        (last_ts["rank"] == 1) & (last_ts["user_id"].isin(active_users))
    ]
    train_pairs = last_ts[last_ts["rank"] > 1]

    train_csr = build_csr_from_pairs(train_pairs, user_enc, item_enc)
    test_csr = build_csr_from_pairs(test_pairs, user_enc, item_enc)

    print(f"\nTrain ненулевых : {train_csr.nnz:,}")
    print(f"Test  ненулевых : {test_csr.nnz:,}")
    print(f"Тестовых юзеров : {test_csr.getnnz(axis=1).astype(bool).sum():,}")

    return train_csr, test_csr, active_users
