import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Power,
  DollarSign,
  Star,
  TrendingUp,
  Clock,
  MapPin,
  Navigation,
  CheckCircle,
  AlertCircle,
  Car,
} from 'lucide-react';
import Layout from '../components/Layout';

interface DriverProfile {
  verification_status: string;
  is_online: boolean;
  rating_average: number;
  total_rides: number;
  total_earnings: number;
  vehicle_type: string;
  vehicle_make: string;
  vehicle_model: string;
}

export default function DriverDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDriverProfile();
    }
  }, [user]);

  const fetchDriverProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/driver/register');
        return;
      }

      setProfile(data);
      setIsOnline(data.is_online);
    } catch (error) {
      console.error('Error fetching driver profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    if (!profile) return;

    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      const { error } = await supabase
        .from('driver_profiles')
        .update({ is_online: newStatus })
        .eq('id', user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating online status:', error);
      setIsOnline(!newStatus);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return null;
  }

  const stats = [
    {
      label: 'Total Earnings',
      value: `$${profile.total_earnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'green',
      trend: '+12% this week',
    },
    {
      label: 'Total Rides',
      value: profile.total_rides,
      icon: Car,
      color: 'blue',
      trend: `${profile.total_rides} completed`,
    },
    {
      label: 'Rating',
      value: profile.rating_average.toFixed(1),
      icon: Star,
      color: 'yellow',
      trend: `${profile.total_rides} ratings`,
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {profile.verification_status === 'pending' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Account Verification Pending
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Your account is under review. You'll be able to start accepting rides once
                verified.
              </p>
            </div>
          </div>
        )}

        {profile.verification_status === 'approved' && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  {profile.vehicle_make} {profile.vehicle_model} • {profile.vehicle_type}
                </p>
              </div>
              <button
                onClick={toggleOnlineStatus}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition ${
                  isOnline
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Power className="w-5 h-5" />
                {isOnline ? 'Go Offline' : 'Go Online'}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.trend}</p>
              </div>
            );
          })}
        </div>

        {isOnline && profile.verification_status === 'approved' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 relative">
              <Car className="w-8 h-8 text-green-600" />
              <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You're Online!</h3>
            <p className="text-gray-600">Waiting for ride requests...</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No recent rides</p>
            <p className="text-sm text-gray-500 mt-2">
              Your recent rides will appear here once you start driving
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
