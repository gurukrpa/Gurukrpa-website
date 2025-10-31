import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'

type ExportPayload = {
  user: any
  charts: any[]
  exportedAt: string
  format: 'gurukrpa.user+charts.v1'
}

async function ensureAdmin(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return { error: 'Unauthorized' }
  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return { error: 'Unauthorized' }
  if (!user.email?.toLowerCase().includes('admin')) return { error: 'Forbidden' }
  return { user }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await ensureAdmin(req)
  if ('error' in admin) return res.status(admin.error === 'Forbidden' ? 403 : 401).json({ error: admin.error })

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const userId = String(req.query.id)
  if (!userId) return res.status(400).json({ error: 'Missing user id' })

  try {
    const { data: appUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userErr) throw userErr

    const { data: charts, error: chartsErr } = await supabaseAdmin
      .from('charts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (chartsErr) throw chartsErr

    const payload: ExportPayload = {
      user: appUser,
      charts: charts || [],
      exportedAt: new Date().toISOString(),
      format: 'gurukrpa.user+charts.v1',
    }

    const filename = `user-${appUser?.email || userId}-export.json`
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    return res.status(200).send(JSON.stringify(payload, null, 2))
  } catch (e: any) {
    console.error('export user failed', e)
    return res.status(500).json({ error: e?.message || 'Export failed' })
  }
}
