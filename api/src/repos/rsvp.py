from sqlalchemy import and_, insert, or_, select, func, delete
from sqlalchemy.orm import Session

from models.rsvp import RSVP
from schemas.rsvp import RSVPCreateSchema, RSVPFilterSchema, RSVPInDBSchema, PaginatedRSVPSchema
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
                    RSVP.name.ilike(filters.name),
                    RSVP.partner_name.ilike(filters.name),
                )
            )
        
        stmt = (
            select(RSVP)
            .where(and_(*clauses))
            .offset(filters.offset)
            .limit(filters.limit)
        )
        
        count_stmt = select(func.count()).select_from(RSVP).where(and_(*clauses))
        
        res = self._session.scalars(stmt).all()
        total = self._session.scalar(count_stmt)
        
        return PaginatedRSVPSchema(
            page=filters.page,
            page_size=filters.page_size,
            total=total,
            contents=validate_model(res, RSVPInDBSchema),
        )
    
    def select_by_name(self, name: str) -> list[RSVPInDBSchema]:
        stmt = select(RSVP).where(or_(RSVP.name == name, RSVP.partner_name == name))
        res = self._session.execute(stmt).all()
        return validate_model(res, RSVPInDBSchema)
    
    def insert(self, rsvp: RSVPCreateSchema) -> RSVPInDBSchema:
        stmt = insert(RSVP).values(rsvp.model_dump(exclude_unset=True)).returning(RSVP)
        res = self._session.execute(stmt).scalar_one()
        return validate_model(res, RSVPInDBSchema)

    def delete(self, rsvp_id: int) -> None:
        stmt = delete(RSVP).where(RSVP.id == rsvp_id)
        self._session.execute(stmt)
