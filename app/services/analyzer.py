def analyze_market_data(price, year, km):

    current_year = 2025

    age = current_year - year

    market_price = (
        price
        + 6000
        - (age * 700)
        - (km * 0.02)
    )

    if market_price < 5000:
        market_price = 5000

    expenses = (
        1500
        + (km * 0.03)
    )

    profit = market_price - price - expenses

    roi = (
        profit / price * 100
        if price > 0
        else 0
    )

    hot_deal = False

    if roi >= 18 and profit >= 2500:
        hot_deal = True

    score = 50

    if year >= 2020:
        score += 15

    if km <= 80000:
        score += 15

    if roi >= 10:
        score += 10

    if roi >= 15:
        score += 10

    if hot_deal:
        score += 15

    if score > 99:
        score = 99

    recommendation = "NORMAL"

    if roi >= 20:
        recommendation = "🔥 SUPER CHOLLO"

    elif roi >= 15:
        recommendation = "🚀 COMPRA PRIORITARIA"

    elif roi >= 10:
        recommendation = "✅ BUENA COMPRA"

    return {
        "market_price": round(market_price, 2),
        "expenses": round(expenses, 2),
        "profit": round(profit, 2),
        "roi": round(roi, 2),
        "score": round(score, 2),
        "recommendation": recommendation,
        "hot_deal": hot_deal
    }
