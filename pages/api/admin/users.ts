import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'

type ChartRow = {
  id: string
  user_id: string
  full_name: string
  relation: string
  selected_services: string[]
  date_of_birth: string | null
  time_of_birth: string | null
  place_of_birth: string
  address: string
  occupation: string
  question1: string
  question2: string
  question3: string
  created_at: string
}

type UserRow = {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  referred_by: string | null
  number_of_charts: number | null
  created_at: string
  last_login: string | null
  selected_services: string[] | null
  charts: ChartRow[]
}

type Data = {
  users?: UserRow[]
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verify the requesting user is an admin
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.substring(7)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if user is admin (email contains 'admin')
    if (!user.email?.toLowerCase().includes('admin')) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' })
    }

    // Fetch all auth users using admin client
    const { data: authData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      throw listError
    }

    const authUsers = authData?.users || []
    const userIds = authUsers.map((u) => u.id)

    // Pull app-level user rows (phone, referred_by, number_of_charts, full_name) from public.users
    const { data: appUsers, error: appUsersErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .in('id', userIds)

    if (appUsersErr) throw appUsersErr

    // Pull charts for these users
    const { data: chartRows, error: chartsErr } = await supabaseAdmin
      .from('charts')
      .select('*')
      .in('user_id', userIds)

    if (chartsErr) throw chartsErr

    const appUserMap = new Map<string, any>(
      (appUsers || []).map((u) => [u.id, u])
    )

    const chartsByUser = new Map<string, ChartRow[]>()
    for (const c of chartRows || []) {
      const arr = chartsByUser.get(c.user_id) || []
      arr.push(c as ChartRow)
      chartsByUser.set(c.user_id, arr)
    }

    // Build unified user objects
    const users: UserRow[] = authUsers.map((authUser) => {
      const meta = authUser.user_metadata || {}
      const app = appUserMap.get(authUser.id) || {}
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: app.full_name || meta.full_name || null,
        phone: app.phone || meta.phone || null,
        referred_by: app.referred_by ?? meta.referred_by ?? null,
        number_of_charts: app.number_of_charts ?? (Array.isArray(meta?.chart_data) ? meta.chart_data.length : null),
        created_at: authUser.created_at,
        last_login: authUser.last_sign_in_at || null,
        selected_services: Array.isArray(meta.selected_services) ? meta.selected_services : null,
        charts: chartsByUser.get(authUser.id) || [],
      }
    })

    res.status(200).json({ users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch users' })
  }
}
