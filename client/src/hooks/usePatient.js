"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as patientService from "../services/patientService";
import * as paymentService from "../services/paymentService";

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
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  // Modify the bookAppointment function to handle both paid and free appointments
  const bookAppointment = async () => {
    setLoading(true);
    setPaymentProcessing(true);
    try {
      // Find the selected doctor to check appointment fee
      const selectedDoctor = doctors.find(
        (doctor) => doctor._id === appointmentData.doctorId
      );

      if (!selectedDoctor) {
        toast.error("Doctor not found");
        return false;
      }

      // If appointment fee is 0, book directly
      if (selectedDoctor.appointmentFee === 0) {
        const response = await patientService.bookAppointment(appointmentData);

        // Reset form data
        setAppointmentData({
          doctorId: "",
          date: "",
          time: "",
          reason: "",
        });
        setAvailableSlots([]);

        // Navigate to confirmation page with appointment details
        navigate("/appointment-confirmation", {
          state: {
            appointmentDetails: {
              ...response.appointment,
              doctorId: selectedDoctor,
            },
          },
        });

        return true;
      } else {
        // If appointment fee > 0, initiate payment
        const paymentResponse = await paymentService.initiatePayment(
          appointmentData
        );

        if (paymentResponse.success) {
          // Store appointment ID in localStorage for verification after payment
          localStorage.setItem(
            "pendingAppointmentId",
            paymentResponse.appointmentId
          );

          // Redirect to Khalti payment page
          window.location.href = paymentResponse.payment_url;
          return true;
        } else {
          toast.error("Failed to initiate payment");
          return false;
        }
      }
    } catch (error) {
      toast.error("Failed to book appointment.");
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  // This function now simply passes the pidx to the backend for verification
  const verifyPayment = async (pidx, appointmentId) => {
    setLoading(true);
    try {
      console.log("Sending payment verification to backend:", {
        pidx,
        appointmentId,
      });
      const response = await paymentService.verifyPayment(pidx, appointmentId);

      if (response.success) {
        toast.success("Payment successful! Appointment confirmed.");
      } else {
        toast.error(response.message || "Payment verification failed");
      }

      return response;
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed");
      return {
        success: false,
        error: error.message,
        message: "Failed to verify payment with the server",
      };
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentPaymentStatus = async (appointmentId) => {
    setLoading(true);
    try {
      const response = await paymentService.getPaymentStatus(appointmentId);
      return response;
    } catch (error) {
      console.error("Error getting payment status:", error);
      return { success: false, error: error.message };
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
    paymentProcessing,
    fetchPatientProfile,
    updateProfile,
    fetchDoctors,
    fetchAvailableSlots,
    bookAppointment,
    verifyPayment,
    getAppointmentPaymentStatus,
    fetchAppointments,
    fetchCompletedAppointments,
    fetchCareTeam,
    fetchPrescriptions,
    handleInputChange,
  };
};
