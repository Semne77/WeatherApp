import backend.utils.fetch_weather as fw

def test_fetch_weather_builds_correct_params(monkeypatch):
    # avoid calling real geocoding
    monkeypatch.setattr(fw, "get_coordinates", lambda location: (40.7, -74.0))

    captured = {}

    class FakeResp:
        status_code = 200
        def json(self): return {"ok": True}

    def fake_get(url, params=None):
        captured["url"] = url
        captured["params"] = params
        return FakeResp()

    monkeypatch.setattr(fw.requests, "get", fake_get)

    fw.fetch_weather("New York", "2026-02-04", "2026-02-07")

    assert "open-meteo.com" in captured["url"] or "open-meteo.com" in captured["url"]
    assert captured["params"]["latitude"] == 40.7
    assert captured["params"]["longitude"] == -74.0
    assert captured["params"]["start_date"] == "2026-02-04"
    assert captured["params"]["end_date"] == "2026-02-07"
    assert "daily" in captured["params"]
