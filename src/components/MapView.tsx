import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, MapPin, Clock, Loader2, DollarSign } from 'lucide-react';

interface MapViewProps {
  pickupAddress: string;
  dropoffAddress: string;
  pickupCoords?: { lat: number; lng: number } | null;
  dropoffCoords?: { lat: number; lng: number } | null;
  onPickupLocationChange?: (address: string, lat: number, lng: number) => void;
  onDropoffLocationChange?: (address: string, lat: number, lng: number) => void;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const DEFAULT_LOCATION = {
  lat: 13.0827,
  lng: 80.2707,
  address: 'Chennai, India',
};

const pickupIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapUpdater({ pickup, dropoff }: { pickup: Location | null; dropoff: Location | null }) {
  const map = useMap();

  useEffect(() => {
    if (pickup && dropoff) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 13);
    } else if (dropoff) {
      map.setView([dropoff.lat, dropoff.lng], 13);
    }
  }, [pickup, dropoff, map]);

  return null;
}

function RouteLayer({ pickup, dropoff }: { pickup: Location | null; dropoff: Location | null }) {
  const map = useMap();
  const routeLayerRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (pickup && dropoff) {
      const fetchRoute = async () => {
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
          );
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const geoJson = {
              type: 'Feature' as const,
              properties: {},
              geometry: route.geometry,
            };

            routeLayerRef.current = L.geoJSON(geoJson, {
              style: {
                color: '#2563eb',
                weight: 4,
                opacity: 0.7,
              },
            }).addTo(map);
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };

      fetchRoute();
    }

    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
    };
  }, [pickup, dropoff, map]);

  return null;
}

export default function MapView({
  pickupAddress,
  dropoffAddress,
  pickupCoords,
  dropoffCoords,
  onPickupLocationChange,
  onDropoffLocationChange,
}: MapViewProps) {
  const [userLocation, setUserLocation] = useState<Location>(DEFAULT_LOCATION);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const pickupDebounceRef = useRef<NodeJS.Timeout>();
  const dropoffDebounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Your Location',
          });
          setLoading(false);
        },
        () => {
          setUserLocation(DEFAULT_LOCATION);
          setLoading(false);
        }
      );
    } else {
      setUserLocation(DEFAULT_LOCATION);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pickupCoords) {
      setPickupLocation({
        lat: pickupCoords.lat,
        lng: pickupCoords.lng,
        address: pickupAddress,
      });
    } else if (pickupAddress && pickupAddress.trim().length > 3 && !pickupCoords) {
      if (pickupDebounceRef.current) {
        clearTimeout(pickupDebounceRef.current);
      }

      pickupDebounceRef.current = setTimeout(() => {
        searchLocation(pickupAddress, 'pickup');
      }, 800);
    } else if (!pickupAddress) {
      setPickupLocation(null);
    }

    return () => {
      if (pickupDebounceRef.current) {
        clearTimeout(pickupDebounceRef.current);
      }
    };
  }, [pickupAddress, pickupCoords]);

  useEffect(() => {
    if (dropoffCoords) {
      setDropoffLocation({
        lat: dropoffCoords.lat,
        lng: dropoffCoords.lng,
        address: dropoffAddress,
      });
    } else if (dropoffAddress && dropoffAddress.trim().length > 3 && !dropoffCoords) {
      if (dropoffDebounceRef.current) {
        clearTimeout(dropoffDebounceRef.current);
      }

      dropoffDebounceRef.current = setTimeout(() => {
        searchLocation(dropoffAddress, 'dropoff');
      }, 800);
    } else if (!dropoffAddress) {
      setDropoffLocation(null);
    }

    return () => {
      if (dropoffDebounceRef.current) {
        clearTimeout(dropoffDebounceRef.current);
      }
    };
  }, [dropoffAddress, dropoffCoords]);

  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      calculateRoute();
    } else {
      setDistance(null);
      setDuration(null);
      setFare(null);
    }
  }, [pickupLocation, dropoffLocation]);

  const searchLocation = async (query: string, type: 'pickup' | 'dropoff') => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location: Location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name,
        };

        if (type === 'pickup') {
          setPickupLocation(location);
          if (onPickupLocationChange) {
            onPickupLocationChange(location.address, location.lat, location.lng);
          }
        } else {
          setDropoffLocation(location);
          if (onDropoffLocationChange) {
            onDropoffLocationChange(location.address, location.lat, location.lng);
          }
        }
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const calculateRoute = async () => {
    if (!pickupLocation || !dropoffLocation) return;

    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupLocation.lng},${pickupLocation.lat};${dropoffLocation.lng},${dropoffLocation.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = route.distance / 1000;
        const durationMin = route.duration / 60;

        setDistance(distanceKm);
        setDuration(durationMin);

        const baseFare = 2.5;
        const perKmRate = 1.5;
        const perMinRate = 0.3;
        const calculatedFare = baseFare + (distanceKm * perKmRate) + (durationMin * perMinRate);
        setFare(calculatedFare);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    }
  };


  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          className="h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pickupLocation && (
            <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-green-700 mb-1">Pickup Location</p>
                  <p className="text-gray-600">{pickupLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {dropoffLocation && (
            <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-red-700 mb-1">Drop-off Location</p>
                  <p className="text-gray-600">{dropoffLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          <RouteLayer pickup={pickupLocation} dropoff={dropoffLocation} />
          <MapUpdater pickup={pickupLocation} dropoff={dropoffLocation} />
        </MapContainer>
      </div>

      {distance !== null && duration !== null && fare !== null && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="text-lg font-semibold text-gray-900">{distance.toFixed(2)} km</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ETA</p>
                <p className="text-lg font-semibold text-gray-900">{Math.ceil(duration)} min</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Fare</p>
                <p className="text-lg font-semibold text-gray-900">${fare.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
