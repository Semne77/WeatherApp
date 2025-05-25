# 🧠 Weather Tournament Advisor

This app helps tennis tournament managers decide whether to host matches indoors or outdoors based on weather forecasts.

## 🌐 Live Demo
Run locally using the instructions below.

## 🚀 Features
- 🌎 Search for a city and date range to get weather data.
- 📈 View daily temperature forecasts.
- 🧠 Get AI-generated advice for hosting the tournament indoors or outdoors.
- 📄 Export the forecast and AI recommendation to PDF.
- 📚 Search history with re-run and delete options.

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
  - Tailwind CSS for styling
  - Axios for API requests
  - Google Maps JavaScript API for map interaction and location autocomplete
  - Google Geocoding API to convert coordinates to readable locations
  - OpenWeatherMap API for current and 5-day forecast weather data

- **Backend**: Flask (Python)
  - Flask-CORS to enable cross-origin requests
  - SQLAlchemy for database interaction
  - dotenv to load API keys securely

- **Database**: PostgreSQL (hosted via Render)

- **APIs**:
  - [Open-Meteo](https://open-meteo.com/) for historical and forecast temperature data
  - [OpenAI GPT-4](https://platform.openai.com/) for AI-generated tennis tournament advice
  - [OpenWeatherMap](https://openweathermap.org/) for real-time weather and forecasts
  - [Google Maps & Geocoding API](https://developers.google.com/maps/documentation) for location handling


---

## ⚙️ How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/weather-tournament-advisor.git
cd weather-tournament-advisor
```

### 2. Setup the Backend
```bash
cd backend_copy
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
# Create a .env file inside the backend_copy/ directory:
```bash
DATABASE_URL=your_postgres_url
WEATHER_API_KEY=your_open_meteo_key
OPENAI_API_KEY=your_openai_key
```

# Then run the Flask server:
```bash
python3 -m backend_copy.app
```

### 3. Setup the Frontend
```bash
cd frontend
npm install
npm run dev
```

### Frontend will be available at:
###📍 http://localhost:5173


