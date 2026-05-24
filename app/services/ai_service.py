import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def analyze_car_with_ai(car):
    if not os.getenv("OPENAI_API_KEY"):
        return "IA no configurada. Falta OPENAI_API_KEY."

    prompt = f"""
Analiza este coche para compraventa profesional en España.

Marca: {car['brand']}
Modelo: {car['model']}
Año: {car['year']}
KM: {car['km']}
Precio: {car['price']}€
Beneficio estimado: {car['estimated_net_profit']}€
Score: {car['score']}

Devuelve una recomendación breve, directa y comercial.
"""

    response = client.responses.create(
        model="gpt-5.5",
        input=prompt
    )

    return response.output_text
