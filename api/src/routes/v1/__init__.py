from fastapi import APIRouter

from routes.v1 import rsvp

router = APIRouter(prefix="/v1")

router.include_router(rsvp.router)
