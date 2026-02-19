# tests/conftest.py
import os
import pytest
import vcr
import sys

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
    
@pytest.fixture
def client():
    from backend.app import app
    app.config["TESTING"] = True
    return app.test_client()

@pytest.fixture(scope="session")
def my_vcr():
    """
    Session-scoped VCR instance.
    Stores cassettes in tests/cassettes and records once.
    """
    cassette_dir = os.path.join(os.path.dirname(__file__), "cassettes")
    os.makedirs(cassette_dir, exist_ok=True)

    return vcr.VCR(
        cassette_library_dir=cassette_dir,
        record_mode="once",  # record on first run, then replay
        match_on=["method", "scheme", "host", "port", "path", "query"],
        decode_compressed_response=True,
        filter_headers=["authorization"],
    )
