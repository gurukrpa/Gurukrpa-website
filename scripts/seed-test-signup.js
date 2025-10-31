require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase env. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function run() {
  const uid = Math.random().toString(36).slice(2, 8)
  const email = `test_${uid}@example.com`
  const password = 'Test@12345'
  const full_name = 'Test User ' + uid
  const phone = '+911234567890'
  const referred_by = 'Automated seed'
  const number_of_charts = 2

  console.log('Creating auth user:', email)
  const { data: createRes, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, referred_by, number_of_charts },
  })
  if (createErr) {
    console.error('Failed to create user:', createErr)
    process.exit(1)
  }

  const userId = createRes.user.id
  console.log('Inserting into users table...')
  const { error: usersErr } = await admin.from('users').insert({
    id: userId,
    email,
    full_name,
    phone,
    referred_by,
    number_of_charts,
  })
  if (usersErr && usersErr.code !== '23505') {
    console.error('Failed to insert users row:', usersErr)
    process.exit(1)
  }

  const charts = [
    {
      user_id: userId,
      full_name: 'Person One',
      relation: 'Self',
      selected_services: ['Astrology Consultation', 'Muhurtha Consultation'],
      date_of_birth: '1995-01-01',
      time_of_birth: '09:30',
      place_of_birth: 'Mumbai, India',
      address: '123 Street, Mumbai, MH, India',
      occupation: 'Engineer',
      question1: 'Career growth in next year?',
      question2: 'Is this a good time to move?',
      question3: 'When is a good muhurtha?',
    },
    {
      user_id: userId,
      full_name: 'Person Two',
      relation: 'Spouse',
      selected_services: ['Marriage Match Making'],
      date_of_birth: '1997-05-20',
      time_of_birth: '18:45',
      place_of_birth: 'Pune, India',
      address: '123 Street, Mumbai, MH, India',
      occupation: 'Teacher',
      question1: 'Marriage compatibility?',
      question2: 'Family planning timing?',
      question3: 'Any doshas to address?',
    },
  ]

  console.log('Inserting charts rows...')
  const { error: chartsErr } = await admin.from('charts').insert(charts)
  if (chartsErr) {
    console.error('Failed to insert charts:', chartsErr)
    process.exit(1)
  }

  console.log('\nSeed complete!')
  console.log('Auth email:', email)
  console.log('User ID:', userId)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
