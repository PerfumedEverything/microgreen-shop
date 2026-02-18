/**
 * Script to verify migration data in Supabase
 * 
 * Usage: npx tsx scripts/verify-migration.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function verifyMigration() {
  console.log('🔍 Verifying migration...\n')
  
  // Check categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
  
  if (catError) {
    console.error('❌ Error fetching categories:', catError)
    return
  }
  
  console.log(`📁 Categories: ${categories?.length || 0}`)
  categories?.forEach(cat => {
    console.log(`   - ${cat.name} (${cat.slug})`)
  })
  
  // Check products
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('*, categories(name)')
  
  if (prodError) {
    console.error('❌ Error fetching products:', prodError)
    return
  }
  
  console.log(`\n📦 Products: ${products?.length || 0}`)
  
  // Statistics
  const activeProducts = products?.filter(p => p.is_active).length || 0
  const bestsellers = products?.filter(p => p.is_bestseller).length || 0
  const newProducts = products?.filter(p => p.is_new).length || 0
  const productsWithImages = products?.filter(p => p.image && p.image.length > 0).length || 0
  
  console.log(`\n📊 Statistics:`)
  console.log(`   - Active: ${activeProducts}`)
  console.log(`   - Bestsellers: ${bestsellers}`)
  console.log(`   - New: ${newProducts}`)
  console.log(`   - With images: ${productsWithImages}`)
  
  // Check for issues
  const productsWithoutCategory = products?.filter(p => !p.category_id).length || 0
  const productsWithoutImages = products?.filter(p => !p.image || p.image.length === 0).length || 0
  
  if (productsWithoutCategory > 0) {
    console.warn(`\n⚠️  Warning: ${productsWithoutCategory} products without category`)
  }
  
  if (productsWithoutImages > 0) {
    console.warn(`\n⚠️  Warning: ${productsWithoutImages} products without images`)
  }
  
  console.log('\n✅ Verification complete!')
  
  // Sample data check
  if (products && products.length > 0) {
    console.log('\n📝 Sample product:')
    const sample = products[0]
    console.log(`   Name: ${sample.name}`)
    console.log(`   Price: ${sample.price} ₽`)
    console.log(`   Category: ${sample.categories?.name || 'N/A'}`)
    console.log(`   Stock: ${sample.stock}`)
  }
}

verifyMigration().catch(console.error)
