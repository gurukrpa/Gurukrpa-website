import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Cinzel } from 'next/font/google'
import Wordmark from '@/components/Wordmark'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['900'] })

// Service data structure - content will be added later
const servicesData: Record<string, {
  title: string
  description: string
  content: string
  image: string
  benefits: string[]
}> = {
  'astrology-consultation': {
    title: 'Astrology Consultation',
    description: 'Personalized Vedic astrology readings and guidance',
    content: 'Detailed content will be added here...',
    image: '/images/13606540_1643131539348188_4941602659500979600_n.jpg',
    benefits: ['Personalized guidance', 'Life path clarity', 'Future predictions']
  },
  'prashna-consultation': {
    title: 'Prashna Consultation',
    description: 'Instant answers through Prashna astrology',
    content: 'Detailed content will be added here...',
    image: '/images/153700262_2889422301385766_9145664278903128347_n.jpg',
    benefits: ['Instant answers', 'Specific questions', 'Accurate predictions']
  },
  'muhurtha-consultation': {
    title: 'Muhurtha Consultation',
    description: 'Auspicious timing for important life events',
    content: 'Detailed content will be added here...',
    image: '/images/172025602_2921021328225863_4034529163949904811_n.jpg',
    benefits: ['Perfect timing', 'Auspicious moments', 'Success assurance']
  },
  'group-pooja-homa': {
    title: 'Group Pooja/Homa Participation',
    description: 'Join collective spiritual ceremonies',
    content: 'Detailed content will be added here...',
    image: '/images/183549571_2945214632473199_5260788716310171813_n.jpg',
    benefits: ['Community prayers', 'Shared blessings', 'Divine energy']
  },
  'custom-pooja-ceremony': {
    title: 'Custom Pooja Ceremony',
    description: 'Personalized sacred rituals for your needs',
    content: 'Detailed content will be added here...',
    image: '/images/35736027_2054892291505442_4237369800285749248_n.jpg',
    benefits: ['Tailored rituals', 'Personal intentions', 'Divine blessings']
  },
  'marriage-match-making': {
    title: 'Marriage Match Making',
    description: 'Vedic compatibility analysis for marriage',
    content: 'Detailed content will be added here...',
    image: '/images/470128586_3925765744418078_401393879124089351_n.jpg',
    benefits: ['Compatibility check', 'Perfect match', 'Happy marriage']
  },
  'garbha-sanskar-astrology': {
    title: 'Garbha Sanskar Astrology',
    description: 'Pre-natal spiritual guidance and rituals',
    content: 'Detailed content will be added here...',
    image: '/images/484175213_3999559870371998_8982690694709368337_n.jpg',
    benefits: ['Healthy pregnancy', 'Divine protection', 'Child welfare']
  },
  'prashna-classes': {
    title: 'Prashna One-on-One Classes',
    description: 'Learn Prashna astrology personally',
    content: 'Detailed content will be added here...',
    image: '/images/484940184_4006514933009825_6626399863205392892_n.jpg',
    benefits: ['Expert teaching', 'Practical learning', 'Personal attention']
  },
  'astrology-classes': {
    title: 'Astrology One-on-One Classes',
    description: 'Master Vedic astrology with personal guidance',
    content: 'Detailed content will be added here...',
    image: '/images/485032773_4006515239676461_9187027870231540033_n.jpg',
    benefits: ['Deep knowledge', 'Personalized pace', 'Expert mentorship']
  },
  'astro-prashna-group-class': {
    title: 'Astro/Prashna Group Class',
    description: 'Learn astrology in a group setting',
    content: 'Detailed content will be added here...',
    image: '/images/489730459_4028884424106209_7325051519151063438_n.jpg',
    benefits: ['Group learning', 'Interactive sessions', 'Affordable pricing']
  },
}

export default function ServicePage() {
  const router = useRouter()
  const { slug } = router.query

  // Get service data
  const service = slug ? servicesData[slug as string] : null

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <Link href="/" className="text-teal-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{service.title} - Gurukrpa</title>
        <meta name="description" content={service.description} />
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Wordmark className="h-12" />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="hover:text-teal-600 transition">Home</Link>
              <Link href="/#services" className="hover:text-teal-600 transition">Services</Link>
              <Link href="/auth/login" className="hover:text-teal-600 transition">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        {/* Hero Section with Image */}
        <section className="relative h-96 overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className={`${cinzel.className} text-5xl md:text-6xl font-bold mb-4`}>
                {service.title}
              </h1>
              <p className="text-xl md:text-2xl">{service.description}</p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#009688' }}>
                About This Service
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-6">{service.content}</p>
                <p className="text-gray-600 italic">
                  📝 Detailed content for this service will be provided soon.
                </p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#009688' }}>
                Benefits
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {service.benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="text-4xl mb-3">✨</div>
                    <p className="font-semibold text-gray-800">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-teal-600 text-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Book This Service?</h3>
              <p className="mb-6 text-lg">Get started on your spiritual journey today</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Book Now
                </Link>
                <Link
                  href="/#services"
                  className="bg-teal-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-800 transition border-2 border-white"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Wordmark className="h-12 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Experience Divine Blessings</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="tel:+1234567890" className="hover:text-teal-400 transition">📞 Contact</a>
            <a href="mailto:info@gurukrpa.com" className="hover:text-teal-400 transition">✉️ Email</a>
          </div>
          <p className="text-sm text-gray-500">© 2025 Gurukrpa. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
