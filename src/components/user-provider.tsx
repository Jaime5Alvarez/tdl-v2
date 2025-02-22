'use client'

import { useEffect } from 'react'
import { useUserStore } from "src/store/user-store"

interface UserProviderProps {
  user: {
    id: string;
    email: string;
  } | null;
}

export function UserProvider({ user }: UserProviderProps) {
  const { setUser } = useUserStore()

  useEffect(() => {
    if (user?.id && user?.email) {
      setUser({
        id: user.id,
        email: user.email,
      })
    }
  }, [user, setUser])

  return null
} 