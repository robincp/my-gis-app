import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

// National Grid locations (with approximations based on the National Grid Syracuse office and nearby locations)
const nationalGridLocations = [
  { id: 1, position: [43.051437, -76.156813], name: "National Grid Syracuse HQ" },
  { id: 2, position: [43.134812, -76.087812], name: "National Grid North Syracuse" },
  { id: 3, position: [42.935938, -75.846438], name: "National Grid Cazenovia" },
  { id: 4, position: [43.130562, -76.189437], name: "National Grid Liverpool" }
];

function MapComponent() {
  return (
    <MapContainer center={mapCenter} zoom={12} style={{ height: "500px", width: "100%" }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render markers for National Grid locations */}
      {nationalGridLocations.map(location => (
        <Marker key={location.id} position={location.position} icon={customIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapComponent;
