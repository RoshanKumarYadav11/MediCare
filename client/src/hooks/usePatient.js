import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as patientService from "../services/patientService";

export const usePatient = () => {
  const navigate = useNavigate();
  const [patientInfo, setPatientInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [careTeam, setCareTeam] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatientProfile = async () => {
    setLoading(true);
    try {
      const data = await patientService.getPatientProfile();
      setPatientInfo(data);
      setEditedInfo(data);
    } catch (error) {
      console.error("Error fetching patient profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updatedProfile = await patientService.updatePatientProfile(
        editedInfo
      );
      setPatientInfo(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
      return true;
    } catch (error) {
      toast.error("Failed to update patient profile.");
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    setLoading(true);
    try {
      const slots = await patientService.getAvailableSlots(doctorId, date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    setLoading(true);
    try {
      await patientService.bookAppointment(appointmentData);
      setAppointmentData({
        doctorId: "",
        date: "",
        time: "",
        reason: "",
      });
      setAvailableSlots([]);
      fetchAppointments();
      toast.success("Appointment booked successfully.");
      return true;
    } catch (error) {
      toast.error("Failed to book appointment.");
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await patientService.getPatientAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedAppointments = async () => {
    setLoading(true);
    try {
      const data = await patientService.getCompletedAppointments();
      setCompletedAppointments(data);
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareTeam = async () => {
    setLoading(true);
    try {
      const data = await patientService.getCareTeam();
      setCareTeam(data);
    } catch (error) {
      console.error("Error fetching care team:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await patientService.getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (isEditing) {
      setEditedInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setAppointmentData((prev) => ({ ...prev, [name]: value }));

      if (name === "date" || name === "doctorId") {
        fetchAvailableSlots(appointmentData.doctorId, value);
      }
    }
  };

  return {
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
    loading,
    error,
    fetchPatientProfile,
    updateProfile,
    fetchDoctors,
    fetchAvailableSlots,
    bookAppointment,
    fetchAppointments,
    fetchCompletedAppointments,
    fetchCareTeam,
    fetchPrescriptions,
    handleInputChange,
  };
};
