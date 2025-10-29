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
    content: `At Gurukrpa, we believe astrology is not just about prediction — it is a sacred dialogue between your soul and the stars.

Our astrology consultations offer divine insight into your life's purpose, guided by timeless Vedic wisdom.

Each session is deeply personal — we study your birth chart with care to understand how planetary energies influence your relationships, career, health, and spiritual growth.

Through compassionate analysis and practical remedies, Gurukrpa helps you gain clarity in confusion and direction in destiny — empowering you to live in alignment with cosmic truth.`,
    image: 'https://images.unsplash.com/photo-1532009877282-3340270e0529?w=800&q=80',
    benefits: ['Personalized birth chart analysis', 'Life path clarity and direction', 'Practical Vedic remedies']
  },
  'prashna-consultation': {
    title: 'Prashna Consultation',
    description: 'Instant answers through Prashna astrology',
    content: `When your heart seeks divine answers, Gurukrpa's Prashna Consultation becomes your sacred guide.

Based on the ancient system of Prashna Marga, we analyze the planetary positions of the exact moment your question arises — revealing the truth the universe wishes you to know.

This method is deeply devotional, confidential, and precise.

Whether it's about relationships, opportunities, or challenges, Gurukrpa helps you receive direction straight from cosmic intelligence — giving you confidence and peace to move forward with faith.`,
    image: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=800&q=80',
    benefits: ['Instant divine answers', 'Confidential and precise guidance', 'Clarity on specific questions']
  },
  'muhurtha-consultation': {
    title: 'Muhurtha Consultation',
    description: 'Auspicious timing for important life events',
    content: `Every new beginning deserves the right moment — and at Gurukrpa, we help you find it.

Our Muhurtha Consultation identifies the most auspicious time for your important events — marriage, housewarming, travel, or new ventures — based on perfect planetary harmony.

Each muhurtha is chosen through careful calculation of nakshatras, tithis, and planetary strengths.

Gurukrpa ensures your sacred start carries divine blessings, aligning your journey with peace, prosperity, and grace.`,
    image: 'https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=800&q=80',
    benefits: ['Perfect timing for life events', 'Nakshatra and tithi calculation', 'Divine blessings assured']
  },
  'group-pooja-homa': {
    title: 'Group Pooja/Homa Participation',
    description: 'Join collective spiritual ceremonies',
    content: `At Gurukrpa, we believe that when hearts unite in prayer, the divine listens with even greater love.

Our Group Pooja and Homa sessions bring devotees together — in person or online — to invoke divine blessings through sacred fire rituals.

Your individual sankalpa (intention) is offered into the ritual, joining the collective energy of devotion.

Each ceremony is performed with authentic Vedic chanting, invoking Agni and the Devas to bless all participants with health, harmony, and spiritual upliftment.`,
    image: 'https://images.unsplash.com/photo-1609619385002-f40b59a44921?w=800&q=80',
    benefits: ['Collective divine energy', 'Personal sankalpa offered', 'Authentic Vedic rituals']
  },
  'custom-pooja-ceremony': {
    title: 'Custom Pooja Ceremony',
    description: 'Personalized sacred rituals for your needs',
    content: `At Gurukrpa, we understand that every devotee's prayer is unique.

Our Custom Pooja Ceremonies are thoughtfully designed to match your personal or family intentions — whether it's for peace, protection, prosperity, or gratitude.

From Ganapathi and Navagraha to Lakshmi or Rudra poojas, every ritual follows the true Vedic path.

We handle all arrangements — from selecting the muhurtha to preparing materials — so you can focus entirely on devotion.

Performed at home or online, each Gurukrpa pooja becomes a bridge between your heart and the Divine.`,
    image: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=800&q=80',
    benefits: ['Tailored to your intentions', 'Complete arrangement handled', 'Home or online options']
  },
  'marriage-match-making': {
    title: 'Marriage Match Making',
    description: 'Vedic compatibility analysis for marriage',
    content: `Marriage is not only the meeting of two people — it is the alignment of two destinies.

At Gurukrpa, our Marriage Match Making service combines the precision of Vedic astrology with compassionate spiritual understanding.

We study both horoscopes, analyzing guna milan, doshas, and planetary harmony to reveal true compatibility.

Our goal is not merely matching charts but creating a foundation for a joyful and spiritually balanced union.

Through Gurukrpa, you receive divine clarity before one of life's most sacred commitments.`,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    benefits: ['Complete horoscope analysis', 'Guna milan and dosha check', 'Spiritual compatibility insight']
  },
  'garbha-sanskar-astrology': {
    title: 'Garbha Sanskar Astrology',
    description: 'Pre-natal spiritual guidance and rituals',
    content: `At Gurukrpa, we honor the sacred journey of motherhood as a divine act of creation.

Our Garbha Sanskar Astrology guidance helps expecting mothers cultivate peace, positivity, and divine energy during pregnancy.

Using astrology, mantra, and meditation, we suggest personalized practices that support both the mother's emotional balance and the baby's spiritual harmony.

Every recommendation — from auspicious colors to daily rituals — is given with care and devotion.

Through this process, Gurukrpa helps parents welcome a soul into the world surrounded by divine protection and love.`,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80',
    benefits: ['Personalized prenatal guidance', 'Mantra and meditation support', 'Divine protection for baby']
  },
  'prashna-classes': {
    title: 'Prashna One-on-One Classes',
    description: 'Learn Prashna astrology personally',
    content: `At Gurukrpa, we share the sacred knowledge of Prashna Shastra through our personalized one-on-one classes.

Guided by classical texts such as Prashna Marga and Hora Sara, these sessions are tailored to your pace and understanding.

You'll learn to cast Prashna charts, interpret planetary messages, and apply Vedic principles with accuracy and intuition.

Each class nurtures both knowledge and spiritual insight, helping you become not just a reader of charts — but a true seeker who listens to the divine voice behind them.`,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    benefits: ['Classical text-based learning', 'Personalized pace and attention', 'Spiritual and technical mastery']
  },
  'astrology-classes': {
    title: 'Astrology One-on-One Classes',
    description: 'Master Vedic astrology with personal guidance',
    content: `Learning astrology is a journey of self-discovery — and at Gurukrpa, we walk with you every step.

Our One-on-One Astrology Classes take you from foundational principles like Rashi, Nakshatra, and Grahas to advanced chart interpretation and divisional charts (Vargas).

Every lesson blends spiritual understanding with real-life practice.

You'll not only gain technical skill but also the humility and insight that come with true Jyotisha learning.

Gurukrpa's mentorship helps you see astrology as the ancient light guiding your dharma and destiny.`,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
    benefits: ['Foundation to advanced learning', 'Real-life chart practice', 'Spiritual Jyotisha mentorship']
  },
  'astro-prashna-group-class': {
    title: 'Astro/Prashna Group Class',
    description: 'Learn astrology in a group setting',
    content: `Learning together is itself a sacred practice — and Gurukrpa's Group Classes create that space of shared growth and devotion.

In our Astro and Prashna Group Classes, seekers from various backgrounds come together to explore the divine science of Jyotisha.

Each session combines theory, case studies, and open discussion, fostering both learning and community.

The environment is joyful, devotional, and inclusive — more like a satsang than a classroom.

Through Gurukrpa's guidance, every student becomes part of a growing family united by light, wisdom, and reverence for the stars.`,
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
    benefits: ['Community-based learning', 'Theory and case studies', 'Satsang-like environment']
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
        <section className="py-16" style={{ background: '#9FE2BF' }}>
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Main Content */}
            <div style={{ background: '#ECF9F6' }} className="rounded-2xl shadow-lg p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#009688' }}>
                About This Service
              </h2>
              <div className="prose prose-lg max-w-none">
                {service.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed mb-6 text-gray-700" style={{ textAlign: 'justify' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div style={{ background: '#ECF9F6' }} className="rounded-2xl shadow-lg p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: '#009688' }}>
                Key Benefits
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {service.benefits.map((benefit, index) => (
                  <div key={index} style={{ background: '#ECF9F6' }} className="rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
                    <div className="text-4xl mb-3 text-center">✨</div>
                    <p className="font-semibold text-gray-800 text-center">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl shadow-lg p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Book This Service?</h3>
              <p className="mb-8 text-lg">Get started on your spiritual journey today</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
                >
                  Book Now
                </Link>
                <Link
                  href="/#services"
                  className="bg-teal-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-900 transition border-2 border-white text-lg"
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
