import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  last_login: string | null
}

interface Booking {
  id: string
  user_id: string
  service_type: string
  service_name: string
  amount: number
  payment_status: string
  created_at: string
  users: {
    email: string
    full_name: string | null
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'bookings'>('users')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    checkAdmin()
    fetchUsers()
    fetchBookings()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin (you can implement custom admin logic)
    // For now, we'll check if the email contains 'admin'
    if (!user.email?.includes('admin')) {
      alert('Access denied. Admin only.')
      router.push('/')
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          users (
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredBookings = bookings.filter(booking =>
    booking.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-orange-600">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Gurukrpa</title>
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">🕉️ Gurukrpa Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-orange-600">{users.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Bookings</h3>
              <p className="text-4xl font-bold text-green-600">{bookings.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Revenue</h3>
              <p className="text-4xl font-bold text-blue-600">
                ₹{bookings.reduce((sum, b) => sum + Number(b.amount), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users or bookings..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`flex-1 px-6 py-4 font-semibold ${
                  activeTab === 'users'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('users')}
              >
                Users ({filteredUsers.length})
              </button>
              <button
                className={`flex-1 px-6 py-4 font-semibold ${
                  activeTab === 'bookings'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                Bookings ({filteredBookings.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registered</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Login</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">{user.full_name || 'N/A'}</td>
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                          <td className="py-3 px-4">
                            {new Date(user.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleDateString('en-IN')
                              : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{booking.users?.full_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{booking.users?.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">{booking.service_name}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                              {booking.service_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold">
                            ₹{Number(booking.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                booking.payment_status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : booking.payment_status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {booking.payment_status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {new Date(booking.created_at).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
