from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "HappyWork API"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./happywork.db"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 480
    system_timezone: str = "Asia/Shanghai"
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()
