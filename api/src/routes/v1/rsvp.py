from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.params import Query

from schemas.base import BaseErrorSchema
from schemas.rsvp import (
    PaginatedRSVPSchema,
    RSVPCreateSchema,
    RSVPFilterSchema,
    RSVPInDBSchema,
    RSVPUpdateSchema,
)
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


@router.patch(
    "/{rsvp_id}",
    responses={
        status.HTTP_404_NOT_FOUND: {"description": "RSVP not found", "model": BaseErrorSchema},
    },
)
def update_rsvp(
    rsvp_id: int,
    rsvp: RSVPUpdateSchema,
    service: Annotated[RSVPService, Depends()],
) -> RSVPInDBSchema:
    return service.update(rsvp_id, rsvp)


@router.delete("/{rsvp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rsvp(
    rsvp_id: int,
    service: Annotated[RSVPService, Depends()],
) -> None:
    service.delete(rsvp_id)
