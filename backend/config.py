import os
from dotenv import load_dotenv

load_dotenv()  

SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")  # or hardcode for local dev
SQLALCHEMY_TRACK_MODIFICATIONS = False
