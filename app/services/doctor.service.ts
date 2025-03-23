import api from "./api"

// Doctor service
const DoctorService = {
  // Get all doctors
  getAllDoctors: async (params?: any) => {
    try {
      const response = await api.get("/doctors", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get doctor by ID
  getDoctorById: async (id: string) => {
    try {
      const response = await api.get(`/doctors/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Create doctor profile
  createDoctorProfile: async (data: any) => {
    try {
      const response = await api.post("/doctors", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update doctor profile
  updateDoctorProfile: async (id: string, data: any) => {
    try {
      const response = await api.put(`/doctors/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Add doctor review
  addDoctorReview: async (id: string, data: { rating: number; comment?: string }) => {
    try {
      const response = await api.post(`/doctors/${id}/reviews`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get doctor specializations
  getDoctorSpecializations: async () => {
    try {
      const response = await api.get("/doctors/specializations")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default DoctorService

