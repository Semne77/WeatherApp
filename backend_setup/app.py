from flask import Flask
from .db import db
from .routes import weather_bp
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all routes (allows cross-origin requests from frontend)
CORS(app)

# Load configuration (e.g., database URI) from config.py
app.config.from_object("backend_setup.config")

# Initialize database with app context
print("Loaded DB URI:", app.config["SQLALCHEMY_DATABASE_URI"])
db.init_app(app)

# Register weather routes under blueprint
app.register_blueprint(weather_bp)

# Run the app locally for development
if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
