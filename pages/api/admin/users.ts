import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'

type Data = {
  users?: any[]
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

    // Fetch all users using admin client
    const { data: authData, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      throw listError
    }

    // Map users with their metadata
    const users = (authData?.users || []).map(authUser => {
      console.log('User metadata for', authUser.email, ':', authUser.user_metadata)
      return {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || null,
        phone: authUser.user_metadata?.phone || null,
        date_of_birth: authUser.user_metadata?.date_of_birth || null,
        time_of_birth: authUser.user_metadata?.time_of_birth || null,
        place_of_birth: authUser.user_metadata?.place_of_birth || null,
        address: authUser.user_metadata?.address || null,
        occupation: authUser.user_metadata?.occupation || null,
        referred_by: authUser.user_metadata?.referred_by || null,
        selected_services: authUser.user_metadata?.selected_services || null,
        created_at: authUser.created_at,
        last_login: authUser.last_sign_in_at || null,
      }
    })

    res.status(200).json({ users })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch users' })
  }
}
