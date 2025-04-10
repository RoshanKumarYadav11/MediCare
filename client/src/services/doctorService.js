import apiRequest from "./api"

export const getDoctorProfile = () => {
  return apiRequest("/doctor/profile")
}

export const updateDoctorProfile = (profileData) => {
  return apiRequest("/doctor/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

export const getPatientsWithAppointments = () => {
  return apiRequest("/doctor/patients-with-appointments")
}

export const getDoctorAppointments = () => {
  return apiRequest("/doctor/appointments")
}

export const getCompletedAppointments = () => {
  return apiRequest("/doctor/appointment/completed")
}

export const getUpcomingAppointments = () => {
  return apiRequest("/doctor/appointments/upcoming")
}

export const updateAppointmentStatus = (appointmentId, status) => {
  return apiRequest(`/doctor/appointment/${appointmentId}/${status}`, {
    method: "PATCH",
    body: JSON.stringify({ appointmentId }),
  })
}

export const getExistingPrescriptions = (patientId) => {
  return apiRequest(`/doctor/prescriptions/${patientId}`)
}

export const prescribeMedication = (prescriptionData, prescriptionId = null) => {
  const endpoint = prescriptionId ? `/doctor/prescriptions/${prescriptionId}` : "/doctor/prescribe-medication"

  const method = prescriptionId ? "PUT" : "POST"

  return apiRequest(endpoint, {
    method,
    body: JSON.stringify(prescriptionData),
  })
}

export const deletePrescription = (prescriptionId) => {
  return apiRequest(`/doctor/prescriptions/${prescriptionId}`, {
    method: "DELETE",
  })
}

export const scheduleAppointment = (appointmentData) => {
  return apiRequest("/doctor/schedule-appointment", {
    method: "POST",
    body: JSON.stringify(appointmentData),
  })
}

export const getAvailableSlots = (patientId, date) => {
  return apiRequest(`/doctor/available-slots?patientId=${patientId}&date=${date}`)
}

