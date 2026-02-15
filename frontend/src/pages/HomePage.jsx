// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import HistoryForecastPage from './HistoryForecastPage';
import LiveWeatherPage from './LiveWeatherPage';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Weather Explorer</h1>
          <p className="text-gray-300">
            Two simple tools: live weather on a map, and date-range weather you can save and review.
          </p>
        </header>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Map / Live Weather */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow space-y-4">
            <h2 className="text-xl font-semibold">Map View</h2>
            <p className="text-gray-300">
              Search any place on Earth or click the map to instantly see the current weather and a short forecast.
            </p>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Live current conditions</li>
              <li>5-day forecast</li>
              <li>Map click = quick lookup</li>
            </ul>
            <Link
              to="/map"
              className="inline-block w-full text-center bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-semibold"
            >
              Open Map View
            </Link>
          </div>

          {/* Date Ranges */}
          <div className="bg-gray-800 rounded-2xl p-6 shadow space-y-4">
            <h2 className="text-xl font-semibold">Date Ranges View</h2>
            <p className="text-gray-300">
              Pick a location + start/end dates to pull weather for that range, store it, and review past queries.
            </p>
            <ul className="text-gray-300 list-disc list-inside space-y-1">
              <li>Historical / forecast range support</li>
              <li>Saved search history</li>
              <li>Optional AI tournament note + PDF export (if enabled)</li>
            </ul>
            <Link
              to="/ranges"
              className="inline-block w-full text-center bg-green-600 hover:bg-green-700 transition rounded-lg py-2 font-semibold"
            >
              Open Date Ranges View
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center text-gray-400 text-sm">
          Tip: Start with <span className="text-gray-200">Map View</span> for quick lookups, then use{" "}
          <span className="text-gray-200">Date Ranges</span> when you need specific date windows.
        </div>
      </div>
    </div>
  );
}

export default HomePage;
