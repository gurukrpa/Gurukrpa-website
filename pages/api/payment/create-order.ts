import Razorpay from 'razorpay'
import type { NextApiRequest, NextApiResponse } from 'next'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
      notes,
    })

    res.status(200).json(order)
  } catch (error: any) {
    console.error('Razorpay order creation error:', error)
    res.status(500).json({ error: error.message || 'Failed to create order' })
  }
}
