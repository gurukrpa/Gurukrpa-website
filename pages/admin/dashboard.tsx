import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'

interface Chart {
  id: string
  user_id: string
  full_name: string
  relation: string
  selected_services: string[]
  date_of_birth: string | null
  time_of_birth: string | null
  place_of_birth: string
  address: string
  occupation: string
  question1: string
  question2: string
  question3: string
  created_at: string
}

interface User {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  referred_by?: string | null
  selected_services?: string[] | null
  number_of_charts?: number | null
  created_at: string
  last_login: string | null
  charts?: Chart[]
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
  const [serviceStats, setServiceStats] = useState<{ [key: string]: number }>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    checkAdmin()
    fetchUsers()
    fetchBookings()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

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
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('No session found')
        return
      }

      // Call our secure API route that uses service role
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }

  const data = await response.json()
      setUsers(data.users || [])
      
      // Calculate service statistics
      const stats: { [key: string]: number } = {}
      data.users?.forEach((user: User) => {
        if (user.selected_services && Array.isArray(user.selected_services)) {
          user.selected_services.forEach((service: string) => {
            stats[service] = (stats[service] || 0) + 1
          })
        }
      })
      setServiceStats(stats)
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

  // All available services
  const allServices = [
    'Astrology Consultation',
    'Prashna Consultation',
    'Muhurtha Consultation',
    'Group Pooja/Homa Participation',
    'Custom Pooja Ceremony',
    'Marriage Match Making',
    'Garbha Sanskar Astrology',
    'Prashna One-on-One Classes',
    'Astrology One-on-One Classes',
    'Astro/Prashna Group Class',
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl" style={{ color: '#088F8F' }}>Loading...</div>
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
        <header className="text-white shadow-lg" style={{ background: 'linear-gradient(to right, #088F8F, #077070)' }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">🕉️ Gurukrpa Admin Dashboard</h1>
              <button
                onClick={handleLogout}
                className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                style={{ color: '#088F8F' }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar - Services Stats */}
          <aside className="w-80 bg-white shadow-lg p-6 min-h-screen">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Services Overview</h2>
            <div className="space-y-3">
              {allServices.map((service) => {
                const count = serviceStats[service] || 0
                return (
                  <div key={service} className="flex items-center justify-between p-3 rounded-lg transition" style={{ backgroundColor: count > 0 ? '#E0F5F5' : '#f9f9f9' }}>
                    <span className="text-sm font-medium text-gray-700 flex-1">{service}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ml-2 ${count > 0 ? 'text-white' : 'bg-gray-300 text-gray-600'}`} style={count > 0 ? { backgroundColor: '#088F8F' } : {}}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: '#088F8F' }}>{Object.values(serviceStats).reduce((a, b) => a + b, 0)}</p>
                <p className="text-sm text-gray-600">Total Service Selections</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#E0F5F5', borderColor: '#088F8F' }}>
              <h3 className="text-gray-700 text-xs font-medium mb-1">Total Users</h3>
              <p className="text-3xl font-bold" style={{ color: '#088F8F' }}>{users.length}</p>
            </div>
            <div className="p-4 rounded-lg border border-green-300" style={{ backgroundColor: '#E0F5F5' }}>
              <h3 className="text-gray-700 text-xs font-medium mb-1">Total Bookings</h3>
              <p className="text-3xl font-bold text-green-600">{bookings.length}</p>
            </div>
            <div className="p-4 rounded-lg border border-blue-300" style={{ backgroundColor: '#E0F5F5' }}>
              <h3 className="text-gray-700 text-xs font-medium mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-blue-600">
                ₹{bookings.reduce((sum, b) => sum + Number(b.amount), 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search users or bookings..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2"
              style={{ '--tw-ring-color': '#088F8F' } as any}
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
                    ? 'text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'users' ? { backgroundColor: '#088F8F' } : {}}
                onClick={() => setActiveTab('users')}
              >
                Users ({filteredUsers.length})
              </button>
              <button
                className={`flex-1 px-6 py-4 font-semibold ${
                  activeTab === 'bookings'
                    ? 'text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'bookings' ? { backgroundColor: '#088F8F' } : {}}
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Services</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Referred By</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Charts</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <>
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 align-top">
                              <button
                                className="px-3 py-1 rounded text-sm font-semibold"
                                style={{ backgroundColor: '#E0F5F5', color: '#066666' }}
                                onClick={() => setExpanded((prev) => ({ ...prev, [user.id]: !prev[user.id] }))}
                              >
                                {expanded[user.id] ? 'Hide' : 'View'} Charts
                              </button>
                            </td>
                            <td className="py-3 px-4">{user.full_name || 'N/A'}</td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                            <td className="py-3 px-4 max-w-md">
                              {user.selected_services && user.selected_services.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {user.selected_services.map((service, idx) => (
                                    <span key={idx} className="inline-block px-2 py-1 text-xs rounded" style={{ backgroundColor: '#E0F5F5', color: '#066666' }}>
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="py-3 px-4">{user.referred_by || 'N/A'}</td>
                            <td className="py-3 px-4">{user.number_of_charts ?? (user.charts?.length || 0)}</td>
                            <td className="py-3 px-4">{new Date(user.created_at).toLocaleDateString('en-IN')}</td>
                          </tr>

                          {expanded[user.id] && (
                            <tr>
                              <td colSpan={8} className="bg-gray-50">
                                <div className="p-4">
                                  <div className="font-semibold mb-2">Charts</div>
                                  {user.charts && user.charts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <table className="w-full">
                                        <thead>
                                          <tr className="border-b border-gray-200 text-sm">
                                            <th className="text-left py-2 px-3">Person</th>
                                            <th className="text-left py-2 px-3">Relation</th>
                                            <th className="text-left py-2 px-3">Services</th>
                                            <th className="text-left py-2 px-3">DOB</th>
                                            <th className="text-left py-2 px-3">Time</th>
                                            <th className="text-left py-2 px-3">Place</th>
                                            <th className="text-left py-2 px-3">Address</th>
                                            <th className="text-left py-2 px-3">Occupation</th>
                                            <th className="text-left py-2 px-3">Q1</th>
                                            <th className="text-left py-2 px-3">Q2</th>
                                            <th className="text-left py-2 px-3">Q3</th>
                                            <th className="text-left py-2 px-3">Created</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {user.charts.map((c) => (
                                            <tr key={c.id} className="border-b border-gray-100 align-top">
                                              <td className="py-2 px-3">{c.full_name}</td>
                                              <td className="py-2 px-3">{c.relation}</td>
                                              <td className="py-2 px-3 max-w-xs">
                                                {c.selected_services && c.selected_services.length > 0 ? (
                                                  <div className="flex flex-wrap gap-1">
                                                    {c.selected_services.map((s, i) => (
                                                      <span key={i} className="inline-block px-2 py-0.5 text-xs rounded" style={{ backgroundColor: '#E0F5F5', color: '#066666' }}>{s}</span>
                                                    ))}
                                                  </div>
                                                ) : '—'}
                                              </td>
                                              <td className="py-2 px-3">{c.date_of_birth || '—'}</td>
                                              <td className="py-2 px-3">{c.time_of_birth || '—'}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={c.place_of_birth}>{c.place_of_birth}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={c.address}>{c.address}</td>
                                              <td className="py-2 px-3">{c.occupation}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={c.question1}>{c.question1}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={c.question2}>{c.question2}</td>
                                              <td className="py-2 px-3 max-w-xs truncate" title={c.question3}>{c.question3}</td>
                                              <td className="py-2 px-3">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-600">No charts for this user.</div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
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
                            <span className="px-2 py-1 rounded-full text-sm" style={{ backgroundColor: '#E0F5F5', color: '#066666' }}>
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
        </div>
      </div>
    </>
  )
}
