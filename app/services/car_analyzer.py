def is_premium_brand(brand):

    premium_brands = [
        "BMW",
        "AUDI",
        "MERCEDES",
        "PORSCHE",
        "LEXUS",
        "VOLVO"
    ]

    return brand.upper() in premium_brands


def estimate_market_price(car):

    base_price = car.price

    km_penalty = (car.km / 10000) * 300

    age_bonus = (car.year - 2015) * 500

    premium_bonus = 0

    if is_premium_brand(car.brand):
        premium_bonus = car.price * 0.08

    market_price = (
        base_price
        - km_penalty
        + age_bonus
        + premium_bonus
    )

    return max(market_price, 1000)


def calculate_margin(car, market_price):

    return market_price - car.price


def estimate_expenses(car):

    transport_cost = 600

    transfer_cost = car.price * 0.04

    repair_buffer = 800

    dealer_margin_cost = car.price * 0.02

    total_expenses = (
        transport_cost +
        transfer_cost +
        repair_buffer +
        dealer_margin_cost
    )

    return round(total_expenses, 2)


def estimate_net_profit(margin, expenses):

    return round(margin - expenses, 2)


def score_deal(margin, price):

    if price <= 0:
        return 0

    score = (margin / price) * 100

    if score < 0:
        return 0

    if score > 100:
        return 100

    return round(score, 2)


def get_deal_label(score):

    if score >= 25:
        return "CHOLLO"

    if score >= 15:
        return "BUENO"

    if score >= 5:
        return "NORMAL"

    return "RIESGO"


def get_buy_recommendation(score, net_profit):

    if score >= 25 and net_profit > 3000:
        return "COMPRAR YA"

    if score >= 15 and net_profit > 1500:
        return "MUY INTERESANTE"

    if score >= 5:
        return "REVISAR"

    return "DESCARTAR"


def detect_risk_flags(car, margin):

    risks = []

    if car.price < 2000:
        risks.append("PRECIO DEMASIADO BAJO")

    if car.km > 250000:
        risks.append("KILOMETRAJE MUY ALTO")

    if car.year < 2010:
        risks.append("COCHE ANTIGUO")

    if margin < 0:
        risks.append("MARGEN NEGATIVO")

    return risks


def is_good_deal(score):

    return score >= 15


def analyze_car_deal(car):

    market_price = estimate_market_price(car)

    margin = calculate_margin(car, market_price)

    expenses = estimate_expenses(car)

    net_profit = estimate_net_profit(
        margin,
        expenses
    )

    score = score_deal(
        margin,
        car.price
    )

    label = get_deal_label(score)

    recommendation = get_buy_recommendation(
        score,
        net_profit
    )

    risks = detect_risk_flags(
        car,
        margin
    )

    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "year": car.year,
        "km": car.km,
        "price": car.price,
        "is_premium_brand": is_premium_brand(car.brand),
        "estimated_market_price": round(market_price, 2),
        "gross_margin": round(margin, 2),
        "estimated_expenses": expenses,
        "estimated_net_profit": net_profit,
        "score": score,
        "label": label,
        "recommendation": recommendation,
        "good_deal": is_good_deal(score),
        "risk_flags": risks
    }

