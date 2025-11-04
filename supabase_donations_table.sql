-- Create donations table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert donations (for anonymous donations)
CREATE POLICY "Allow public to create donations"
  ON donations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow reading own donations by email
CREATE POLICY "Allow users to read their own donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

-- Update trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donations_updated_at();

-- Insert some test data (optional)
-- UNCOMMENT to add test donations
-- INSERT INTO donations (donor_name, donor_email, amount, message) VALUES
--   ('John Doe', 'john@example.com', 50.00, 'Happy to help!'),
--   ('Jane Smith', 'jane@example.com', 100.00, 'Every bit counts!');

COMMENT ON TABLE donations IS 'Stores donation records for immigrant support fund';
