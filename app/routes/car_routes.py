from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.car_model import Car

router = APIRouter(prefix="/cars", tags=["cars"])


PREMIUM_BRANDS = ["BMW", "AUDI", "MERCEDES", "PORSCHE", "TESLA", "LEXUS"]


def analyze(car):
    brand = car.brand.upper()
    premium = brand in PREMIUM_BRANDS

    market_price = car.price * 1.35

    age_penalty = max(0, 2026 - car.year) * 350
    km_penalty = (car.km / 10000) * 120
    expenses = 1800 + age_penalty + km_penalty

    profit = market_price - car.price - expenses

    roi = (profit / car.price) * 100 if car.price else 0

    score = roi * 2

    if premium:
        score += 20

    if car.year >= 2020:
        score += 15

    if car.km < 80000:
        score += 15

    score = round(max(0, min(100, score)), 2)

    if score >= 70:
        recommendation = "COMPRAR YA"
    elif score >= 45:
        recommendation = "ANALIZAR"
    else:
        recommendation = "DESCARTAR"

    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "year": car.year,
        "km": car.km,
        "price": car.price,
        "image_url": car.image_url or "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        "estimated_market_price": round(market_price, 2),
        "estimated_expenses": round(expenses, 2),
        "estimated_net_profit": round(profit, 2),
        "roi": round(roi, 2),
        "score": score,
        "recommendation": recommendation,
        "is_hot_deal": score >= 70,
        "is_premium_brand": premium,
    }


@router.get("/")
def list_cars(db: Session = Depends(get_db)):
    return db.query(Car).all()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    cars = db.query(Car).all()
    analyzed = [analyze(car) for car in cars]

    analyzed.sort(key=lambda car: car["score"], reverse=True)

    hot = [car for car in analyzed if car["is_hot_deal"]]

    avg_score = (
        round(sum(car["score"] for car in analyzed) / len(analyzed), 2)
        if analyzed
        else 0
    )

    total_profit = round(
        sum(car["estimated_net_profit"] for car in analyzed),
        2
    )

    total_value = round(
        sum(car["price"] for car in analyzed),
        2
    )

    return {
        "stats": {
            "total_cars": len(analyzed),
            "hot_deals_count": len(hot),
            "avg_score": avg_score,
            "total_profit": total_profit,
            "total_value": total_value,
        },
        "top_deals": analyzed,
    }


@router.post("/")
def create_car(car: dict, db: Session = Depends(get_db)):
    db_car = Car(
        brand=car["brand"],
        model=car["model"],
        year=car["year"],
        km=car["km"],
        price=car["price"],
        image_url=car.get("image_url"),
    )

    db.add(db_car)
    db.commit()
    db.refresh(db_car)

    return {
        "message": "Coche creado",
        "id": db_car.id,
    }


@router.delete("/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()

    if car:
        db.delete(car)
        db.commit()

    return {
        "message": "Coche eliminado",
        "id": car_id,
    }


@router.post("/import-mobile")
def import_mobile(db: Session = Depends(get_db)):
    imported = 0
    skipped = 0

    cars = [
        {
            "brand": "BMW",
            "model": "M3",
            "year": 2021,
            "km": 45000,
            "price": 52000,
            "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e",
        },
        {
            "brand": "AUDI",
            "model": "RS6",
            "year": 2020,
            "km": 60000,
            "price": 68000,
            "image_url": "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
        },
        {
            "brand": "MERCEDES",
            "model": "C63 AMG",
            "year": 2019,
            "km": 72000,
            "price": 59000,
            "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8",
        },
        {
            "brand": "PORSCHE",
            "model": "Macan",
            "year": 2021,
            "km": 38000,
            "price": 54000,
            "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        },
    ]

    for item in cars:
        exists = db.query(Car).filter(
            Car.brand == item["brand"],
            Car.model == item["model"],
            Car.year == item["year"],
            Car.km == item["km"],
            Car.price == item["price"],
        ).first()

        if exists:
            skipped += 1
            continue

        db.add(Car(**item))
        imported += 1

    db.commit()

    return {
        "message": "Importación completada",
        "imported": imported,
        "skipped_duplicates": skipped,
    }


@router.post("/seed")
def seed(db: Session = Depends(get_db)):
    if db.query(Car).count() > 0:
        return {"message": "La base ya tiene coches"}

    starter_cars = [
        Car(brand="BMW", model="320d", year=2019, km=95000, price=18500, image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e"),
        Car(brand="AUDI", model="A4", year=2020, km=85000, price=24000, image_url="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"),
        Car(brand="MERCEDES", model="C220", year=2018, km=120000, price=21000, image_url="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"),
    ]

    db.add_all(starter_cars)
    db.commit()

    return {"message": "Datos iniciales creados"}


@router.delete("/")
def clear_all(db: Session = Depends(get_db)):
    db.query(Car).delete()
    db.commit()

    return {"message": "Base de datos limpiada"}

from app.services.ai_service import analyze_car_with_ai


@router.get("/{car_id}/ai")
def ai_car_analysis(car_id: int, db: Session = Depends(get_db)):
    car = db.query(Car).filter(Car.id == car_id).first()

    if not car:
        return {
            "analysis": "Coche no encontrado"
        }

    analyzed = analyze(car)

    ai_text = analyze_car_with_ai(analyzed)

    return {
        "car_id": car_id,
        "analysis": ai_text
    }
