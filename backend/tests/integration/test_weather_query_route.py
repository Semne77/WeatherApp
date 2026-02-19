# tests/integration/test_weather_query_route.py
import json

def test_post_weather_query_missing_field_returns_400(client):
    res = client.post(
        "/api/weather-query",
        data=json.dumps({
            "location": "New York, NY, USA",
            "start_date": "2026-02-04"
            # end_date missing
        }),
        content_type="application/json",
    )
    assert res.status_code == 400
