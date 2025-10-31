import type { NextApiRequest, NextApiResponse } from 'next'
import PDFDocument from 'pdfkit'
import type * as PDFKit from 'pdfkit'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const config = {
  api: {
    responseLimit: false,
  },
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

function addHeading(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(0.5)
  doc.fillColor('#0b6b6b').fontSize(16).text(text)
  doc.moveTo(doc.x, doc.y + 2).lineTo(550, doc.y + 2).strokeColor('#cceaea').stroke()
  doc.moveDown(0.2)
}

function addField(doc: PDFKit.PDFDocument, label: string, value?: any) {
  const out = value === undefined || value === null || value === '' ? '—' : String(value)
  doc.fillColor('#222').fontSize(11).text(`${label}: ${out}`)
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

    const filename = `user-${appUser?.email || userId}-export.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

    const doc = new PDFDocument({ size: 'A4', margin: 40 })
    doc.pipe(res)

    // Title
    doc.fillColor('#066666').fontSize(22).text('Gurukrpa - Customer Export', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(10).fillColor('#666').text(new Date().toLocaleString(), { align: 'center' })
    doc.moveDown()

    // Account section
    addHeading(doc, 'Account Details')
    addField(doc, 'Full Name', appUser?.full_name)
    addField(doc, 'Email', appUser?.email)
    addField(doc, 'Phone', appUser?.phone)
    addField(doc, 'Referred By', appUser?.referred_by)
    addField(doc, 'Number of Charts', appUser?.number_of_charts)
    doc.moveDown(0.5)

    // Charts
    addHeading(doc, 'Charts')
    if (!charts || charts.length === 0) {
      doc.text('No charts for this user.')
    } else {
      charts.forEach((c: any, idx: number) => {
        doc.moveDown(0.5)
        doc.fillColor('#444').fontSize(14).text(`Chart ${idx + 1}`)
        doc.moveDown(0.2)
        addField(doc, 'Person', c.full_name)
        addField(doc, 'Relation', c.relation)
        addField(doc, 'Services', Array.isArray(c.selected_services) ? c.selected_services.join(', ') : '—')
        addField(doc, 'Date of Birth', c.date_of_birth)
        addField(doc, 'Time of Birth', c.time_of_birth)
        addField(doc, 'Place of Birth', c.place_of_birth)
        addField(doc, 'Address', c.address)
        addField(doc, 'Occupation', c.occupation)
        addField(doc, 'Question 1', c.question1)
        addField(doc, 'Question 2', c.question2)
        addField(doc, 'Question 3', c.question3)

        // Page break if near bottom
        if (doc.y > 700 && idx < charts.length - 1) doc.addPage()
      })
    }

    doc.end()
  } catch (e: any) {
    console.error('export user pdf failed', e)
    return res.status(500).json({ error: e?.message || 'Export PDF failed' })
  }
}
