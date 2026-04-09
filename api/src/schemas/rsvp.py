from datetime import datetime, timedelta
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints, computed_field, PositiveInt

from enums import RSVPStatusEnum

NameStr = Annotated[
    str | None,
    StringConstraints(
        min_length=3,
        max_length=255,
    ),
]


class RSVPCreateSchema(BaseModel):
    name: NameStr = None
    partner_name: NameStr = None


class RSVPInDBSchema(BaseModel):
    id: int
    name: str | None
    partner_name: str | None
    created_at: datetime

    @computed_field
    def status(self) -> RSVPStatusEnum:
        if self.name and self.partner_name:
            return RSVPStatusEnum.ACCEPTED_DUO
        elif self.name and not self.partner_name:
            return RSVPStatusEnum.ACCEPTED_SOLO
        else:
            return RSVPStatusEnum.REJECTED


class RSVPFilterSchema(BaseModel):
    page: PositiveInt = 1
    page_size: Annotated[int, Field(ge=1, le=100)] = 100
    start: datetime = Field(default_factory=lambda: datetime.now() - timedelta(days=90))
    end: datetime = Field(default_factory=datetime.now)
    name: NameStr = None

    @computed_field
    def offset(self) -> int:
        return (self.page - 1) * self.page_size
    
    @computed_field
    def limit(self) -> int:
        return self.page_size


class PaginatedRSVPSchema(BaseModel):
    contents: list[RSVPInDBSchema]
    total: int
