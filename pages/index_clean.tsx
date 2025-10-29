import Head from 'next/head'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa'
import { supabase } from '@/lib/supabase'

// Interactive Stories Carousel Component
function StoriesCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const totalSlides = 10

  const slides = [
    { icon: '???', title: 'Sacred Rituals', description: 'Traditional Vedic ceremonies for spiritual growth', gradient: 'from-teal-100 to-cyan-200' },
    { icon: '??', title: 'Homa Ceremonies', description: 'Sacred fire rituals for prosperity and peace', gradient: 'from-cyan-100 to-teal-200' },
    { icon: '??', title: 'Puja Services', description: 'Divine worship ceremonies for blessings', gradient: 'from-teal-200 to-cyan-100' },
    { icon: '??', title: 'Japa Meditation', description: 'Mantra recitation for inner peace', gradient: 'from-cyan-200 to-teal-100' },
    { icon: '??', title: 'Spiritual Guidance', description: 'Expert consultations for life'"'"'s journey', gradient: 'from-teal-100 to-cyan-300' },
    { icon: '??', title: 'Astrology Services', description: 'Vedic astrology readings and guidance', gradient: 'from-cyan-300 to-teal-200' },
    { icon: '??', title: 'Cultural Events', description: 'Traditional celebrations and festivals', gradient: 'from-teal-200 to-cyan-200' },
    { icon: '??', title: 'Vedic Learning', description: 'Ancient wisdom for modern times', gradient: 'from-cyan-100 to-teal-300' },
    { icon: '??', title: 'Meditation Classes', description: 'Find inner peace and balance', gradient: 'from-teal-300 to-cyan-100' },
    { icon: '??', title: 'Sacred Music', description: 'Devotional songs and mantras', gradient: 'from-cyan-200 to-teal-200' },
  ]

  // Auto-advance slides
  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [isPaused])

  // Keyboard navigation
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

  // Handle tap/click navigation (left/right side)
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

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer"
          style={{ background: '#E0F5F5', minHeight: '600px' }}
          onClick={handleContainerClick}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides */}
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="min-w-full flex items-center justify-center p-12">
                <div className="text-center max-w-2xl">
                  <div
                    className={`w-full h-96 bg-gradient-to-br ${slide.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg transform transition hover:scale-105`}
                  >
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

          {/* Progress Bars */}
          <div className="absolute top-4 left-0 right-0 flex justify-center space-x-2 px-4">
            {slides.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 max-w-20 bg-white/30 rounded-full overflow-hidden"
              >
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

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(i)
                }}
                className="w-3 h-3 rounded-full transition-all transform hover:scale-150"
                style={{
                  background: i === currentSlide ? '#088F8F' : '#B8E5E5',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Previous/Next Arrows */}
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

          {/* Tap Hint (Mobile) */}
          <div className="absolute bottom-20 left-0 right-0 flex justify-between px-8 pointer-events-none">
            <div className="text-white/50 text-sm">? Tap</div>
            <div className="text-white/50 text-sm">Tap ?</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Use arrow keys (?/?) or click left/right to navigate • Auto-advances every 4 seconds</p>
        </div>
      </div>
    </section>
  )
}
