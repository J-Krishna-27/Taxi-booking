export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          phone_verified: boolean
          photo_url: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          phone_verified?: boolean
          photo_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          phone_verified?: boolean
          photo_url?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      driver_profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          photo_url: string | null
          vehicle_type: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          vehicle_make: string
          vehicle_model: string
          vehicle_year: number
          vehicle_color: string
          license_plate: string
          license_number: string
          license_expiry: string
          license_photo_url: string | null
          vehicle_registration_url: string | null
          insurance_url: string | null
          verification_status: 'pending' | 'approved' | 'rejected'
          is_online: boolean
          current_latitude: number | null
          current_longitude: number | null
          rating_average: number
          total_rides: number
          total_earnings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          phone: string
          photo_url?: string | null
          vehicle_type: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          vehicle_make: string
          vehicle_model: string
          vehicle_year: number
          vehicle_color: string
          license_plate: string
          license_number: string
          license_expiry: string
          license_photo_url?: string | null
          vehicle_registration_url?: string | null
          insurance_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          is_online?: boolean
          current_latitude?: number | null
          current_longitude?: number | null
          rating_average?: number
          total_rides?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          photo_url?: string | null
          vehicle_type?: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          vehicle_make?: string
          vehicle_model?: string
          vehicle_year?: number
          vehicle_color?: string
          license_plate?: string
          license_number?: string
          license_expiry?: string
          license_photo_url?: string | null
          vehicle_registration_url?: string | null
          insurance_url?: string | null
          verification_status?: 'pending' | 'approved' | 'rejected'
          is_online?: boolean
          current_latitude?: number | null
          current_longitude?: number | null
          rating_average?: number
          total_rides?: number
          total_earnings?: number
          created_at?: string
          updated_at?: string
        }
      }
      rides: {
        Row: {
          id: string
          user_id: string
          driver_id: string | null
          status: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          ride_type: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          dropoff_address: string
          dropoff_latitude: number
          dropoff_longitude: number
          scheduled_time: string | null
          estimated_fare: number
          final_fare: number | null
          distance_km: number | null
          duration_minutes: number | null
          payment_method: 'card' | 'cash' | 'wallet'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code: string | null
          discount_amount: number
          fare_split_enabled: boolean
          fare_split_users: Json | null
          notes: string | null
          created_at: string
          accepted_at: string | null
          started_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancelled_by: 'rider' | 'driver' | 'system' | null
          cancellation_reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          driver_id?: string | null
          status?: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          ride_type: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          pickup_address: string
          pickup_latitude: number
          pickup_longitude: number
          dropoff_address: string
          dropoff_latitude: number
          dropoff_longitude: number
          scheduled_time?: string | null
          estimated_fare: number
          final_fare?: number | null
          distance_km?: number | null
          duration_minutes?: number | null
          payment_method?: 'card' | 'cash' | 'wallet'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code?: string | null
          discount_amount?: number
          fare_split_enabled?: boolean
          fare_split_users?: Json | null
          notes?: string | null
          created_at?: string
          accepted_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: 'rider' | 'driver' | 'system' | null
          cancellation_reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          driver_id?: string | null
          status?: 'pending' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled'
          ride_type?: 'Economy' | 'Premium' | 'SUV' | 'Auto-rickshaw'
          pickup_address?: string
          pickup_latitude?: number
          pickup_longitude?: number
          dropoff_address?: string
          dropoff_latitude?: number
          dropoff_longitude?: number
          scheduled_time?: string | null
          estimated_fare?: number
          final_fare?: number | null
          distance_km?: number | null
          duration_minutes?: number | null
          payment_method?: 'card' | 'cash' | 'wallet'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code?: string | null
          discount_amount?: number
          fare_split_enabled?: boolean
          fare_split_users?: Json | null
          notes?: string | null
          created_at?: string
          accepted_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: 'rider' | 'driver' | 'system' | null
          cancellation_reason?: string | null
        }
      }
      ride_ratings: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          driver_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          driver_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          driver_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          ride_id: string
          user_id: string
          amount: number
          currency: string
          payment_method: 'card' | 'cash' | 'wallet'
          stripe_payment_intent_id: string | null
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata: Json | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          ride_id: string
          user_id: string
          amount: number
          currency?: string
          payment_method: 'card' | 'cash' | 'wallet'
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          ride_id?: string
          user_id?: string
          amount?: number
          currency?: string
          payment_method?: 'card' | 'cash' | 'wallet'
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          metadata?: Json | null
          created_at?: string
          completed_at?: string | null
        }
      }
      driver_locations: {
        Row: {
          id: string
          driver_id: string
          latitude: number
          longitude: number
          heading: number | null
          speed: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          driver_id: string
          latitude: number
          longitude: number
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          driver_id?: string
          latitude?: number
          longitude?: number
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          ride_id: string
          sender_id: string
          sender_type: 'rider' | 'driver'
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          sender_id: string
          sender_type: 'rider' | 'driver'
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          ride_id?: string
          sender_id?: string
          sender_type?: 'rider' | 'driver'
          message?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
  }
}
