from app.ai.scoring import calculate_professional_score

premium_brands = ["BMW", "AUDI", "MERCEDES", "PORSCHE"]

def analyze_car(car):
    analysis = calculate_professional_score(car)

    return {
        **car,
        **analysis
    }
