// Update the dashboard layout to include the AuthGuard
"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  HospitalIcon,
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import AuthGuard from "@/app/components/auth-guard"
import { useAuth } from "@/app/contexts/AuthContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar },
    { name: "Medical Records", href: "/dashboard/records", icon: FileText },
    { name: "Doctors", href: "/dashboard/doctors", icon: Users },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthGuard>
      <div className="flex h-screen bg-background">
        {/* Sidebar for desktop */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
          <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <Link href="/" className="flex items-center">
                <HospitalIcon className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">Medicare</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 flex-shrink-0 h-5 w-5 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.firstName || "User"} />
                    <AvatarFallback>
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3 w-full">
                  <div className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">{user?.role}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Log out</span>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col flex-1 min-h-0 bg-card">
              <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
                <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <HospitalIcon className="h-6 w-6 text-primary mr-2" />
                  <span className="text-xl font-bold">Medicare</span>
                </Link>
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                <nav className="flex-1 px-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 flex-shrink-0 h-5 w-5 ${
                            isActive ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t p-4">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage
                        src={user?.profileImage || "/placeholder-user.jpg"}
                        alt={user?.firstName || "User"}
                      />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3 w-full">
                    <div className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{user?.role}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log out</span>
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          {/* Top navigation */}
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-card border-b">
            <button
              type="button"
              className="md:hidden px-4 text-muted-foreground focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex items-center">
                <h1 className="text-2xl font-semibold">
                  {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                </h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8 md:hidden">
                  <AvatarImage src={user?.profileImage || "/placeholder-user.jpg"} alt={user?.firstName || "User"} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-muted/30 p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}

