def calculate_professional_score(car):
    price = car.get("price") or car.get("precio") or 0
    km = car.get("km") or 0
    year = car.get("year") or car.get("año") or 0
    brand = (car.get("brand") or car.get("marca") or "").upper()

    premium_brands = ["BMW", "AUDI", "MERCEDES", "PORSCHE"]
    strong_resale_brands = ["BMW", "AUDI", "MERCEDES", "TOYOTA", "VOLKSWAGEN", "PORSCHE"]

    market_price = price * 1.35
    expenses = 1500 + (km * 0.03)
    net_profit = market_price - price - expenses
    roi = (net_profit / price) * 100 if price > 0 else 0

    score = 40

    if net_profit > 7000:
        score += 25
    elif net_profit > 4000:
        score += 18
    elif net_profit > 2000:
        score += 10

    if roi > 20:
        score += 20
    elif roi > 12:
        score += 14
    elif roi > 8:
        score += 8

    if brand in premium_brands:
        score += 10

    if brand in strong_resale_brands:
        score += 8

    if km < 60000:
        score += 10
    elif km < 100000:
        score += 6
    elif km > 180000:
        score -= 12

    if year >= 2020:
        score += 8
    elif year < 2015:
        score -= 10

    score = max(0, min(100, round(score, 2)))

    if score >= 85:
        recommendation = "COMPRA PRIORITARIA 🚀"
    elif score >= 70:
        recommendation = "MUY INTERESANTE 🔥"
    elif score >= 55:
        recommendation = "ANALIZAR CON CALMA 👀"
    else:
        recommendation = "DESCARTAR"

    return {
        "estimated_market_price": round(market_price, 2),
        "estimated_expenses": round(expenses, 2),
        "estimated_net_profit": round(net_profit, 2),
        "roi": round(roi, 2),
        "score": score,
        "recommendation": recommendation,
        "is_hot_deal": score >= 80 and roi >= 12 and net_profit >= 3000,
        "is_premium_brand": brand in premium_brands
    }
