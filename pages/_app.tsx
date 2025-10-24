import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
