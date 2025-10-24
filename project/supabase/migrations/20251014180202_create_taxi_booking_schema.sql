/*
  # Taxi Booking Application Database Schema

  ## Overview
  Complete database schema for a taxi booking platform with users, drivers, rides, payments, and ratings.

  ## 1. New Tables

  ### `user_profiles`
  Extended user profile information beyond Supabase auth.users
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - User's full name
  - `phone` (text, unique) - Phone number with country code
  - `phone_verified` (boolean) - Phone verification status
  - `photo_url` (text) - Profile photo URL
  - `emergency_contact_name` (text) - Emergency contact name
  - `emergency_contact_phone` (text) - Emergency contact phone
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `driver_profiles`
  Driver-specific information and verification status
  - `id` (uuid, primary key) - References auth.users
  - `full_name` (text) - Driver's full name
  - `phone` (text, unique) - Phone number
  - `photo_url` (text) - Profile photo URL
  - `vehicle_type` (text) - Economy, Premium, SUV, Auto-rickshaw
  - `vehicle_make` (text) - Vehicle manufacturer
  - `vehicle_model` (text) - Vehicle model
  - `vehicle_year` (integer) - Vehicle year
  - `vehicle_color` (text) - Vehicle color
  - `license_plate` (text, unique) - Vehicle license plate
  - `license_number` (text, unique) - Driver's license number
  - `license_expiry` (date) - License expiration date
  - `license_photo_url` (text) - License document URL
  - `vehicle_registration_url` (text) - Vehicle registration document URL
  - `insurance_url` (text) - Insurance document URL
  - `verification_status` (text) - pending, approved, rejected
  - `is_online` (boolean) - Driver availability status
  - `current_latitude` (numeric) - Current location latitude
  - `current_longitude` (numeric) - Current location longitude
  - `rating_average` (numeric) - Average rating (0-5)
  - `total_rides` (integer) - Total completed rides
  - `total_earnings` (numeric) - Total earnings amount
  - `created_at` (timestamptz) - Registration timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `rides`
  Core ride booking and tracking information
  - `id` (uuid, primary key) - Unique ride identifier
  - `user_id` (uuid) - References user_profiles (rider)
  - `driver_id` (uuid, nullable) - References driver_profiles (assigned driver)
  - `status` (text) - pending, accepted, arrived, in_progress, completed, cancelled
  - `ride_type` (text) - Economy, Premium, SUV, Auto-rickshaw
  - `pickup_address` (text) - Pickup location address
  - `pickup_latitude` (numeric) - Pickup location latitude
  - `pickup_longitude` (numeric) - Pickup location longitude
  - `dropoff_address` (text) - Drop-off location address
  - `dropoff_latitude` (numeric) - Drop-off location latitude
  - `dropoff_longitude` (numeric) - Drop-off location longitude
  - `scheduled_time` (timestamptz, nullable) - Scheduled ride time (null for immediate)
  - `estimated_fare` (numeric) - Estimated fare amount
  - `final_fare` (numeric, nullable) - Actual fare charged
  - `distance_km` (numeric) - Trip distance in kilometers
  - `duration_minutes` (integer) - Trip duration in minutes
  - `payment_method` (text) - card, cash, wallet
  - `payment_status` (text) - pending, completed, failed, refunded
  - `promo_code` (text, nullable) - Applied promo code
  - `discount_amount` (numeric) - Discount amount applied
  - `fare_split_enabled` (boolean) - Fare splitting option
  - `fare_split_users` (jsonb, nullable) - Array of user IDs sharing fare
  - `notes` (text, nullable) - Special instructions from rider
  - `created_at` (timestamptz) - Booking creation time
  - `accepted_at` (timestamptz, nullable) - Driver acceptance time
  - `started_at` (timestamptz, nullable) - Ride start time
  - `completed_at` (timestamptz, nullable) - Ride completion time
  - `cancelled_at` (timestamptz, nullable) - Cancellation time
  - `cancelled_by` (text, nullable) - rider, driver, system
  - `cancellation_reason` (text, nullable) - Reason for cancellation

  ### `ride_ratings`
  Rating and feedback system for completed rides
  - `id` (uuid, primary key) - Unique rating identifier
  - `ride_id` (uuid, unique) - References rides (one rating per ride)
  - `user_id` (uuid) - References user_profiles (rater)
  - `driver_id` (uuid) - References driver_profiles (rated driver)
  - `rating` (integer) - Rating score (1-5)
  - `comment` (text, nullable) - Optional feedback comment
  - `created_at` (timestamptz) - Rating submission time

  ### `payments`
  Payment transaction records
  - `id` (uuid, primary key) - Unique payment identifier
  - `ride_id` (uuid) - References rides
  - `user_id` (uuid) - References user_profiles (payer)
  - `amount` (numeric) - Payment amount
  - `currency` (text) - Currency code (USD, INR, etc.)
  - `payment_method` (text) - card, cash, wallet
  - `stripe_payment_intent_id` (text, nullable) - Stripe payment intent ID
  - `status` (text) - pending, completed, failed, refunded
  - `metadata` (jsonb, nullable) - Additional payment metadata
  - `created_at` (timestamptz) - Payment creation time
  - `completed_at` (timestamptz, nullable) - Payment completion time

  ### `driver_locations`
  Real-time driver location tracking history
  - `id` (uuid, primary key) - Unique location record
  - `driver_id` (uuid) - References driver_profiles
  - `latitude` (numeric) - Location latitude
  - `longitude` (numeric) - Location longitude
  - `heading` (numeric, nullable) - Direction in degrees (0-360)
  - `speed` (numeric, nullable) - Speed in km/h
  - `timestamp` (timestamptz) - Location timestamp

  ### `chat_messages`
  In-app messaging between riders and drivers
  - `id` (uuid, primary key) - Unique message identifier
  - `ride_id` (uuid) - References rides
  - `sender_id` (uuid) - References auth.users (sender)
  - `sender_type` (text) - rider, driver
  - `message` (text) - Message content
  - `is_read` (boolean) - Message read status
  - `created_at` (timestamptz) - Message timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Create policies for authenticated users to manage their own data
  - Create policies for drivers to access ride and location data
  - Create policies for real-time subscriptions

  ## 3. Indexes
  - Add indexes on frequently queried columns for performance
  - Add indexes on foreign keys
  - Add indexes on location columns for spatial queries

  ## 4. Important Notes
  - All monetary values stored in decimal format for precision
  - All timestamps use timestamptz for timezone awareness
  - JSONB used for flexible metadata storage
  - Location data uses numeric type for precision
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE,
  phone_verified boolean DEFAULT false,
  photo_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create driver_profiles table
CREATE TABLE IF NOT EXISTS driver_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE NOT NULL,
  photo_url text,
  vehicle_type text NOT NULL CHECK (vehicle_type IN ('Economy', 'Premium', 'SUV', 'Auto-rickshaw')),
  vehicle_make text NOT NULL,
  vehicle_model text NOT NULL,
  vehicle_year integer NOT NULL,
  vehicle_color text NOT NULL,
  license_plate text UNIQUE NOT NULL,
  license_number text UNIQUE NOT NULL,
  license_expiry date NOT NULL,
  license_photo_url text,
  vehicle_registration_url text,
  insurance_url text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  is_online boolean DEFAULT false,
  current_latitude numeric(10, 8),
  current_longitude numeric(11, 8),
  rating_average numeric(3, 2) DEFAULT 0.00,
  total_rides integer DEFAULT 0,
  total_earnings numeric(10, 2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  driver_id uuid REFERENCES driver_profiles(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled')),
  ride_type text NOT NULL CHECK (ride_type IN ('Economy', 'Premium', 'SUV', 'Auto-rickshaw')),
  pickup_address text NOT NULL,
  pickup_latitude numeric(10, 8) NOT NULL,
  pickup_longitude numeric(11, 8) NOT NULL,
  dropoff_address text NOT NULL,
  dropoff_latitude numeric(10, 8) NOT NULL,
  dropoff_longitude numeric(11, 8) NOT NULL,
  scheduled_time timestamptz,
  estimated_fare numeric(10, 2) NOT NULL,
  final_fare numeric(10, 2),
  distance_km numeric(10, 2),
  duration_minutes integer,
  payment_method text DEFAULT 'card' CHECK (payment_method IN ('card', 'cash', 'wallet')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  promo_code text,
  discount_amount numeric(10, 2) DEFAULT 0.00,
  fare_split_enabled boolean DEFAULT false,
  fare_split_users jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancelled_by text CHECK (cancelled_by IN ('rider', 'driver', 'system')),
  cancellation_reason text
);

-- Create ride_ratings table
CREATE TABLE IF NOT EXISTS ride_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid UNIQUE NOT NULL REFERENCES rides(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  driver_id uuid NOT NULL REFERENCES driver_profiles(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL REFERENCES rides(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text NOT NULL CHECK (payment_method IN ('card', 'cash', 'wallet')),
  stripe_payment_intent_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create driver_locations table
CREATE TABLE IF NOT EXISTS driver_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id uuid NOT NULL REFERENCES driver_profiles(id),
  latitude numeric(10, 8) NOT NULL,
  longitude numeric(11, 8) NOT NULL,
  heading numeric(5, 2),
  speed numeric(6, 2),
  timestamp timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid NOT NULL REFERENCES rides(id),
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  sender_type text NOT NULL CHECK (sender_type IN ('rider', 'driver')),
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_driver_profiles_verification ON driver_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_online ON driver_profiles(is_online);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_location ON driver_profiles(current_latitude, current_longitude);
CREATE INDEX IF NOT EXISTS idx_rides_user_id ON rides(user_id);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ride_ratings_driver_id ON ride_ratings(driver_id);
CREATE INDEX IF NOT EXISTS idx_payments_ride_id ON payments(ride_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_driver_locations_driver_id ON driver_locations(driver_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_ride_id ON chat_messages(ride_id, created_at);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for driver_profiles
CREATE POLICY "Drivers can view own profile"
  ON driver_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can view approved online drivers"
  ON driver_profiles FOR SELECT
  TO authenticated
  USING (verification_status = 'approved' AND is_online = true);

CREATE POLICY "Drivers can insert own profile"
  ON driver_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Drivers can update own profile"
  ON driver_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for rides
CREATE POLICY "Users can view own rides"
  ON rides FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = driver_id);

CREATE POLICY "Users can create rides"
  ON rides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and drivers can update their rides"
  ON rides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = driver_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = driver_id);

-- RLS Policies for ride_ratings
CREATE POLICY "Users can view ratings for their rides"
  ON ride_ratings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() = driver_id OR
    EXISTS (SELECT 1 FROM rides WHERE rides.id = ride_ratings.ride_id AND rides.driver_id = auth.uid())
  );

CREATE POLICY "Users can create ratings"
  ON ride_ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM rides WHERE rides.id = payments.ride_id AND rides.driver_id = auth.uid())
  );

CREATE POLICY "Users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for driver_locations
CREATE POLICY "Drivers can insert own locations"
  ON driver_locations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Users can view driver locations for their rides"
  ON driver_locations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.driver_id = driver_locations.driver_id 
      AND rides.user_id = auth.uid()
      AND rides.status IN ('accepted', 'arrived', 'in_progress')
    )
    OR auth.uid() = driver_id
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages for their rides"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = chat_messages.ride_id 
      AND (rides.user_id = auth.uid() OR rides.driver_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages for their rides"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM rides 
      WHERE rides.id = chat_messages.ride_id 
      AND (rides.user_id = auth.uid() OR rides.driver_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at
  BEFORE UPDATE ON driver_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();