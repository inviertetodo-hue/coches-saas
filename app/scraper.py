import re
import requests

from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}

KNOWN_BRANDS = [
    "BMW",
    "Audi",
    "Mercedes",
    "Porsche",
    "Volkswagen",
    "Toyota",
    "Tesla",
    "Cupra",
    "Peugeot",
    "Renault",
    "Citroen",
    "Ford"
]

def clean_number(text):

    if not text:
        return None

    value = re.sub(r"[^\d]", "", text)

    if not value:
        return None

    return int(value)


def detect_brand(text):

    for brand in KNOWN_BRANDS:

        if brand.lower() in text.lower():
            return brand.upper()

    return "BMW"


def detect_model(text, brand):

    text = text.replace("\n", " ")

    patterns = [
        rf"{brand}\s([A-Za-z0-9\-]+)",
        rf"{brand.lower()}\s([A-Za-z0-9\-]+)"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:
            return match.group(1).upper()

    return "IMPORTADO"


def detect_year(text):

    match = re.search(
        r"(201[5-9]|202[0-6])",
        text
    )

    if match:
        return int(match.group(1))

    return 2020


def detect_price(text):

    patterns = [
        r"(\d{1,3}[.,]\d{3})\s?€",
        r"€\s?(\d{1,3}[.,]\d{3})"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text
        )

        if match:

            value = clean_number(
                match.group(1)
            )

            if value:
                return value

    return 30000


def detect_km(text):

    patterns = [
        r"(\d{1,3}[.,]\d{3})\s?km",
        r"(\d{1,3}[.,]\d{3})\s?kms"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text.lower()
        )

        if match:

            value = clean_number(
                match.group(1)
            )

            if value:
                return value

    return 70000


def scrape_car_url(url: str):

    response = requests.get(
        url,
        headers=HEADERS,
        timeout=15
    )

    soup = BeautifulSoup(
        response.text,
        "html.parser"
    )

    title = ""

    if soup.title:
        title = soup.title.text

    page_text = soup.get_text(
        " ",
        strip=True
    )

    full_text = f"{title} {page_text}"

    brand = detect_brand(full_text)

    model = detect_model(
        full_text,
        brand
    )

    year = detect_year(full_text)

    price = detect_price(full_text)

    km = detect_km(full_text)

    image_url = ""

    og = soup.find(
        "meta",
        property="og:image"
    )

    if og and og.get("content"):
        image_url = og.get("content")

    if not image_url:
        image_url = "https://images.unsplash.com/photo-1503376780353-7e6692767b70"

    return {
        "brand": brand,
        "model": model,
        "year": year,
        "km": km,
        "price": price,
        "image_url": image_url
    }
