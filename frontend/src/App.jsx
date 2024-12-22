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

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="/dashboard/doctors" element={<Doctors />} />
          <Route path="/dashboard/messages" element={<Message/>} />
          <Route path="/dashboard/adddoctor" element={<AddDoctor/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
