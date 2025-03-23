import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function DoctorsPage() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      experience: "15 years",
      rating: 4.8,
      availability: "Mon, Wed, Fri",
      image: "/placeholder-user.jpg",
      languages: ["English", "Spanish"],
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "Dental",
      experience: "10 years",
      rating: 4.7,
      availability: "Tue, Thu, Sat",
      image: "/placeholder-user.jpg",
      languages: ["English", "Chinese"],
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "General Medicine",
      experience: "8 years",
      rating: 4.9,
      availability: "Mon, Tue, Thu, Fri",
      image: "/placeholder-user.jpg",
      languages: ["English", "Spanish", "Portuguese"],
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      specialty: "Orthopedics",
      experience: "20 years",
      rating: 4.6,
      availability: "Wed, Thu, Fri",
      image: "/placeholder-user.jpg",
      languages: ["English"],
    },
    {
      id: 5,
      name: "Dr. Lisa Thompson",
      specialty: "Dermatology",
      experience: "12 years",
      rating: 4.8,
      availability: "Mon, Wed, Fri",
      image: "/placeholder-user.jpg",
      languages: ["English", "French"],
    },
    {
      id: 6,
      name: "Dr. Robert Garcia",
      specialty: "Neurology",
      experience: "18 years",
      rating: 4.7,
      availability: "Tue, Thu",
      image: "/placeholder-user.jpg",
      languages: ["English", "Spanish"],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Doctors</h2>
        <p className="text-muted-foreground">Find and connect with our healthcare professionals</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search doctors by name or specialty..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback>
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">{doctor.rating}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({Math.floor(Math.random() * 200) + 50} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Experience:</span>
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability:</span>
                    <span>{doctor.availability}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Languages:</span>
                    <div className="flex flex-wrap justify-end gap-1">
                      {doctor.languages.map((language) => (
                        <Badge key={language} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex border-t">
                <Button variant="ghost" className="flex-1 rounded-none py-6" asChild>
                  <Link href={`/dashboard/appointments/new?doctor=${doctor.id}`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book
                  </Link>
                </Button>
                <Button variant="ghost" className="flex-1 rounded-none py-6 border-l" asChild>
                  <Link href={`/dashboard/messages?doctor=${doctor.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

