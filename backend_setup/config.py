import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database config
SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
SQLALCHEMY_TRACK_MODIFICATIONS = False
