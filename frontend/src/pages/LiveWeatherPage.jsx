import React, { useState, useCallback } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import LocationButton from '../components/LocationButton';
import ErrorMessage from '../components/ErrorMessage';
import MapComponent from '../components/MapComponent';

function FrontendPage() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);

  const googleKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather and forecast data from OpenWeatherMap API
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setError('');
      setLat(lat);
      setLon(lon);

      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      setWeather(weatherRes.data);
      const daily = forecastRes.data.list.filter((_, index) => index % 8 === 0);
      setForecast(daily);
    } catch (err) {
      setError('Location error or API failed.');
      setWeather(null);
      setForecast([]);
    }
  };

    // Handle click on the map (reverse geocode and fetch weather)
  const handleMapClick = useCallback(
    async (lat, lon) => {
      await fetchWeatherByCoords(lat, lon);
      setTimeout(() => setAddress(""), 0);
    }
    ,
    [fetchWeatherByCoords]
  );

  // Handle location selected from search suggestions
  const handleSearchSelection = (lat, lon, fullAddress) => {
    setAddress(fullAddress);
    setLat(lat);
    setLon(lon);
    fetchWeatherByCoords(lat, lon);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Weather & Forecast Explorer</h1>
        <p className="text-gray-400">Enter a location or use your current one to view the weather, forecast, and map.</p>
      </div>
  
      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchBar
          address={address}
          setAddress={setAddress}
          onLocationSelect={handleSearchSelection}
        />
      </div>
  
      {/* Main Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weather Info */}
        <div className="bg-gray-800 rounded-lg p-4 shadow">
          {error && <ErrorMessage message={error} />}
          <CurrentWeather data={weather} />
        </div>
  
        {/* Map */}
        <div className="bg-gray-800 rounded-lg p-4 shadow">
          <LocationButton onUseLocation={fetchWeatherByCoords} />
          <MapComponent lat={lat} lon={lon} onMapClick={handleMapClick} />
        </div>
      </div>
  
      {/* Forecast */}
      <div className="bg-gray-800 rounded-lg p-4 shadow">
        <Forecast data={forecast} />
      </div>
    </div>
  );
}

export default FrontendPage;
