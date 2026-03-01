"""Обучение ALS-модели.

Параметры по умолчанию — разумный старт для прототипа.
Тюнинг: factors (50–200), regularization (0.001–0.1), alpha (1–40).
"""

from implicit.als import AlternatingLeastSquares
from scipy.sparse import csr_matrix

ALS_PARAMS = dict(
    factors=100,  # K латентных факторов
    regularization=0.01,  # λ L2-регуляризация
    alpha=1.0,  # c_ui = 1 + alpha * r_ui
    iterations=15,
    use_cg=True,  # Conjugate Gradient — ускорение сходимости
    num_threads=0,  # 0 = авто (все доступные ядра)
    random_state=42,
)


def train_als(
    train_csr: csr_matrix,
    params: dict | None = None,
    show_progress: bool = True,
) -> AlternatingLeastSquares:
    """Обучает ALS-модель на train-матрице."""
    kwargs = {**ALS_PARAMS, **(params or {})}
    model = AlternatingLeastSquares(**kwargs)
    model.fit(train_csr, show_progress=show_progress)
    print("Обучение завершено.")
    print(f"user_factors shape : {model.user_factors.shape}")
    print(f"item_factors shape : {model.item_factors.shape}")
    return model
