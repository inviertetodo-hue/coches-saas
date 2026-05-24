from pydantic import BaseModel


class CarCreate(BaseModel):
    brand: str
    model: str
    year: int
    km: int
    price: float

