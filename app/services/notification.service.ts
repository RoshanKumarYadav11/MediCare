import api from "./api"

// Notification service
const NotificationService = {
  // Get all notifications
  getNotifications: async (params?: any) => {
    try {
      const response = await api.get("/notifications", { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch("/notifications/mark-all-read")
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    try {
      const response = await api.delete(`/notifications/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await api.get("/notifications/unread")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default NotificationService

