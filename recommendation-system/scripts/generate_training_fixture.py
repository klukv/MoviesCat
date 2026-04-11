"""
Генерирует JSON ~1000 строк взаимодействий + каталог фильмов в формате сущности Movies.

Запуск из корня recommendation-system:
  python scripts/generate_training_fixture.py
"""

from __future__ import annotations

import json
import random
from pathlib import Path


def main() -> None:
    random.seed(42)
    n_movies = 120
    n_users = 200
    n_interactions = 1000

    movies: list[dict] = []
    for i in range(1, n_movies + 1):
        movies.append(
            {
                "id": i,
                "title": f"Фильм {i}",
                "description": f"Описание тестового фильма {i}",
                "year": 1990 + (i % 30),
                "country": random.choice(["RU", "US", "FR"]),
                "genre": random.choice(["драма", "комедия", "боевик", "фантастика"]),
                "director": f"Режиссёр {i % 40}",
                "time": float(80 + (i % 80)),
                "budget": 1_000_000 * (1 + i % 50),
                "imgUrl": f"https://example.invalid/posters/{i}.jpg",
                "type": "movie",
                "rating": round(5 + random.random() * 4, 1),
            }
        )

    interactions: list[dict] = []
    base_ts = 1_700_000_000
    for k in range(n_interactions):
        u = random.randint(1, n_users)
        m = random.randint(1, n_movies)
        interactions.append(
            {
                "userId": str(u),
                "movieId": str(m),
                "weight": 1.0,
                "timestamp": base_ts + k * 60 + random.randint(0, 30),
            }
        )

    root = Path(__file__).resolve().parents[1]
    out = root / "ml_model" / "fixtures" / "training_sample_1k.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"movies": movies, "interactions": interactions}, f, ensure_ascii=False, indent=2)
    print(f"Записано: {out} (фильмов={n_movies}, событий={len(interactions)})")


if __name__ == "__main__":
    main()
