from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.deps import get_db

from app.models.car import Car
from app.models.car_schema import CarCreate
from app.models.import_log import ImportLog

from app.services.car_analyzer import analyze_car_deal
from app.services.scraper_service import fake_mobile_de_scraper

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
# TOP DEALS
# -------------------------

@router.get("/top-deals")
def get_top_deals(
    limit: int = Query(default=5),
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

    return {
        "total": len(analyzed_cars),
        "top_deals": analyzed_cars[:limit]
    }


# -------------------------
# IMPORT MOBILE
# -------------------------

@router.post("/import-mobile")
def import_mobile_cars(
    db: Session = Depends(get_db)
):

    scraped_cars = fake_mobile_de_scraper()

    imported = []

    skipped_duplicates = 0

    for car in scraped_cars:

        existing_car = db.query(Car).filter(
            Car.brand == car["brand"],
            Car.model == car["model"],
            Car.year == car["year"],
            Car.km == car["km"],
            Car.price == car["price"]
        ).first()

        if existing_car:
            skipped_duplicates += 1
            continue

        db_car = Car(
            brand=car["brand"],
            model=car["model"],
            year=car["year"],
            km=car["km"],
            price=car["price"]
        )

        db.add(db_car)

        imported.append(db_car)

    db.commit()

    for car in imported:
        db.refresh(car)

    log = ImportLog(
        source="mobile.de",
        imported_count=len(imported),
        duplicates_skipped=skipped_duplicates
    )

    db.add(log)
    db.commit()

    return {
        "imported_count": len(imported),
        "duplicates_skipped": skipped_duplicates,
        "cars": imported
    }


# -------------------------
# VER LOGS IMPORTACION
# -------------------------

@router.get("/import-logs")
def get_import_logs(
    db: Session = Depends(get_db)
):

    logs = db.query(ImportLog).all()

    return logs


# -------------------------
# STATS
# -------------------------

@router.get("/stats")
def get_stats(
    db: Session = Depends(get_db)
):

    cars = db.query(Car).all()

    analyzed_cars = []

    for car in cars:
        analyzed_cars.append(
            analyze_car_deal(car)
        )

    total_cars = len(analyzed_cars)

    avg_price = 0
    avg_score = 0
    total_chollos = 0
    total_risk = 0

    if total_cars > 0:

        avg_price = round(
            sum(car["price"] for car in analyzed_cars) / 
total_cars,
            2
        )

        avg_score = round(
            sum(car["score"] for car in analyzed_cars) / 
total_cars,
            2
        )

        total_chollos = len([
            car for car in analyzed_cars
            if "CHOLLO" in car["label"]
        ])

        total_risk = len([
            car for car in analyzed_cars
            if len(car["risk_flags"]) > 0
        ])

    return {
        "total_cars": total_cars,
        "avg_price": avg_price,
        "avg_score": avg_score,
        "total_chollos": total_chollos,
        "total_with_risk": total_risk
    }


# -------------------------
# DEALS
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

    sort_by: str = Query(default="score"),

    page: int = Query(default=1),

    limit: int = Query(default=10),

    db: Session = Depends(get_db)
):

    query = db.query(Car)

    if search:

        query = query.filter(

            or_(
                Car.brand.ilike(f"%{search}%"),
                Car.model.ilike(f"%{search}%")
            )
        )

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

    offset = (page - 1) * limit

    cars = query.offset(offset).limit(limit).all()

    analyzed_cars = []

    for car in cars:

        analyzed = analyze_car_deal(car)

        if only_good and not analyzed["good_deal"]:
            continue

        analyzed_cars.append(analyzed)

    if sort_by == "score":

        analyzed_cars.sort(
            key=lambda x: x["score"],
            reverse=True
        )

    elif sort_by == "price":

        analyzed_cars.sort(
            key=lambda x: x["price"]
        )

    elif sort_by == "year":

        analyzed_cars.sort(
            key=lambda x: x["year"],
            reverse=True
        )

    elif sort_by == "km":

        analyzed_cars.sort(
            key=lambda x: x["km"]
        )

    return {
        "page": page,
        "limit": limit,
        "total_results": len(analyzed_cars),
        "sort_by": sort_by,
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

