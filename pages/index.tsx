import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'

// 3D Coverflow Carousel Component
function CoverflowCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Sacred images for Pooja, Homa, and Astrology
  const images = [
    { src: '/images/13606540_1643131539348188_4941602659500979600_n.jpg', alt: 'Sacred Pooja Ceremony', title: 'Divine Pooja' },
    { src: '/images/153700262_2889422301385766_9145664278903128347_n.jpg', alt: 'Holy Homa Ritual', title: 'Sacred Homa' },
    { src: '/images/172025602_2921021328225863_4034529163949904811_n.jpg', alt: 'Vedic Astrology', title: 'Vedic Astrology' },
    { src: '/images/183549571_2945214632473199_5260788716310171813_n.jpg', alt: 'Temple Worship', title: 'Temple Rituals' },
    { src: '/images/35736027_2054892291505442_4237369800285749248_n.jpg', alt: 'Sacred Fire Ceremony', title: 'Fire Ceremony' },
    { src: '/images/470128586_3925765744418078_401393879124089351_n.jpg', alt: 'Spiritual Blessings', title: 'Divine Blessings' },
    { src: '/images/484175213_3999559870371998_8982690694709368337_n.jpg', alt: 'Sacred Rituals', title: 'Sacred Rituals' },
    { src: '/images/484940184_4006514933009825_6626399863205392892_n.jpg', alt: 'Holy Ceremony', title: 'Holy Ceremony' },
    { src: '/images/485032773_4006515239676461_9187027870231540033_n.jpg', alt: 'Divine Worship', title: 'Divine Worship' },
    { src: '/images/489730459_4028884424106209_7325051519151063438_n.jpg', alt: 'Spiritual Services', title: 'Spiritual Services' },
  ]

  const totalSlides = images.length

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 4000)
    return () => clearInterval(timer)
  }, [totalSlides])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Calculate position and styling for each slide
  const getSlideStyle = (index: number) => {
    const diff = index - currentIndex
    const absDiff = Math.abs(diff)
    
    // Normalize diff for circular positioning
    let normalizedDiff = diff
    if (absDiff > totalSlides / 2) {
      normalizedDiff = diff > 0 ? diff - totalSlides : diff + totalSlides
    }

    const isCenter = normalizedDiff === 0
    const isNext = normalizedDiff === 1
    const isPrev = normalizedDiff === -1
    
    let transform = ''
    let zIndex = 0
    let opacity = 0
    let scale = 0.6

    if (isCenter) {
      // Center image: forward and larger
      transform = 'translateX(0%) translateZ(200px) scale(1.2)'
      zIndex = 30
      opacity = 1
      scale = 1.2
    } else if (isNext) {
      // Next image: right and smaller
      transform = 'translateX(70%) translateZ(0px) scale(0.85) rotateY(-25deg)'
      zIndex = 20
      opacity = 0.7
    } else if (isPrev) {
      // Previous image: left and smaller
      transform = 'translateX(-70%) translateZ(0px) scale(0.85) rotateY(25deg)'
      zIndex = 20
      opacity = 0.7
    } else if (absDiff === 2 || (absDiff > totalSlides / 2 && absDiff < totalSlides - 1)) {
      // Hidden slides further away
      transform = normalizedDiff > 0 
        ? 'translateX(120%) translateZ(-100px) scale(0.6) rotateY(-35deg)'
        : 'translateX(-120%) translateZ(-100px) scale(0.6) rotateY(35deg)'
      zIndex = 10
      opacity = 0.3
    } else {
      // Completely hidden
      opacity = 0
      zIndex = 0
    }

    return {
      transform,
      zIndex,
      opacity,
      transition: 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  }

  return (
    <section 
      className="py-20 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #E0F5F5, #ffffff)' }}
    >
      <div className="container mx-auto px-4">
        {/* Coverflow Container */}
        <div className="relative" style={{ height: '450px', perspective: '1200px' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => {
              const style = getSlideStyle(index)
              return (
                <div
                  key={index}
                  className="absolute cursor-pointer"
                  style={{
                    ...style,
                    width: '320px',
                    maxWidth: '85vw',
                    height: '380px',
                    transformStyle: 'preserve-3d',
                  }}
                  onClick={() => goToSlide(index)}
                >
                  <div 
                    className="w-full h-full rounded-2xl shadow-2xl overflow-hidden relative bg-gray-100"
                    style={{
                      border: 'none',
                      boxShadow: index === currentIndex 
                        ? '0 20px 60px rgba(0, 150, 136, 0.4)' 
                        : '0 10px 30px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {/* Actual sacred images */}
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 85vw, 320px"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl font-bold transition-all hover:scale-110 z-40"
            style={{ 
              background: 'linear-gradient(135deg, #009688, #00796B)',
              color: 'white',
            }}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl font-bold transition-all hover:scale-110 z-40"
            style={{ 
              background: 'linear-gradient(135deg, #009688, #00796B)',
              color: 'white',
            }}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center space-x-3 mt-12">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: index === currentIndex ? '40px' : '12px',
                height: '12px',
                background: index === currentIndex ? '#F7C948' : '#009688',
                opacity: index === currentIndex ? 1 : 0.5,
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// Original Stories Carousel Component (keeping for reference)
function StoriesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 10

  const slides = [
    { icon: '🕉️', title: 'Sacred Rituals', description: 'Traditional Vedic ceremonies for spiritual growth', gradient: 'from-teal-100 to-cyan-200' },
    { icon: '🔥', title: 'Homa Ceremonies', description: 'Sacred fire rituals for prosperity and peace', gradient: 'from-cyan-100 to-teal-200' },
    { icon: '🙏', title: 'Puja Services', description: 'Divine worship ceremonies for blessings', gradient: 'from-teal-200 to-cyan-100' },
    { icon: '📿', title: 'Japa Meditation', description: 'Mantra recitation for inner peace', gradient: 'from-cyan-200 to-teal-100' },
    { icon: '🪷', title: 'Spiritual Guidance', description: 'Expert consultations for life\'s journey', gradient: 'from-teal-100 to-cyan-300' },
    { icon: '🌟', title: 'Astrology Services', description: 'Vedic astrology readings and guidance', gradient: 'from-cyan-300 to-teal-200' },
    { icon: '🎭', title: 'Cultural Events', description: 'Traditional celebrations and festivals', gradient: 'from-teal-200 to-cyan-200' },
    { icon: '📖', title: 'Vedic Learning', description: 'Ancient wisdom for modern times', gradient: 'from-cyan-100 to-teal-300' },
    { icon: '🧘', title: 'Meditation Classes', description: 'Find inner peace and balance', gradient: 'from-teal-300 to-cyan-100' },
    { icon: '🎵', title: 'Sacred Music', description: 'Devotional songs and mantras', gradient: 'from-cyan-200 to-teal-200' },
  ]

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isPaused])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide])

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const clickX = e.clientX - rect.left
    const containerWidth = rect.width
    if (clickX < containerWidth / 2) {
      goToPrevious()
    } else {
      goToNext()
    }
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#088F8F' }}>
            Cloneable Interactive CMS Template
          </h2>
          <div className="ornament"></div>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
          style={{ background: '#E0F5F5', minHeight: '600px' }}
          onClick={handleContainerClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full flex items-center justify-center p-12">
                <div className="text-center max-w-2xl">
                  <div className={`w-full h-96 bg-gradient-to-br ${slide.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg transform transition hover:scale-105`}>
                    <div className="text-8xl animate-pulse">{slide.icon}</div>
                  </div>
                  <h3 className="text-3xl font-bold mb-3" style={{ color: '#088F8F' }}>
                    {slide.title}
                  </h3>
                  <p className="text-gray-600 text-lg">{slide.description}</p>
                  <div className="mt-6 text-gray-400 text-sm">
                    Slide {index + 1} of {totalSlides}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2 px-4">
            {slides.map((_, i) => (
              <div key={i} className="h-1 flex-1 max-w-20 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: i === currentSlide ? '100%' : i < currentSlide ? '100%' : '0%',
                    background: '#088F8F',
                  }}
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(i)
                }}
                className="w-3 h-3 rounded-full transition-all transform hover:scale-150"
                style={{ background: i === currentSlide ? '#088F8F' : '#B8E5E5' }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition hover:scale-110 hover:bg-white text-3xl font-bold z-10"
            style={{ color: '#088F8F' }}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition hover:scale-110 hover:bg-white text-3xl font-bold z-10"
            style={{ color: '#088F8F' }}
            aria-label="Next slide"
          >
            ›
          </button>

          <div className="absolute bottom-20 left-0 right-0 flex justify-between px-8 pointer-events-none">
            <div className="text-white/50 text-sm">← Tap</div>
            <div className="text-white/50 text-sm">Tap →</div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Use arrow keys (←/→) or click left/right to navigate • Auto-advances every 4 seconds</p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
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
        {/* 3D Coverflow Sacred Images Gallery */}
        <CoverflowCarousel />

        {/* Stats Section */}
        <section className="py-6 text-white" style={{background: '#088F8F'}}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">Why Us</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-center">
              <div className="animate-fadeIn flex items-center gap-2">
                <span className="text-2xl font-bold">250,000+</span>
                <span className="text-xs">Pujas Performed</span>
              </div>
              <div className="animate-fadeIn flex items-center gap-2" style={{animationDelay: '0.1s'}}>
                <span className="text-2xl font-bold">150,000+</span>
                <span className="text-xs">Homas Performed</span>
              </div>
              <div className="animate-fadeIn flex items-center gap-2" style={{animationDelay: '0.2s'}}>
                <span className="text-2xl font-bold">50,000,000+</span>
                <span className="text-xs">Japa counts recited</span>
              </div>
              <div className="animate-fadeIn flex items-center gap-2" style={{animationDelay: '0.3s'}}>
                <span className="text-2xl font-bold">400,000+</span>
                <span className="text-xs">Individuals enriched</span>
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
