from fastapi import status

from errors.base import BaseError


class BadRequestError(BaseError):
    detail = "Bad Request"
    status_code = status.HTTP_400_BAD_REQUEST


class ResourceConflictError(BaseError):
    detail = "Resource Conflict"
    status_code = status.HTTP_409_CONFLICT


class UnauthorizedError(BaseError):
    detail = "Unauthorized access"
    status_code = status.HTTP_401_UNAUTHORIZED


class ForbiddenError(BaseError):
    detail = "Forbidden"
    status_code = status.HTTP_403_FORBIDDEN
