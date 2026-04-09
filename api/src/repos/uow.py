from functools import cached_property
from typing import Annotated

from fastapi.params import Depends
from sqlalchemy.orm import Session

from database.session import get_session
from repos.rsvp import RSVPRepo


class UnitOfWork:
    def __init__(self, session: Annotated[Session, Depends(get_session)]):
        self._session = session

    @cached_property
    def rsvp(self) -> RSVPRepo:
        return RSVPRepo(self._session)

    def __enter__(self):
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc: BaseException | None,
        tb: object | None,
    ) -> None:
        if exc:
            self._session.rollback()
        else:
            self._session.commit()
