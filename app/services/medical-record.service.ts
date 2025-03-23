import api from "./api"

// Medical Record service
const MedicalRecordService = {
  // Create a new medical record
  createMedicalRecord: async (data: any) => {
    try {
      const response = await api.post("/medical-records", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get all medical records
  getMedicalRecords: async (params?: any) => {
    try {
      const response = await api.get("/medical-records", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get medical record by ID
  getMedicalRecordById: async (id: string) => {
    try {
      const response = await api.get(`/medical-records/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update medical record
  updateMedicalRecord: async (id: string, data: any) => {
    try {
      const response = await api.put(`/medical-records/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete medical record
  deleteMedicalRecord: async (id: string) => {
    try {
      const response = await api.delete(`/medical-records/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get record types
  getRecordTypes: async () => {
    try {
      const response = await api.get("/medical-records/types")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default MedicalRecordService

