import { useState, useEffect } from 'react';
import Map from './components/Map';
import RadiusControl from './components/RadiusControl';
import locationsData from './data/locations.json';

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

function App() {
  // Load initial data from JSON, but keep it in state to allow updates (radius)
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, we might fetch this. For now, we load the imported JSON.
    // We cast the imported data to our type.
    setLocations(locationsData as Location[]);
  }, []);

  const handleLocationSelect = (id: string) => {
    setSelectedLocationId(id);
  };

  const handleRadiusChange = (newRadius: number) => {
    if (!selectedLocationId) return;

    setLocations(prevLocations =>
      prevLocations.map(loc =>
        loc.id === selectedLocationId
          ? { ...loc, radius: newRadius }
          : loc
      )
    );
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  return (
    <div className="h-screen w-screen relative flex flex-col">
      <header className="bg-white shadow-sm z-[1001] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <h1 className="text-xl font-bold text-gray-800">Careportal Map <span className="text-gray-400 font-normal text-sm ml-2">Orange County</span></h1>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-gray-600">Careportal Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-gray-600">Potential Partner</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <Map
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={handleLocationSelect}
        />

        {selectedLocation && (
          <RadiusControl
            radius={selectedLocation.radius}
            onChange={handleRadiusChange}
            locationName={selectedLocation.name}
          />
        )}
      </main>
    </div>
  );
}

export default App;
