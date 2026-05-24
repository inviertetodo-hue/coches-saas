def normalize_car_data(raw_data):

    return {
        "brand": raw_data.get("brand"),
        "model": raw_data.get("model"),
        "year": raw_data.get("year"),
        "km": raw_data.get("km"),
        "price": raw_data.get("price")
    }


def validate_car_data(car_data):

    required_fields = [
        "brand",
        "model",
        "year",
        "km",
        "price"
    ]

    for field in required_fields:

        if field not in car_data:
            return False

        if car_data[field] is None:
            return False

    return True


def fake_mobile_de_scraper():

    cars = [

        {
            "brand": "BMW",
            "model": "320d",
            "year": 2019,
            "km": 120000,
            "price": 18500
        },

        {
            "brand": "Audi",
            "model": "A4",
            "year": 2018,
            "km": 98000,
            "price": 17900
        },

        {
            "brand": "Mercedes",
            "model": "C220",
            "year": 2020,
            "km": 85000,
            "price": 24900
        }
    ]

    valid_cars = []

    for raw_car in cars:

        normalized = normalize_car_data(raw_car)

        if validate_car_data(normalized):
            valid_cars.append(normalized)

    return valid_cars

