"""Сопоставление внешних id (API / JSON) с ключами словарей энкодеров."""

from __future__ import annotations


def resolve_encoder_key(raw: str | int, enc: dict) -> object | None:
    """
    Находит ключ в enc для значения из API.

    Поддерживает строковые id (как в JSON/API) и числовые id, если они совпали
    с ключами энкодера (например после int(user_id) для чисто числовых строк).
    """
    if raw in enc:
        return raw
    s = str(raw).strip()
    if s in enc:
        return s
    if s.isdigit():
        i = int(s)
        if i in enc:
            return i
    return None
