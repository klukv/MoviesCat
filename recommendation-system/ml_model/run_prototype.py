"""
Утилита для запуска исходного ML-прототипа после переноса в `ml_model/prototype/`.

Пример:
  python -m ml_model.run_prototype
"""

from __future__ import annotations


def main() -> None:
    # Запускаем прототип как нормальный пакет (без sys.path)
    from ml_model.prototype import main as prototype_main

    prototype_main.main()


if __name__ == "__main__":
    main()

