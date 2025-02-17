import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix for missing marker icons in Leaflet (React-Leaflet bug)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create a custom Leaflet icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],  
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34], 
});

// Center map on Syracuse, NY
const mapCenter = [43.0481, -76.1474];

function MapComponent() {
  const [locations, setLocations] = useState([]); // State for storing locations

  useEffect(() => {
    // Fetch locations from the backend
    axios.get('http://localhost:5000/locations')
      .then(response => {
        setLocations(response.data); // Set the locations from the response
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map(location => (
        <Marker key={location.id} position={[location.latitude, location.longitude]} icon={customIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
      <FitBounds locations={locations} />
    </MapContainer>
  );
}

// Component to adjust map bounds
function FitBounds({ locations }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(location => [location.latitude, location.longitude]));
      map.invalidateSize(); // Ensure map size is updated before fitting bounds
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

export default MapComponent;
