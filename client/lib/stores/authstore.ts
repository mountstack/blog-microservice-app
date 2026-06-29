import { create } from "zustand"; 
import { devtools, persist } from "zustand/middleware"; 
import { connectSocket, disconnectSocket } from "../socket/client";

interface User {
  id: string
  email: string
  isSuspended: string
  name?: string
  bio?: string
  gender?: string
  avatarUrl?: string
  phoneNumber?: string
  totalPosts?: string
  createdAt?: string
  updatedAt?: string
} 

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (user: User, accessToken: string) => void
  logout: () => void, 
  setAccessToken: (accessToken: string) => void 
} 

const createStore = (set: any) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (accessToken: string) => set({ accessToken }),
  login: (user: User, accessToken: string) => { 
    const socket = connectSocket(user.id.toString()); 
    set({ user, accessToken, isAuthenticated: true }); 
  },
  logout: () => { 
    disconnectSocket();
    set({ user: null, accessToken: null, isAuthenticated: false })
  }
}); 

const isDevelopment = process.env.NODE_ENV === "development"; 

export const useAuthStore = create<AuthState>()( 
  devtools( 
    isDevelopment 
      ? persist(createStore, { name: "auth-storage" }) 
      : createStore, 
    { name: "AuthStore" } 
  ) as any 
); 
