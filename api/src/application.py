import logging

from fastapi import FastAPI
from fastapi.responses import RedirectResponse

import routes
from configs import settings
from errors import add_error_handlers
from lifespan import lifespan

_logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.name,
    version=settings.version,
    lifespan=lifespan,
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
)

app.include_router(routes.router)


@app.get("/", include_in_schema=False)
async def redirect_to_docs() -> RedirectResponse:
    return RedirectResponse(url=app.url_path_for("get_swagger_documentation"))


add_error_handlers(app)

_logger.info(f"Finished setting application up, version: {settings.version}")
