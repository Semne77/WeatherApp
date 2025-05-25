import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

function SearchBar({ address, setAddress, onLocationSelect }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  // Handle text input changes
  const handleInput = (e) => {
    setAddress(e.target.value);
    setValue(e.target.value); // updates autocomplete suggestions
  };

  // Handle selection from suggestions
  const handleSelect = async (suggestion) => {
    const description = suggestion.description;
    setValue(description, false);
    setAddress(description);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onLocationSelect(lat, lng, description);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  return (
    <div className="relative">
      <input
        className="w-full p-2 rounded border bg-gray-800 text-white"
        value={address}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Enter city, zip, or address"
      />

      {/* Suggestion list */}
      <div className="absolute mt-1 w-full bg-gray-800 border rounded z-50 max-h-48 overflow-y-auto">
        {status === 'OK' && data.map((suggestion) => (
          <div
            key={suggestion.place_id}
            className="p-2 hover:bg-gray-700 cursor-pointer text-white"
            onClick={() => handleSelect(suggestion)}
          >
            {suggestion.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
