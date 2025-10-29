import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<{ full_name?: string; email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (robust: try getUser first, then getSession)
    const loadUser = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        if (userRes?.user) {
          const fullName = userRes.user.user_metadata?.full_name || userRes.user.email?.split('@')[0]
          setUser({ full_name: fullName, email: userRes.user.email || undefined })
          setLoading(false)
          return
        }
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
          setUser({ full_name: fullName, email: session.user.email || undefined })
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session) // Debug log
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0]
        setUser({
          full_name: fullName,
          email: session.user.email
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <>
      <Head>
        <title>Gurukrpa - Experience the Divine | Online Homa & Puja Services</title>
        <meta name="description" content="Explore Authentic Online Homa & Puja Services with Gurukrpa" />
      </Head>

      {/* Header */}
      <header className="text-white shadow-lg" style={{background: '#088F8F'}}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden ring-2 ring-white/60">
                <Image src="/images/gurukrpa-logo.jpg" alt="Gurukrpa Logo" fill sizes="56px" className="object-cover" style={{ transform: 'scale(1.07)' }} priority />
              </div>
              <Wordmark className="text-3xl md:text-4xl" />
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="hover:text-cyan-200 transition">Home</Link>
              <Link href="/homa" className="hover:text-cyan-200 transition">Homa</Link>
              <Link href="/puja" className="hover:text-cyan-200 transition">Puja</Link>
              <Link href="/japa" className="hover:text-cyan-200 transition">Japa</Link>
              <Link href="/contact" className="hover:text-cyan-200 transition">Contact</Link>
            </nav>
            <div className="flex space-x-4">
              {user ? (
                <>
                  <span className="text-white px-4 py-2 rounded-lg font-semibold">
                    Welcome, {user.full_name}
                  </span>
                  {user.email?.toLowerCase().includes('admin') && (
                    <Link 
                      href="/admin/dashboard"
                      className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
                      style={{ color: '#088F8F' }}
                    >
                      Admin
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition" 
                    style={{color: '#FFA07A'}}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signup" className="bg-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-100 transition" style={{color: '#FFA07A'}}>
                    Sign Up
                  </Link>
                  <Link href="/auth/login" className="text-white px-4 py-2 rounded-lg font-semibold transition" style={{backgroundColor: '#FF8C69'}}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20" style={{ background: 'linear-gradient(to bottom, #E0F5F5, #ffffff)' }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-4 animate-fadeIn" style={{ color: '#8B4513' }}>
              Experience the Divine
            </h2>
            <p className="text-2xl text-gray-700 mb-8">
              Explore Authentic Online Homa & Puja Services
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="flex-1 px-6 py-4 text-lg border-2 rounded-l-lg focus:outline-none"
                  style={{ borderColor: '#088F8F', '--tw-ring-color': '#088F8F' } as any}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="text-white px-8 py-4 rounded-r-lg font-semibold transition" style={{ background: '#088F8F' }}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ color: '#088F8F' }}>Our Services</h2>
              <div className="ornament"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/homa" className="group">
                <div className="p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2" style={{ background: 'linear-gradient(to bottom right, #E0F5F5, #B8E5E5)' }}>
                  <div className="text-6xl mb-4 text-center">🔥</div>
                  <h3 className="text-2xl font-bold text-center mb-3" style={{ color: '#088F8F' }}>Homa Services</h3>
                  <p className="text-gray-600 text-center">Sacred fire rituals for prosperity and peace</p>
                </div>
              </Link>
              <Link href="/puja" className="group">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                  <div className="text-6xl mb-4 text-center">🙏</div>
                  <h3 className="text-2xl font-bold text-center mb-3" style={{ color: '#088F8F' }}>Puja Services</h3>
                  <p className="text-gray-600 text-center">Divine worship ceremonies for blessings</p>
                </div>
              </Link>
              <Link href="/japa" className="group">
                <div className="bg-gradient-to-br from-red-100 to-red-50 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
                  <div className="text-6xl mb-4 text-center">📿</div>
                  <h3 className="text-2xl font-bold text-center mb-3" style={{ color: '#088F8F' }}>Japa Services</h3>
                  <p className="text-gray-600 text-center">Mantra recitation for spiritual growth</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 text-white" style={{background: '#088F8F'}}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Us</h2>
              <div className="ornament"></div>
            </div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-fadeIn">
                <div className="text-5xl font-bold mb-2">250,000+</div>
                <div className="text-xl">Pujas Performed</div>
              </div>
              <div className="animate-fadeIn" style={{animationDelay: '0.1s'}}>
                <div className="text-5xl font-bold mb-2">150,000+</div>
                <div className="text-xl">Homas Performed</div>
              </div>
              <div className="animate-fadeIn" style={{animationDelay: '0.2s'}}>
                <div className="text-5xl font-bold mb-2">50,000,000+</div>
                <div className="text-xl">Japa counts recited</div>
              </div>
              <div className="animate-fadeIn" style={{animationDelay: '0.3s'}}>
                <div className="text-5xl font-bold mb-2">400,000+</div>
                <div className="text-xl">Individuals enriched</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16" style={{ background: '#E0F5F5' }}>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6" style={{ color: '#088F8F' }}>Ready to Begin Your Spiritual Journey?</h2>
            <p className="text-xl text-gray-700 mb-8">Join thousands of devotees who have experienced divine blessings</p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/signup" className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition" style={{ background: '#088F8F' }}>
                Get Started
              </Link>
              <Link href="/contact" className="bg-white px-8 py-4 rounded-lg text-lg font-semibold border-2 transition hover:bg-gray-50" style={{ color: '#088F8F', borderColor: '#088F8F' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🕉️ Gurukrpa</h3>
              <p className="text-gray-400">Authentic Online Homa & Puja Services</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/services" className="text-gray-400 hover:text-white">Services</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><Link href="/homa" className="text-gray-400 hover:text-white">Homa</Link></li>
                <li><Link href="/puja" className="text-gray-400 hover:text-white">Puja</Link></li>
                <li><Link href="/japa" className="text-gray-400 hover:text-white">Japa</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FaPhone />
                  <span className="text-gray-400">+91 96295 55442</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaWhatsapp />
                  <a href="https://wa.me/919629555442" className="text-gray-400 hover:text-white">WhatsApp</a>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope />
                  <span className="text-gray-400">info@gurukrpa.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Gurukrpa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/919629555442"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110 z-50"
      >
        <FaWhatsapp size={32} />
      </a>
    </>
  )
}
