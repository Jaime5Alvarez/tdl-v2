'use client'

import Script from 'next/script'
import { createClient } from 'src/utils/supabase/client'
import { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const GoogleOneTap = () => {
  const supabase = createClient()
  const router = useRouter()
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return [nonce, hashedNonce]
  }

  useEffect(() => {
    if (!isScriptLoaded) return

    const initializeGoogleOneTap = async () => {
      console.log('Initializing Google One Tap')
      const [nonce, hashedNonce] = await generateNonce()
      console.log('Nonce: ', nonce, hashedNonce)

      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session', error)
      }
      if (data.session) {
        router.push('/')
        return
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: CredentialResponse) => {
          try {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
              nonce
            })

            if (error) throw error
            console.log('Successfully logged in with Google One Tap')
            router.push('/')
          } catch (error) {
            console.error('Error logging in with Google One Tap', error)
          }
        },
        nonce: hashedNonce,
      })

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton")!,
        { 
          theme: "outline", 
          size: "large",
          type: "standard"
        }
      )
    }

    initializeGoogleOneTap()
  }, [isScriptLoaded])

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div id="googleButton" className="fixed top-0 right-0 z-[100]" />
    </>
  )
}

export default GoogleOneTap
