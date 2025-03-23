import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HospitalIcon, Calendar, User, FileText, CreditCard, MessageSquare, Bell, Settings } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HospitalIcon className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Medicare</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Modern Hospital Management System</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Streamline your hospital operations with our comprehensive management solution for patients, doctors, and
              administrators.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-background">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<User className="h-10 w-10 text-primary" />}
                title="User Accounts"
                description="Secure and personalized access for patients, doctors, and administrators."
              />
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-primary" />}
                title="Appointment Scheduler"
                description="Book appointments effortlessly with real-time availability."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Patient Profiles"
                description="All health records in one place for easy access and management."
              />
              <FeatureCard
                icon={<CreditCard className="h-10 w-10 text-primary" />}
                title="Billing"
                description="Easy payments and tracking for all medical services."
              />
              <FeatureCard
                icon={<MessageSquare className="h-10 w-10 text-primary" />}
                title="Communication"
                description="Direct contact with doctors through secure messaging."
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-primary" />}
                title="Notifications"
                description="Stay informed with timely reminders and updates."
              />
              <FeatureCard
                icon={<Settings className="h-10 w-10 text-primary" />}
                title="Admin Tools"
                description="Comprehensive tools for hospital management and oversight."
              />
              <FeatureCard
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Doctor Profiles"
                description="Clear and updated doctor details for informed patient choices."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Hospital Management?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join Medicare today and experience the difference in healthcare management.
            </p>
            <Link href="/register">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <HospitalIcon className="h-6 w-6" />
              <span className="text-xl font-bold">Medicare</span>
            </div>
            <div className="text-sm">&copy; {new Date().getFullYear()} Medicare. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

