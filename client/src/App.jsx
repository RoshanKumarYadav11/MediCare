import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import Admin from "./pages/Admin";
import PaymentCallback from "./pages/PaymentCallback";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/patient" element={<Patient />} />
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route
            path="/appointment-confirmation"
            element={<AppointmentConfirmation />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}

export default App;
