from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float
from sqlalchemy import Boolean

from app.database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    brand = Column(String)

    model = Column(String)

    year = Column(Integer)

    km = Column(Integer)

    price = Column(Float)

    score = Column(Float)

    estimated_net_profit = Column(Float)

    recommendation = Column(String)

    image_url = Column(String)

    is_hot_deal = Column(Boolean)

    is_premium_brand = Column(Boolean)
