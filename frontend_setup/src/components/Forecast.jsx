// src/components/Forecast.jsx
import React from 'react';

function Forecast({ data }) {
  return (
    <div>
      <h2>5-Day Forecast</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
              style={{ width: '50px', height: '50px' }}
            />
            <span>
              {new Date(item.dt_txt).toLocaleDateString()} — {Math.round(item.main.temp)}°C, {item.weather[0].description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Forecast;
