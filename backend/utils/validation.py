def validate_weather_payload(data: dict) -> str | None:
    if not data.get("location"):
        return "location is required"
    if not data.get("start_date"):
        return "start_date is required"
    if not data.get("end_date"):
        return "end_date is required"
    return None
