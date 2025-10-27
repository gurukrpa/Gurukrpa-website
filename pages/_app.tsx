import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Handle redirect back from email confirmation (or OAuth) and create a session
    // This enables "auto sign-in" after the user clicks the verification link in email.
    // It does NOT change steps 1-3 of your flow; it only completes the session on return.
    const maybeExchangeCodeForSession = async () => {
      if (typeof window === 'undefined') return
      const href = window.location.href

      // Supabase may return either a `?code=` query param or tokens in the hash fragment.
      const url = new URL(href)
      const hasCodeParam = !!url.searchParams.get('code')
      const hasAuthHash = href.includes('#access_token') || href.includes('#id_token') || href.includes('type=recovery') || href.includes('type=signup')
      if (!hasCodeParam && !hasAuthHash) return

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(href)
        if (!error) {
          // Clean the URL (remove code/hash) to avoid confusion on refresh
          const cleanUrl = `${url.origin}${url.pathname}`
          window.history.replaceState({}, document.title, cleanUrl)
        }
      } catch (e) {
        // Ignore – header will still show Sign Up if not authenticated
      }
    }

    // Dev helper: allow quick sign-out via ?logout=1
    const maybeDevLogout = async () => {
      if (typeof window === 'undefined') return
      const url = new URL(window.location.href)
      if (url.searchParams.get('logout') === '1') {
        try { await supabase.auth.signOut() } catch {}
        url.searchParams.delete('logout')
        window.history.replaceState({}, document.title, `${url.origin}${url.pathname}${url.search}`)
      }
    }

    // Run immediately on first mount
    void maybeExchangeCodeForSession()
    void maybeDevLogout()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Update last login
        supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', session.user.id)
          .then()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <Component {...pageProps} />
}
