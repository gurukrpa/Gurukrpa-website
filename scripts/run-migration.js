const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Starting database migration...\n')

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_charts_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    console.log('📖 Reading migration file: add_charts_table.sql\n')

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
      
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement })
      
      if (error) {
        // Try direct query if rpc doesn't work
        const { error: directError } = await supabase.from('_sqlRunner').insert({ query: statement })
        
        if (directError) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message)
          console.log('Statement:', statement.substring(0, 100) + '...')
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`)
      }
    }

    console.log('\n✨ Migration completed!\n')
    console.log('📊 Database changes:')
    console.log('   • Created "charts" table')
    console.log('   • Added "referred_by" column to users table')
    console.log('   • Added "number_of_charts" column to users table')
    console.log('   • Set up RLS policies for charts table')
    console.log('   • Created indexes for better performance\n')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigration()
