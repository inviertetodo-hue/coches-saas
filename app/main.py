from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.init_db import init_db
from app.db.crud import create_car, get_all_cars, delete_car, create_user, get_user_by_email
from app.auth.security import hash_password, verify_password
from app.auth.jwt_handler import create_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Coches SaaS API funcionando"}

@app.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, data["email"])

    if existing_user:
        return {"message": "Usuario ya existe"}

    user = create_user(
        db,
        data["email"],
        hash_password(data["password"])
    )

    token = create_token({"sub": user.email})

    return {"token": token, "email": user.email}

@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = get_user_by_email(db, data["email"])

    if not user:
        return {"message": "Usuario no encontrado"}

    if not verify_password(data["password"], user.hashed_password):
        return {"message": "Password incorrecta"}

    token = create_token({"sub": user.email})

    return {"token": token, "email": user.email}

@app.get("/cars/dashboard")
def dashboard(db: Session = Depends(get_db)):
    cars = get_all_cars(db)

    total_profit = sum(car.estimated_net_profit or 0 for car in cars)
    avg_score = sum(car.score or 0 for car in cars) / len(cars) if cars else 0
    hot_deals = [car for car in cars if car.is_hot_deal]

    return {
        "stats": {
            "total_cars": len(cars),
            "hot_deals_count": len(hot_deals),
            "avg_score": round(avg_score, 2),
            "total_profit": round(total_profit, 2)
        },
        "top_deals": cars,
        "hot_deals": cars
    }

@app.post("/cars/analyze")
def analyze_car(data: dict, db: Session = Depends(get_db)):
    price = float(data["price"])
    km = int(data["km"])
    year = int(data["year"])
    brand = data["brand"].upper()

    estimated_market_price = round(price * 1.35, 2)
    expenses = round(1500 + (km * 0.03), 2)
    estimated_profit = round(estimated_market_price - price - expenses, 2)
    roi = round((estimated_profit / price) * 100, 2)

    score = 50

    if estimated_profit > 7000:
        score += 25
    elif estimated_profit > 4000:
        score += 18
    elif estimated_profit > 2000:
        score += 10

    if roi > 20:
        score += 20
    elif roi > 12:
        score += 14
    elif roi > 8:
        score += 8

    premium_brands = ["BMW", "AUDI", "MERCEDES", "PORSCHE"]

    if brand in premium_brands:
        score += 10

    if km < 60000:
        score += 10
    elif km < 100000:
        score += 6

    if year >= 2020:
        score += 8

    score = min(score, 100)

    recommendation = "DESCARTAR"

    if score >= 85:
        recommendation = "COMPRA PRIORITARIA 🚀"
    elif score >= 70:
        recommendation = "MUY INTERESANTE 🔥"
    elif score >= 55:
        recommendation = "ANALIZAR CON CALMA 👀"

    car_data = {
        "brand": data["brand"],
        "model": data["model"],
        "year": year,
        "km": km,
        "price": price,
        "image_url": data["image_url"],
        "estimated_market_price": estimated_market_price,
        "estimated_expenses": expenses,
        "estimated_net_profit": estimated_profit,
        "roi": roi,
        "score": score,
        "recommendation": recommendation,
        "is_hot_deal": score >= 80,
        "is_premium_brand": brand in premium_brands
    }

    saved_car = create_car(db, car_data)

    return {
        "message": "Coche analizado y guardado",
        "id": saved_car.id,
        "score": score,
        "recommendation": recommendation
    }

@app.delete("/cars/{car_id}")
def delete_car_endpoint(car_id: int, db: Session = Depends(get_db)):
    car = delete_car(db, car_id)

    if not car:
        return {"message": "Coche no encontrado"}

    return {"message": "Coche eliminado"}

@app.delete("/cars")
def delete_all_cars(db: Session = Depends(get_db)):
    from app.db.models import Car

    db.query(Car).delete()
    db.commit()

    return {"message": "Todos los coches eliminados"}

@app.patch("/cars/{car_id}/favorite")
def toggle_favorite(car_id: int, db: Session = Depends(get_db)):
    from app.db.models import Car

    car = db.query(Car).filter(Car.id == car_id).first()

    if not car:
        return {"message": "Coche no encontrado"}

    car.is_favorite = not bool(car.is_favorite)
    db.commit()
    db.refresh(car)

    return {"message": "Favorito actualizado", "is_favorite": car.is_favorite}

@app.patch("/cars/{car_id}/sold")
def toggle_sold(car_id: int, db: Session = Depends(get_db)):
    from app.db.models import Car

    car = db.query(Car).filter(Car.id == car_id).first()

    if not car:
        return {"message": "Coche no encontrado"}

    car.is_sold = not bool(car.is_sold)
    db.commit()
    db.refresh(car)

    return {"message": "Estado vendido actualizado", "is_sold": car.is_sold}
