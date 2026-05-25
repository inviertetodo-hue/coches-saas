from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "SUPER_SECRET_KEY_123"

ALGORITHM = "HS256"

def create_token(data: dict):

    to_encode = data.copy()

    expire = (
        datetime.utcnow() +
        timedelta(days=7)
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
