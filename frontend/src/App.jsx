import "./App.css";
import "./index.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Appointment from "./pages/Appointment";
import AboutUs from "./pages/AboutUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Doctors from "./dash/Doctors";
import DashboardLayout from "./dash/DashboardLayout";
import Message from "./dash/Message";
import AddDoctor from "./dash/AddDoctor";
import DashHome from "./dash/DashHome";
import Prescription from "./dash/Prescription";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Unauthorized from "./pages/Unauthorized";
import Availability from "./dash/Availability";
import PatientReports from "./dash/PatientReport";
import Chat from "./dash/Chat";
import AppointmentHistory from "./dash/AppointmentHistory";
import NotificationBell from "./global/NotificationBell";
import Invoice from "./dash/Invoice";
import AddInvoice from "./dash/AddInvoice";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/patientreport" element={<PatientReports />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["Admin", "Doctor", "Patient"]} />
          }
        >
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashHome />} />
            <Route
              path="doctors"
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route index element={<Doctors />} />
            </Route>
            <Route
              path="messages"
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route index element={<Message />} />
            </Route>
            <Route
              path="adddoctor"
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route index element={<AddDoctor />} />
            </Route>
            <Route
              path="prescription"
              element={<ProtectedRoute allowedRoles={["Doctor", "Admin"]} />}
            >
              <Route index element={<Prescription />} />
            </Route>
            <Route
              path="chat"
              element={<ProtectedRoute allowedRoles={["Doctor", "Patient"]} />}
            >
              <Route index element={<Chat />} />
            </Route>

            <Route
              path="availability"
              element={<ProtectedRoute allowedRoles={["Doctor", "Admin"]} />}
            >
              <Route index element={<Availability />} />
            </Route>
            <Route
              path="addinvoice"
              element={<ProtectedRoute allowedRoles={["Admin"]} />}
            >
              <Route index element={<AddInvoice />} />
            </Route>
            <Route path="patientreport" element={<PatientReports />} />
            <Route path="appointmenthistory" element={<AppointmentHistory />} />
            <Route path="notifications" element={<NotificationBell />} />
            <Route path="invoice" element={<Invoice />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
