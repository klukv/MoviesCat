"""
ML-модель (обёртка над существующим прототипом).

Прототип (обучение/оценка/сохранение артефактов) лежит в `ml_model/prototype/`.
Recommendation microservice обращается к функции `ml_model.predict(...)`,
не зная деталей прототипа.
"""

from .inference import predict  # noqa: F401

