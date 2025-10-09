import { useEffect, useState } from 'react'
import { NavBar, Footer } from '../components/websection'
import { supabase, supabaseUrl, supabaseAnonKey } from '../lib/supabase'

function SupabaseTest() {
  const [result, setResult] = useState({ ping: null, auth: null, error: null })

  useEffect(() => {
    const run = async () => {
      try {
        // 1) Lightweight connectivity check (no tables needed)
        const pingRes = await fetch(`${supabaseUrl}/auth/v1/settings`, {
          headers: { apikey: supabaseAnonKey },
        })
        const pingOk = pingRes.ok

        // 2) Basic auth session read
        const { data: authData, error: authError } = await supabase.auth.getSession()

        setResult({ ping: pingOk, auth: authData ?? null, error: authError || null })
      } catch (e) {
        setResult({ ping: null, auth: null, error: e })
      }
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <NavBar />
      <section className="flex-1 flex items-center justify-center px-6 py-12">
        <article className="w-full max-w-2xl bg-neutral-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
          <pre className="whitespace-pre-wrap break-words text-sm bg-white p-4 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        </article>
      </section>
      <Footer />
    </div>
  )
}

SupabaseTest.displayName = 'SupabaseTest'
export default SupabaseTest


