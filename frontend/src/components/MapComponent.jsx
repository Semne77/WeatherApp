import { useEffect, useRef } from 'react';

function MapComponent({ onMapClick, lat, lon }) {
  const mapRef = useRef(null);              // DOM container
  const mapInstanceRef = useRef(null);      // Google Maps instance

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 }, // default center
      zoom: 6,
    });

    map.addListener('click', (e) => {
      const clickedLat = e.latLng.lat();
      const clickedLng = e.latLng.lng();
      onMapClick(clickedLat, clickedLng);
    });

    mapInstanceRef.current = map;
  }, [onMapClick]);

  useEffect(() => {
    if (mapInstanceRef.current && lat && lon) {
      mapInstanceRef.current.setCenter({ lat, lng: lon });

      // Optional: force map to resize properly
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
    }
  }, [lat, lon]);

  return (
    <div
      ref={mapRef}
      style={{ height: '400px', width: '400px' }}
    />
  );
}

export default MapComponent;
