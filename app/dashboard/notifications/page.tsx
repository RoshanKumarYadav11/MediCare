"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, FileText, Pill, CreditCard, Clock, Check, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications)

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Stay updated with your medical care</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
          <Button variant="outline" asChild>
            <a href="#settings">Notification Settings</a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No notifications to display</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="grid gap-4">
            {notifications.filter((n) => !n.read).length > 0 ? (
              notifications
                .filter((notification) => !notification.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Check className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No unread notifications</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="read">
          <div className="grid gap-4">
            {notifications.filter((n) => n.read).length > 0 ? (
              notifications
                .filter((notification) => notification.read)
                .map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No read notifications</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div id="settings" className="pt-8">
        <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Appointment Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appointment-reminders">Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
                    </div>
                    <Switch id="appointment-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="appointment-changes">Appointment Changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when appointments are rescheduled or cancelled
                      </p>
                    </div>
                    <Switch id="appointment-changes" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Medical Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prescription-reminders">Prescription Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive reminders to take your medication</p>
                    </div>
                    <Switch id="prescription-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lab-results">Lab Results</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new lab results are available</p>
                    </div>
                    <Switch id="lab-results" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="health-tips">Health Tips</Label>
                      <p className="text-sm text-muted-foreground">Receive personalized health recommendations</p>
                    </div>
                    <Switch id="health-tips" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Billing Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="payment-reminders">Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming or overdue payments</p>
                    </div>
                    <Switch id="payment-reminders" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="billing-updates">Billing Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about billing statements and insurance claims
                      </p>
                    </div>
                    <Switch id="billing-updates" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Notification Delivery</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch id="sms-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: any
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "prescription":
        return <Pill className="h-5 w-5 text-green-500" />
      case "record":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "billing":
        return <CreditCard className="h-5 w-5 text-orange-500" />
      case "reminder":
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  return (
    <Card className={notification.read ? "bg-card" : "bg-primary/5"}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-muted p-3 rounded-full">{getIcon(notification.type)}</div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-lg">{notification.title}</h3>
                <p className="text-sm text-muted-foreground">{notification.time}</p>
              </div>
              <div className="flex items-start gap-2">
                {!notification.read && (
                  <Badge variant="default" className="ml-2">
                    New
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>Mark as read</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(notification.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="mt-2">{notification.message}</p>
            {notification.action && (
              <div className="mt-4">
                <Button size="sm" asChild>
                  <a href={notification.actionLink}>{notification.action}</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const allNotifications = [
  {
    id: 1,
    title: "Appointment Reminder",
    message: "You have an appointment with Dr. Sarah Johnson tomorrow at 2:00 PM.",
    time: "10 minutes ago",
    type: "appointment",
    read: false,
    action: "View Appointment",
    actionLink: "/dashboard/appointments",
  },
  {
    id: 2,
    title: "Prescription Refill",
    message: "Your prescription for Amoxicillin has been refilled and is ready for pickup.",
    time: "2 hours ago",
    type: "prescription",
    read: false,
    action: "View Prescription",
    actionLink: "/dashboard/records",
  },
  {
    id: 3,
    title: "Lab Results Available",
    message: "Your recent blood test results are now available for review.",
    time: "Yesterday",
    type: "record",
    read: false,
    action: "View Results",
    actionLink: "/dashboard/records",
  },
  {
    id: 4,
    title: "Payment Due",
    message: "You have an outstanding payment of $120.00 due in 7 days.",
    time: "2 days ago",
    type: "billing",
    read: true,
    action: "Make Payment",
    actionLink: "/dashboard/billing",
  },
  {
    id: 5,
    title: "Medication Reminder",
    message: "Remember to take your Lisinopril medication today.",
    time: "3 days ago",
    type: "reminder",
    read: true,
  },
  {
    id: 6,
    title: "Appointment Confirmation",
    message: "Your appointment with Dr. Michael Chen has been confirmed for March 22, 2024 at 10:30 AM.",
    time: "5 days ago",
    type: "appointment",
    read: true,
    action: "View Appointment",
    actionLink: "/dashboard/appointments",
  },
]

