import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Activity, CreditCard, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next: Today at 2:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Last visit: 3 days ago</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$120.00</div>
            <p className="text-xs text-muted-foreground">Due in 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Last checkup: 2 weeks ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 border rounded-lg">
                <div className="mr-4 bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Dr. Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground">General Checkup</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Today</p>
                  <p className="text-sm text-muted-foreground">2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="mr-4 bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Dr. Michael Chen</h3>
                  <p className="text-sm text-muted-foreground">Dental Cleaning</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Tomorrow</p>
                  <p className="text-sm text-muted-foreground">10:30 AM</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded-lg">
                <div className="mr-4 bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Dr. Emily Rodriguez</h3>
                  <p className="text-sm text-muted-foreground">Follow-up Consultation</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Friday</p>
                  <p className="text-sm text-muted-foreground">3:15 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/appointments">View All Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent medical activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-green-100 p-1 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Prescription Filled</p>
                  <p className="text-sm text-muted-foreground">Your prescription for Amoxicillin has been filled</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-blue-100 p-1 rounded-full">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Lab Results Available</p>
                  <p className="text-sm text-muted-foreground">Your blood test results are now available</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 mt-1 bg-yellow-100 p-1 rounded-full">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Appointment Reminder</p>
                  <p className="text-sm text-muted-foreground">Reminder for your appointment with Dr. Johnson</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/records">View Medical Records</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/appointments/new">
                <Calendar className="mr-2 h-4 w-4" />
                Book New Appointment
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/messages">
                <Users className="mr-2 h-4 w-4" />
                Message Your Doctor
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Outstanding Bills
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medications</CardTitle>
            <CardDescription>Your current medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Amoxicillin</p>
                  <p className="text-sm text-muted-foreground">500mg, 3 times daily</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Lisinopril</p>
                  <p className="text-sm text-muted-foreground">10mg, once daily</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Metformin</p>
                  <p className="text-sm text-muted-foreground">1000mg, twice daily</p>
                </div>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Health Tips</CardTitle>
            <CardDescription>Personalized health recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <h3 className="font-medium mb-1">Stay Hydrated</h3>
                <p className="text-sm text-muted-foreground">
                  Remember to drink at least 8 glasses of water daily for optimal health.
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <h3 className="font-medium mb-1">Regular Exercise</h3>
                <p className="text-sm text-muted-foreground">
                  Aim for at least 30 minutes of moderate exercise 5 days a week.
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <h3 className="font-medium mb-1">Medication Reminder</h3>
                <p className="text-sm text-muted-foreground">Take your medications as prescribed for best results.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

