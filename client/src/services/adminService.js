import apiRequest from "./api"

export const getAdminProfile = () => {
  return apiRequest("/admin/profile")
}

export const updateAdminProfile = (profileData) => {
  return apiRequest("/admin/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  })
}

export const getTotalDoctors = () => {
  return apiRequest("/admin/total-doctors")
}

export const getTotalPatients = () => {
  return apiRequest("/admin/total-patients")
}

export const getDoctorOverview = () => {
  return apiRequest("/admin/doctor-overview")
}

export const getPatientOverview = () => {
  return apiRequest("/admin/patient-overview")
}

export const getCompletedAppointments = () => {
  return apiRequest("/admin/appointment/completed-cancelled")
}

export const getUpcomingAppointments = () => {
  return apiRequest("/admin/appointments/upcoming")
}

export const addDoctor = (doctorData) => {
  return apiRequest("/admin/add-doctor", {
    method: "POST",
    body: JSON.stringify(doctorData),
  })
}

export const addAdmin = (adminData) => {
  return apiRequest("/admin/add-admin", {
    method: "POST",
    body: JSON.stringify(adminData),
  })
}

