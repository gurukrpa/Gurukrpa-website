import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import { supabase } from '@/lib/supabase'
import { FaStar, FaQuestionCircle, FaCalendarCheck, FaPrayingHands, FaHeart, FaBaby, FaChalkboardTeacher, FaUsers } from 'react-icons/fa'

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

  // Small services list to show as cute tiles (2 rows)
  const services = [
    { name: 'Astrology Consultation', Icon: FaStar },
    { name: 'Prashna Consultation', Icon: FaQuestionCircle },
    { name: 'Muhurtha Consultation', Icon: FaCalendarCheck },
    { name: 'Pooja / Homa Live', Icon: FaPrayingHands },
    { name: 'Marriage Match Making', Icon: FaHeart },
    { name: 'Garbha Sanskar Astrology', Icon: FaBaby },
    { name: 'Prashna One-on-One Classes', Icon: FaQuestionCircle },
    { name: 'Astrology One-on-One Classes', Icon: FaChalkboardTeacher },
    { name: 'Group Class Consultation', Icon: FaUsers },
  ] as const

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            date_of_birth: dateOfBirth,
            time_of_birth: timeOfBirth,
            place_of_birth: placeOfBirth,
            address: address,
            occupation: occupation,
            referred_by: referredBy,
          },
        },
      })

      if (signUpError) throw signUpError

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

        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
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

      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 relative rounded-full overflow-hidden ring-2 ring-orange-200">
                <Image src="/images/gurukrpa-logo.jpg" alt="Gurukrpa Logo" fill sizes="80px" className="object-cover" style={{ transform: 'scale(1.07)' }} priority />
              </div>
              <Wordmark className="text-4xl md:text-5xl mb-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Astrology Consultation Registration</h2>
              <p className="text-gray-600 mt-2">Begin your spiritual journey with personalized guidance</p>
              {/* Cute services tiles - 2 rows on md+ */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map(({ name, Icon }) => (
                  <div key={name} className="flex items-center space-x-3 rounded-xl border border-orange-100 bg-orange-50/60 px-3 py-3 hover:shadow-md transition">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: '#FFA07A' }}>
                      <Icon className="text-white" size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Account created successfully! Redirecting to login...
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Create a strong password"
                  minLength={6}
                />
                <p className="mt-1 text-sm text-gray-500">Minimum 6 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-orange-600 font-semibold hover:text-orange-700">
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
