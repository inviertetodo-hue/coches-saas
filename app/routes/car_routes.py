from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.car import Car
from app.models.car_schema import CarCreate

router = APIRouter(prefix="/cars", tags=["Cars"])


# crear coche
@router.post("/")
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car


# listar coches
@router.get("/")
def list_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()

