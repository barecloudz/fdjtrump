-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  discount INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert products (for demo purposes)
-- In production, you'd restrict this to authenticated admin users
CREATE POLICY "Anyone can insert products"
  ON products
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to update products (for demo purposes)
CREATE POLICY "Anyone can update products"
  ON products
  FOR UPDATE
  USING (true);

-- Create policy to allow anyone to delete products (for demo purposes)
CREATE POLICY "Anyone can delete products"
  ON products
  FOR DELETE
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
