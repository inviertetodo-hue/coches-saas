from hashlib import sha256

def hash_password(password: str):
    return sha256(password.encode()).hexdigest()

def verify_password(password: str, hashed: str):
    return sha256(password.encode()).hexdigest() == hashed
