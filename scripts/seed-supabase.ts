/**
 * Script to migrate data from JSON to Supabase
 * 
 * Usage:
 * 1. Make sure .env.local has SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npx tsx scripts/seed-supabase.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import productsData from '../data/products.json'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  console.error('Please check .env.local has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// Map category slugs to names
const categoryMap: Record<string, string> = {
  'vegetables': 'Овощи',
  'herbs': 'Зелень',
  'legumes': 'Бобовые',
  'seeds': 'Семена',
}

async function seedCategories() {
  console.log('🌱 Seeding categories...')
  
  const categories = Object.entries(categoryMap).map(([slug, name]) => ({
    slug,
    name,
  }))
  
  const { data, error } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()
  
  if (error) {
    console.error('❌ Error seeding categories:', error)
    throw error
  }
  
  console.log(`✅ Seeded ${data?.length} categories`)
  return data
}

async function seedProducts(categories: any[]) {
  console.log('🌱 Seeding products...')
  
  // Create a map of slug -> id for categories
  const categoryIdMap = new Map(categories.map(c => [c.slug, c.id]))
  
  const products = productsData.map(product => ({
    name: product.name,
    price: product.price,
    weight: product.weight,
    description: product.description,
    image: product.image,
    category_id: categoryIdMap.get(product.category),
    stock: product.stock,
    is_new: product.isNew || false,
    is_bestseller: product.isBestseller || false,
    is_active: product.isActive,
  }))
  
  // First, delete existing products to avoid duplicates
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all
  
  if (deleteError) {
    console.error('❌ Error clearing products:', deleteError)
    throw deleteError
  }
  
  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select()
  
  if (error) {
    console.error('❌ Error seeding products:', error)
    throw error
  }
  
  console.log(`✅ Seeded ${data?.length} products`)
  return data
}

async function main() {
  console.log('🚀 Starting migration to Supabase...\n')
  
  try {
    // Step 1: Seed categories
    const categories = await seedCategories()
    
    // Step 2: Seed products
    const products = await seedProducts(categories)
    
    console.log('\n✨ Migration completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Categories: ${categories?.length || 0}`)
    console.log(`   - Products: ${products?.length || 0}`)
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error)
    process.exit(1)
  }
}

main()
