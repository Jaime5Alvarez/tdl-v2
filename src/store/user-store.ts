import { create } from 'zustand'
import { User } from '@/modules/user/domain/interface'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
  accessToken: string | null
  setAccessToken: (accessToken: string | null) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
})) 
