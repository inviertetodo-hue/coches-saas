from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

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

    search: str | None = Query(default=None),

    brand: str | None = Query(default=None),

    min_price: float | None = Query(default=None),

    max_price: float | None = Query(default=None),

    min_year: int | None = Query(default=None),

    max_km: int | None = Query(default=None),

    only_good: bool = Query(default=False),

    db: Session = Depends(get_db)
):

    query = db.query(Car)

    # -------------------------
    # SEARCH
    # -------------------------

    if search:

        query = query.filter(

            or_(
                Car.brand.ilike(f"%{search}%"),
                Car.model.ilike(f"%{search}%")
            )
        )

    # -------------------------
    # FILTROS
    # -------------------------

    if brand:
        query = query.filter(Car.brand.ilike(f"%{brand}%"))

    if min_price is not None:
        query = query.filter(Car.price >= min_price)

    if max_price is not None:
        query = query.filter(Car.price <= max_price)

    if min_year is not None:
        query = query.filter(Car.year >= min_year)

    if max_km is not None:
        query = query.filter(Car.km <= max_km)

    cars = query.all()

    analyzed_cars = []

    for car in cars:

        analyzed = analyze_car_deal(car)

        if only_good and not analyzed["good_deal"]:
            continue

        analyzed_cars.append(analyzed)

    analyzed_cars.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "total": len(analyzed_cars),
        "filters": {
            "search": search,
            "brand": brand,
            "min_price": min_price,
            "max_price": max_price,
            "min_year": min_year,
            "max_km": max_km,
            "only_good": only_good
        },
        "deals": analyzed_cars
    }

