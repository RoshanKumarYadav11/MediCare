import api from "./api"

// Types
interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  role: "patient" | "doctor"
}

interface LoginData {
  email: string
  password: string
}

// Auth service
const AuthService = {
  // Register a new user
  register: async (data: RegisterData) => {
    try {
      const response = await api.post("/auth/register", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Login user
  login: async (data: LoginData) => {
    try {
      const response = await api.post("/auth/login", data)

      // Save token to localStorage
      if (response.data.data.token) {
        localStorage.setItem("token", response.data.data.token)
      }

      return response.data
    } catch (error) {
      throw error
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.get("/auth/logout")
      localStorage.removeItem("token")
    } catch (error) {
      localStorage.removeItem("token")
      throw error
    }
  },

  // Verify email
  verifyEmail: async (token: string) => {
    try {
      const response = await api.get(`/auth/verify/${token}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post("/auth/forgot-password", { email })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Reset password
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me")
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("token") !== null
  },
}

export default AuthService

