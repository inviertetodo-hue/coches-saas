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

def delete_car(db: Session, car_id: int):
    car = db.query(Car).filter(Car.id == car_id).first()

    if car:
        db.delete(car)
        db.commit()

    return car

from app.db.models import User

def create_user(
    db,
    email,
    hashed_password
):
    user = User(
        email=email,
        password=hashed_password
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user

def get_user_by_email(db, email):

    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
