"""HTTP-клиенты внешних сервисов."""

from .backend import (
    BackendAuthError,
    BackendClient,
    BackendFetchError,
    PaginatedFetchStats,
    create_authenticated_backend_client,
)

__all__ = [
    "BackendAuthError",
    "BackendClient",
    "BackendFetchError",
    "PaginatedFetchStats",
    "create_authenticated_backend_client",
]
