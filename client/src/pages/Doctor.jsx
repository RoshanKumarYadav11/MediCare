"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Home,
  UserCircle,
  CheckCircle,
  XCircle,
  Bell,
  MessageSquare,
} from "lucide-react"
import DashboardLayout from "../layouts/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card"
import { Input, Label, Select } from "../components/ui/Input"
import Button from "../components/ui/Button"
import { useDoctor } from "../hooks/useDoctor"
import NotificationsPanel from "../components/NotificationsPanel"
import MessagesPanel from "../components/MessagesPanel"

const DoctorDashboard = () => {
  const {
    doctorInfo,
    editedInfo,
    isEditing,
    setIsEditing,
    patients,
    appointments,
    completedAppointments,
    upcomingAppointments,
    appointmentData,
    availableSlots,
    selectedAction,
    existingPrescriptions,
    formatDate,
    fetchDoctorProfile,
    updateProfile,
    fetchPatientsWithAppointments,
    fetchAppointments,
    fetchCompletedAppointments,
    fetchUpcomingAppointments,
    handleUpdateStatus,
    handleEditPrescription,
    handleDeletePrescription,
    handleSubmitPrescription,
    handleScheduleAppointment,
    handleInputChange,
  } = useDoctor()

  const [activeTab, setActiveTab] = useState("Dashboard")
  const [showAppointments, setShowAppointments] = useState(false)
  const [showPatients, setShowPatients] = useState(false)

  useEffect(() => {
    fetchDoctorProfile()
    fetchPatientsWithAppointments()
    fetchAppointments()
    fetchCompletedAppointments()
    fetchUpcomingAppointments()

    // Store user ID in localStorage for message component
    if (doctorInfo?._id) {
      localStorage.setItem("userId", doctorInfo._id)
    }
  }, [doctorInfo?._id])

  const navItems = [
    { label: "Dashboard", icon: Home },
    { label: "Profile", icon: UserCircle },
    { label: "Patient Management", icon: Users },
    { label: "Messages", icon: MessageSquare },
    { label: "Notifications", icon: Bell },
  ]

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Calendar}>
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            {appointments.length > 0 ? (
              <p className="text-xs text-gray-500">
                Next: {appointments[0].patientId.firstName} {appointments[0].patientId.lastName} at{" "}
                {appointments[0].time}
              </p>
            ) : (
              <p className="text-xs text-gray-500">No appointments today</p>
            )}
          </CardContent>
          <CardFooter className="p-2">
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowAppointments(!showAppointments)}
            >
              {showAppointments ? "Hide" : "View"} Today's Appointments
            </Button>
          </CardFooter>
          {showAppointments && (
            <div className="px-4 pb-4">
              {appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-t">
                    <div>
                      <p className="text-sm font-medium">
                        {appointment.patientId.firstName} {appointment.patientId.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{appointment.reason}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-nowrap">{appointment.time}</p>

                      {/* Mark as Completed */}
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, "completed")}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as Completed"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>

                      {/* Cancel Appointment */}
                      <button
                        onClick={() => handleUpdateStatus(appointment._id, "cancelled")}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Appointment"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled for today</p>
              )}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader icon={Users}>
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-gray-500">Total patients under care</p>
          </CardContent>
          <CardFooter className="p-2">
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowPatients(!showPatients)}
            >
              {showPatients ? "Hide" : "View All"} Patients
            </Button>
          </CardFooter>
          {showPatients && (
            <div className="px-4 pb-4">
              {patients.map((patient, index) => (
                <div key={index} className="py-2 border-t">
                  <p className="text-sm font-medium">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString("en-GB") : "N/A"} |
                    Next:{" "}
                    {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString("en-GB") : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {completedAppointments.slice(0, 3).map((appointment, index) => (
                <li key={appointment._id || index} className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>
                    {appointment.status === "completed" ? "Completed" : "Cancelled"} appointment with{" "}
                    <strong>
                      {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                    </strong>{" "}
                    on {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                  </span>
                </li>
              ))}

              {/* Static fallback if no completed appointments */}
              {completedAppointments.length === 0 && (
                <>
                  <li className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">No records found.</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {upcomingAppointments.slice(0, 3).map((appointment, index) => (
                <li key={appointment._id || index} className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>
                    Appointment with{" "}
                    <strong>
                      {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                    </strong>{" "}
                    on {new Date(appointment.date).toLocaleDateString()} at {appointment.time}.{" "}
                    <span className="text-gray-500">{"(" + appointment.reason + ")"}</span>
                  </span>
                </li>
              ))}

              {/* Fallback if there are no upcoming appointments */}
              {upcomingAppointments.length === 0 && (
                <>
                  <li className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">No upcoming schedule.</span>
                  </li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderProfile = () => {
    const handleSave = async () => {
      await updateProfile()
    }

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Doctor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={isEditing ? editedInfo.firstName : doctorInfo?.firstName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo.lastName : doctorInfo?.lastName}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={isEditing ? editedInfo.email : doctorInfo?.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                name="specialty"
                value={isEditing ? editedInfo.specialty : doctorInfo?.specialty}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={isEditing ? editedInfo.licenseNumber : doctorInfo?.licenseNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={isEditing ? editedInfo.phoneNumber : doctorInfo?.phoneNumber}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="ml-auto">
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  const renderPatientManagement = () => {
    const handleSubmit = async (e) => {
      e.preventDefault()
      if (selectedAction === "prescribe-medication") {
        await handleSubmitPrescription()
      } else if (selectedAction === "schedule-appointment") {
        await handleScheduleAppointment()
      }
    }

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Select Patient</Label>
              <Select id="patient" name="patientId" value={appointmentData.patientId} onChange={handleInputChange}>
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select id="action" name="action" value={selectedAction} onChange={handleInputChange}>
                <option value="">Choose an action</option>
                <option value="schedule-appointment">Schedule Appointment</option>
                <option value="prescribe-medication">Prescribe Medication</option>
              </Select>
            </div>
            {selectedAction === "schedule-appointment" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="date">Appointment Date</Label>
                  <Input id="date" name="date" type="date" value={appointmentData.date} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select
                    id="time"
                    name="time"
                    value={appointmentData.time}
                    onChange={handleInputChange}
                    disabled={availableSlots.length === 0}
                  >
                    <option value="">Choose a time slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    name="reason"
                    value={appointmentData.reason}
                    onChange={handleInputChange}
                    placeholder="Brief description of your concern"
                  />
                </div>
              </>
            )}
            {selectedAction === "prescribe-medication" && (
              <>
                {existingPrescriptions.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <Label>Existing Prescriptions</Label>
                    {existingPrescriptions.map((prescription) => (
                      <div key={prescription._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span>
                          {prescription.medication} - {prescription.dosage} - {prescription.frequency} - {" (Till - "}
                          {new Date(prescription.tilldate).toLocaleDateString()}
                          {") "}
                        </span>
                        <div>
                          <Button
                            type="button"
                            onClick={() => handleEditPrescription(prescription)}
                            variant="outline"
                            size="sm"
                            className="mr-2"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeletePrescription(prescription._id)}
                            variant="outline"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication</Label>
                  <Input
                    id="medication"
                    name="medication"
                    value={appointmentData.medication || ""}
                    onChange={handleInputChange}
                    placeholder="Medication name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={appointmentData.dosage || ""}
                    onChange={handleInputChange}
                    placeholder="Dosage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={appointmentData.frequency || ""}
                    onChange={handleInputChange}
                    placeholder="Frequency"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tilldate">Till Date</Label>
                  <Input
                    id="tilldate"
                    name="tilldate"
                    type="date"
                    value={formatDate(appointmentData.tilldate) || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}
            <Button type="submit" className="ml-auto">
              {selectedAction === "prescribe-medication"
                ? appointmentData.prescriptionId
                  ? "Update Prescription"
                  : "Prescribe Medication"
                : "Schedule Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  const renderMessages = () => {
    return <MessagesPanel />
  }

  const renderNotifications = () => {
    return <NotificationsPanel />
  }

  return (
    <DashboardLayout
      title={`Welcome, Dr. ${doctorInfo?.firstName} ${doctorInfo?.lastName}`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === "Dashboard" && renderDashboard()}
      {activeTab === "Profile" && renderProfile()}
      {activeTab === "Patient Management" && renderPatientManagement()}
      {activeTab === "Messages" && renderMessages()}
      {activeTab === "Notifications" && renderNotifications()}
    </DashboardLayout>
  )
}

export default DoctorDashboard
