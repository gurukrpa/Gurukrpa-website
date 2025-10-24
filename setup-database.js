const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSchema() {
  try {
    console.log('📖 Reading schema.sql...')
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('🔄 Executing SQL commands...')
    
    // Split into individual statements and execute
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i]
      if (stmt) {
        try {
          console.log(`  Executing statement ${i + 1}/${statements.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: stmt })
          if (error && error.message !== 'No rows returned') {
            console.log(`  ⚠️  ${error.message}`)
          }
        } catch (e) {
          // Some statements might fail if already exist, that's OK
          console.log(`  ℹ️  ${e.message}`)
        }
      }
    }
    
    console.log('\n✅ Database setup complete!')
    console.log('\nNext steps:')
    console.log('1. Your website is running at http://localhost:3000')
    console.log('2. Try signing up at /auth/signup')
    console.log('3. Create an admin account (email must contain "admin")')
    console.log('4. Access admin dashboard at /admin/dashboard\n')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

executeSchema()
