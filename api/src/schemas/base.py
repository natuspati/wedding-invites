from typing import TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class BaseErrorSchema(BaseModel):
    detail: str
    extra_info: str | dict | None = None
