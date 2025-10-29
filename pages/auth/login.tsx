import { useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendStatus, setResendStatus] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) throw loginError

      if (data.user) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)

        // Redirect: admins to admin dashboard, customers to home
        if (data.user.email?.toLowerCase().includes('admin')) {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendStatus(null)
    try {
      if (!email) {
        setResendStatus('Please enter your email above first.')
        return
      }
      // Resend confirmation for signup
      const { error } = await supabase.auth.resend({ type: 'signup', email })
      if (error) throw error
      setResendStatus('Verification email sent. Please check your inbox/spam.')
    } catch (e: any) {
      setResendStatus(e?.message || 'Could not resend verification email.')
    }
  }

  return (
    <>
      <Head>
        <title>Login - Gurukrpa</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ background: 'linear-gradient(135deg, #E0F5F5 0%, #B8E5E5 50%, #E0F5F5 100%)' }}>
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto mb-3 h-16 w-16 md:h-20 md:w-20 relative rounded-full overflow-hidden ring-2" style={{ borderColor: '#088F8F' }}>
                <Image src="/images/gurukrpa-logo.jpg" alt="Gurukrpa Logo" fill sizes="80px" className="object-cover" style={{ transform: 'scale(1.07)' }} priority />
              </div>
              <Wordmark className="text-4xl md:text-5xl mb-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Login to continue your spiritual journey</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {resendStatus && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded">
                {resendStatus}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#088F8F' } as any}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  style={{ '--tw-ring-color': '#088F8F' } as any}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 border-gray-300 rounded"
                    style={{ accentColor: '#088F8F' }}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="hover:underline" style={{ color: '#088F8F' }}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="mt-2 text-sm">
                <button type="button" onClick={handleResend} className="hover:underline" style={{ color: '#088F8F' }}>
                  Resend verification email
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                style={{ background: 'linear-gradient(to right, #088F8F, #077070)', '--tw-ring-color': '#088F8F' } as any}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: '#088F8F' }}>
                  Sign up here
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
