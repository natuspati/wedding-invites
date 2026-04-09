from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.params import Query

from schemas.rsvp import PaginatedRSVPSchema, RSVPCreateSchema, RSVPFilterSchema, RSVPInDBSchema
from services import RSVPService

router = APIRouter(prefix="/rsvp", tags=["RSVP"])


@router.post("", status_code=status.HTTP_201_CREATED)
def register(
    rsvp: RSVPCreateSchema,
    service: Annotated[RSVPService, Depends()],
) -> RSVPInDBSchema:
    return service.create(rsvp)


@router.get("")
def get_rsvps(
    filters: Annotated[RSVPFilterSchema, Query()],
    service: Annotated[RSVPService, Depends()],
) -> PaginatedRSVPSchema:
    return service.get(filters)
