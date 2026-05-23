def estimate_market_price(car):
    """
    Estimación más estable de mercado.
    """

    base_price = 18000

    km_penalty = (car.km / 10000) * 400
    age_penalty = (2026 - car.year) * 750

    market_price = base_price - km_penalty - age_penalty

    return max(market_price, 1200)


def calculate_margin(car, market_price):
    return market_price - car.price


def score_deal(margin, price):
    """
    Score 0–100 tipo inversión.
    """

    if price <= 0:
        return 0

    score = (margin / price) * 100

    if score < 0:
        return 0
    if score > 100:
        return 100

    return round(score, 2)


def is_good_deal(score):
    return score >= 15

