import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PadelBooking = {
  id?: string;
  customer_name: string;
  phone: string;
  booking_date: string;
  time_slot: string;
  court: 1 | 2;
  players: 2 | 4;
  payment_method: 'cash' | 'wish';
  total_price: number;
  price_per_player: number;
  status?: string;
  created_at?: string;
};
