"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, Filter, Receipt, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function BillingPage() {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingBills = [
    {
      id: 1,
      service: "General Consultation",
      doctor: "Dr. Sarah Johnson",
      date: "15 Mar 2024",
      amount: 120.0,
      dueDate: "29 Mar 2024",
      status: "Pending",
    },
    {
      id: 2,
      service: "Blood Test",
      doctor: "Dr. Michael Chen",
      date: "10 Mar 2024",
      amount: 85.5,
      dueDate: "24 Mar 2024",
      status: "Pending",
    },
    {
      id: 3,
      service: "X-Ray",
      doctor: "Dr. Emily Rodriguez",
      date: "05 Mar 2024",
      amount: 250.0,
      dueDate: "19 Mar 2024",
      status: "Overdue",
    },
  ]

  const paidBills = [
    {
      id: 4,
      service: "Dental Cleaning",
      doctor: "Dr. Michael Chen",
      date: "28 Feb 2024",
      amount: 150.0,
      paidDate: "28 Feb 2024",
      status: "Paid",
    },
    {
      id: 5,
      service: "Annual Checkup",
      doctor: "Dr. Emily Rodriguez",
      date: "15 Feb 2024",
      amount: 200.0,
      paidDate: "15 Feb 2024",
      status: "Paid",
    },
    {
      id: 6,
      service: "Prescription Refill",
      doctor: "Dr. Sarah Johnson",
      date: "05 Feb 2024",
      amount: 45.0,
      paidDate: "05 Feb 2024",
      status: "Paid",
    },
  ]

  const handlePayment = (bill: any) => {
    setSelectedBill(bill)
    setIsPaymentDialogOpen(true)
  }

  const processPayment = () => {
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsPaymentDialogOpen(false)
      // Here you would update the bill status in a real application
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Payments</h2>
        <p className="text-muted-foreground">Manage your medical bills and payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${pendingBills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Across {pendingBills.length} pending bills</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Payment</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paidBills[0].amount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Paid on {paidBills[0].paidDate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Saved payment methods</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search bills..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pending">Pending Bills</TabsTrigger>
          <TabsTrigger value="paid">Payment History</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} onPayNow={() => handlePayment(bill)} showPayButton={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="paid">
          <div className="grid gap-4">
            {paidBills.map((bill) => (
              <BillCard key={bill.id} bill={bill} showPayButton={false} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
            <DialogDescription>Complete your payment for {selectedBill?.service}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">{selectedBill?.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor:</span>
                <span>{selectedBill?.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{selectedBill?.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-bold">${selectedBill?.amount.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select defaultValue="card1">
                  <SelectTrigger id="payment-method">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card1">Visa ending in 4242</SelectItem>
                    <SelectItem value="card2">Mastercard ending in 5555</SelectItem>
                    <SelectItem value="new">Add new payment method</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Pay $${selectedBill?.amount.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BillCard({ bill, onPayNow, showPayButton }: { bill: any; onPayNow?: () => void; showPayButton: boolean }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{bill.service}</h3>
              <Badge
                variant={bill.status === "Paid" ? "secondary" : bill.status === "Overdue" ? "destructive" : "outline"}
              >
                {bill.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{bill.doctor}</p>
            <p className="text-sm text-muted-foreground">Date: {bill.date}</p>
            {bill.dueDate && <p className="text-sm text-muted-foreground">Due: {bill.dueDate}</p>}
            {bill.paidDate && <p className="text-sm text-muted-foreground">Paid: {bill.paidDate}</p>}
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-right">
              <p className="font-bold text-lg">${bill.amount.toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              {showPayButton && <Button onClick={onPayNow}>Pay Now</Button>}
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

