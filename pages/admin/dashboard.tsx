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

  const exportUser = async (userId: string, email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const resp = await fetch(`/api/admin/users/${userId}/export`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!resp.ok) {
        const t = await resp.json().catch(() => ({}))
        throw new Error(t.error || 'Export failed')
      }
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-${email || userId}-export.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export error', e)
      alert('Failed to export user file')
    }
  }

  const exportUserPdf = async (userId: string, email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const resp = await fetch(`/api/admin/users/${userId}/export.pdf`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!resp.ok) {
        const t = await resp.json().catch(() => ({}))
        throw new Error(t.error || 'Export PDF failed')
      }
      const blob = await resp.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `user-${email || userId}-export.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export PDF error', e)
      alert('Failed to export PDF')
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this customer and all their charts? This cannot be undone.')) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const resp = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      if (!resp.ok) {
        const t = await resp.json().catch(() => ({}))
        throw new Error(t.error || 'Delete failed')
      }
      // Refresh list and stats
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      // Optionally recompute service stats quickly
      setServiceStats((prev) => {
        const remaining = users.filter((u) => u.id !== userId)
        const stats: { [key: string]: number } = {}
        remaining.forEach((u) => {
          if (u.selected_services) {
            u.selected_services.forEach((s) => (stats[s] = (stats[s] || 0) + 1))
          }
        })
        return stats
      })
      alert('Customer deleted')
    } catch (e) {
      console.error('Delete error', e)
      alert('Failed to delete customer')
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

      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}>
        {/* Header */}
        <header className="text-white shadow-xl" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
          <div className="container mx-auto px-6 py-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  🕉️
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Gurukrpa Admin Dashboard</h1>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                style={{ color: '#0891b2' }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Left Sidebar - Services Stats */}
          <aside className="w-80 bg-white shadow-xl p-6 min-h-screen border-r border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent mb-2">📊 Services Overview</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
            </div>
            <div className="space-y-2.5">
              {allServices.map((service) => {
                const count = serviceStats[service] || 0
                return (
                  <div key={service} className="flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 hover:shadow-md" style={{ backgroundColor: count > 0 ? '#ecfeff' : '#f9fafb', border: count > 0 ? '1px solid #a5f3fc' : '1px solid #e5e7eb' }}>
                    <span className="text-sm font-medium text-gray-700 flex-1 leading-snug">{service}</span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ml-3 shadow-sm ${count > 0 ? 'text-white' : 'bg-gray-200 text-gray-600'}`} style={count > 0 ? { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' } : {}}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)' }}>
                <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{Object.values(serviceStats).reduce((a, b) => a + b, 0)}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">Total Service Selections</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="container mx-auto px-8 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', border: '2px solid #a5f3fc' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Users</h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">{users.length}</p>
                </div>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                  👥
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', border: '2px solid #6ee7b7' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Bookings</h3>
                  <p className="text-5xl font-bold text-green-600">{bookings.length}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-3xl">
                  📅
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #fcd34d' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-600 text-sm font-semibold mb-2 uppercase tracking-wide">Total Revenue</h3>
                  <p className="text-5xl font-bold text-amber-600">
                    ₹{bookings.reduce((sum, b) => sum + Number(b.amount), 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-3xl">
                  💰
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search users or bookings..."
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 shadow-md hover:shadow-lg transition-all duration-200 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex border-b-2 border-gray-100">
              <button
                className={`flex-1 px-8 py-5 font-bold text-lg transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'users' ? { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' } : {}}
                onClick={() => setActiveTab('users')}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>👥</span>
                  <span>Users ({filteredUsers.length})</span>
                </div>
              </button>
              <button
                className={`flex-1 px-8 py-5 font-bold text-lg transition-all duration-200 ${
                  activeTab === 'bookings'
                    ? 'text-white shadow-lg'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
                style={activeTab === 'bookings' ? { background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' } : {}}
                onClick={() => setActiveTab('bookings')}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>📅</span>
                  <span>Bookings ({filteredBookings.length})</span>
                </div>
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200" style={{ background: 'linear-gradient(to right, #f0f9ff, #ecfeff)' }}>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Actions</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Name</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Email</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Phone</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Services</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Referred By</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Charts</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <>
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 transition-all duration-200">
                            <td className="py-4 px-4 align-top">
                              <div className="flex gap-2 flex-wrap">
                                <button
                                  className={`px-3 py-2 rounded-lg text-xs font-bold shadow-sm transition-all duration-200 ${
                                    (user.charts?.length || 0) > 1
                                      ? 'hover:shadow-md transform hover:scale-105 cursor-pointer'
                                      : 'opacity-50 cursor-not-allowed'
                                  }`}
                                  style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', color: '#0891b2', border: '1px solid #a5f3fc' }}
                                  onClick={() => {
                                    if ((user.charts?.length || 0) > 1) {
                                      setExpanded((prev) => ({ ...prev, [user.id]: !prev[user.id] }))
                                    }
                                  }}
                                  disabled={(user.charts?.length || 0) <= 1}
                                >
                                  {expanded[user.id] ? '▼ Hide' : '▶ View'} Charts
                                </button>
                                <button
                                  className="px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                                  style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#1e40af', border: '1px solid #93c5fd' }}
                                  onClick={() => exportUserPdf(user.id, user.email)}
                                >
                                  📄 Export PDF
                                </button>
                                <button
                                  className="px-3 py-2 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                                  style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', color: '#991b1b', border: '1px solid #fca5a5' }}
                                  onClick={() => deleteUser(user.id)}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-gray-800">{user.full_name || 'N/A'}</td>
                            <td className="py-4 px-4 text-gray-600">{user.email}</td>
                            <td className="py-4 px-4 text-gray-600">{user.phone || 'N/A'}</td>
                            <td className="py-4 px-4 max-w-md">
                              {user.selected_services && user.selected_services.length > 0 ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {user.selected_services.map((service, idx) => (
                                    <span key={idx} className="inline-block px-2.5 py-1 text-xs font-medium rounded-full shadow-sm" style={{ background: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)', color: '#155e75' }}>
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-600">{user.referred_by || 'N/A'}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shadow-sm" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', color: 'white' }}>
                                {user.number_of_charts ?? (user.charts?.length || 0)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600 text-sm">{new Date(user.created_at).toLocaleDateString('en-IN')}</td>
                          </tr>

                          {expanded[user.id] && (
                            <tr>
                              <td colSpan={8} className="bg-gradient-to-r from-gray-50 to-cyan-50 border-l-4 border-cyan-500">
                                <div className="p-6">
                                  <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">📊</span>
                                    <span className="font-bold text-lg text-gray-800">Charts for {user.full_name || user.email}</span>
                                  </div>
                                  {user.charts && user.charts.length > 0 ? (
                                    <div className="overflow-x-auto">
                                      <table className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                                        <thead>
                                          <tr className="border-b-2 border-gray-200" style={{ background: 'linear-gradient(to right, #ecfeff, #e0f2fe)' }}>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Person</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Relation</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Services</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">DOB</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Time</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Place</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Address</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Occupation</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Q1</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Q2</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Q3</th>
                                            <th className="text-left py-3 px-3 text-xs font-bold text-gray-700 uppercase">Created</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {user.charts.map((c, idx) => (
                                            <tr key={c.id} className={`border-b border-gray-100 align-top hover:bg-cyan-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                              <td className="py-3 px-3 font-semibold text-gray-800">{c.full_name}</td>
                                              <td className="py-3 px-3">
                                                <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                                                  {c.relation}
                                                </span>
                                              </td>
                                              <td className="py-3 px-3 max-w-xs">
                                                {c.selected_services && c.selected_services.length > 0 ? (
                                                  <div className="flex flex-wrap gap-1">
                                                    {c.selected_services.map((s, i) => (
                                                      <span key={i} className="inline-block px-2 py-0.5 text-xs font-medium rounded-full" style={{ background: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)', color: '#155e75' }}>{s}</span>
                                                    ))}
                                                  </div>
                                                ) : <span className="text-gray-400">—</span>}
                                              </td>
                                              <td className="py-3 px-3 text-sm text-gray-600">{c.date_of_birth || '—'}</td>
                                              <td className="py-3 px-3 text-sm text-gray-600">{c.time_of_birth || '—'}</td>
                                              <td className="py-3 px-3 max-w-xs truncate text-sm text-gray-600" title={c.place_of_birth}>{c.place_of_birth}</td>
                                              <td className="py-3 px-3 max-w-xs truncate text-sm text-gray-600" title={c.address}>{c.address}</td>
                                              <td className="py-3 px-3 text-sm text-gray-600">{c.occupation}</td>
                                              <td className="py-3 px-3 max-w-xs truncate text-sm text-gray-600" title={c.question1}>{c.question1}</td>
                                              <td className="py-3 px-3 max-w-xs truncate text-sm text-gray-600" title={c.question2}>{c.question2}</td>
                                              <td className="py-3 px-3 max-w-xs truncate text-sm text-gray-600" title={c.question3}>{c.question3}</td>
                                              <td className="py-3 px-3 text-sm text-gray-600">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">No charts for this user.</div>
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
                      <tr className="border-b-2 border-gray-200" style={{ background: 'linear-gradient(to right, #f0f9ff, #ecfeff)' }}>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">User</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Service</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Type</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Amount</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                        <th className="text-left py-4 px-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-teal-50 transition-all duration-200">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-semibold text-gray-800">{booking.users?.full_name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{booking.users?.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-gray-700">{booking.service_name}</td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1.5 rounded-full text-xs font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)', color: '#155e75' }}>
                              {booking.service_type}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-bold text-lg text-green-600">
                            ₹{Number(booking.amount).toLocaleString('en-IN')}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                                booking.payment_status === 'completed'
                                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200'
                                  : booking.payment_status === 'pending'
                                  ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200'
                                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                              }`}
                            >
                              {booking.payment_status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
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
