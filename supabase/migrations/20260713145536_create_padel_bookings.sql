/*
# Create padel_bookings table

1. New Tables
- `padel_bookings`
  - `id` (uuid, primary key)
  - `customer_name` (text, not null) — full name of the customer
  - `phone` (text, not null) — customer phone number
  - `booking_date` (date, not null) — date of the match
  - `time_slot` (text, not null) — e.g. "09:00 - 10:30"
  - `court` (integer, not null) — 1 or 2
  - `players` (integer, not null) — 2 or 4
  - `payment_method` (text, not null) — "cash" or "wish"
  - `total_price` (numeric, not null) — total match price (always 24)
  - `price_per_player` (numeric, not null) — 12 for 2 players, 6 for 4 players
  - `status` (text, default "pending")
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `padel_bookings`.
- Allow anon + authenticated full CRUD (no login required, public booking system).
*/

CREATE TABLE IF NOT EXISTS padel_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  booking_date date NOT NULL,
  time_slot text NOT NULL,
  court integer NOT NULL CHECK (court IN (1, 2)),
  players integer NOT NULL CHECK (players IN (2, 4)),
  payment_method text NOT NULL CHECK (payment_method IN ('cash', 'wish')),
  total_price numeric NOT NULL DEFAULT 24,
  price_per_player numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE padel_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON padel_bookings;
CREATE POLICY "anon_select_bookings" ON padel_bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON padel_bookings;
CREATE POLICY "anon_insert_bookings" ON padel_bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON padel_bookings;
CREATE POLICY "anon_update_bookings" ON padel_bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON padel_bookings;
CREATE POLICY "anon_delete_bookings" ON padel_bookings FOR DELETE
  TO anon, authenticated USING (true);
