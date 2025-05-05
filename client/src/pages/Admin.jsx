"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Users,
  Home,
  UserCircle,
  Eye,
  EyeOff,
  Stethoscope,
  Activity,
  UserPlus,
  ShieldCheck,
  Bell,
  MessageSquare,
} from "lucide-react";
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
import { useAdmin } from "../hooks/useAdmin";
import AdminNotificationsPanel from "../components/AdminNotificationsPanel";
import MessagesPanel from "../components/MessagesPanel";

const AdminDashboard = () => {
  const {
    adminInfo,
    editedInfo,
    isEditing,
    setIsEditing,
    totalDoctors,
    totalPatients,
    doctorOverview,
    patientOverview,
    completedAppointments,
    upcomingAppointments,
    doctorData,
    adminData,
    fetchAdminProfile,
    updateProfile,
    fetchTotalDoctors,
    fetchTotalPatients,
    fetchDoctorOverview,
    fetchPatientOverview,
    fetchCompletedAppointments,
    fetchUpcomingAppointments,
    addDoctor,
    addAdmin,
    handleInputChange,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [showDoctors, setShowDoctors] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [showDoctorPassword, setShowDoctorPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [hospitalCapacity] = useState(150);

  useEffect(() => {
    fetchAdminProfile();
    fetchTotalDoctors();
    fetchTotalPatients();
    fetchDoctorOverview();
    fetchPatientOverview();
    fetchCompletedAppointments();
    fetchUpcomingAppointments();

    // Store user ID in localStorage for message component
    if (adminInfo?._id) {
      localStorage.setItem("userId", adminInfo._id);
    }
  }, [adminInfo?._id]);

  const navItems = [
    { label: "Dashboard", icon: Home },
    { label: "Profile", icon: UserCircle },
    { label: "Add Doctor", icon: UserPlus },
    { label: "Add Admin", icon: ShieldCheck },
    { label: "Messages", icon: MessageSquare },
    { label: "Notifications", icon: Bell },
  ];

  const renderDashboard = () => {
    const occupancyRate = ((totalPatients / hospitalCapacity) * 100).toFixed(2);
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">
                Total Doctors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDoctors}</div>
              <p className="text-xs text-gray-500">Active medical staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Users}>
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
              <p className="text-xs text-gray-500">Currently admitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader icon={Activity}>
              <CardTitle className="text-sm font-medium">
                Hospital Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyRate}%</div>
              <p className="text-xs text-gray-500">Bed occupancy rate</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader icon={Stethoscope}>
              <CardTitle className="text-sm font-medium">
                Doctor Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorOverview.length}</div>
              <p className="text-xs text-gray-500">Total doctors on staff</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowDoctors(!showDoctors)}>
                {showDoctors ? "Hide" : "View All"} Doctors
              </Button>
            </CardFooter>
            {showDoctors && (
              <div className="px-4 pb-4">
                {doctorOverview.map((doctor, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-t">
                    <div>
                      <p className="text-sm font-medium">{doctor.name}</p>
                      <p className="text-xs text-gray-500">
                        {doctor.specialty}
                      </p>
                    </div>
                    <p className="text-sm">{doctor.patients} patients</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader icon={Users}>
              <CardTitle className="text-sm font-medium">
                Patient Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientOverview.length}</div>
              <p className="text-xs text-gray-500">Total admitted patients</p>
            </CardContent>
            <CardFooter className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors"
                onClick={() => setShowPatients(!showPatients)}>
                {showPatients ? "Hide" : "View All"} Patients
              </Button>
            </CardFooter>
            {showPatients && (
              <div className="px-4 pb-4">
                {patientOverview.map((patient, index) => (
                  <div key={index} className="py-2 border-t">
                    <p className="text-sm font-medium">{patient.name}</p>
                    <p className="text-xs text-gray-500">
                      Total Appointments: {patient.appointments}
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
                      <strong>
                        {appointment.doctorId?.firstName}{" "}
                        {appointment.doctorId?.lastName}
                      </strong>
                      {appointment.status === "completed"
                        ? " completed"
                        : " cancelled"}{" "}
                      appointment with{" "}
                      <strong>
                        {appointment.patientId?.firstName}{" "}
                        {appointment.patientId?.lastName}
                      </strong>{" "}
                      on {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {appointment.time}
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
                  <li
                    key={appointment._id || index}
                    className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>
                      <strong>
                        {appointment.doctorId?.firstName}{" "}
                        {appointment.doctorId?.lastName}
                      </strong>
                      {"'s "}
                      appointment with{" "}
                      <strong>
                        {appointment.patientId?.firstName}{" "}
                        {appointment.patientId?.lastName}
                      </strong>{" "}
                      on {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {appointment.time}.{" "}
                      <span className="text-gray-500">
                        {"(" + appointment.reason + ")"}
                      </span>
                    </span>
                  </li>
                ))}

                {/* Fallback if there are no upcoming appointments */}
                {upcomingAppointments.length === 0 && (
                  <>
                    <li className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">
                        No upcoming schedule.
                      </span>
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </>
    );
  };

  const renderProfile = () => {
    const handleSave = async () => {
      await updateProfile();
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
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
                    isEditing ? editedInfo.firstName : adminInfo?.firstName
                  }
                  onChange={(e) => handleInputChange(e)}
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={isEditing ? editedInfo.lastName : adminInfo?.lastName}
                  onChange={(e) => handleInputChange(e)}
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
                value={isEditing ? editedInfo.email : adminInfo?.email}
                onChange={(e) => handleInputChange(e)}
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

  const renderAddDoctor = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addDoctor();
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Doctor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={doctorData.firstName}
                  onChange={(e) => handleInputChange(e, "doctor")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={doctorData.lastName}
                  onChange={(e) => handleInputChange(e, "doctor")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={doctorData.email}
                onChange={(e) => handleInputChange(e, "doctor")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Select
                id="specialty"
                name="specialty"
                value={doctorData.specialty}
                onChange={(e) => handleInputChange(e, "doctor")}
                required>
                <option value="">Choose a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="oncology">Oncology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="dermatology">Dermatology</option>
                <option value="gastroenterology">Gastroenterology</option>
                <option value="psychiatry">Psychiatry</option>
                <option value="gynecology">Gynecology</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={doctorData.licenseNumber}
                onChange={(e) => handleInputChange(e, "doctor")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentFee">Appointment Fee</Label>
              <Input
                id="appointmentFee"
                name="appointmentFee"
                type="number"
                value={doctorData.appointmentFee}
                onChange={(e) => handleInputChange(e, "doctor")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={doctorData.phoneNumber}
                onChange={(e) => handleInputChange(e, "doctor")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showDoctorPassword ? "text" : "password"}
                  value={doctorData.password}
                  onChange={(e) => handleInputChange(e, "doctor")}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowDoctorPassword(!showDoctorPassword)}>
                  {showDoctorPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showDoctorPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="ml-auto">
              Add Doctor
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderAddAdmin = () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addAdmin();
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={adminData.firstName}
                  onChange={(e) => handleInputChange(e, "admin")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={adminData.lastName}
                  onChange={(e) => handleInputChange(e, "admin")}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={adminData.email}
                onChange={(e) => handleInputChange(e, "admin")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showAdminPassword ? "text" : "password"}
                  value={adminData.password}
                  onChange={(e) => handleInputChange(e, "admin")}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}>
                  {showAdminPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="sr-only">
                    {showAdminPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showAdminPassword ? "text" : "password"}
                  value={adminData.confirmPassword}
                  onChange={(e) => handleInputChange(e, "admin")}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="ml-auto">
              Add Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const renderMessages = () => {
    return <MessagesPanel />;
  };

  const renderNotifications = () => {
    return <AdminNotificationsPanel />;
  };

  return (
    <DashboardLayout
      title={`Welcome, ${
        adminInfo ? `${adminInfo.firstName} ${adminInfo.lastName}` : "Admin"
      }`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}>
      {activeTab === "Dashboard" && renderDashboard()}
      {activeTab === "Profile" && renderProfile()}
      {activeTab === "Add Doctor" && renderAddDoctor()}
      {activeTab === "Add Admin" && renderAddAdmin()}
      {activeTab === "Messages" && renderMessages()}
      {activeTab === "Notifications" && renderNotifications()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
