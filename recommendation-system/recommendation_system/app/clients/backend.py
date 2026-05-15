"""
Пагинированная загрузка данных с основного бекенда (Spring PageResponse).

Контракт страницы:
  { content, page, size, totalElements, totalPages, last }
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any
from urllib.parse import urljoin

import httpx


@dataclass(frozen=True)
class PaginatedFetchStats:
    pages_fetched: int
    items_fetched: int
    total_elements: int | None


class BackendFetchError(Exception):
    """Ошибка при обращении к основному бекенду."""

    def __init__(self, message: str, *, status_code: int | None = None) -> None:
        super().__init__(message)
        self.status_code = status_code


class BackendAuthError(Exception):
    """Не удалось авторизоваться на основном бекенде."""


_AUTH_HINT = (
    "Задайте REC_SERVICE_BACKEND_AUTH_USERNAME и REC_SERVICE_BACKEND_AUTH_PASSWORD "
    "в файле recommendation-system/.env (или в переменных окружения)."
)


class BackendClient:
    """Клиент основного бекенда с постраничной выгрузкой."""

    def __init__(
        self,
        *,
        base_url: str,
        jwt_token: str | None = None,
        timeout_seconds: float = 30.0,
    ) -> None:
        self._base_url = base_url.rstrip("/") + "/"
        self._jwt_token = (jwt_token or "").strip()
        self._timeout = timeout_seconds

    def _headers(self) -> dict[str, str]:
        headers: dict[str, str] = {"Accept": "application/json"}
        if self._jwt_token:
            headers["Authorization"] = f"Bearer {self._jwt_token}"
        return headers

    def _url(self, path: str) -> str:
        path = path if path.startswith("/") else f"/{path}"
        return urljoin(self._base_url, path.lstrip("/"))

    async def login(self, username: str, password: str) -> str:
        """
        POST /api/auth/login → JWT (поле `token` в JwtResponse).

        Пользователь должен иметь роль USER, MODERATOR или ADMIN
        (иначе GET /api/movies вернёт 403).
        """
        username = username.strip()
        if not username or not password:
            raise BackendAuthError("Логин и пароль не могут быть пустыми.")

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(
                self._url("/api/auth/login"),
                json={"username": username, "password": password},
                headers={"Accept": "application/json", "Content-Type": "application/json"},
            )

        if response.status_code >= 400:
            raise BackendAuthError(
                f"POST /api/auth/login вернул HTTP {response.status_code}: {response.text[:300]}"
            )

        payload = response.json()
        if not isinstance(payload, dict):
            raise BackendAuthError("Ответ /api/auth/login должен быть JSON-объектом.")

        token = payload.get("token")
        if not token or not str(token).strip():
            raise BackendAuthError("В ответе /api/auth/login отсутствует поле token.")

        self._jwt_token = str(token).strip()
        return self._jwt_token

    async def fetch_all_pages(
        self,
        path: str,
        *,
        page_size: int = 100,
        extra_params: dict[str, Any] | None = None,
        max_pages: int | None = None,
    ) -> tuple[list[dict[str, Any]], PaginatedFetchStats]:
        """
        Обходит все страницы `path`, накапливает `content`.

        Параметры пагинации: page (0-based), size.
        """
        if page_size < 1:
            raise ValueError("page_size должен быть >= 1")

        params_base: dict[str, Any] = {"size": page_size}
        if extra_params:
            params_base.update(extra_params)

        all_items: list[dict[str, Any]] = []
        page = 0
        total_elements: int | None = None
        pages_fetched = 0

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            while True:
                if max_pages is not None and pages_fetched >= max_pages:
                    break

                params = {**params_base, "page": page}
                url = self._url(path)
                response = await client.get(url, params=params, headers=self._headers())

                if response.status_code == 204:
                    break

                if response.status_code == 401:
                    raise BackendFetchError(
                        f"GET {path}: HTTP 401 Unauthorized. {_AUTH_HINT}",
                        status_code=401,
                    )
                if response.status_code == 403:
                    raise BackendFetchError(
                        f"GET {path}: HTTP 403 Forbidden — у токена нет роли USER/MODERATOR/ADMIN.",
                        status_code=403,
                    )
                if response.status_code >= 400:
                    raise BackendFetchError(
                        f"GET {path} вернул HTTP {response.status_code}: {response.text[:500]}",
                        status_code=response.status_code,
                    )

                payload = response.json()
                if not isinstance(payload, dict):
                    raise BackendFetchError(f"Ожидался JSON-объект PageResponse, получен {type(payload).__name__}")

                content = payload.get("content") or []
                if not isinstance(content, list):
                    raise BackendFetchError("Поле content в ответе бекенда должно быть массивом")

                all_items.extend(content)
                pages_fetched += 1

                if payload.get("totalElements") is not None:
                    total_elements = int(payload["totalElements"])

                is_last = payload.get("last")
                if is_last is True:
                    break
                if not content:
                    break

                page += 1

        return all_items, PaginatedFetchStats(
            pages_fetched=pages_fetched,
            items_fetched=len(all_items),
            total_elements=total_elements,
        )

    async def fetch_all_movies(
        self,
        *,
        page_size: int = 100,
        genre: str = "default",
        sort: str = "id,asc",
        max_pages: int | None = None,
    ) -> tuple[list[dict[str, Any]], PaginatedFetchStats]:
        """GET /api/movies — каталог фильмов постранично."""
        return await self.fetch_all_pages(
            "/api/movies",
            page_size=page_size,
            extra_params={"genre": genre, "sort": sort},
            max_pages=max_pages,
        )

    async def fetch_all_interactions(
        self,
        *,
        interactions_path: str,
        page_size: int = 100,
        max_pages: int | None = None,
    ) -> tuple[list[dict[str, Any]], PaginatedFetchStats]:
        """
        Пагинированная выгрузка неявных событий (когда бекенд отдаёт PageResponse).

        Путь задаётся в настройках (например /api/interactions).
        """
        path = interactions_path.strip()
        if not path:
            raise ValueError("interactions_path не задан")
        return await self.fetch_all_pages(path, page_size=page_size, max_pages=max_pages)


async def create_authenticated_backend_client(
    *,
    base_url: str,
    auth_username: str,
    auth_password: str,
    timeout_seconds: float = 30.0,
) -> BackendClient:
    """Создаёт клиент и получает JWT через POST /api/auth/login."""
    client = BackendClient(base_url=base_url, timeout_seconds=timeout_seconds)
    await client.login(auth_username, auth_password)
    return client
