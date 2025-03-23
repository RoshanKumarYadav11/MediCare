"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ("patient" | "doctor" | "admin")[]
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Skip if still loading
    if (loading) return

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

    // If user is not authenticated and route is not public, redirect to login
    if (!user && !isPublicRoute) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // If user is authenticated but accessing a public route like login/register, redirect to dashboard
    if (user && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard")
      return
    }

    // If roles are specified, check if user has the required role
    if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard") // Redirect to dashboard if user doesn't have the required role
      return
    }

    // User is authorized to view the page
    setIsAuthorized(true)
  }, [user, loading, pathname, router, allowedRoles])

  // Show loading state or nothing while checking authorization
  if (loading || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

