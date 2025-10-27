/*
Delete users by email safely for testing.

Usage:
  # Using portable Node in this repo (Windows):
  .\.tools\node\node-v20.17.0-win-x64\node.exe scripts\delete-users.js --emails "a@b.com,b@c.com"

  # Or if npm works for you:
  npm run delete-users -- --emails "a@b.com,b@c.com"

Requires env vars (in .env.local or environment):
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY  (service role key)
*/

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment (.env.local).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function parseEmailsFromArgs() {
  const idx = process.argv.indexOf('--emails')
  if (idx === -1 || !process.argv[idx + 1]) return []
  return process.argv[idx + 1]
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

async function findUserIdByEmail(email) {
  // Try app table
  let { data, error } = await supabase
    .from('users')
    .select('id')
    .ilike('email', email)
    .maybeSingle()
  if (error) throw error
  if (data?.id) return data.id

  // Fallback: list Auth users (first page)
  try {
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const hit = list?.users?.find((u) => (u.email || '').toLowerCase() === email)
    return hit?.id
  } catch (_e) {
    return undefined
  }
}

async function deleteForEmail(email) {
  console.log(`\n=== Deleting ${email} ===`)
  const userId = await findUserIdByEmail(email)
  if (!userId) {
    console.log('No user found. Skipping.')
    return
  }

  // Delete dependent rows first
  let resp = await supabase.from('bookings').delete().eq('user_id', userId)
  if (resp.error) throw resp.error
  if (resp.count) console.log(`Deleted ${resp.count} bookings`)

  // Delete from app users table
  resp = await supabase.from('users').delete().eq('id', userId)
  if (resp.error) throw resp.error
  console.log('Deleted app user row (if existed)')

  // Delete from Auth
  const { error: authErr } = await supabase.auth.admin.deleteUser(userId)
  if (authErr) throw authErr
  console.log('Deleted from Supabase Auth')
}

async function main() {
  const emails = parseEmailsFromArgs()
  if (!emails.length) {
    console.log('No emails provided. Example: --emails "a@b.com,b@c.com"')
    process.exit(1)
  }

  for (const email of emails) {
    try {
      await deleteForEmail(email)
    } catch (e) {
      console.error(`Failed for ${email}:`, e?.message || e)
    }
  }

  console.log('\nDone.')
}

main()