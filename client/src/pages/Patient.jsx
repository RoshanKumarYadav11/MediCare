"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Home,
  UserCircle,
  CalendarIcon,
  Bell,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { Input, Label, Select } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { usePatient } from "../hooks/usePatient";
import NotificationsPanel from "../components/NotificationsPanel";
import MessagesPanel from "../components/MessagesPanel";
import { toast } from "react-toastify";

const PatientDashboard = () => {
  // const navigate = useNavigate()
  const {
    patientInfo,
    editedInfo,
    isEditing,
    setIsEditing,
    doctors,
    appointments,
    completedAppointments,
    careTeam,
    prescriptions,
    appointmentData,
    availableSlots,
    fetchPatientProfile,
    updateProfile,
    fetchDoctors,
    bookAppointment,
    fetchAppointments,
    fetchCompletedAppointments,
    fetchCareTeam,
    fetchPrescriptions,
    handleInputChange,
  } = usePatient();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showAppointments, setShowAppointments] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

  // Add this near the top of the component, after the useState declarations
  const location = useLocation();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Add this useEffect to handle the payment success notification
  useEffect(() => {
    if (location.state?.paymentSuccess || location.state?.appointmentSuccess) {
      toast.success("Appointment booked successfully!");
      setShowPaymentSuccess(true);
      setActiveTab("Dashboard");

      // Clear the state
      window.history.replaceState({}, document.title);

      // Refresh appointments
      fetchAppointments();
    }
  }, [location.state]);

  useEffect(() => {
    fetchPatientProfile();
    fetchDoctors();
    fetchAppointments();
    fetchCareTeam();
    fetchPrescriptions();
    fetchCompletedAppointments();

    // Store user ID in localStorage for message component
    if (patientInfo?._id) {
      localStorage.setItem("userId", patientInfo._id);
    }
  }, [patientInfo?._id]);

  const navItems = [
    { label: "Dashboard", icon: Home },
    { label: "Profile", icon: UserCircle },
    { label: "Appointment Booking", icon: CalendarIcon },
    { label: "Prescriptions", icon: FileText },
    { label: "Messages", icon: MessageSquare },
    { label: "Notifications", icon: Bell },
    { label: "Settings", icon: Settings },
  ];

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader icon={Calendar}>
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-xs text-gray-500">
              {appointments.length > 0 ? (
                <>
                  {
                    appointments.filter(
                      (app) =>
                        new Date(app.date).toLocaleDateString() ===
                        new Date().toLocaleDateString()
                    ).length
                  }{" "}
                  today, {appointments.length} total
                </>
              ) : (
                "No upcoming appointments"
              )}
            </p>
          </CardContent>
          <CardFooter className="p-2">
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowAppointments(!showAppointments)}>
              {showAppointments ? "Hide" : "View"} Today&apos;s Appointments
            </Button>
          </CardFooter>
          {showAppointments && (
            <div className="px-4 pb-4">
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {/* Group appointments by date */}
                  {Array.from(
                    appointments.reduce((groups, appointment) => {
                      const date = new Date(
                        appointment.date
                      ).toLocaleDateString();
                      if (!groups.has(date)) groups.set(date, []);
                      groups.get(date).push(appointment);
                      return groups;
                    }, new Map())
                  ).map(([date, dateAppointments]) => (
                    <div key={date} className="border-t pt-2">
                      <h4 className="text-sm font-medium text-blue-600 mb-2">
                        {new Date().toLocaleDateString() === date
                          ? "Today"
                          : date}
                      </h4>
                      {dateAppointments.map((appointment, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="text-sm font-medium">
                              Dr. {appointment.doctorId?.firstName}{" "}
                              {appointment.doctorId?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment.reason}
                            </p>
                          </div>
                          <p className="text-sm">{appointment.time}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming appointments scheduled
                </p>
              )}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader icon={FileText}>
            <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-gray-500">Active prescriptions</p>
          </CardContent>
          <CardFooter className="p-2">
            <Button
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
              onClick={() => setShowPrescriptions(!showPrescriptions)}>
              {showPrescriptions ? "Hide" : "View All"} Prescriptions
            </Button>
          </CardFooter>
          {showPrescriptions && (
            <div className="px-4 pb-4">
              {prescriptions.map((prescription, index) => (
                <div key={index} className="py-2 border-t">
                  <p className="text-sm font-medium">
                    {prescription.medication}
                  </p>
                  <p className="text-xs text-gray-500">
                    {prescription.dosage} - {prescription.frequency} -{" "}
                    {" (Till - "}
                    {new Date(prescription.tilldate).toLocaleDateString()}
                    {") "}
                  </p>
                  <p className="text-xs text-gray-500">
                    Prescribed by: Dr. {prescription.doctorId?.firstName}{" "}
                    {prescription.doctorId?.lastName}
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
                <li
                  key={appointment._id || index}
                  className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>
                    {appointment.status === "completed"
                      ? "Completed"
                      : "Cancelled"}{" "}
                    appointment with{" "}
                    <strong>
                      {appointment.doctorId?.firstName}{" "}
                      {appointment.doctorId?.lastName}
                    </strong>{" "}
                    on {new Date(appointment.date).toLocaleDateString()} at{" "}
                    {appointment.time}
                  </span>
                </li>
              ))}

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
            <CardTitle>Your Care Team</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {careTeam.map((member, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>
                    Dr. {member.firstName} {member.lastName} -{" "}
                    {member.specialty}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderProfile = () => {
    const handleSave = async () => {
      await updateProfile();
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={
                    isEditing ? editedInfo.firstName : patientInfo?.firstName
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={
                    isEditing ? editedInfo.lastName : patientInfo?.lastName
                  }
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
                value={isEditing ? editedInfo.email : patientInfo?.email}
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
    );
  };

  const renderAppointmentBooking = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      await bookAppointment();
    };

    // Get the selected doctor to display appointment fee
    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === appointmentData.doctorId
    );
    const appointmentFee = selectedDoctor ? selectedDoctor.appointmentFee : 0;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Select Doctor</Label>
              <Select
                id="doctorId"
                name="doctorId"
                value={appointmentData.doctorId}
                onChange={handleInputChange}>
                <option value="">Choose a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} -{" "}
                    {doctor.specialty} (Appointment Fee Nrs.{" "}
                    {doctor.appointmentFee})
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Appointment Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={appointmentData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time</Label>
              <Select
                id="time"
                name="time"
                value={appointmentData.time}
                onChange={handleInputChange}
                disabled={availableSlots.length === 0}>
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

            {/* Display appointment fee information */}
            {appointmentFee > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Appointment Fee:</strong> Rs. {appointmentFee}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  You will be redirected to the payment gateway after clicking
                  the Book Appointment button.
                </p>
              </div>
            )}

            <Button type="submit" className="ml-auto">
              Book Appointment
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderPrescriptions = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No prescriptions found
            </p>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{prescription.medication}</h3>
                      <p className="text-sm text-gray-600">
                        {prescription.dosage} - {prescription.frequency}
                      </p>
                      <p className="text-sm text-gray-600">
                        Valid until:{" "}
                        {new Date(prescription.tilldate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Prescribed by: Dr. {prescription.doctorId?.firstName}{" "}
                        {prescription.doctorId?.lastName}
                      </p>
                      {prescription.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {prescription.notes}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMessages = () => {
    return <MessagesPanel />;
  };

  const renderNotifications = () => {
    return <NotificationsPanel />;
  };

  const renderSettings = () => {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Account settings and preferences will be available here.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout
      title={`Welcome, ${patientInfo?.firstName} ${patientInfo?.lastName}`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}>
      {activeTab === "Dashboard" && renderDashboard()}
      {activeTab === "Profile" && renderProfile()}
      {activeTab === "Appointment Booking" && renderAppointmentBooking()}
      {activeTab === "Prescriptions" && renderPrescriptions()}
      {activeTab === "Messages" && renderMessages()}
      {activeTab === "Notifications" && renderNotifications()}
      {activeTab === "Settings" && renderSettings()}
    </DashboardLayout>
  );
};

export default PatientDashboard;
