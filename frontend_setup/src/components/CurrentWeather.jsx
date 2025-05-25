// src/components/CurrentWeather.jsx
import React from 'react';

function CurrentWeather({ data }) {
    if (!data) return null;
  
    const { name, main, weather } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  
    return (
      <div>
        <h2>Current Weather</h2>
        <p>City: {name}</p>
        <p>Temperature: {main.temp}°C</p>
        <p>Condition: {weather[0].description}</p>
        <img src={iconUrl} alt={weather[0].description} />
      </div>
    );
  }
  

export default CurrentWeather;
