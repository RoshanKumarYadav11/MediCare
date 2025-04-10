"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "react-hot-toast"
import * as messageService from "../services/messageService"

export const useMessages = () => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [attachment, setAttachment] = useState(null)
  const [messageContent, setMessageContent] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)
  const [conversationFiles, setConversationFiles] = useState([])

  // Store current user ID in state to ensure it's available
  const [currentUserId] = useState(() => localStorage.getItem("userId"))
  const [currentUserRole] = useState(() => localStorage.getItem("userRole"))

  // Ensure user ID is stored in localStorage
  useEffect(() => {
    // If userId is not in localStorage but we have it in state, store it
    if (!localStorage.getItem("userId") && currentUserId) {
      localStorage.setItem("userId", currentUserId)
    }

    // If userRole is not in state but we have it in localStorage, store it
    if (!currentUserRole && localStorage.getItem("userRole")) {
      localStorage.setItem("userRole", localStorage.getItem("userRole"))
    }
  }, [currentUserId, currentUserRole])

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    setLoading(true)
    try {
      const data = await messageService.getConversations()
      setConversations(data)
      setError(null)

      // If there's an active conversation, update its unread count
      if (activeConversation) {
        const updatedConversation = data.find((c) => c._id === activeConversation)
        if (updatedConversation && updatedConversation.unreadCount > 0) {
          fetchMessages(activeConversation)
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err)
      setError("Failed to load conversations")
      toast.error("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }, [activeConversation])

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId) => {
    setLoading(true)
    try {
      const data = await messageService.getMessages(conversationId)
      setMessages(data)
      setActiveConversation(conversationId)
      setError(null)

      // Update the unread count in the conversations list
      setConversations((prev) => prev.map((conv) => (conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv)))

      // Mark messages as read
      await messageService.markMessagesAsRead(conversationId)
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages")
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch files for a specific conversation
  const fetchConversationFiles = useCallback(async (conversationId) => {
    setLoading(true)
    try {
      const data = await messageService.getConversationFiles(conversationId)
      setConversationFiles(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching conversation files:", err)
      setError("Failed to load files")
      toast.error("Failed to load files")
    } finally {
      setLoading(false)
    }
  }, [])

  // Send a new message
  const sendNewMessage = useCallback(
    async (recipientId, recipientRole, content, file = null) => {
      setSendingMessage(true)
      try {
        console.log("Sending new message:", { recipientId, recipientRole, content, hasFile: !!file })

        const message = await messageService.sendMessage(recipientId, recipientRole, content, file)
        console.log("Message sent successfully:", message)

        // If we're in an active conversation, add the new message to the messages list
        if (activeConversation) {
          // Add the new message to the messages state immediately
          setMessages((prev) => [...prev, message])

          // If the message has an attachment, update the files list
          if (message.attachment) {
            setConversationFiles((prev) => [...prev, message])
          }

          // Refresh conversations to update last message
          await fetchConversations()
        } else {
          // If this is a new conversation, refresh conversations
          await fetchConversations()

          // Find the new conversation with this recipient
          const newConversation = conversations.find(
            (c) =>
              c.participant._id === recipientId && c.participant.role.toLowerCase() === recipientRole.toLowerCase(),
          )

          if (newConversation) {
            fetchMessages(newConversation._id)
          }
        }

        setMessageContent("")
        setAttachment(null)
        setError(null)
        toast.success("Message sent successfully")
        return true
      } catch (err) {
        console.error("Error sending message:", err)
        setError("Failed to send message")
        toast.error(err.message || "Failed to send message")
        return false
      } finally {
        setSendingMessage(false)
      }
    },
    [activeConversation, fetchConversations, fetchMessages, conversations],
  )

  // Fetch users for new conversations
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await messageService.getUsers()
      setUsers(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users")
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle file selection
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) {
      // Check if file is a PDF
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed")
        return
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB")
        return
      }

      setAttachment(file)
      toast.success("File attached successfully")
    }
  }, [])

  // Clear attachment
  const clearAttachment = useCallback(() => {
    setAttachment(null)
  }, [])

  // Set up polling for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        fetchConversations()

        // If there's an active conversation, also fetch its messages
        if (activeConversation) {
          fetchMessages(activeConversation)
        }
      }
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(interval)
  }, [fetchConversations, fetchMessages, loading, activeConversation])

  // Initial fetch
  useEffect(() => {
    fetchConversations()
    fetchUsers()
  }, [fetchConversations, fetchUsers])

  return {
    conversations,
    messages,
    activeConversation,
    users,
    loading,
    error,
    attachment,
    messageContent,
    sendingMessage,
    conversationFiles,
    setMessageContent,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    fetchUsers,
    handleFileChange,
    clearAttachment,
    setActiveConversation,
    fetchConversationFiles,
  }
}
