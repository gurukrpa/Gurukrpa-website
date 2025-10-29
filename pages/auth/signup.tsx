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

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [timeOfBirth, setTimeOfBirth] = useState('')
  const [placeOfBirth, setPlaceOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [occupation, setOccupation] = useState('')
  const [referredBy, setReferredBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [servicesOpen, setServicesOpen] = useState(false)
  const [serviceQuery, setServiceQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement | null>(null)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!servicesOpen) return
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [servicesOpen])

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
            date_of_birth: dateOfBirth,
            time_of_birth: timeOfBirth,
            place_of_birth: placeOfBirth,
            address: address,
            occupation: occupation,
            referred_by: referredBy,
            selected_services: selectedServices,
          },
        },
      })

      if (signUpError) throw signUpError

      console.log('Signup data:', data) // Debug log

      if (data.user) {
        // Insert user data into users table
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: fullName,
              phone: phone,
            },
          ])

        if (insertError && insertError.code !== '23505') {
          console.error('Error inserting user:', insertError)
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
          <div style={{ background: '#9FE2BF' }} className="rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 relative rounded-full overflow-hidden ring-2 ">
                <Image src="/images/gurukrpa-logo.jpg" alt="Gurukrpa Logo" fill sizes="80px" className="object-cover" style={{ transform: 'scale(1.07)' }} priority />
              </div>
              <Wordmark className="text-4xl md:text-5xl mb-2" />
              {/* Service Selection (Dropdown multi-select) */}
              <div className="mt-4" ref={dropdownRef}>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Select Services You're Interested In:</h3>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setServicesOpen(o => !o)}
                    className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left ${selectedServices.length === 0 ? 'border-gray-300' : ''}`}
                    style={{ background: '#9FE2BF' }}
                  >
                    <span className="text-gray-700 truncate">
                      {selectedServices.length === 0 ? 'Choose one or more services' : `${selectedServices.length} selected`}
                    </span>
                    <svg className={`w-4 h-4 ml-2 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.048l3.71-3.817a.75.75 0 111.08 1.04l-4.24 4.368a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {servicesOpen && (
                    <div className="absolute z-20 mt-2 w-full rounded-lg border shadow-lg" style={{ background: '#9FE2BF' }}>
                      <div className="p-2 border-b  ">
                        <input
                          type="text"
                          value={serviceQuery}
                          onChange={(e) => setServiceQuery(e.target.value)}
                          placeholder="Search services..."
                          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 "
                        />
                      </div>
                      <div className="max-h-64 overflow-auto p-2 space-y-1">
                        {services
                          .filter(s => s.name.toLowerCase().includes(serviceQuery.trim().toLowerCase()))
                          .map(({ name, Icon }) => (
                            <label key={name} className="flex items-center gap-3 p-2 rounded-md hover: cursor-pointer">
                              <input
                                type="checkbox"
                                className="h-4 w-4 "
                                checked={selectedServices.includes(name)}
                                onChange={() => toggleService(name)}
                              />
                              <span className="flex items-center gap-2 text-sm text-gray-800">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full "><Icon size={12} className="text-white" /></span>
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
                          <button type="button" className="text-xs  hover:underline" onClick={selectAllServices}>Select all</button>
                          <button type="button" className="text-xs  text-white px-3 py-1 rounded" onClick={() => setServicesOpen(false)}>Done</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {selectedServices.length === 0
                    ? 'Please select at least one service'
                    : selectedServices.slice(0, 3).join(', ') + (selectedServices.length > 3 ? ` +${selectedServices.length - 3} more` : '')}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div style={{ background: '#9FE2BF' }} className="rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fadeIn">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Time of Birth *
                  </label>
                  <input
                    id="timeOfBirth"
                    type="time"
                    required
                    value={timeOfBirth}
                    onChange={(e) => setTimeOfBirth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Place of Birth *
                </label>
                <input
                  id="placeOfBirth"
                  type="text"
                  required
                  value={placeOfBirth}
                  onChange={(e) => setPlaceOfBirth(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="City, State, Country"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Residential Address *
                </label>
                <textarea
                  id="address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="House/Street, Area, City, State, PIN, Country"
                />
              </div>

              <div>
                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Occupation *
                </label>
                <input
                  id="occupation"
                  type="text"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-transparent"
                  placeholder="Your current profession"
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

