from math import floor


PREMIUM_BRANDS = [
    "BMW",
    "AUDI",
    "MERCEDES",
    "PORSCHE",
    "LEXUS",
    "TESLA"
]


def calculate_market_price(car):

    base = car.price * 1.35

    age_penalty = (2025 - car.year) * 450

    km_penalty = floor(car.km / 10000) * 180

    market_price = (
        base
        - age_penalty
        - km_penalty
    )

    return max(market_price, 0)


def calculate_expenses(car):

    transport = 650
    plates = 250
    paperwork = 300

    repairs = 0

    if car.km > 180000:
        repairs += 2500

    elif car.km > 140000:
        repairs += 1500

    elif car.km > 100000:
        repairs += 800

    premium_tax = 0

    if car.brand in PREMIUM_BRANDS:
        premium_tax = 500

    return (
        transport
        + plates
        + paperwork
        + repairs
        + premium_tax
    )


def calculate_score(
    net_profit,
    market_price,
    expenses,
    car
):

    score = 0

    if net_profit > 6000:
        score += 40

    elif net_profit > 3000:
        score += 25

    elif net_profit > 1000:
        score += 10

    if car.brand in PREMIUM_BRANDS:
        score += 20

    if car.year >= 2020:
        score += 20

    elif car.year >= 2018:
        score += 10

    if car.km < 100000:
        score += 20

    elif car.km < 150000:
        score += 10

    if expenses > 5000:
        score -= 30

    if net_profit < 0:
        score = 0

    return min(score, 100)


def get_label(score):

    if score >= 80:
        return "HOT DEAL"

    if score >= 60:
        return "MUY BUENO"

    if score >= 40:
        return "INTERESANTE"

    if score >= 20:
        return "RIESGO"

    return "DESCARTAR"


def get_recommendation(score):

    if score >= 80:
        return "COMPRAR YA"

    if score >= 60:
        return "MUY RECOMENDABLE"

    if score >= 40:
        return "REVISAR"

    if score >= 20:
        return "RIESGO ALTO"

    return "NO COMPRAR"


def detect_risks(car):

    risks = []

    if car.km > 200000:
        risks.append("KM MUY ALTO")

    if car.year < 2014:
        risks.append("COCHE ANTIGUO")

    if car.price > 60000:
        risks.append("PRECIO ELEVADO")

    if car.brand not in PREMIUM_BRANDS:
        risks.append("MENOR DEMANDA")

    return risks


def is_hot_deal(score):

    return score >= 80


def analyze_car_deal(car):

    market_price = calculate_market_price(car)

    expenses = calculate_expenses(car)

    gross_margin = (
        market_price - car.price
    )

    net_profit = (
        market_price
        - car.price
        - expenses
    )

    score = calculate_score(
        net_profit,
        market_price,
        expenses,
        car
    )

    label = get_label(score)

    recommendation = get_recommendation(score)

    risks = detect_risks(car)

    return {

        "id": car.id,

        "brand": car.brand,

        "model": car.model,

        "year": car.year,

        "km": car.km,

        "price": car.price,

        "image_url": car.image_url,

        "is_premium_brand":
            car.brand in PREMIUM_BRANDS,

        "estimated_market_price":
            round(market_price, 2),

        "estimated_expenses":
            round(expenses, 2),

        "gross_margin":
            round(gross_margin, 2),

        "estimated_net_profit":
            round(net_profit, 2),

        "score":
            score,

        "label":
            label,

        "recommendation":
            recommendation,

        "is_hot_deal":
            is_hot_deal(score),

        "risk_flags":
            risks
    }

