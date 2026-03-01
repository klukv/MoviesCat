"""
Точка входа рекомендательной системы.
Оркестрирует загрузку данных, обучение модели, оценку и сохранение артефактов.
"""

import warnings

import implicit
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

print(f"implicit version : {implicit.__version__}")
print(f"numpy   version  : {np.__version__}")
print(f"pandas  version  : {pd.__version__}")


def main() -> None:
    # --- Загрузка данных ---
    from data import download_movielens, load_movies, load_ratings

    download_movielens()
    ratings = load_ratings()
    movies = load_movies()

    # --- Предобработка ---
    from preprocessing import (
        build_csr_matrix,
        build_encoders,
        leave_last_out_split,
        to_implicit,
    )

    implicit_df = to_implicit(ratings)
    user_enc, item_enc, user_dec, item_dec = build_encoders(implicit_df)
    user_items = build_csr_matrix(implicit_df, user_enc, item_enc)

    train_csr, test_csr, active_users = leave_last_out_split(
        ratings, user_enc, item_enc
    )

    # --- Обучение ALS ---
    from model import train_als

    print("\nОбучаем ALS-модель…")
    model = train_als(train_csr)

    # --- Оценка метрик ---
    from evaluation import compute_metrics

    K = 10
    print(f"\nВычисляем метрики @ K={K} (может занять ~1–2 мин)…")
    metrics = compute_metrics(model, train_csr, test_csr, k=K)

    print(f"\n{'='*42}")
    print(f"  Пользователей в оценке : {metrics['n_users']:,}")
    print(f"  {'─'*38}")
    print(f"  Precision@{K}  : {metrics['precision']:.4f}")
    print(f"  Recall@{K}     : {metrics['recall']:.4f}")
    print(f"  NDCG@{K}       : {metrics['ndcg']:.4f}")
    print(f"  MAP@{K}        : {metrics['map']:.4f}")
    print(f"  Hit Rate@{K}   : {metrics['hit_rate']:.4f}")
    print(f"{'='*42}")
    print("⚠️  Метрики завышены из-за смещения MovieLens 1M.")

    # --- Рекомендации для пользователя ---
    from recommendations import (
        get_popularity_baseline,
        get_recommendations,
        get_similar_items,
    )

    sample_user = int(active_users[42])
    recommendations = get_recommendations(
        model, train_csr, user_enc, item_dec, movies,
        sample_user, n=10,
    )

    # --- Похожие фильмы ---
    similar = get_similar_items(
        model, item_enc, item_dec, movies,
        original_item_id=1, n=10,
    )

    # --- Popularity Baseline ---
    baseline = get_popularity_baseline(
        train_csr, item_dec, movies, n=10,
    )

    # --- Сохранение артефактов ---
    from persistence import save_artifacts

    save_artifacts(
        model, user_enc, item_enc, user_dec, item_dec, movies,
        train_csr=train_csr,
    )

    # --- Тест загрузки и инференса ---
    print("\nТест загрузки артефактов:")
    loaded_recs = load_and_infer(sample_user, n=5)
    print(loaded_recs[["title", "score"]].to_string(index=False))

    # --- Чеклист ---
    print("""
╔══════════════════════════════════════════════════════════════╗
║              ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ В ПРОДАКШН               ║
╠══════════════════════════════════════════════════════════════╣
║  [✓] Train/test split по временной метке (leave-last-out)   ║
║  [✓] NDCG@10, MAP@10, Precision@10 рассчитаны на тест-сете  ║
║  [✓] Popularity baseline для холодного старта реализован    ║
║  [✓] Артефакты модели сохранены (model + encoders)          ║
║  [ ] partial_fit_users настроен для новых юзеров            ║
║  [ ] ANN-индекс (Faiss) настроен при N > 10K фильмов        ║
║  [ ] Кэш рекомендаций настроен (Redis/Memcached)             ║
║  [ ] A/B-тест настроен с baseline-группой                   ║
║  [ ] Мониторинг CTR и Watch Rate подключён                  ║
╚══════════════════════════════════════════════════════════════╝
""")


def load_and_infer(user_id: int, n: int = 10) -> pd.DataFrame:
    """
    Загружает артефакты и возвращает рекомендации для пользователя.
    Для неизвестных пользователей возвращает popularity baseline.
    """
    from persistence import load_artifacts
    from recommendations import get_popularity_baseline, get_recommendations

    arts = load_artifacts()
    _model = arts["model"]
    _user_enc = arts["user_enc"]
    _item_dec = arts["item_dec"]
    _movies = arts["movies"]
    _train = arts.get("train_csr")

    if _train is None:
        raise ValueError(
            "train_csr не сохранён в артефактах. "
            "Пересохраните с параметром train_csr."
        )

    if user_id not in _user_enc:
        print(f"Пользователь {user_id} не найден → возвращаем popularity baseline.")
        return get_popularity_baseline(_train, _item_dec, _movies, n=n, verbose=False)

    return get_recommendations(
        _model, _train, _user_enc, _item_dec, _movies,
        user_id, n=n, verbose=False,
    )


if __name__ == "__main__":
    main()
