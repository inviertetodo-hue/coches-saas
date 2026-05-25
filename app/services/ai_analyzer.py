def analyze_car(car):
    price = car.get("price") or car.get("precio") or 0
    km = car.get("km") or 0
    brand = (car.get("brand") or car.get("marca") or "").upper()

    premium_brands = ["BMW", "AUDI", "MERCEDES", "PORSCHE"]

    market_price = price * 1.35
    expenses = 1500 + (km * 0.03)
    estimated_profit = market_price - price - expenses

    roi = (estimated_profit / price) * 100 if price > 0 else 0

    score = 50
    if estimated_profit > 3000:
        score += 15
    if roi > 10:
        score += 20
    if brand in premium_brands:
        score += 10
    if km < 100000:
        score += 5

    score = round(min(score, 100), 2)

    recommendation = "DESCARTAR"
    if score >= 70:
        recommendation = "COMPRAR YA 🚀"
    elif score >= 55:
        recommendation = "INTERESANTE 👀"

    hot_deal = roi >= 12 and estimated_profit >= 3000

    return {
        "estimated_market_price": round(market_price, 2),
        "estimated_expenses": round(expenses, 2),
        "estimated_net_profit": round(estimated_profit, 2),
        "roi": round(roi, 2),
        "score": score,
        "recommendation": recommendation,
        "is_hot_deal": hot_deal,
        "is_premium_brand": brand in premium_brands
    }
