import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Orange Icon for Careportal
const orangeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Custom Blue Icon for others (default is blue, but explicit is good)
const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
    id: string;
    name: string;
    type: string;
    address: string;
    lat: number;
    lng: number;
    careportal: boolean;
    radius: number;
    website?: string;
    phone?: string;
}

interface MapProps {
    locations: Location[];
    selectedLocationId: string | null;
    onSelectLocation: (id: string) => void;
}

// Component to handle map bounds updates
function MapUpdater({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function Map({ locations, selectedLocationId, onSelectLocation }: MapProps) {
    // Default center: Orange County (approx)
    const defaultCenter: [number, number] = [33.6846, -117.8265];

    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    return (
        <MapContainer center={defaultCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {locations.map(location => (
                <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={location.careportal ? orangeIcon : blueIcon}
                    eventHandlers={{
                        click: () => onSelectLocation(location.id),
                    }}
                >
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold text-lg">{location.name}</h3>
                            <p className="text-sm text-gray-600">{location.address}</p>
                            <div className="mt-2 flex flex-col gap-1">
                                {location.website && (
                                    <a href={`https://${location.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
                                        Website
                                    </a>
                                )}
                                {location.phone && (
                                    <a href={`tel:${location.phone}`} className="text-blue-500 hover:underline text-sm">
                                        {location.phone}
                                    </a>
                                )}
                            </div>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${location.careportal ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {location.careportal ? 'Careportal Active' : 'Not Active'}
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {selectedLocation && (
                <Circle
                    center={[selectedLocation.lat, selectedLocation.lng]}
                    radius={selectedLocation.radius * 1609.34} // Convert miles to meters
                    pathOptions={{ color: selectedLocation.careportal ? 'orange' : 'blue', fillColor: selectedLocation.careportal ? 'orange' : 'blue', fillOpacity: 0.2 }}
                />
            )}

            <MapUpdater center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null} />
        </MapContainer>
    );
}
