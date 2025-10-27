import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type Data = {
  ok: boolean
  email?: string
  userId?: string
  note?: string
  error?: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Safety: Disable in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'Disabled in production' })
  }

  // Simple auth: require ADMIN_API_SECRET via header or query for dev usage
  const provided = (req.headers['x-admin-secret'] as string) || (req.query.secret as string)
  if (!process.env.ADMIN_API_SECRET || provided !== process.env.ADMIN_API_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' })
  }

  const email = ((req.method === 'POST' ? req.body?.email : req.query.email) as string | undefined)?.toLowerCase()
  if (!email) return res.status(400).json({ ok: false, error: 'Missing email' })

  // Find user id from app users table
  const { data: row, error: findErr } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (findErr) return res.status(500).json({ ok: false, error: findErr.message })

  let userId = row?.id as string | undefined

  if (!userId) {
    // Try to locate via Admin list (best-effort, first page only to keep it simple in dev)
    try {
      // @ts-ignore: types may vary by SDK version
      const { data: list } = await (supabaseAdmin as any).auth.admin.listUsers({ page: 1, perPage: 1000 })
      userId = list?.users?.find((u: any) => u.email?.toLowerCase() === email)?.id
    } catch {}
  }

  if (!userId) {
    return res.status(200).json({ ok: true, email, note: 'No user found' })
  }

  // Delete from Supabase Auth
  const { error: delAuthErr } = await supabaseAdmin.auth.admin.deleteUser(userId)
  if (delAuthErr) return res.status(500).json({ ok: false, error: delAuthErr.message })

  // Delete from app users table (best-effort)
  await supabaseAdmin.from('users').delete().eq('id', userId)

  return res.status(200).json({ ok: true, email, userId })
}
