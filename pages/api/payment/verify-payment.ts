import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = req.body

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (isValid) {
      // Update booking status in database (admin client bypasses RLS)
      const { error } = await supabaseAdmin
        .from('bookings')
        .update({
          payment_status: 'completed',
          razorpay_payment_id,
          razorpay_order_id,
        })
        .eq('id', booking_id)

      if (error) throw error

      res.status(200).json({ success: true, message: 'Payment verified successfully' })
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' })
    }
  } catch (error: any) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: error.message || 'Payment verification failed' })
  }
}
