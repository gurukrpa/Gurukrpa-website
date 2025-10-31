import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'

type Resp = { ok?: boolean; error?: string }

async function ensureAdmin(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return { error: 'Unauthorized' }
  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return { error: 'Unauthorized' }
  if (!user.email?.toLowerCase().includes('admin')) return { error: 'Forbidden' }
  return { user }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  const admin = await ensureAdmin(req)
  if ('error' in admin) return res.status(admin.error === 'Forbidden' ? 403 : 401).json({ error: admin.error })

  const userId = String(req.query.id)
  if (!userId) return res.status(400).json({ error: 'Missing user id' })

  if (req.method === 'DELETE') {
    try {
      // First try: delete auth user (preferred)
      const { error: delAuthErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (!delAuthErr) return res.status(200).json({ ok: true })

      // Fallback: manually remove dependent rows, then auth
      await supabaseAdmin.from('charts').delete().eq('user_id', userId)
      await supabaseAdmin.from('users').delete().eq('id', userId)
      const { error: delAuthErr2 } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (delAuthErr2) throw delAuthErr2
      return res.status(200).json({ ok: true })
    } catch (e: any) {
      console.error('admin delete user failed', e)
      return res.status(500).json({ error: e?.message || 'Delete failed' })
    }
  }

  res.setHeader('Allow', 'DELETE')
  return res.status(405).json({ error: 'Method not allowed' })
}
