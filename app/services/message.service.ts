import api from "./api"

// Message service
const MessageService = {
  // Send a message
  sendMessage: async (data: { receiverId: string; content: string; attachments?: any[] }) => {
    try {
      const response = await api.post("/messages", data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get conversations
  getConversations: async () => {
    try {
      const response = await api.get("/messages/conversations")
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get messages with a specific user
  getMessages: async (userId: string) => {
    try {
      const response = await api.get(`/messages/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Delete message
  deleteMessage: async (id: string) => {
    try {
      const response = await api.delete(`/messages/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await api.get("/messages/unread")
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default MessageService

