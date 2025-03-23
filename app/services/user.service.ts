import api from "./api"

// User service
const UserService = {
  // Get all users (admin only)
  getAllUsers: async (params?: any) => {
    try {
      const response = await api.get("/users", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get user by ID
  getUserById: async (id: string) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update user
  updateUser: async (id: string, data: any) => {
    try {
      const response = await api.put(`/users/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Change password
  changePassword: async (id: string, data: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await api.post(`/users/${id}/change-password`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default UserService

