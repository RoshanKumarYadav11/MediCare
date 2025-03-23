"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/app/services"

// Define the User type
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "patient" | "doctor" | "admin"
  profileImage?: string
  isVerified: boolean
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: any) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to fetch the current user
  const fetchCurrentUser = async () => {
    try {
      // Check if there's a token
      if (!AuthService.isAuthenticated()) {
        setLoading(false)
        return
      }

      // Fetch current user
      const response = await AuthService.getCurrentUser()
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching current user:", error)
      // Clear token if there's an error
      localStorage.removeItem("token")
    } finally {
      setLoading(false)
    }
  }

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await AuthService.login({ email, password })
      setUser(response.data)
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setLoading(true)
    try {
      await AuthService.logout()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData: any) => {
    setLoading(true)
    try {
      await AuthService.register(userData)
      // Don't log in automatically after registration since email verification is required
      router.push("/login?registered=true")
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  // Create the context value
  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

