# backend/utils/fetch_weather.py

import requests
from datetime import datetime, date
import geopy
from geopy.geocoders import Nominatim

# Convert city name to latitude and longitude
def get_coordinates(location):
    geolocator = Nominatim(user_agent="weather-app")
    loc = geolocator.geocode(location)
    if loc:
        return loc.latitude, loc.longitude
    raise Exception("Location not found")

def fetch_weather(location, start_date, end_date):
    start = datetime.strptime(start_date, "%Y-%m-%d").date()
    end = datetime.strptime(end_date, "%Y-%m-%d").date()
    today = date.today()
    print("getting coardinates")
    latitude, longitude = get_coordinates(location)

    result = []
    print("selecting")
    if end < today:
        # Historical Data
        url = "https://archive-api.open-meteo.com/v1/archive"
    else:
        # Forecast or mixed
        url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "daily": "temperature_2m_max,temperature_2m_min",
        "timezone": "auto"
    }

    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        result.append(data)
    else:
        raise Exception(f"Open-Meteo API failed: {response.text}")

    return result
