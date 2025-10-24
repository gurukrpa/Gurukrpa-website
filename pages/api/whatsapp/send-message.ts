import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { phone, message, name } = req.body

    // WhatsApp Business API integration
    // You can use services like Twilio, WhatsApp Business API, or WATI
    const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER
    
    // For simple redirect to WhatsApp (client-side)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

    // If you're using WhatsApp Business API (example with fetch)
    // const response = await fetch('YOUR_WHATSAPP_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHATSAPP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     to: phone,
    //     type: 'text',
    //     text: { body: message }
    //   })
    // })

    res.status(200).json({ 
      success: true, 
      message: 'WhatsApp message prepared',
      whatsappUrl 
    })
  } catch (error: any) {
    console.error('WhatsApp API error:', error)
    res.status(500).json({ error: error.message || 'Failed to send WhatsApp message' })
  }
}
