import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import * as doctorService from "../services/doctorService";

export const useDoctor = () => {
  const navigate = useNavigate();
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [editedInfo, setEditedInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    patientId: "",
    date: "",
    time: "",
    reason: "",
    prescriptionId: "",
    medication: "",
    dosage: "",
    frequency: "",
    tilldate: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");
  const [existingPrescriptions, setExistingPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctorProfile();
      setDoctorInfo(data);
      setEditedInfo(data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updatedProfile = await doctorService.updateDoctorProfile(
        editedInfo
      );
      setDoctorInfo(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully.");
      return true;
    } catch (error) {
      toast.error("Failed to update profile.");
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientsWithAppointments = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getPatientsWithAppointments();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients with appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getDoctorAppointments();
      const now = new Date();
      // Filter and sort appointments by date and time in ascending order
      const sortedAppointments = data
        .filter(
          (appointment) =>
            new Date(appointment.date) > now ||
            (new Date(appointment.date).toLocaleDateString() ===
              now.toLocaleDateString() &&
              appointment.time >
                now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }))
        )
        .sort(
          (a, b) =>
            new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
        );
      setAppointments(sortedAppointments);
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
      const data = await doctorService.getCompletedAppointments();
      const sortedCompleted = data.sort(
        (a, b) =>
          new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
      );
      setCompletedAppointments(sortedCompleted);
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingAppointments = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getUpcomingAppointments();
      const sortedUpcoming = data.sort(
        (a, b) =>
          new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
      );
      setUpcomingAppointments(sortedUpcoming);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    setLoading(true);
    try {
      await doctorService.updateAppointmentStatus(appointmentId, status);
      fetchAppointments();
      fetchCompletedAppointments();
      toast.success("Appointment status updated.");
      return true;
    } catch (error) {
      toast.error("Failed to update appointment status");
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingPrescriptions = async (patientId) => {
    if (!patientId) return;
    setLoading(true);
    try {
      const prescriptions = await doctorService.getExistingPrescriptions(
        patientId
      );
      setExistingPrescriptions(prescriptions);
    } catch (error) {
      console.error("Error fetching existing prescriptions:", error);
      setExistingPrescriptions([]);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPrescription = (prescription) => {
    setAppointmentData({
      ...appointmentData,
      prescriptionId: prescription._id,
      medication: prescription.medication || "",
      dosage: prescription.dosage || "",
      frequency: prescription.frequency || "",
      tilldate: prescription.tilldate || "",
    });
    setSelectedAction("prescribe-medication");
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      setLoading(true);
      try {
        await doctorService.deletePrescription(prescriptionId);
        fetchExistingPrescriptions(appointmentData.patientId);
        toast.success("Prescription deleted successfully.");
        return true;
      } catch (error) {
        toast.error("Failed to delete prescription.");
        setError(error.message);
        return false;
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitPrescription = async () => {
    setLoading(true);
    try {
      await doctorService.prescribeMedication(
        {
          doctorId: appointmentData.doctorId,
          patientId: appointmentData.patientId,
          medication: appointmentData.medication,
          dosage: appointmentData.dosage,
          frequency: appointmentData.frequency,
          tilldate: appointmentData.tilldate,
        },
        appointmentData.prescriptionId
      );

      setAppointmentData({
        ...appointmentData,
        prescriptionId: "",
        medication: "",
        dosage: "",
        frequency: "",
        tilldate: "",
      });

      fetchExistingPrescriptions(appointmentData.patientId);
      setSelectedAction("");

      toast.success(
        appointmentData.prescriptionId
          ? "Medication updated successfully"
          : "Medication prescribed successfully"
      );

      return true;
    } catch (error) {
      toast.error(
        `Failed to ${
          appointmentData.prescriptionId ? "update" : "prescribe"
        } medication: ${error.message}`
      );
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async () => {
    setLoading(true);
    try {
      await doctorService.scheduleAppointment({
        patientId: appointmentData.patientId,
        date: appointmentData.date,
        time: appointmentData.time,
        reason: appointmentData.reason,
      });

      setAppointmentData({
        patientId: "",
        date: "",
        time: "",
        reason: "",
        prescriptionId: "",
        medication: "",
        dosage: "",
        frequency: "",
        tilldate: "",
      });

      setSelectedAction("");
      fetchAppointments();
      fetchUpcomingAppointments();

      toast.success("Appointment scheduled successfully.");
      return true;
    } catch (error) {
      toast.error(`Failed to schedule appointment: ${error.message}`);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (patientId, date) => {
    if (!patientId || !date) return;
    setLoading(true);
    try {
      const slots = await doctorService.getAvailableSlots(patientId, date);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Failed to fetch available slots");
      setAvailableSlots([]);
      toast.error("Failed to fetch available slots");
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

      if (name === "action") {
        setSelectedAction(value);
      }

      if (name === "patientId") {
        fetchExistingPrescriptions(value);
      }

      if (name === "date" || name === "patientId") {
        fetchAvailableSlots(appointmentData.patientId, value);
      }
    }
  };

  return {
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
    loading,
    error,
    formatDate,
    fetchDoctorProfile,
    updateProfile,
    fetchPatientsWithAppointments,
    fetchAppointments,
    fetchCompletedAppointments,
    fetchUpcomingAppointments,
    handleUpdateStatus,
    fetchExistingPrescriptions,
    handleEditPrescription,
    handleDeletePrescription,
    handleSubmitPrescription,
    handleScheduleAppointment,
    fetchAvailableSlots,
    handleInputChange,
  };
};
