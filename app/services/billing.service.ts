import api from "./api"

// Billing service
const BillingService = {
  // Get all bills
  getBills: async (params?: any) => {
    try {
      const response = await api.get("/billing", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get bill by ID
  getBillById: async (id: string) => {
    try {
      const response = await api.get(`/billing/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Process payment
  processPayment: async (id: string, data: { paymentMethod: string; transactionId?: string }) => {
    try {
      const response = await api.post(`/billing/${id}/payment`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get billing statistics (admin only)
  getBillingStats: async () => {
    try {
      const response = await api.get("/billing/stats")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default BillingService

