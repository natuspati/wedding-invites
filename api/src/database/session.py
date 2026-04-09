from collections.abc import Generator

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from configs.settings import settings

engine: Engine = create_engine(
    url=settings.db_url,
    echo=settings.db_echo,
    echo_pool=settings.db_echo_pool,
)

session_factory: sessionmaker[Session] = sessionmaker(
    bind=engine,
    expire_on_commit=settings.db_expire_on_commit,
    autoflush=False,
)


def get_session() -> Generator[Session]:
    with session_factory() as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()
