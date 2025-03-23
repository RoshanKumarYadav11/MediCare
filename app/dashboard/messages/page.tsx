"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<any>(contacts[0])
  const [messageInput, setMessageInput] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim()) {
      // In a real app, you would send this to an API
      console.log("Sending message:", messageInput)
      setMessageInput("")
    }
  }

  return (
    <div className="h-[calc(100vh-10rem)]">
      <Card className="h-full">
        <CardContent className="p-0 flex h-full">
          {/* Contacts sidebar */}
          <div className="w-full max-w-xs border-r h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search contacts..." className="pl-8" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              {contacts.map((contact) => (
                <div key={contact.id}>
                  <button
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted transition-colors ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-medium truncate">{contact.name}</p>
                        <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat area */}
          {selectedContact ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Chat header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                    <AvatarFallback>
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedContact.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedContact.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuItem>Clear chat</DropdownMenuItem>
                      <DropdownMenuItem>Block contact</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedContact.messages.map((message: any, index: number) => (
                    <div key={index} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sent ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${message.sent ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                        >
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Button type="button" variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Select a contact to start messaging</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const contacts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    avatar: "/placeholder-user.jpg",
    status: "Online",
    lastMessage: "Your prescription has been sent to the pharmacy.",
    lastMessageTime: "10:30 AM",
    messages: [
      {
        text: "Hello, how are you feeling today?",
        time: "10:00 AM",
        sent: false,
      },
      {
        text: "I'm feeling much better, thank you.",
        time: "10:05 AM",
        sent: true,
      },
      {
        text: "That's great to hear. Your test results look good.",
        time: "10:10 AM",
        sent: false,
      },
      {
        text: "I've prescribed some medication for you. Take it twice daily.",
        time: "10:15 AM",
        sent: false,
      },
      {
        text: "Thank you, doctor. When should I come for a follow-up?",
        time: "10:20 AM",
        sent: true,
      },
      {
        text: "Let's schedule for next week. I'll have my assistant call you.",
        time: "10:25 AM",
        sent: false,
      },
      {
        text: "Your prescription has been sent to the pharmacy.",
        time: "10:30 AM",
        sent: false,
      },
    ],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    avatar: "/placeholder-user.jpg",
    status: "Last seen 30 min ago",
    lastMessage: "Please remember to floss daily.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        text: "Hello, I wanted to follow up on your dental cleaning.",
        time: "Yesterday, 2:00 PM",
        sent: false,
      },
      {
        text: "Hi Dr. Chen, everything is fine. No sensitivity.",
        time: "Yesterday, 2:30 PM",
        sent: true,
      },
      {
        text: "That's good to hear. Please remember to floss daily.",
        time: "Yesterday, 3:00 PM",
        sent: false,
      },
    ],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    avatar: "/placeholder-user.jpg",
    status: "Online",
    lastMessage: "Your blood test is scheduled for tomorrow at 9 AM.",
    lastMessageTime: "Mar 15",
    messages: [
      {
        text: "Good morning, I've reviewed your symptoms.",
        time: "Mar 15, 9:00 AM",
        sent: false,
      },
      {
        text: "I think we should run some blood tests to be sure.",
        time: "Mar 15, 9:05 AM",
        sent: false,
      },
      {
        text: "That sounds good. When should I come in?",
        time: "Mar 15, 9:10 AM",
        sent: true,
      },
      {
        text: "Your blood test is scheduled for tomorrow at 9 AM.",
        time: "Mar 15, 9:15 AM",
        sent: false,
      },
    ],
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    avatar: "/placeholder-user.jpg",
    status: "Last seen 2 hours ago",
    lastMessage: "Continue with the physical therapy exercises I showed you.",
    lastMessageTime: "Mar 10",
    messages: [
      {
        text: "How is your knee feeling after our last session?",
        time: "Mar 10, 11:00 AM",
        sent: false,
      },
      {
        text: "It's still a bit sore, but I can move it better now.",
        time: "Mar 10, 11:30 AM",
        sent: true,
      },
      {
        text: "That's progress. Continue with the physical therapy exercises I showed you.",
        time: "Mar 10, 12:00 PM",
        sent: false,
      },
    ],
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    avatar: "/placeholder-user.jpg",
    status: "Online",
    lastMessage: "Apply the cream twice daily and avoid sun exposure.",
    lastMessageTime: "Mar 5",
    messages: [
      {
        text: "Have you noticed any improvement with the rash?",
        time: "Mar 5, 3:00 PM",
        sent: false,
      },
      {
        text: "Yes, it's less red now but still itchy sometimes.",
        time: "Mar 5, 3:30 PM",
        sent: true,
      },
      {
        text: "Apply the cream twice daily and avoid sun exposure.",
        time: "Mar 5, 4:00 PM",
        sent: false,
      },
    ],
  },
]

