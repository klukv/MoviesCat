from __future__ import annotations

import json
from typing import Any, Optional

from redis.asyncio import Redis

from recommendation_system.app.core.config import settings


_redis_client: Optional[Redis] = None


async def get_redis_client() -> Redis:
    """
    Возвращает Redis-клиент (создаём лениво, чтобы сервис стартовал быстро).
    """
    global _redis_client
    if _redis_client is None:
        _redis_client = Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            db=settings.redis_db,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_client


def make_cache_key(user_id: str) -> str:
    return f"rec:{user_id}"


async def cache_get(user_id: str) -> Optional[list[dict[str, Any]]]:
    client = await get_redis_client()
    raw = await client.get(make_cache_key(user_id))
    if raw is None:
        return None
    return json.loads(raw)


async def cache_set(user_id: str, recommendations: list[dict[str, Any]]) -> None:
    client = await get_redis_client()
    await client.setex(
        make_cache_key(user_id),
        settings.redis_recommendations_ttl_seconds,
        json.dumps(recommendations),
    )


async def cache_del(user_id: str) -> None:
    client = await get_redis_client()
    await client.delete(make_cache_key(user_id))

