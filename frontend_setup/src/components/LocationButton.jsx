// src/components/LocationButton.jsx
import React from 'react';

function LocationButton({ onUseLocation }) {
  const handleClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onUseLocation(latitude, longitude); // Pass location back to parent
      },
      () => {
        alert('Unable to retrieve your location');
      }
    );
  };

  return <button onClick={handleClick}>Use My Location</button>;
}

export default LocationButton;
