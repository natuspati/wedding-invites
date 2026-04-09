from functools import cached_property
from typing import Literal

import sqlalchemy
from pydantic_settings import BaseSettings, SettingsConfigDict

from enums import AppEnvironmentEnum


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="API_",
        case_sensitive=False,
        env_file_encoding="utf-8",
        extra="ignore",
        env_parse_none_str="null",
    )

    # Application state
    environment: AppEnvironmentEnum = AppEnvironmentEnum.LOCAL
    name: str = "Wedding invite API"
    version: str = "0.1.0"
    secret_key: str = "secret"

    # Uvicorn
    host: str = "0.0.0.0"
    port: int = 8080
    workers_count: int = 1
    reload: bool = True

    # Authentication
    openapi_schema_user: str = "user"
    openapi_schema_password: str = "password"

    # Database
    db_apply_migrations: bool = False
    db_driver: str = "sqlite"
    db_name: str = "wed-invites.db"
    db_name_test: str = "test_wed-invites.db"
    db_echo: bool = False
    db_echo_pool: bool = False
    db_expire_on_commit: bool = False

    @cached_property
    def db_url(self) -> sqlalchemy.URL:
        return sqlalchemy.URL.create(
            drivername=self.db_driver,
            database=self.db_name,
        )

    @cached_property
    def log_level(self) -> Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
        return "DEBUG" if self.environment is AppEnvironmentEnum.LOCAL else "INFO"

    @cached_property
    def log_verbosity(self) -> Literal["standard", "verbose"]:
        return "verbose" if self.environment is AppEnvironmentEnum.LOCAL else "standard"


settings = Settings()
