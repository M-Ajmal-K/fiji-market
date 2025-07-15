"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, location: string) => Promise<void>
  signOut: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("fiji-market-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in a real app, this would call your API
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email,
      location: "Suva",
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: new Date(),
      verified: true,
    }

    setUser(mockUser)
    localStorage.setItem("fiji-market-user", JSON.stringify(mockUser))
  }

  const signUp = async (name: string, email: string, password: string, location: string) => {
    // Mock registration - in a real app, this would call your API
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      location,
      avatar: "/placeholder.svg?height=40&width=40",
      joinedAt: new Date(),
      verified: false,
    }

    setUser(mockUser)
    localStorage.setItem("fiji-market-user", JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("fiji-market-user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
