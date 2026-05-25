import re
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

def extract_number(text):
    if not text:
        return None

    cleaned = re.sub(r"[^\d]", "", text)

    if not cleaned:
        return None

    return int(cleaned)


def scrape_car_url(url: str):
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=10
    )

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    page_text = soup.get_text(
        " ",
        strip=True
    )

    title = (
        soup.title.string
        if soup.title
        else ""
    )

    combined = f"{title} {page_text}"

    brand = "BMW"
    model = "Importado"

    known_brands = [
        "BMW",
        "Audi",
        "Mercedes",
        "Porsche",
        "Volkswagen",
        "Toyota",
        "Tesla"
    ]

    for item in known_brands:
        if item.lower() in combined.lower():
            brand = item.upper()
            break

    year = 2020
    year_match = re.search(r"(20[0-2][0-9])", combined)

    if year_match:
        year = int(year_match.group(1))

    price = 30000
    price_match = re.search(r"(\d{2,3}[.,]?\d{3})\s?€", combined)

    if price_match:
        price = extract_number(price_match.group(1))

    km = 70000
    km_match = re.search(r"(\d{1,3}[.,]?\d{3})\s?km", combined.lower())

    if km_match:
        km = extract_number(km_match.group(1))

    image_url = ""

    og_image = soup.find(
        "meta",
        property="og:image"
    )

    if og_image and og_image.get("content"):
        image_url = og_image.get("content")
    else:
        image_url = "https://images.unsplash.com/photo-1503376780353-7e6692767b70"

    return {
        "brand": brand,
        "model": model,
        "year": year,
        "km": km,
        "price": price,
        "image_url": image_url
    }
