"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function NewAppointmentPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [appointmentType, setAppointmentType] = useState<string | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const doctors = [
    {
      id: "dr-johnson",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      image: "/placeholder-user.jpg",
      availability: ["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"],
    },
    {
      id: "dr-chen",
      name: "Dr. Michael Chen",
      specialty: "Dental",
      image: "/placeholder-user.jpg",
      availability: ["8:30 AM", "11:00 AM", "1:30 PM", "4:00 PM"],
    },
    {
      id: "dr-rodriguez",
      name: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      image: "/placeholder-user.jpg",
      availability: ["9:30 AM", "12:00 PM", "2:30 PM", "4:30 PM"],
    },
    {
      id: "dr-patel",
      name: "Dr. Raj Patel",
      specialty: "Neurology",
      image: "/placeholder-user.jpg",
      availability: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    },
  ]

  const selectedDoctorData = doctors.find((doctor) => doctor.id === selectedDoctor)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard/appointments")
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Book New Appointment</h2>
        <p className="text-muted-foreground">Schedule an appointment with one of our healthcare professionals</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Appointment Type</CardTitle>
              <CardDescription>Choose the type of appointment you need</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={appointmentType}
                onValueChange={setAppointmentType}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="consultation" id="consultation" />
                  <Label htmlFor="consultation" className="flex flex-col cursor-pointer">
                    <span className="font-medium">Consultation</span>
                    <span className="text-sm text-muted-foreground">General medical consultation</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="follow-up" id="follow-up" />
                  <Label htmlFor="follow-up" className="flex flex-col cursor-pointer">
                    <span className="font-medium">Follow-up</span>
                    <span className="text-sm text-muted-foreground">Follow-up on previous treatment</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="specialist" id="specialist" />
                  <Label htmlFor="specialist" className="flex flex-col cursor-pointer">
                    <span className="font-medium">Specialist Referral</span>
                    <span className="text-sm text-muted-foreground">See a specialist for specific issues</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="emergency" id="emergency" />
                  <Label htmlFor="emergency" className="flex flex-col cursor-pointer">
                    <span className="font-medium">Urgent Care</span>
                    <span className="text-sm text-muted-foreground">For non-life-threatening urgent issues</span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Doctor</CardTitle>
              <CardDescription>Choose a healthcare professional for your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedDoctor && (
                <div className="mt-6 border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedDoctorData?.image} alt={selectedDoctorData?.name} />
                      <AvatarFallback>
                        {selectedDoctorData?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedDoctorData?.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedDoctorData?.specialty}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you would like to schedule your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div>
                  <Label className="block mb-2">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => {
                          // Disable weekends and past dates
                          const day = date.getDay()
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today || day === 0 || day === 6
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedDoctor && date && (
                  <div>
                    <Label className="block mb-2">Available Time Slots</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {selectedDoctorData?.availability.map((time) => (
                        <Button
                          key={time}
                          type="button"
                          variant={selectedTime === time ? "default" : "outline"}
                          className="justify-center"
                          onClick={() => setSelectedTime(time)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe your symptoms or reason for the appointment"
                  className="mt-2"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedDoctor || !date || !selectedTime || !appointmentType || isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

