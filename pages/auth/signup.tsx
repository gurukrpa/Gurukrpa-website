import { useState, useEffect, FormEvent, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import { supabase } from '@/lib/supabase'
import { FaStar, FaQuestionCircle, FaCalendarCheck, FaPrayingHands, FaHeart, FaBaby, FaChalkboardTeacher, FaUsers } from 'react-icons/fa'

// Services list defined at module scope to avoid recreating on every render
const services = [
  { name: 'Astrology Consultation', Icon: FaStar },
  { name: 'Prashna Consultation', Icon: FaQuestionCircle },
  { name: 'Muhurtha Consultation', Icon: FaCalendarCheck },
  { name: 'Group Pooja/Homa Participation', Icon: FaPrayingHands },
  { name: 'Custom Pooja Ceremony', Icon: FaPrayingHands },
  { name: 'Marriage Match Making', Icon: FaHeart },
  { name: 'Garbha Sanskar Astrology', Icon: FaBaby },
  { name: 'Prashna One-on-One Classes', Icon: FaQuestionCircle },
  { name: 'Astrology One-on-One Classes', Icon: FaChalkboardTeacher },
  { name: 'Astro/Prashna Group Class', Icon: FaUsers },
] as const

// Interface for chart data
interface ChartData {
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

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [servicesOpen, setServicesOpen] = useState(false)
  const [serviceQuery, setServiceQuery] = useState('')
  const [numberOfCharts, setNumberOfCharts] = useState('1')
  const [chartData, setChartData] = useState<ChartData[]>([{
    fullName: '',
    relation: '',
    selectedServices: [],
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    address: '',
    occupation: '',
    question1: '',
    question2: '',
    question3: ''
  }])
  const [chartServicesOpen, setChartServicesOpen] = useState<boolean[]>([false])
  const [chartServiceQuery, setChartServiceQuery] = useState<string[]>([''])
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const chartDropdownRefs = useRef<(HTMLDivElement | null)[]>([])

  // Small services list shown as tiles (moved to module scope for stability)

  const toggleService = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    )
  }

  const clearServices = () => setSelectedServices([])
  const selectAllServices = () => setSelectedServices(services.map(s => s.name))

  // Update chart data array when number of charts changes
  useEffect(() => {
    const count = parseInt(numberOfCharts)
    setChartData(prev => {
      const newData = [...prev]
      // Add empty chart data if we need more
      while (newData.length < count) {
        newData.push({
          fullName: '',
          relation: '',
          selectedServices: [],
          dateOfBirth: '',
          timeOfBirth: '',
          placeOfBirth: '',
          address: '',
          occupation: '',
          question1: '',
          question2: '',
          question3: ''
        })
      }
      // Remove extra chart data if we need fewer
      return newData.slice(0, count)
    })
    // Update services dropdown states
    setChartServicesOpen(prev => {
      const newOpen = [...prev]
      while (newOpen.length < count) newOpen.push(false)
      return newOpen.slice(0, count)
    })
    setChartServiceQuery(prev => {
      const newQuery = [...prev]
      while (newQuery.length < count) newQuery.push('')
      return newQuery.slice(0, count)
    })
  }, [numberOfCharts])

  // Update individual chart data
  const updateChartData = (index: number, field: keyof ChartData, value: string) => {
    setChartData(prev => {
      const newData = [...prev]
      newData[index] = { ...newData[index], [field]: value }
      return newData
    })
  }

  // Toggle service for a specific chart
  const toggleChartService = (chartIndex: number, serviceName: string) => {
    setChartData(prev => {
      const newData = [...prev]
      const currentServices = newData[chartIndex].selectedServices
      newData[chartIndex] = {
        ...newData[chartIndex],
        selectedServices: currentServices.includes(serviceName)
          ? currentServices.filter(s => s !== serviceName)
          : [...currentServices, serviceName]
      }
      return newData
    })
  }

  // Clear all services for a specific chart
  const clearChartServices = (chartIndex: number) => {
    setChartData(prev => {
      const newData = [...prev]
      newData[chartIndex] = { ...newData[chartIndex], selectedServices: [] }
      return newData
    })
  }

  // Select all services for a specific chart
  const selectAllChartServices = (chartIndex: number) => {
    setChartData(prev => {
      const newData = [...prev]
      newData[chartIndex] = { ...newData[chartIndex], selectedServices: services.map(s => s.name) }
      return newData
    })
  }

  // Toggle dropdown for a specific chart
  const toggleChartServicesDropdown = (chartIndex: number) => {
    setChartServicesOpen(prev => {
      const newOpen = [...prev]
      newOpen[chartIndex] = !newOpen[chartIndex]
      return newOpen
    })
  }

  // Update service query for a specific chart
  const updateChartServiceQuery = (chartIndex: number, query: string) => {
    setChartServiceQuery(prev => {
      const newQuery = [...prev]
      newQuery[chartIndex] = query
      return newQuery
    })
  }

  // Close dropdown when clicking outside (for chart dropdowns)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      
      // Check main services dropdown
      if (servicesOpen && dropdownRef.current && !dropdownRef.current.contains(target)) {
        setServicesOpen(false)
      }
      
      // Check chart services dropdowns
      chartServicesOpen.forEach((isOpen, index) => {
        if (isOpen && chartDropdownRefs.current[index] && !chartDropdownRefs.current[index]?.contains(target)) {
          setChartServicesOpen(prev => {
            const newOpen = [...prev]
            newOpen[index] = false
            return newOpen
          })
        }
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicesOpen, chartServicesOpen])

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL as string) || window.location.origin
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${baseUrl}/`,
          data: {
            full_name: fullName,
            phone: phone,
            referred_by: referredBy,
            selected_services: selectedServices,
            number_of_charts: numberOfCharts,
            chart_data: chartData,
          },
        },
      })

      if (signUpError) throw signUpError

      console.log('Signup data:', data) // Debug log

      if (data.user) {
        // Use a server-side API to persist users & charts (works even if email confirmation is required)
        const resp = await fetch('/api/auth/complete-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            email,
            fullName,
            phone,
            referredBy,
            numberOfCharts: parseInt(numberOfCharts),
            chartData,
          }),
        })
        if (!resp.ok) {
          const t = await resp.json().catch(() => ({}))
          throw new Error(t.error || 'Failed to save signup data')
        }
      }

      console.log('Session after signup:', data.session) // Debug log

      // Show success message - user is now signed in automatically (if email confirmation is disabled)
      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 8000)
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up - Gurukrpa</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#9FE2BF' }}>
        <div className="max-w-3xl w-full">
          <div style={{ background: '#ECF9F6' }} className="rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 relative rounded-full overflow-hidden ring-2 ">
                <Image src="/images/gurukrpa-logo.jpg" alt="Gurukrpa Logo" fill sizes="80px" className="object-cover" style={{ transform: 'scale(1.07)' }} priority />
              </div>
              <Wordmark className="text-4xl md:text-5xl mb-2" />
              
              {/* Service and Charts Selection - Side by Side */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4" ref={dropdownRef}>
                {/* Service Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Select Services:</h3>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setServicesOpen(o => !o)}
                      className={`w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm ${selectedServices.length === 0 ? 'border-gray-300' : ''}`}
                      style={{ background: '#ECF9F6' }}
                    >
                      <span className="text-gray-700 truncate">
                        {selectedServices.length === 0 ? 'Choose services' : `${selectedServices.length} selected`}
                      </span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.048l3.71-3.817a.75.75 0 111.08 1.04l-4.24 4.368a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {servicesOpen && (
                      <div className="absolute z-20 mt-2 w-full rounded-lg border shadow-lg" style={{ background: '#ECF9F6' }}>
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            value={serviceQuery}
                            onChange={(e) => setServiceQuery(e.target.value)}
                            placeholder="Search services..."
                            className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1"
                          />
                        </div>
                        <div className="max-h-64 overflow-auto p-2 space-y-1">
                          {services
                            .filter(s => s.name.toLowerCase().includes(serviceQuery.trim().toLowerCase()))
                            .map(({ name, Icon }) => (
                              <label key={name} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={selectedServices.includes(name)}
                                  onChange={() => toggleService(name)}
                                />
                                <span className="flex items-center gap-2 text-sm text-gray-800">
                                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-600"><Icon size={12} className="text-white" /></span>
                                  {name}
                                </span>
                              </label>
                            ))}
                          {services.filter(s => s.name.toLowerCase().includes(serviceQuery.trim().toLowerCase())).length === 0 && (
                            <div className="p-3 text-xs text-gray-500">No matches</div>
                          )}
                        </div>
                        <div className="flex items-center justify-between p-2 border-t bg-gray-50">
                          <button type="button" className="text-xs text-gray-600 hover:text-gray-800" onClick={clearServices}>Clear</button>
                          <div className="space-x-2">
                            <button type="button" className="text-xs text-teal-600 hover:underline" onClick={selectAllServices}>Select all</button>
                            <button type="button" className="text-xs bg-teal-600 text-white px-3 py-1 rounded" onClick={() => setServicesOpen(false)}>Done</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedServices.length === 0
                      ? 'Please select at least one'
                      : selectedServices.slice(0, 2).join(', ') + (selectedServices.length > 2 ? ` +${selectedServices.length - 2}` : '')}
                  </p>
                </div>

                {/* Number of Charts Selection */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">Number of Charts:</h3>
                  <select
                    value={numberOfCharts}
                    onChange={(e) => setNumberOfCharts(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    style={{ background: '#ECF9F6' }}
                  >
                    <option value="1">1 Chart</option>
                    <option value="2">2 Charts</option>
                    <option value="3">3 Charts</option>
                    <option value="4">4 Charts</option>
                    <option value="5">5 Charts</option>
                    <option value="6">6 Charts</option>
                    <option value="7">7 Charts</option>
                    <option value="8">8 Charts</option>
                    <option value="9">9 Charts</option>
                    <option value="10">10 Charts</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How many charts to analyze
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div style={{ background: '#ECF9F6' }} className="rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fadeIn">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                      <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                    <p className="text-gray-600">Successfully signed up. Please check your mail for verification.</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700 mb-2">
                  Who Referred You? *
                </label>
                <input
                  id="referredBy"
                  type="text"
                  required
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="Friend, family, social media, etc."
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="Create a strong password"
                  minLength={6}
                />
                <p className="mt-1 text-sm text-gray-500">Minimum 6 characters</p>
              </div>

              {/* Dynamic Chart Information Sections */}
              <div className="space-y-8 mt-8">
                <div className="border-t-2 border-gray-300 pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {parseInt(numberOfCharts) === 1 ? 'Chart Information' : `Information for ${numberOfCharts} Charts`}
                  </h2>
                  <p className="text-sm text-gray-600 text-center mb-6">
                    Please provide the following information for {parseInt(numberOfCharts) === 1 ? 'the chart' : `each of the ${numberOfCharts} people`}
                  </p>
                </div>

                {chartData.map((chart, index) => (
                  <div key={index} className="border-2 border-teal-200 rounded-xl p-6 space-y-4" style={{ background: '#F0FBF8' }}>
                    <h3 className="text-lg font-bold text-teal-800 mb-4 flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white text-sm">
                        {index + 1}
                      </span>
                      {parseInt(numberOfCharts) === 1 ? 'Chart Information' : `Person ${index + 1} Information`}
                    </h3>

                    <div>
                      <label htmlFor={`fullName-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id={`fullName-${index}`}
                        type="text"
                        required
                        value={chart.fullName}
                        onChange={(e) => updateChartData(index, 'fullName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label htmlFor={`relation-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Relation *
                      </label>
                      <input
                        id={`relation-${index}`}
                        type="text"
                        required
                        value={chart.relation}
                        onChange={(e) => updateChartData(index, 'relation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Self, Spouse, Friend, Daughter, Son, Parent"
                      />
                    </div>

                    {/* Services Selection for this Chart */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Services *
                      </label>
                      <div className="relative" ref={(el) => { chartDropdownRefs.current[index] = el }}>
                        <button
                          type="button"
                          onClick={() => toggleChartServicesDropdown(index)}
                          className="w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm border-gray-300"
                          style={{ background: '#ECF9F6' }}
                        >
                          <span className="text-gray-700 truncate">
                            {chart.selectedServices.length === 0 ? 'Choose services' : `${chart.selectedServices.length} selected`}
                          </span>
                          <svg className={`w-4 h-4 ml-2 transition-transform ${chartServicesOpen[index] ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.048l3.71-3.817a.75.75 0 111.08 1.04l-4.24 4.368a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                          </svg>
                        </button>

                        {chartServicesOpen[index] && (
                          <div className="absolute z-20 mt-2 w-full rounded-lg border shadow-lg" style={{ background: '#ECF9F6' }}>
                            <div className="p-2 border-b">
                              <input
                                type="text"
                                value={chartServiceQuery[index] || ''}
                                onChange={(e) => updateChartServiceQuery(index, e.target.value)}
                                placeholder="Search services..."
                                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1"
                              />
                            </div>
                            <div className="max-h-64 overflow-auto p-2 space-y-1">
                              {services
                                .filter(s => s.name.toLowerCase().includes((chartServiceQuery[index] || '').trim().toLowerCase()))
                                .map(({ name, Icon }) => (
                                  <label key={name} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4"
                                      checked={chart.selectedServices.includes(name)}
                                      onChange={() => toggleChartService(index, name)}
                                    />
                                    <span className="flex items-center gap-2 text-sm text-gray-800">
                                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-600"><Icon size={12} className="text-white" /></span>
                                      {name}
                                    </span>
                                  </label>
                                ))}
                              {services.filter(s => s.name.toLowerCase().includes((chartServiceQuery[index] || '').trim().toLowerCase())).length === 0 && (
                                <div className="p-3 text-xs text-gray-500">No matches</div>
                              )}
                            </div>
                            <div className="flex items-center justify-between p-2 border-t bg-gray-50">
                              <button type="button" className="text-xs text-gray-600 hover:text-gray-800" onClick={() => clearChartServices(index)}>Clear</button>
                              <div className="space-x-2">
                                <button type="button" className="text-xs text-teal-600 hover:underline" onClick={() => selectAllChartServices(index)}>Select all</button>
                                <button type="button" className="text-xs bg-teal-600 text-white px-3 py-1 rounded" onClick={() => toggleChartServicesDropdown(index)}>Done</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {chart.selectedServices.length === 0
                          ? 'Please select at least one service'
                          : chart.selectedServices.slice(0, 2).join(', ') + (chart.selectedServices.length > 2 ? ` +${chart.selectedServices.length - 2}` : '')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`dateOfBirth-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth *
                        </label>
                        <input
                          id={`dateOfBirth-${index}`}
                          type="date"
                          required
                          value={chart.dateOfBirth}
                          onChange={(e) => updateChartData(index, 'dateOfBirth', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="dd-mm-yyyy"
                        />
                      </div>

                      <div>
                        <label htmlFor={`timeOfBirth-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Time of Birth *
                        </label>
                        <input
                          id={`timeOfBirth-${index}`}
                          type="time"
                          required
                          value={chart.timeOfBirth}
                          onChange={(e) => updateChartData(index, 'timeOfBirth', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="--:-- --"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={`placeOfBirth-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Place of Birth *
                      </label>
                      <input
                        id={`placeOfBirth-${index}`}
                        type="text"
                        required
                        value={chart.placeOfBirth}
                        onChange={(e) => updateChartData(index, 'placeOfBirth', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="City, State, Country"
                      />
                    </div>

                    <div>
                      <label htmlFor={`address-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Current Residential Address *
                      </label>
                      <textarea
                        id={`address-${index}`}
                        required
                        value={chart.address}
                        onChange={(e) => updateChartData(index, 'address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="House/Street, Area, City, State, PIN, Country"
                      />
                    </div>

                    <div>
                      <label htmlFor={`occupation-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Current Occupation *
                      </label>
                      <input
                        id={`occupation-${index}`}
                        type="text"
                        required
                        value={chart.occupation}
                        onChange={(e) => updateChartData(index, 'occupation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Your current profession"
                      />
                    </div>

                    {/* Questions Section */}
                    <div className="border-t-2 border-teal-300 pt-4 mt-4">
                      <div className="bg-orange-50 border-l-4 border-orange-500 rounded-md p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600 text-lg">⚠️</span>
                          <p className="text-sm font-semibold text-gray-800">
                            Questions must be <span className="text-orange-600 font-bold">related to your selected services</span> above
                          </p>
                        </div>
                      </div>

                      <div>
                        <label htmlFor={`question1-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Question 1 *
                        </label>
                        <textarea
                          id={`question1-${index}`}
                          required
                          value={chart.question1}
                          onChange={(e) => updateChartData(index, 'question1', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter your first question related to the selected services..."
                        />
                      </div>

                      <div>
                        <label htmlFor={`question2-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Question 2 *
                        </label>
                        <textarea
                          id={`question2-${index}`}
                          required
                          value={chart.question2}
                          onChange={(e) => updateChartData(index, 'question2', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter your second question related to the selected services..."
                        />
                      </div>

                      <div>
                        <label htmlFor={`question3-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Question 3 *
                        </label>
                        <textarea
                          id={`question3-${index}`}
                          required
                          value={chart.question3}
                          onChange={(e) => updateChartData(index, 'question3', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="Enter your third question related to the selected services..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || selectedServices.length === 0}
                className="w-full bg-gradient-to-r  text-white py-3 px-4 rounded-lg font-semibold  focus:outline-none focus:ring-2  focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className=" font-semibold hover:">
                  Login here
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

