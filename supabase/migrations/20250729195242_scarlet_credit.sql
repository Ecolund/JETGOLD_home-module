/*
  # Create home_features table for HomeModule

  1. New Tables
    - `home_features`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, required)
      - `subtitle` (text, optional)
      - `icon` (text, optional)
      - `order` (integer, default 0 for sorting)
      - `created_at` (timestamp, auto-generated)
      - `updated_at` (timestamp, auto-generated)

  2. Security
    - Enable RLS on `home_features` table
    - Add policy for public read access (features are public content)
    - Add policy for authenticated users to manage features

  3. Sample Data
    - Insert initial feature data for demonstration
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create home_features table
CREATE TABLE IF NOT EXISTS home_features (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  subtitle text,
  icon text,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE home_features ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read home features"
  ON home_features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage home features"
  ON home_features
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_home_features_order ON home_features ("order");

-- Insert sample data
INSERT INTO home_features (title, subtitle, icon, "order") VALUES
  ('Modular Architecture', 'Built with workspace packages for scalability', 'Package', 1),
  ('TypeScript Support', 'Full type safety with shared types across modules', 'Code', 2),
  ('Cross-Platform', 'Works seamlessly on iOS, Android, and Web', 'Smartphone', 3),
  ('Modern Navigation', 'Expo Router with tab-based navigation', 'Navigation', 4)
ON CONFLICT DO NOTHING;