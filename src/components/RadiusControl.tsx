

interface RadiusControlProps {
    radius: number;
    onChange: (radius: number) => void;
    locationName: string;
}

export default function RadiusControl({ radius, onChange, locationName }: RadiusControlProps) {
    return (
        <div className="absolute bottom-8 left-8 z-[1000] bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-80">
            <h3 className="font-bold text-gray-800 mb-2">Impact Radius</h3>
            <p className="text-sm text-gray-600 mb-4">Adjusting for: <span className="font-semibold text-orange-600">{locationName}</span></p>

            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <span className="text-gray-700 font-mono w-12 text-right">{radius} mi</span>
            </div>
        </div>
    );
}
