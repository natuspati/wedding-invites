from sqlalchemy import and_, delete, func, insert, or_, select, update
from sqlalchemy.orm import Session

from models.rsvp import RSVP
from schemas.rsvp import (
    PaginatedRSVPSchema,
    RSVPCreateSchema,
    RSVPFilterSchema,
    RSVPInDBSchema,
    RSVPUpdateSchema,
)
from utils.validation import validate_model


class RSVPRepo:
    def __init__(self, session: Session) -> None:
        self._session = session

    def select(self, filters: RSVPFilterSchema) -> PaginatedRSVPSchema:
        clauses = [
            RSVP.created_at >= filters.start,
            RSVP.created_at <= filters.end,
        ]

        if filters.name:
            clauses.append(
                or_(
                    RSVP.name.ilike(f"%{filters.name}%"),
                    RSVP.partner_name.ilike(f"%{filters.name}%"),
                ),
            )

        stmt = select(RSVP).where(and_(*clauses)).offset(filters.offset).limit(filters.limit)

        count_stmt = select(func.count()).select_from(RSVP).where(and_(*clauses))

        res = self._session.scalars(stmt).all()
        total = self._session.scalar(count_stmt)

        return PaginatedRSVPSchema(
            page=filters.page,
            page_size=filters.page_size,
            total=total,
            contents=validate_model(res, RSVPInDBSchema),
        )

    def select_by_id(self, rsvp_id: int) -> RSVPInDBSchema | None:
        stmt = select(RSVP).where(RSVP.id == rsvp_id)
        res = self._session.scalar(stmt)
        return validate_model(res, RSVPInDBSchema)

    def select_by_name(self, name: str) -> list[RSVPInDBSchema]:
        stmt = select(RSVP).where(or_(RSVP.name == name, RSVP.partner_name == name))
        res = self._session.execute(stmt).all()
        return validate_model(res, RSVPInDBSchema)

    def insert(self, rsvp: RSVPCreateSchema) -> RSVPInDBSchema:
        stmt = insert(RSVP).values(rsvp.model_dump(exclude_unset=True)).returning(RSVP)
        res = self._session.execute(stmt).scalar_one()
        return validate_model(res, RSVPInDBSchema)

    def update(self, rsvp_id: int, rsvp: RSVPUpdateSchema) -> RSVPInDBSchema:
        stmt = (
            update(RSVP)
            .values(rsvp.model_dump(exclude_unset=True))
            .where(RSVP.id == rsvp_id)
            .returning(RSVP)
        )
        res = self._session.execute(stmt).scalar_one()
        return validate_model(res, RSVPInDBSchema)

    def delete(self, rsvp_id: int) -> None:
        stmt = delete(RSVP).where(RSVP.id == rsvp_id)
        self._session.execute(stmt)
