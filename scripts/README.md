# 🗄️ Database Migration Guide

This guide explains how to migrate data from JSON files to Supabase PostgreSQL database.

## Prerequisites

1. Supabase project created
2. Database schema set up (tables created)
3. Environment variables configured in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## Migration Steps

### Option 1: Using TypeScript Script (Recommended)

This is the easiest way to migrate all data at once.

```bash
# Install tsx if not already installed
npm install -D tsx

# Run the migration script
npx tsx scripts/seed-supabase.ts
```

**What it does:**
1. Creates categories in the database
2. Creates products and links them to categories
3. Handles duplicates (uses `upsert`)

**Output:**
```
🚀 Starting migration to Supabase...

🌱 Seeding categories...
✅ Seeded 4 categories
🌱 Seeding products...
✅ Seeded 12 products

✨ Migration completed successfully!
📊 Summary:
   - Categories: 4
   - Products: 12
```

### Option 2: Using SQL Editor

If you prefer to use Supabase SQL Editor:

1. **First, create categories:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the contents of `scripts/seed-categories.sql`

2. **Then, manually insert products or use the TypeScript script**

## Verifying Migration

### Check in Supabase Dashboard

1. Go to **Table Editor**
2. Check `categories` table - should have 4 rows
3. Check `products` table - should have 12 rows
4. Verify products have `category_id` populated

### Check via API

```bash
# Get all categories
curl https://your-project.supabase.co/rest/v1/categories \
  -H "apikey: your-anon-key"

# Get all products with categories
curl "https://your-project.supabase.co/rest/v1/products?select=*,categories(name)" \
  -H "apikey: your-anon-key"
```

## Troubleshooting

### Error: "Missing environment variables"

**Solution:** Check `.env.local` has both variables set:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Error: "relation does not exist"

**Solution:** Tables not created. Run the schema SQL from Stage 2 first.

### Error: "violates row level security policy"

**Solution:** Service role key should bypass RLS. If not, check RLS policies are set correctly.

### Duplicate products

**Normal behavior:** The script uses `upsert` with conflict on `name`, so running multiple times won't create duplicates.

### Missing category for product

**Check:** Make sure all category slugs from `products.json` exist in `categoryMap` in the script.

Current mapping:
- `legumes` → Бобовые
- `seeds` → Семена
- `vegetables` → Овощи
- `herbs` → Зелень

## Rollback

If you need to clear data and start over:

```sql
-- Delete all products (keeps categories)
DELETE FROM products;

-- Or delete everything
DELETE FROM products;
DELETE FROM categories;
```

## Next Steps

After migration is complete:
1. ✅ Proceed to Stage 4: Create Supabase client
2. ✅ Test API endpoints
3. ✅ Verify data in admin panel

## Data Mapping

### JSON → Database Field Mapping

| JSON Field | Database Field | Notes |
|------------|----------------|-------|
| `id` | Auto-generated UUID | Not migrated |
| `name` | `name` | Used as unique key |
| `price` | `price` | Direct mapping |
| `weight` | `weight` | Direct mapping |
| `description` | `description` | Direct mapping |
| `image` | `image` | Direct mapping |
| `category` | `category_id` | Converted to UUID via lookup |
| `isNew` | `is_new` | Default: false |
| `isBestseller` | `is_bestseller` | Default: false |
| `stock` | `stock` | Direct mapping |
| `isActive` | `is_active` | Direct mapping |

## Files

- `scripts/seed-supabase.ts` - Main migration script
- `scripts/seed-categories.sql` - SQL for categories only
- `data/products.json` - Source data
