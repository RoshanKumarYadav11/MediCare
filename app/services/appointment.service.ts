import api from "./api"

// Types
interface AppointmentData {
  doctorId: string
  date: string
  time: string
  type: string
  reason?: string
}

// Appointment service
const AppointmentService = {
  // Create a new appointment
  createAppointment: async (data: AppointmentData) => {
    try {
      const response = await api.post("/appointments", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get all appointments
  getAppointments: async (params?: any) => {
    try {
      const response = await api.get("/appointments", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get appointment by ID
  getAppointmentById: async (id: string) => {
    try {
      const response = await api.get(`/appointments/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update appointment
  updateAppointment: async (id: string, data: Partial<AppointmentData>) => {
    try {
      const response = await api.put(`/appointments/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Cancel appointment
  cancelAppointment: async (id: string) => {
    try {
      const response = await api.patch(`/appointments/${id}/cancel`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get doctor availability
  getDoctorAvailability: async (doctorId: string, date: string) => {
    try {
      const response = await api.get("/appointments/availability", {
        params: { doctorId, date },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default AppointmentService

