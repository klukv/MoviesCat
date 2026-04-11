"""
Обучение ALS на JSON-выгрузке каталога Movies + взаимодействий (как из GET бекенда).

Пример:
  cd recommendation-system
  python -m ml_model.train_from_payload --input ml_model/fixtures/training_sample_1k.json
"""

from __future__ import annotations

import argparse
from pathlib import Path

from ml_model.prototype.pipeline_db import train_from_training_payload_file


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Обучение рекомендательной модели на данных формата БД (movies + interactions).",
    )
    parser.add_argument(
        "--input",
        "-i",
        type=Path,
        required=True,
        help="Путь к JSON с ключами movies и interactions",
    )
    parser.add_argument(
        "--output",
        "-o",
        type=Path,
        default=Path("als_model_artifacts.pkl"),
        help="Куда сохранить pickle с моделью и энкодерами",
    )
    parser.add_argument(
        "--metrics-k",
        type=int,
        default=10,
        help="K для офлайн-метрик leave-last-out (если есть тест)",
    )
    args = parser.parse_args()

    train_from_training_payload_file(
        payload_path=args.input,
        artifacts_path=args.output,
        metrics_k=args.metrics_k,
    )


if __name__ == "__main__":
    main()
