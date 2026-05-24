from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.car_routes import router as car_router
from app.database.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Coches SaaS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(car_router)


@app.get("/")
def root():

    return {
        "status": "ok",
        "message": "Coches SaaS funcionando"
    }

