from flask import Flask
from backend.db import db
from backend.routes import weather_bp
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",  # for local frontend dev
    "https://weather-frontend-plhk.onrender.com"  # deployed frontend
])

app.config.from_object("backend.config")
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(weather_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
