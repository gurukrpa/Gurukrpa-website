require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function run() {
  const { data, error } = await admin
    .from('charts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) return console.error(error)

  const userIds = [...new Set(data.map(d => d.user_id))]
  const { data: users } = await admin.from('users').select('id,email,full_name').in('id', userIds)
  const userMap = new Map(users?.map(u => [u.id, u]) || [])

  console.log('\nLatest charts rows:')
  for (const row of data) {
    const u = userMap.get(row.user_id)
    console.log({
      id: row.id,
      user_id: row.user_id,
      user_email: u?.email,
      full_name: row.full_name,
      relation: row.relation,
      created_at: row.created_at,
    })
  }
}

run().catch(console.error)
