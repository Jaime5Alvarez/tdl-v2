'use client'

import { useEffect } from 'react'
import { useUserStore } from "@/store/user-store"

interface UserProviderProps {
  user: {
    id: string;
    email: string;
  } | null;
  accessToken: string | null;
}

export function UserProvider({ user, accessToken }: UserProviderProps) {
  const { setUser, setAccessToken } = useUserStore()

  useEffect(() => {
    if (user?.id && user?.email) {
      setUser({
        id: user.id,
        email: user.email,
      })
      if (accessToken) {
        setAccessToken(accessToken)
      }
    }
  }, [user, setUser])

  return null
} 