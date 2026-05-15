from fastapi import FastAPI

from recommendation_system.app.api.v1.routes import router as api_v1_router
from recommendation_system.app.api.v1.train_routes import router as train_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Recommendation Service",
        version="1.0.0",
    )

    app.include_router(api_v1_router)
    app.include_router(train_router)
    return app


app = create_app()

