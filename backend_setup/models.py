from .db import db
from datetime import datetime

# Model for storing weather queries in the database
class WeatherQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(128), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    weather_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Serialize model instance to dictionary
    def to_dict(self):
        return {
            "id": self.id,
            "location": self.location,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "created_at": self.created_at.isoformat()
        }
