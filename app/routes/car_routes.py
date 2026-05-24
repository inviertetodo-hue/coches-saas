from fastapi import APIRouter
from app.models.car import Car
from app.services.car_analyzer import analyze_car_deal

router = APIRouter(
    prefix="/cars",
    tags=["Cars"]
)

cars_db = [
    Car(
        id=1,
        brand="BMW",
        model="320d",
        year=2019,
        km=95000,
        price=18500,
        
image_url="https://images.unsplash.com/photo-1555215695-3004980ad54e"
    ),
    Car(
        id=2,
        brand="AUDI",
        model="A4",
        year=2020,
        km=85000,
        price=24000,
        
image_url="https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"
    ),
    Car(
        id=3,
        brand="MERCEDES",
        model="C220",
        year=2018,
        km=120000,
        price=21000,
        
image_url="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
    )
]


@router.get("/dashboard")
def dashboard():
    analyzed = []

    for car in cars_db:
        analyzed.append(analyze_car_deal(car))

    analyzed.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    total_cars = len(analyzed)

    avg_score = 0

    if total_cars > 0:
        avg_score = round(
            sum(car["score"] for car in analyzed) / total_cars,
            1
        )

    hot_deals = [
        car for car in analyzed
        if car["is_hot_deal"]
    ]

    return {
        "stats": {
            "total_cars": total_cars,
            "avg_score": avg_score,
            "hot_deals_count": len(hot_deals)
        },
        "top_deals": analyzed,
        "hot_deals": hot_deals,
        "latest_imports": []
    }


@router.post("/")
def create_car(car: Car):
    cars_db.append(car)

    return {
        "message": "Coche añadido",
        "car": car
    }


@router.delete("/{car_id}")
def delete_car(car_id: int):
    global cars_db

    cars_db = [
        car for car in cars_db
        if car.id != car_id
    ]

    return {
        "message": "Coche eliminado",
        "car_id": car_id
    }


@router.post("/import-mobile")
def import_mobile():
    new_car = Car(
        id=len(cars_db) + 1,
        brand="PORSCHE",
        model="Macan",
        year=2021,
        km=45000,
        price=52000,
        
image_url="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    )

    cars_db.append(new_car)

    return {
        "message": "Importación completada",
        "car": new_car
    }

