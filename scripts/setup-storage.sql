-- Create Storage bucket for product images
-- Run this in Supabase SQL Editor

-- Create the bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Policy: Allow public read access to all images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow authenticated users to update their own images
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Policy: Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'product-images';
