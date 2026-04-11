"""Офлайн-метрики рекомендаций.

Все метрики реализованы вручную — без зависимости от implicit.evaluation.
Реализованы:
  - Precision@K  : доля релевантных среди топ-K рекомендаций
  - Recall@K     : доля найденных релевантных из всех релевантных
  - NDCG@K       : учитывает позицию релевантного item в списке
  - MAP@K        : средняя точность по всем позициям (Mean Average Precision)
  - Hit Rate@K   : 1 если хотя бы 1 релевантный item попал в топ-K

⚠️  RMSE не реализуем — она для explicit-данных и здесь не применима.
"""

import numpy as np
from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix
from tqdm.auto import tqdm


def _dcg_at_k(relevances: np.ndarray, k: int) -> float:
    """
    Discounted Cumulative Gain для одного пользователя.
    relevances — бинарный массив длины K: 1 если item релевантен, иначе 0.
    Формула: DCG = Σ rel_i / log2(i+2), i=0..K-1
    """
    relevances = relevances[:k]
    if len(relevances) == 0:
        return 0.0
    positions = np.arange(1, len(relevances) + 1)
    discounts = np.log2(positions + 1)
    return float(np.sum(relevances / discounts))


def _ndcg_at_k_user(
    recommended: np.ndarray,
    relevant: set,
    k: int,
) -> float:
    """
    NDCG@K для одного пользователя.
    recommended — массив item-индексов в порядке убывания score (топ-K).
    relevant    — множество item-индексов, которые пользователь реально смотрел в тесте.
    """
    if not relevant:
        return 0.0
    relevances = np.array(
        [1.0 if item in relevant else 0.0 for item in recommended[:k]]
    )
    dcg = _dcg_at_k(relevances, k)
    ideal = _dcg_at_k(np.ones(min(len(relevant), k)), k)
    return dcg / ideal if ideal > 0 else 0.0


def _ap_at_k_user(
    recommended: np.ndarray,
    relevant: set,
    k: int,
) -> float:
    """
    Average Precision@K для одного пользователя.
    AP@K = (1/|relevant|) · Σ Precision@i · rel_i, i=1..K
    """
    if not relevant:
        return 0.0
    hits, score = 0, 0.0
    for i, item in enumerate(recommended[:k], start=1):
        if item in relevant:
            hits += 1
            score += hits / i
    return score / min(len(relevant), k)


def compute_metrics(
    model: AlternatingLeastSquares,
    train: csr_matrix,
    test: csr_matrix,
    k: int = 10,
) -> dict:
    """
    Вычисляет Precision@K, Recall@K, NDCG@K, MAP@K, HitRate@K
    для всех пользователей, у которых есть тестовые взаимодействия.

    Возвращает dict с ключами: precision, recall, ndcg, map, hit_rate, n_users
    """
    precisions, recalls, ndcgs, aps, hits = [], [], [], [], []

    test_users = np.where(np.diff(test.indptr) > 0)[0]

    for uid in tqdm(test_users, desc=f"Метрики@{k}"):
        relevant = set(test[uid].indices)

        try:
            recommended, _ = model.recommend(
                uid,
                train[uid],
                N=k,
                filter_already_liked_items=True,
            )
        except Exception:
            continue

        recommended = np.array(recommended)

        n_hits = sum(1 for item in recommended[:k] if item in relevant)
        precisions.append(n_hits / k)
        recalls.append(n_hits / len(relevant) if relevant else 0.0)
        ndcgs.append(_ndcg_at_k_user(recommended, relevant, k))
        aps.append(_ap_at_k_user(recommended, relevant, k))
        hits.append(1.0 if n_hits > 0 else 0.0)

    if not precisions:
        return {
            "precision": 0.0,
            "recall": 0.0,
            "ndcg": 0.0,
            "map": 0.0,
            "hit_rate": 0.0,
            "n_users": 0,
        }

    return {
        "precision": float(np.mean(precisions)),
        "recall": float(np.mean(recalls)),
        "ndcg": float(np.mean(ndcgs)),
        "map": float(np.mean(aps)),
        "hit_rate": float(np.mean(hits)),
        "n_users": len(precisions),
    }
