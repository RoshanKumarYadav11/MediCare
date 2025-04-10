import apiRequest from "./api"
import { BASE_URL } from "../constants/constants"

export const getConversations = () => {
  return apiRequest("/messages/conversations")
}

export const getMessages = (conversationId) => {
  return apiRequest(`/messages/conversations/${conversationId}`)
}

export const getConversationFiles = (conversationId) => {
  return apiRequest(`/messages/conversations/${conversationId}/files`)
}

export const sendMessage = async (recipientId, recipientRole, content, attachment = null) => {
  try {
    const formData = new FormData()
    formData.append("recipientId", recipientId)
    formData.append("recipientRole", recipientRole)
    formData.append("content", content)

    if (attachment) {
      formData.append("attachment", attachment)
    }

    // Log the form data for debugging
    console.log("Sending message with data:", {
      recipientId,
      recipientRole,
      content,
      hasAttachment: !!attachment,
    })

    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/messages`, {
      method: "POST",
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error sending message:", errorData)
      throw new Error(errorData.error || "Failed to send message")
    }

    return await response.json()
  } catch (error) {
    console.error("Error in sendMessage:", error)
    throw error
  }
}

// Update the downloadAttachment function to handle authenticated downloads properly
export const downloadAttachment = async (messageId) => {
  try {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}/messages/attachments/${messageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to download file")
    }

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    // Get filename from Content-Disposition header if available
    let filename = "download.pdf"
    const contentDisposition = response.headers.get("Content-Disposition")
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    // Create a temporary link and trigger download
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // Clean up
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    return true
  } catch (error) {
    console.error("Error downloading attachment:", error)
    throw error
  }
}

export const getUsers = () => {
  return apiRequest("/messages/users")
}

export const markMessagesAsRead = (conversationId) => {
  return apiRequest(`/messages/conversations/${conversationId}/read`, {
    method: "PATCH",
  })
}
