from typing import Annotated

from fastapi.params import Depends

from errors.request import BadRequestError
from repos import UnitOfWork
from schemas.rsvp import PaginatedRSVPSchema, RSVPCreateSchema, RSVPFilterSchema, RSVPInDBSchema


class RSVPService:
    def __init__(self, uow: Annotated[UnitOfWork, Depends()]) -> None:
        self._uow = uow

    def get(self, filters: RSVPFilterSchema) -> PaginatedRSVPSchema:
        with self._uow as uow:
            fetched_rsvps = uow.rsvp.select(filters)
        return fetched_rsvps

    def create(self, rsvp: RSVPCreateSchema) -> RSVPInDBSchema:
        with self._uow as uow:
            if rsvp.name:
                existing_rsvp = uow.rsvp.select_by_name(name=rsvp.name)
                if existing_rsvp:
                    raise BadRequestError(detail="RSVP already exists")

            created_rsvp = uow.rsvp.insert(rsvp)

        return created_rsvp

    def delete(self, rsvp_id: int) -> None:
        with self._uow as uow:
            uow.rsvp.delete(rsvp_id)
