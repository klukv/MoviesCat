from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# recommendation-system/.env
_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_recommendations_ttl_seconds: int = 3600  # 1 час

    # Kafka (пока заглушка)
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_user_activity: str = "user-activity-events"

    # Основной бекенд (Spring) — авторизация через POST /api/auth/login
    backend_base_url: str = "http://localhost:8080"
    backend_auth_username: str = ""
    backend_auth_password: str = ""
    backend_movies_page_size: int = 100
    backend_movies_genre: str = "default"
    backend_movies_sort: str = "id,asc"
    backend_interactions_path: str = ""
    backend_request_timeout_seconds: float = 30.0
    backend_max_pages: int | None = None

    # Артефакты ALS
    model_artifacts_path: str = "als_model_artifacts.pkl"

    model_config = SettingsConfigDict(
        env_prefix="REC_SERVICE_",
        env_file=_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
