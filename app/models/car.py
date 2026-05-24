from pydantic import BaseModel
from typing import Optional


class Car(BaseModel):

    id: int

    brand: str

    model: str

    year: int

    km: int

    price: float

    image_url: Optional[str] = (
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
    )

