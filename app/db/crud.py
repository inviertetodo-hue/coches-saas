from sqlalchemy.orm import Session

from app.db.models import Car

def create_car(db: Session, car_data: dict):
    car = Car(**car_data)

    db.add(car)

    db.commit()

    db.refresh(car)

    return car

def get_all_cars(db: Session):
    return db.query(Car).all()
