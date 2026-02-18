/**
 * Script to create admin user in Supabase
 * 
 * Usage: npx tsx scripts/create-admin.ts
 */

import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables')
  console.error('Please check .env.local has:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const email = 'admin@microgreen.ru'
  const password = 'admin123' // Change this in production!

  console.log('🔐 Creating admin user...\n')

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log('⚠️  User already exists. Fetching existing user...')
        
        // Get existing user
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users?.users.find(u => u.email === email)
        
        if (existingUser) {
          // Ensure profile exists
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', existingUser.id)
            .single()
          
          if (!profile) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: existingUser.id,
                email: existingUser.email!,
                role: 'admin',
              })
            
            if (profileError) {
              console.error('❌ Error creating profile:', profileError)
              return
            }
            
            console.log('✅ Admin profile created for existing user')
          } else {
            // Update role to admin if needed
            if (profile.role !== 'admin') {
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', existingUser.id)
              
              if (updateError) {
                console.error('❌ Error updating profile:', updateError)
                return
              }
              
              console.log('✅ Profile role updated to admin')
            } else {
              console.log('✅ User already has admin role')
            }
          }
          
          console.log('\n📧 Email:', email)
          console.log('🔑 Password: [Use your existing password]')
          return
        }
      } else {
        console.error('❌ Error creating user:', authError)
        return
      }
    }

    if (authData?.user) {
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          role: 'admin',
        })

      if (profileError) {
        console.error('❌ Error creating profile:', profileError)
        return
      }

      console.log('✅ Admin user created successfully!\n')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
      console.log('\n⚠️  IMPORTANT: Change the password after first login!')
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    process.exit(1)
  }
}

createAdminUser()
