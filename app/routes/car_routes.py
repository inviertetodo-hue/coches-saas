from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.deps import get_db
from app.models.car import Car
from app.models.car_schema import CarCreate

router = APIRouter(prefix="/cars", tags=["Cars"])


# -------------------------
# LOGICA CHOLLOS
# -------------------------

def estimate_market_price(car):
    base_price = car.price

    # penalización km
    km_penalty = (car.km / 10000) * 300

    # bonus año
    age_bonus = (car.year - 2015) * 500

    market_price = base_price - km_penalty + age_bonus

    return max(market_price, 1000)


def calculate_margin(car, market_price):
    return market_price - car.price


def score_deal(margin, price):
    if price <= 0:
        return 0

    score = (margin / price) * 100

    if score < 0:
        return 0

    if score > 100:
        return 100

    return round(score, 2)


def is_good_deal(score):
    return score >= 10


# -------------------------
# CREAR COCHE
# -------------------------

@router.post("/")
def create_car(car: CarCreate, db: Session = Depends(get_db)):

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
def list_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()


# -------------------------
# RANKING CHOLLOS
# -------------------------

@router.get("/deals")
def get_deals(db: Session = Depends(get_db)):

    cars = db.query(Car).all()

    deals = []

    for car in cars:

        market_price = estimate_market_price(car)

        margin = calculate_margin(car, market_price)

        score = score_deal(margin, car.price)

        deals.append({
            "id": car.id,
            "brand": car.brand,
            "model": car.model,
            "price": car.price,
            "estimated_market_price": round(market_price, 2),
            "margin": round(margin, 2),
            "score": score,
            "good_deal": is_good_deal(score)
        })

    deals.sort(key=lambda x: x["score"], reverse=True)

    return deals

