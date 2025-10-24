import { useState } from 'react';
import { MapPin, Navigation, Calendar, Clock, DollarSign, Car, Zap } from 'lucide-react';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import LocationAutocomplete from '../components/LocationAutocomplete';

const rideTypes = [
  {
    id: 'economy',
    name: 'Economy',
    description: 'Affordable rides',
    icon: Car,
    price: 8.5,
    eta: '3 min',
    capacity: 4,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Comfortable rides',
    icon: Zap,
    price: 12.0,
    eta: '5 min',
    capacity: 4,
  },
  {
    id: 'suv',
    name: 'SUV',
    description: 'Extra space',
    icon: Car,
    price: 15.0,
    eta: '7 min',
    capacity: 6,
  },
  {
    id: 'auto',
    name: 'Auto-rickshaw',
    description: 'Quick & cheap',
    icon: Car,
    price: 5.0,
    eta: '2 min',
    capacity: 3,
  },
];

export default function Dashboard() {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRideType, setSelectedRideType] = useState('economy');
  const [scheduleRide, setScheduleRide] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handlePickupSelect = (address: string, lat: number, lng: number) => {
    setPickupAddress(address);
    setPickupCoords({ lat, lng });
  };

  const handleDropoffSelect = (address: string, lat: number, lng: number) => {
    setDropoffAddress(address);
    setDropoffCoords({ lat, lng });
  };

  const handleBookRide = () => {
    console.log('Booking ride...', {
      pickup: pickupAddress,
      dropoff: dropoffAddress,
      rideType: selectedRideType,
      scheduled: scheduleRide,
      date: scheduledDate,
      time: scheduledTime,
    });
  };

  return (
    <Layout>
      <div className="h-full lg:flex">
        <div className="lg:w-2/5 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Book a Ride</h1>
            <p className="text-gray-600 mt-1">Where would you like to go?</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <LocationAutocomplete
                value={pickupAddress}
                onChange={setPickupAddress}
                onLocationSelect={handlePickupSelect}
                placeholder="Enter pickup location"
                icon="pickup"
                label="Pickup Location"
              />

              <LocationAutocomplete
                value={dropoffAddress}
                onChange={setDropoffAddress}
                onLocationSelect={handleDropoffSelect}
                placeholder="Where to?"
                icon="dropoff"
                label="Drop-off Location"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <input
                type="checkbox"
                id="scheduleRide"
                checked={scheduleRide}
                onChange={(e) => setScheduleRide(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="scheduleRide" className="text-sm font-medium text-gray-700">
                Schedule for later
              </label>
            </div>

            {scheduleRide && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Ride Type</h3>
              <div className="space-y-3">
                {rideTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedRideType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedRideType(type.id)}
                      className={`w-full p-4 rounded-lg border-2 transition ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-blue-600' : 'bg-gray-100'
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                isSelected ? 'text-white' : 'text-gray-600'
                              }`}
                            />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{type.name}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {type.eta} away • {type.capacity} seats
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            ${type.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleBookRide}
              disabled={!pickupAddress || !dropoffAddress}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              <span>Confirm Ride</span>
            </button>
          </div>
        </div>

        <div className="hidden lg:block lg:flex-1">
          <MapView
            pickupAddress={pickupAddress}
            dropoffAddress={dropoffAddress}
            pickupCoords={pickupCoords}
            dropoffCoords={dropoffCoords}
          />
        </div>
      </div>
    </Layout>
  );
}
