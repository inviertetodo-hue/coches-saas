from sqlalchemy import Column, Integer, Float, String, Boolean
from app.db.database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)

    brand = Column(String)
    model = Column(String)
    year = Column(Integer)
    km = Column(Integer)
    price = Column(Float)
    image_url = Column(String)

    estimated_market_price = Column(Float)
    estimated_expenses = Column(Float)
    estimated_net_profit = Column(Float)
    roi = Column(Float)
    score = Column(Float)
    recommendation = Column(String)

    is_hot_deal = Column(Boolean, default=False)
    is_premium_brand = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    is_sold = Column(Boolean, default=False)

    visual_score = Column(Float, default=75)
    visual_status = Column(String, default="BUEN ASPECTO")
    visual_risk = Column(String, default="RIESGO BAJO")
    visual_color = Column(String, default="COLOR NO DETECTADO")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
