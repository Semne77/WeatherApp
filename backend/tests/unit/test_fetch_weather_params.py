# tests/unit/test_fetch_weather_params.py
import utils.fetch_weather as fw

def test_fetch_weather_builds_correct_params(monkeypatch):
    # avoid calling real geocoding
    monkeypatch.setattr(fw, "get_coordinates", lambda location: (40.7, -74.0))

    captured = {}

    class FakeResp:
        status_code = 200
        def json(self):
            return {"ok": True}

    def fake_get(url, params=None):
        captured["url"] = url
        captured["params"] = params
        return FakeResp()

    monkeypatch.setattr(fw.requests, "get", fake_get)

    fw.fetch_weather("New York", "2026-02-04", "2026-02-07")

    assert "open-meteo.com" in captured["url"]
    assert captured["params"]["latitude"] == 40.7
    assert captured["params"]["longitude"] == -74.0
    assert captured["params"]["start_date"] == "2026-02-04"
    assert captured["params"]["end_date"] == "2026-02-07"
    assert "daily" in captured["params"]


def test_fetch_weather_records_and_replays_openmeteo(my_vcr, monkeypatch):
    """
    Records Open-Meteo response once and replays it later.
    We mock get_coordinates so we don't record Nominatim calls.
    """
    monkeypatch.setattr(fw, "get_coordinates", lambda location: (40.7128, -74.0060))

    # Use historical dates so it always calls archive endpoint (stable over time)
    location = "New York, NY, USA"
    start_date = "2024-02-01"
    end_date = "2024-02-03"

    with my_vcr.use_cassette("openmeteo_new_york_2024_02_01_02_03.yaml"):
        result = fw.fetch_weather(location, start_date, end_date)

    assert isinstance(result, list)
    assert len(result) == 1
    assert "daily" in result[0]
    assert "temperature_2m_max" in result[0]["daily"]
    assert "temperature_2m_min" in result[0]["daily"]
