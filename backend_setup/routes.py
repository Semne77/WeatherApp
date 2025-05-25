from flask import Blueprint, request, jsonify
from backend_setup.utils.fetch_weather import fetch_weather
from backend_setup.models import WeatherQuery
from backend_setup.db import db
import backend_setup.config
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()  

client = OpenAI()

weather_bp = Blueprint("weather", __name__)

@weather_bp.route("/api/weather-query", methods=["POST"])
def weather_query():
    print("POST /api/weather-query hit!")
    data = request.get_json()
    print("Received data:", data)

    location = data.get("location")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    try:
        # 🧽 Step 1: Delete existing entry (if any)
        existing = WeatherQuery.query.filter_by(
            location=location,
            start_date=start_date,
            end_date=end_date
        ).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()

        # 📡 Step 2: Fetch new data
        weather_data = fetch_weather(location, start_date, end_date)

        # 💾 Step 3: Save new record
        query = WeatherQuery(
            location=location,
            start_date=start_date,
            end_date=end_date,
            weather_data=weather_data
        )
        db.session.add(query)
        db.session.commit()

        return jsonify({"message": "Weather data saved."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400


from datetime import datetime

@weather_bp.route("/api/weather-query", methods=["GET"])
def get_weather_query():
    location = request.args.get("location")
    start_date_str = request.args.get("start_date")
    end_date_str = request.args.get("end_date")

    if not location or not start_date_str or not end_date_str:
        return jsonify({"error": "Location, start_date, and end_date are required"}), 400

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    query = WeatherQuery.query.filter_by(
        location=location,
        start_date=start_date,
        end_date=end_date
    ).order_by(WeatherQuery.created_at.desc()).first()

    if not query:
        return jsonify({"error": "No data found for this location and date range"}), 404

    return jsonify({
        "location": query.location,
        "start_date": query.start_date.isoformat(),
        "end_date": query.end_date.isoformat(),
        "weather_data": query.weather_data,
        "created_at": query.created_at.isoformat()
    }), 200

@weather_bp.route("/api/search-history", methods=["GET"])
def get_search_history():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    offset = (page - 1) * limit

    queries = WeatherQuery.query.order_by(WeatherQuery.created_at.desc()).offset(offset).limit(limit).all()
    total = WeatherQuery.query.count()

    return jsonify({
        "data": [q.to_dict() for q in queries],
        "total": total
    })


@weather_bp.route("/api/weather-query/<int:query_id>", methods=["DELETE"])
def delete_weather_query(query_id):
    entry = WeatherQuery.query.get(query_id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404
    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Entry deleted"}), 200


@weather_bp.route("/api/weather-query/<int:query_id>", methods=["PUT"])
def update_weather_query(query_id):
    entry = WeatherQuery.query.get(query_id)
    if not entry:
        return jsonify({"error": "Entry not found"}), 404

    data = request.get_json()
    location = data.get("location")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not location or not start_date or not end_date:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        updated_weather = fetch_weather(location, start_date, end_date)
        entry.location = location
        entry.start_date = start_date
        entry.end_date = end_date
        entry.weather_data = updated_weather
        db.session.commit()
        return jsonify({"message": "Query updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@weather_bp.route("/api/generate-report", methods=["POST"])
def generate_report():
    data = request.get_json()
    location = data.get("location")
    start = data.get("start_date")
    end = data.get("end_date")
    daily = data.get("forecast")

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are a casual assistant helping a tennis tournament supervisor. You give short and relaxed advice based only on temperature."
                },
                {
                    "role": "user",
                    "content": f"""
        You are helping decide whether to host a tennis tournament indoors or outdoors based only on temperature.

        Here’s the rule:
        - If the max temperature is below 10°C on any day, suggest having an indoor backup plan.
        - If the overall temperatures are above 10°C most of the time, it's fine to host outdoors.

        Based on this forecast for {location} from {start} to {end}, give a short and casual recommendation.

        Data:\n{daily}
        """
                }
            ]
        )



        return jsonify({"report": response.choices[0].message.content})
    except Exception as e:
        print("AI report generation failed:", str(e))  # 🪵 Logs the actual error in your terminal
        return jsonify({"error": str(e)}), 500  # 🛠️ Make sure this is 500 not 50

