-- Fix: Add unique constraint to products.name for upsert to work
ALTER TABLE products ADD CONSTRAINT products_name_unique UNIQUE (name);

-- Verify constraint was added
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'products';
