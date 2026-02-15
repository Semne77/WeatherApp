// src/components/ErrorMessage.jsx
import React from 'react';

function ErrorMessage({ message }) {
  if (!message) return null; // Skip rendering if no error message

  return (
    <div style={{ color: 'red', marginTop: '1rem' }}>
      <p>Error: {message}</p>
    </div>
  );
}

export default ErrorMessage;
