from collections.abc import Sequence

import pydantic
from sqlalchemy import Row

from errors.validation import SchemaValidationError
from models import Base
from schemas.base import T


def validate_model(
    data: Sequence[Base] | Sequence[Row] | Base | None,
    dto: type[T],
) -> list[T] | T | None:
    if data is None:
        return None

    if isinstance(data, Sequence):
        return _validate_models(data=data, dto=dto)

    return _validate_model(data=data, dto=dto)


def _validate_model(
    data: Base | Row,
    dto: type[T],
) -> T:
    if isinstance(data, Row):
        data = data._mapping
    try:
        return dto.model_validate(data, from_attributes=True)
    except pydantic.ValidationError as error:
        raise SchemaValidationError(error) from error


def _validate_models(
    data: Sequence[Base] | Sequence[Row],
    dto: type[T],
) -> list[T]:
    try:
        return [
            dto.model_validate(obj._mapping if isinstance(obj, Row) else obj, from_attributes=True)
            for obj in data
        ]
    except pydantic.ValidationError as error:
        raise SchemaValidationError(error) from error
