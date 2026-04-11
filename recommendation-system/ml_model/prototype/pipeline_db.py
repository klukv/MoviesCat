"""
Пайплайн обучения ALS на данных каталога Movies + неявные взаимодействия (как из БД).
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

from ml_model.prototype.data.db_loaders import load_training_payload
from ml_model.prototype.evaluation import compute_metrics
from ml_model.prototype.model import train_als
from ml_model.prototype.persistence import save_artifacts
from ml_model.prototype.preprocessing import build_encoders
from ml_model.prototype.preprocessing.interactions_split import (
    interactions_to_implicit,
    leave_last_out_interactions,
)
from ml_model.prototype.recommendations import (
    get_popularity_baseline,
    get_recommendations,
    get_similar_items,
)


def _sample_user_for_demo(active_users: pd.Index, user_enc: dict) -> str | int | None:
    if active_users is not None and len(active_users) > 0:
        return active_users[0]
    if user_enc:
        return next(iter(user_enc.keys()))
    return None


def train_from_training_payload_file(
    payload_path: str | Path,
    artifacts_path: str | Path = "als_model_artifacts.pkl",
    metrics_k: int = 10,
    min_interactions_for_eval: int = 3,
    show_progress: bool = True,
) -> dict:
    """
    Загружает JSON (movies + interactions), обучает ALS, сохраняет артефакты.

    Возвращает словарь с ключом metrics (или metrics=None, если тест пустой).
    """
    payload_path = Path(payload_path)
    artifacts_path = Path(artifacts_path)

    movies_df, interactions_df = load_training_payload(payload_path)

    implicit_df = interactions_to_implicit(interactions_df)
    user_enc, item_enc, user_dec, item_dec = build_encoders(implicit_df)

    train_csr, test_csr, active_users = leave_last_out_interactions(
        interactions_df,
        user_enc,
        item_enc,
        min_interactions=min_interactions_for_eval,
    )

    print("\nОбучаем ALS-модель (данные каталога Movies + implicit)...")
    model = train_als(train_csr, show_progress=show_progress)

    metrics: dict | None = None
    if test_csr.nnz > 0:
        print(f"\nВычисляем метрики @ K={metrics_k}...")
        metrics = compute_metrics(model, train_csr, test_csr, k=metrics_k)
        print(f"\n{'='*42}")
        print(f"  Пользователей в оценке : {metrics['n_users']:,}")
        print(f"  {'-'*38}")
        print(f"  Precision@{metrics_k}  : {metrics['precision']:.4f}")
        print(f"  Recall@{metrics_k}     : {metrics['recall']:.4f}")
        print(f"  NDCG@{metrics_k}       : {metrics['ndcg']:.4f}")
        print(f"  MAP@{metrics_k}        : {metrics['map']:.4f}")
        print(f"  Hit Rate@{metrics_k}   : {metrics['hit_rate']:.4f}")
        print(f"{'='*42}")
    else:
        print("\nТестовая выборка пуста — офлайн-метрики пропущены.")

    sample_user = _sample_user_for_demo(active_users, user_enc)
    if sample_user is not None:
        _ = get_recommendations(
            model,
            train_csr,
            user_enc,
            item_dec,
            movies_df,
            sample_user,
            n=5,
            verbose=True,
        )

    first_item = next(iter(item_enc.keys()), None)
    if first_item is not None:
        _ = get_similar_items(
            model,
            item_enc,
            item_dec,
            movies_df,
            original_item_id=first_item,
            n=5,
            verbose=True,
        )

    _ = get_popularity_baseline(
        train_csr,
        item_dec,
        movies_df,
        n=5,
        verbose=True,
    )

    save_artifacts(
        model,
        user_enc,
        item_enc,
        user_dec,
        item_dec,
        movies_df,
        train_csr=train_csr,
        path=artifacts_path,
    )

    return {"metrics": metrics, "artifacts_path": str(artifacts_path.resolve())}
