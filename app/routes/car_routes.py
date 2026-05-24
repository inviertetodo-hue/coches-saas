from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db

from app.models.car import Car
from app.models.car_schema import CarCreate

from app.services.car_analyzer import analyze_car_deal

router = APIRouter(
    prefix="/cars",
    tags=["Cars"]
)


# -------------------------
# CREAR COCHE
# -------------------------

@router.post("/")
def create_car(
    car: CarCreate,
    db: Session = Depends(get_db)
):

    db_car = Car(
        brand=car.brand,
        model=car.model,
        year=car.year,
        km=car.km,
        price=car.price
    )

    db.add(db_car)
    db.commit()
    db.refresh(db_car)

    return db_car


# -------------------------
# LISTAR COCHES
# -------------------------

@router.get("/")
def list_cars(
    db: Session = Depends(get_db)
):

    return db.query(Car).all()


# -------------------------
# RANKING CHOLLOS
# -------------------------

@router.get("/deals")
def get_deals(
    db: Session = Depends(get_db)
):

    cars = db.query(Car).all()

    analyzed_cars = []

    for car in cars:
        analyzed = analyze_car_deal(car)
        analyzed_cars.append(analyzed)

    analyzed_cars.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return analyzed_cars

