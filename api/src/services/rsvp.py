from typing import Annotated

from fastapi.params import Depends

from errors.request import BadRequestError, NotFoundError
from repos import UnitOfWork
from schemas.rsvp import (
    PaginatedRSVPSchema,
    RSVPCreateSchema,
    RSVPFilterSchema,
    RSVPInDBSchema,
    RSVPUpdateSchema,
)


class RSVPService:
    def __init__(self, uow: Annotated[UnitOfWork, Depends()]) -> None:
        self._uow = uow

    def get(self, filters: RSVPFilterSchema) -> PaginatedRSVPSchema:
        with self._uow as uow:
            fetched_rsvps = uow.rsvp.select(filters)
        return fetched_rsvps

    def get_by_id(self, rsvp_id: int) -> RSVPInDBSchema:
        with self._uow as uow:
            rsvp = uow.rsvp.select_by_id(rsvp_id)
        if not rsvp:
            raise NotFoundError(f"RSVP {rsvp_id} not found")
        return rsvp

    def create(self, rsvp: RSVPCreateSchema) -> RSVPInDBSchema:
        with self._uow as uow:
            if rsvp.name:
                existing_rsvp = uow.rsvp.select_by_name(name=rsvp.name)
                if existing_rsvp:
                    raise BadRequestError(detail="RSVP already exists")

            created_rsvp = uow.rsvp.insert(rsvp)

        return created_rsvp

    def update(self, rsvp_id: int, rsvp: RSVPUpdateSchema) -> RSVPInDBSchema:
        with self._uow as uow:
            self._check_rsvp_update_is_valid(rsvp_id, rsvp)
            updated_rsvp = uow.rsvp.update(rsvp_id, rsvp)

        return updated_rsvp

    def delete(self, rsvp_id: int) -> None:
        with self._uow as uow:
            uow.rsvp.delete(rsvp_id)

    def _check_rsvp_update_is_valid(
        self,
        rsvp_id: int,
        upd_rsvp: RSVPUpdateSchema,
    ) -> None:
        """
        Check whether updated RSVP is valid.

        If updated RSVP has not None partner name, either existing RSVP must have
        name as not None or updated RSVP must provide name.

        Updated RSVP must be different from existing RSVP.

        :param rsvp_id:
        :param upd_rsvp:
        :return:
        """
        existing_rsvp = self.get_by_id(rsvp_id)
        upd_data = upd_rsvp.model_dump(exclude_unset=True)

        if all(getattr(existing_rsvp, k) == v for k, v in upd_data.items()):
            raise BadRequestError("RSVP with provided fields already exists")

        upd_name = upd_data.get("name")
        upd_partner_name = upd_data.get("partner_name")

        effective_name = upd_name if "name" in upd_data else existing_rsvp.name
        if upd_partner_name is not None and effective_name is None:
            raise BadRequestError("Cannot update partner name if name is not present")
