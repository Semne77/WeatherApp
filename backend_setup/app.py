from flask import Flask
from backend_setup.db import db
from backend_setup.routes import weather_bp
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app, origins="https://weather-frontend-plhk.onrender.com")

app.config.from_object("backend_setup.config")
db.init_app(app)

with app.app_context():
    db.create_all()

app.register_blueprint(weather_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001, host="0.0.0.0")
