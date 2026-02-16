from backend.utils.validation import validate_weather_payload

def test_missing_location():
    assert validate_weather_payload({"start_date": "2026-02-01", "end_date": "2026-02-02"}) == "location is required"

def test_valid_payload():
    assert validate_weather_payload({"location": "NYC", "start_date": "2026-02-01", "end_date": "2026-02-02"}) is None
