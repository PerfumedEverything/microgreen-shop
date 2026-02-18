-- Initial data seeding for MicroGreen Shop
-- Run this in Supabase SQL Editor if you prefer SQL over the TypeScript script

-- Insert categories
INSERT INTO categories (name, slug) VALUES
  ('Бобовые', 'legumes'),
  ('Семена', 'seeds'),
  ('Овощи', 'vegetables'),
  ('Зелень', 'herbs')
ON CONFLICT (slug) DO NOTHING;

-- Verify categories were inserted
SELECT * FROM categories;

-- Optional: Insert sample products
-- Note: It's better to use the TypeScript script for products to handle category mapping
