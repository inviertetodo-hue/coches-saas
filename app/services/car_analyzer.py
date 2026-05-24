def estimate_market_price(car):

    base_price = car.price

    km_penalty = (car.km / 10000) * 300

    age_bonus = (car.year - 2015) * 500

    market_price = base_price - km_penalty + age_bonus

    return max(market_price, 1000)


def calculate_margin(car, market_price):

    return market_price - car.price


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


def get_buy_recommendation(score, margin):

    if score >= 25 and margin > 3000:
        return "COMPRAR YA"

    if score >= 15 and margin > 1500:
        return "MUY INTERESANTE"

    if score >= 5:
        return "REVISAR"

    return "DESCARTAR"


def detect_risk_flags(car, margin):

    risks = []

    # precio sospechosamente bajo
    if car.price < 2000:
        risks.append("PRECIO DEMASIADO BAJO")

    # demasiados km
    if car.km > 250000:
        risks.append("KILOMETRAJE MUY ALTO")

    # coche viejo
    if car.year < 2010:
        risks.append("COCHE ANTIGUO")

    # margen negativo
    if margin < 0:
        risks.append("MARGEN NEGATIVO")

    return risks


def is_good_deal(score):

    return score >= 15


def analyze_car_deal(car):

    market_price = estimate_market_price(car)

    margin = calculate_margin(car, market_price)

    score = score_deal(margin, car.price)

    label = get_deal_label(score)

    recommendation = get_buy_recommendation(score, margin)

    risks = detect_risk_flags(car, margin)

    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "year": car.year,
        "km": car.km,
        "price": car.price,
        "estimated_market_price": round(market_price, 2),
        "margin": round(margin, 2),
        "score": score,
        "label": label,
        "recommendation": recommendation,
        "good_deal": is_good_deal(score),
        "risk_flags": risks
    }

