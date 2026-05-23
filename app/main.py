from fastapi import FastAPI
from app.routes.car_routes import router as car_router
from app.database.db import Base, engine

# crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Coches SaaS")

# rutas
app.include_router(car_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Coches SaaS funcionando"
    }

