import apiRequest from "./api"

export const getPatientProfile = () => {
  return apiRequest("/patient/profile")
}

export const updatePatientProfile = (profileData) => {
  return apiRequest("/patient/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

export const getAllDoctors = () => {
  return apiRequest("/doctor/all")
}

export const getAvailableSlots = (doctorId, date) => {
  return apiRequest(`/patient/available-slots?doctorId=${doctorId}&date=${date}`)
}

export const bookAppointment = (appointmentData) => {
  return apiRequest("/patient/book-appointment", {
    method: "POST",
    body: JSON.stringify(appointmentData),
  })
}

export const getPatientAppointments = () => {
  return apiRequest("/patient/appointments")
}

export const getCompletedAppointments = () => {
  return apiRequest("/patient/appointment/completed-cancelled")
}

export const getCareTeam = () => {
  return apiRequest("/patient/care-team")
}

export const getPrescriptions = () => {
  return apiRequest("/patient/prescriptions")
}

