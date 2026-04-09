from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.params import Query

from schemas.rsvp import PaginatedRSVPSchema, RSVPCreateSchema, RSVPFilterSchema, RSVPInDBSchema
from services import RSVPService

router = APIRouter(prefix="/rsvp", tags=["RSVP"])


@router.post("", status_code=status.HTTP_201_CREATED)
def create_rsvp(
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


@router.delete("/{rsvp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rsvp(
    rsvp_id: int,
    service: Annotated[RSVPService, Depends()],
) -> None:
    service.delete(rsvp_id)
