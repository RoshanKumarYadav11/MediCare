"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Filter, Search, Activity, Pill, FlaskRoundIcon as Flask, FileUp } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Medical Records</h2>
          <p className="text-muted-foreground">View and manage your health records</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileUp className="mr-2 h-4 w-4" /> Upload Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Medical Record</DialogTitle>
                <DialogDescription>Upload a new medical record to your profile.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="record-type">Record Type</Label>
                  <Select>
                    <SelectTrigger id="record-type">
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lab">Lab Result</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="report">Medical Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="record-date">Date</Label>
                  <Input id="record-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="record-description">Description</Label>
                  <Input id="record-description" placeholder="Brief description of the record" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="record-file">File</Label>
                  <Input id="record-file" type="file" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search records..." className="pl-8" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lab">Lab Results</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="report">Medical Reports</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-4">
            {allRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lab">
          <div className="grid gap-4">
            {allRecords
              .filter((record) => record.type === "Lab Result")
              .map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions">
          <div className="grid gap-4">
            {allRecords
              .filter((record) => record.type === "Prescription")
              .map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="imaging">
          <div className="grid gap-4">
            {allRecords
              .filter((record) => record.type === "Imaging")
              .map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4">
            {allRecords
              .filter((record) => record.type === "Medical Report")
              .map((record) => (
                <RecordCard key={record.id} record={record} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function RecordCard({ record }: { record: any }) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "Lab Result":
        return <Flask className="h-5 w-5 text-blue-500" />
      case "Prescription":
        return <Pill className="h-5 w-5 text-green-500" />
      case "Imaging":
        return <Activity className="h-5 w-5 text-purple-500" />
      case "Medical Report":
        return <FileText className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-muted p-3 rounded-full">{getIcon(record.type)}</div>
              <div>
                <h3 className="font-semibold text-lg">{record.title}</h3>
                <p className="text-sm text-muted-foreground">{record.doctor}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{record.type}</Badge>
                  <span className="text-sm text-muted-foreground">{record.date}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">View</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{record.title}</DialogTitle>
                    <DialogDescription>
                      {record.type} - {record.date}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] mt-4 p-4 border rounded-md">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Details</h4>
                        <p className="text-sm mt-1">{record.description}</p>
                      </div>

                      {record.type === "Lab Result" && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Test Results</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between p-2 border rounded">
                              <span className="text-muted-foreground">Hemoglobin</span>
                              <span>14.2 g/dL</span>
                            </div>
                            <div className="flex justify-between p-2 border rounded">
                              <span className="text-muted-foreground">White Blood Cells</span>
                              <span>7.5 K/uL</span>
                            </div>
                            <div className="flex justify-between p-2 border rounded">
                              <span className="text-muted-foreground">Platelets</span>
                              <span>250 K/uL</span>
                            </div>
                            <div className="flex justify-between p-2 border rounded">
                              <span className="text-muted-foreground">Glucose</span>
                              <span>95 mg/dL</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {record.type === "Prescription" && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Medication Details</h4>
                          <div className="p-3 border rounded">
                            <p className="font-medium">{record.medication}</p>
                            <p className="text-sm text-muted-foreground">{record.dosage}</p>
                            <p className="text-sm mt-2">{record.instructions}</p>
                          </div>
                        </div>
                      )}

                      {record.type === "Imaging" && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Imaging Results</h4>
                          <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                            <p className="text-muted-foreground">Image Preview</p>
                          </div>
                          <p className="text-sm mt-2">{record.findings}</p>
                        </div>
                      )}

                      {record.type === "Medical Report" && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Report Summary</h4>
                          <p className="text-sm">{record.summary}</p>

                          <h4 className="font-medium mt-4">Recommendations</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {record.recommendations.map((rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

const allRecords = [
  {
    id: 1,
    title: "Complete Blood Count",
    type: "Lab Result",
    doctor: "Dr. Sarah Johnson",
    date: "15 Mar 2024",
    description: "Routine blood test to check overall health.",
  },
  {
    id: 2,
    title: "Amoxicillin Prescription",
    type: "Prescription",
    doctor: "Dr. Emily Rodriguez",
    date: "10 Mar 2024",
    description: "Prescription for bacterial infection.",
    medication: "Amoxicillin",
    dosage: "500mg, 3 times daily for 10 days",
    instructions: "Take with food. Complete the full course even if you feel better.",
  },
  {
    id: 3,
    title: "Chest X-Ray",
    type: "Imaging",
    doctor: "Dr. James Wilson",
    date: "05 Mar 2024",
    description: "Chest X-ray to check for pneumonia.",
    findings: "No significant abnormalities detected. Lungs appear clear.",
  },
  {
    id: 4,
    title: "Annual Physical Examination",
    type: "Medical Report",
    doctor: "Dr. Emily Rodriguez",
    date: "28 Feb 2024",
    description: "Comprehensive annual health checkup.",
    summary:
      "Patient is in good overall health. Blood pressure, heart rate, and other vital signs are within normal ranges. No significant health concerns identified.",
    recommendations: [
      "Continue regular exercise routine",
      "Maintain balanced diet",
      "Schedule next annual checkup in February 2025",
      "Consider vitamin D supplementation during winter months",
    ],
  },
  {
    id: 5,
    title: "Lipid Panel",
    type: "Lab Result",
    doctor: "Dr. Sarah Johnson",
    date: "15 Feb 2024",
    description: "Blood test to check cholesterol levels.",
  },
  {
    id: 6,
    title: "Lisinopril Prescription",
    type: "Prescription",
    doctor: "Dr. Sarah Johnson",
    date: "15 Feb 2024",
    description: "Prescription for blood pressure management.",
    medication: "Lisinopril",
    dosage: "10mg, once daily",
    instructions: "Take in the morning. Monitor blood pressure regularly.",
  },
  {
    id: 7,
    title: "MRI Scan - Knee",
    type: "Imaging",
    doctor: "Dr. James Wilson",
    date: "10 Feb 2024",
    description: "MRI scan to evaluate knee pain.",
    findings: "Minor meniscus tear identified in the right knee. No other significant abnormalities.",
  },
  {
    id: 8,
    title: "Specialist Consultation - Orthopedics",
    type: "Medical Report",
    doctor: "Dr. James Wilson",
    date: "05 Feb 2024",
    description: "Consultation for persistent knee pain.",
    summary:
      "Patient presents with right knee pain that has persisted for 3 weeks. Physical examination and MRI results indicate a minor meniscus tear.",
    recommendations: [
      "Physical therapy twice weekly for 6 weeks",
      "Apply ice for 20 minutes when pain increases",
      "Avoid high-impact activities until reassessment",
      "Follow up in 6 weeks to evaluate progress",
    ],
  },
]

