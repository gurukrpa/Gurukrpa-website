import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

type ChartData = {
  fullName: string
  relation: string
  selectedServices: string[]
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  address: string
  occupation: string
  question1: string
  question2: string
  question3: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const {
      userId,
      email,
      fullName,
      phone,
      referredBy,
      numberOfCharts,
      chartData,
    }: {
      userId: string
      email: string
      fullName: string
      phone: string
      referredBy?: string
      numberOfCharts?: number
      chartData: ChartData[]
    } = req.body

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Upsert into users table (id conflict safe)
    const { error: upsertErr } = await supabaseAdmin
      .from('users')
      .upsert(
        [{
          id: userId,
          email,
          full_name: fullName,
          phone,
          referred_by: referredBy ?? null,
          number_of_charts: numberOfCharts ?? (chartData?.length || 1),
        }],
        { onConflict: 'id' }
      )

    if (upsertErr) {
      console.error('complete-signup: users upsert error', upsertErr)
      return res.status(500).json({ error: upsertErr.message })
    }

    // Prepare chart rows; filter any incomplete rows
    const rows = (chartData || [])
      .filter((c) => c && (c.fullName?.trim() || c.relation?.trim() || c.dateOfBirth))
      .map((c) => ({
        user_id: userId,
        full_name: c.fullName,
        relation: c.relation,
        selected_services: c.selectedServices || [],
        date_of_birth: c.dateOfBirth || null,
        time_of_birth: c.timeOfBirth || null,
        place_of_birth: c.placeOfBirth || '',
        address: c.address || '',
        occupation: c.occupation || '',
        question1: c.question1 || '',
        question2: c.question2 || '',
        question3: c.question3 || '',
      }))

    if (rows.length > 0) {
      const { error: chartsErr } = await supabaseAdmin.from('charts').insert(rows)
      if (chartsErr) {
        console.error('complete-signup: charts insert error', chartsErr)
        return res.status(500).json({ error: chartsErr.message })
      }
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('complete-signup: unhandled', e)
    return res.status(500).json({ error: e?.message || 'Unknown error' })
  }
}
