// src/components/ErrorMessage.jsx
import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null; // don't show anything if there's no error

  return (
    <div style={{ color: 'red', marginTop: '1rem' }}>
      <p>Error: {message}</p>
    </div>
  );
}

export default ErrorMessage;