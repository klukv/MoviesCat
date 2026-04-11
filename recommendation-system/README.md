# Recommendation System

Внутри этой папки лежат две части:

- `ml_model/` — **ML-модель** (обучение на JSON-выгрузке каталога + взаимодействий) + инференс `ml_model.predict(...)`.
- `recommendation_system/` — **Recommendation Service** (FastAPI): REST API, Redis-кэш, feedback + Kafka-заглушка.

## Быстрый старт

Установка зависимостей:

```bash
pip install -r requirements.txt
```

### Запуск Recommendation Service (FastAPI)

Поднимите Redis (например, через Docker):

```bash
docker run --name rec-redis -p 6379:6379 -d redis:7
```

Запуск API:

```bash
uvicorn recommendation_system.app.main:app --host 0.0.0.0 --port 8000 --reload
```

Swagger UI: `http://localhost:8000/docs`

### Обучение модели (JSON как с бекенда)

Формат файла: `movies` + `interactions` (см. `ml_model/prototype/data/db_loaders.py`).  
Офлайн-пример без БД:

```bash
python scripts/generate_training_fixture.py
python -m ml_model.train_from_payload -i ml_model/fixtures/training_sample_1k.json -o als_model_artifacts.pkl
```

Артефакт `als_model_artifacts.pkl` кладите туда, откуда запускаете сервис (по умолчанию — корень `recommendation-system/`).

