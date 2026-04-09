from enum import StrEnum, auto


class AppEnvironmentEnum(StrEnum):
    LOCAL = auto()
    TEST = auto()
    PROD = auto()


class RSVPStatusEnum(StrEnum):
    ACCEPTED_SOLO = auto()
    ACCEPTED_DUO = auto()
    REJECTED = auto()
