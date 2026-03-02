from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_recommendations_ttl_seconds: int = 3600  # 1 час

    # Kafka (пока заглушка)
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic_user_activity: str = "user-activity-events"

    class Config:
        env_prefix = "REC_SERVICE_"


settings = Settings()

