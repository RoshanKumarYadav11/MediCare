"use client"

import { useState } from "react"
import { Shield, User, Stethoscope, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AuthLayout from "../layouts/AuthLayout"
import { useAuth } from "../hooks/useAuth"

const Login = () => {
  const navigate = useNavigate()
  const { login, error, loading } = useAuth()
  const [selectedRole, setSelectedRole] = useState("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const roles = [
    { id: "admin", label: "Admin", icon: Shield },
    { id: "patient", label: "Patient", icon: User },
    { id: "doctor", label: "Doctor", icon: Stethoscope },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password, selectedRole)
  }

  return (
    <AuthLayout title="Login to HealthCare Portal" subtitle="Access your account">
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white">
        <div className="p-6">
          <div className="flex bg-blue-100 rounded-lg p-1 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                  selectedRole === role.id ? "bg-blue-600 text-white" : "text-blue-600"
                }`}
              >
                <role.icon size={16} />
                <span>{role.label}</span>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-1 text-left">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-1 text-left">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div>{error && <p className="text-red-500 text-xs mt-1">{error}</p>}</div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? "Logging in..." : `Login as ${roles.find((r) => r.id === selectedRole)?.label}`}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-blue-600 font-semibold hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login

