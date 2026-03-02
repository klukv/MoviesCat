# Recommendation System

Внутри этой папки лежат две части:

- `ml_model/` — **ML-модель** (существующий прототип, упакованный в слой) + стабильный интерфейс инференса `ml_model.predict(...)`.
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

### Запуск ML-прототипа (обучение/оценка/сохранение артефактов)

Прототип перенесён в `ml_model/prototype/`. Чтобы запустить его так же, как раньше:

```bash
python -m ml_model.run_prototype
```

Артефакты по умолчанию сохраняются в `als_model_artifacts.pkl` в корне `recommendation-system/`.

