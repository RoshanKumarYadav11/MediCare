"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Clock, Filter, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import Link from "next/link"

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "Today",
      time: "2:00 PM",
      status: "Confirmed",
      location: "Main Hospital, Room 302",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dental",
      date: "Tomorrow",
      time: "10:30 AM",
      status: "Confirmed",
      location: "Dental Clinic, Room 105",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      date: "Fri, 22 Mar",
      time: "3:15 PM",
      status: "Pending",
      location: "Medical Center, Room 210",
    },
  ]

  const pastAppointments = [
    {
      id: 4,
      doctor: "Dr. James Wilson",
      specialty: "Orthopedics",
      date: "15 Mar 2024",
      time: "9:00 AM",
      status: "Completed",
      location: "Orthopedic Center, Room 405",
    },
    {
      id: 5,
      doctor: "Dr. Lisa Thompson",
      specialty: "Dermatology",
      date: "28 Feb 2024",
      time: "1:30 PM",
      status: "Completed",
      location: "Dermatology Clinic, Room 203",
    },
    {
      id: 6,
      doctor: "Dr. Robert Garcia",
      specialty: "Neurology",
      date: "10 Feb 2024",
      time: "11:45 AM",
      status: "Cancelled",
      location: "Neurology Department, Room 512",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage your upcoming and past appointments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search appointments..." className="pl-8" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <div className="grid gap-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="grid gap-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
              <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    appointment.status === "Confirmed"
                      ? "default"
                      : appointment.status === "Pending"
                        ? "outline"
                        : appointment.status === "Completed"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {appointment.status}
                </Badge>
                <span className="text-sm text-muted-foreground">{appointment.location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-right">
              <p className="font-medium">{appointment.date}</p>
              <p className="text-sm text-muted-foreground">{appointment.time}</p>
            </div>
            <div className="flex gap-2">
              {appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                <>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm">
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

