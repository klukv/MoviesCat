from __future__ import annotations

from recommendation_system.app.core.config import settings


async def publish_user_activity_event(event: dict) -> None:
    """
    Заглушка Kafka-продюсера.

    В реальной реализации:
    - подключаем Kafka-клиент (например, aiokafka)
    - сериализуем event в JSON
    - отправляем в топик settings.kafka_topic_user_activity
    """
    print(f"[KAFKA STUB] topic='{settings.kafka_topic_user_activity}' event={event}")

