"use client"

import { useState, useRef, useEffect } from "react"
import { useMessages } from "../hooks/useMessages"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import Button from "./ui/Button"
import { Input } from "./ui/Input"
import { PaperclipIcon, Send, X, Download, User, UserCircle, Shield, Loader, FileIcon } from "lucide-react"
import { downloadAttachment } from "../services/messageService"
import { toast } from "react-hot-toast"

const MessagesPanel = () => {
  const {
    conversations,
    messages,
    activeConversation,
    users,
    loading,
    error,
    attachment,
    messageContent,
    sendingMessage,
    setMessageContent,
    fetchConversations,
    fetchMessages,
    sendNewMessage,
    fetchUsers,
    handleFileChange,
    clearAttachment,
    setActiveConversation,
    conversationFiles,
    fetchConversationFiles,
  } = useMessages()

  const [showNewMessage, setShowNewMessage] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilesSection, setShowFilesSection] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const messageInputRef = useRef(null)

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem("userId")

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Focus on message input when conversation changes
  useEffect(() => {
    if (activeConversation && messageInputRef.current) {
      messageInputRef.current.focus()
    }
  }, [activeConversation])

  // Fetch files when conversation changes or files section is shown
  useEffect(() => {
    if (activeConversation && showFilesSection) {
      fetchConversationFiles(activeConversation)
    }
  }, [activeConversation, showFilesSection, fetchConversationFiles])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!messageContent.trim() && !attachment) {
      toast.error("Please enter a message or attach a file")
      return
    }

    let recipientId, recipientRole

    if (activeConversation) {
      // Find the active conversation
      const conversation = conversations.find((c) => c._id === activeConversation)
      if (conversation) {
        recipientId = conversation.participant._id
        recipientRole = conversation.participant.role
      }
    } else if (selectedUser) {
      recipientId = selectedUser._id
      recipientRole = selectedUser.role || selectedUser.model.toLowerCase()
    } else {
      toast.error("Please select a recipient")
      return
    }

    const success = await sendNewMessage(recipientId, recipientRole, messageContent, attachment)

    if (success && !activeConversation) {
      setShowNewMessage(false)
      setSelectedUser(null)
      await fetchConversations()
    }
  }

  const handleSelectConversation = (conversationId) => {
    fetchMessages(conversationId)
    setShowNewMessage(false)
    setShowFilesSection(false)
  }

  const handleStartNewMessage = () => {
    setActiveConversation(null)
    setShowNewMessage(true)
    fetchUsers()
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "doctor":
        return <User className="h-4 w-4 text-blue-600" />
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />
      case "patient":
      default:
        return <UserCircle className="h-4 w-4 text-green-600" />
    }
  }

  const toggleFilesSection = () => {
    setShowFilesSection(!showFilesSection)
  }

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) => {
    if (!conversation.participant || !conversation.participant.firstName) return false
    const fullName = `${conversation.participant.firstName} ${conversation.participant.lastName}`.toLowerCase()
    return fullName.includes(searchTerm.toLowerCase())
  })

  // Get conversation name - show the receiver
  const getConversationName = (conversation) => {
    if (!conversation.participant) return "Unknown"
    return `${conversation.participant.firstName} ${conversation.participant.lastName}`
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Messages</CardTitle>
        <Button onClick={handleStartNewMessage} className="flex items-center gap-1">
          New Message
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex h-[calc(100vh-250px)]">
          {/* Conversations List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white z-10 border-b">
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {loading && conversations.length === 0 ? (
              <div className="p-4 text-center">
                <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No conversations yet</div>
            ) : (
              <ul className="divide-y">
                {filteredConversations.map((conversation) => (
                  <li
                    key={conversation._id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${activeConversation === conversation._id ? "bg-blue-50" : ""
                      }`}
                    onClick={() => handleSelectConversation(conversation._id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {conversation.participant && getRoleIcon(conversation.participant.role)}
                        <span className="font-medium">{getConversationName(conversation)}</span>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage && (
                      <p className="text-sm text-gray-500 truncate mt-1">{conversation.lastMessage.content}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{formatDate(conversation.updatedAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Messages or New Message UI */}
          <div className="w-2/3 flex flex-col">
            {showNewMessage ? (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h3 className="font-medium">New Message</h3>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Recipient</label>
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full mb-2"
                    />
                    <div className="max-h-40 overflow-y-auto border rounded-md">
                      {filteredUsers.length === 0 ? (
                        <div className="p-2 text-center text-gray-500">No users found</div>
                      ) : (
                        filteredUsers.map((user) => (
                          <div
                            key={`${user._id}-${user.model}`}
                            className={`p-2 cursor-pointer hover:bg-gray-50 flex items-center gap-2 ${selectedUser && selectedUser._id === user._id ? "bg-blue-50" : ""
                              }`}
                            onClick={() => handleSelectUser(user)}
                          >
                            {getRoleIcon(user.role || user.model.toLowerCase())}
                            <span>
                              {user.firstName} {user.lastName} ({user.role || user.model.toLowerCase()})
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {selectedUser ? (
                    <div className="text-center text-gray-500">
                      Start a conversation with {selectedUser.firstName} {selectedUser.lastName}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">Select a recipient to start a conversation</div>
                  )}
                </div>
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        disabled={!selectedUser || sendingMessage}
                        ref={messageInputRef}
                      />
                    </div>
                    {attachment && (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                        <span className="text-sm truncate flex-1">{attachment.name}</span>
                        <button type="button" onClick={clearAttachment} className="text-red-600 hover:text-red-800">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="application/pdf"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={!selectedUser || sendingMessage}
                        >
                          <PaperclipIcon className="h-4 w-4 mr-1" />
                          Attach PDF
                        </Button>
                      </div>
                      <Button
                        type="submit"
                        disabled={(!messageContent.trim() && !attachment) || !selectedUser || sendingMessage}
                      >
                        {sendingMessage ? (
                          <>
                            <Loader className="h-4 w-4 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : activeConversation ? (
              <div className="flex flex-col h-full">
                {/* Conversation Header */}
                <div className="p-4 border-b">
                  {conversations.find((c) => c._id === activeConversation)?.participant && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(conversations.find((c) => c._id === activeConversation).participant.role)}
                        <h3 className="font-medium">
                          {getConversationName(conversations.find((c) => c._id === activeConversation))}
                        </h3>
                      </div>
                      <Button variant="outline" size="sm" onClick={toggleFilesSection}>
                        <FileIcon className="h-4 w-4 mr-1" />
                        {showFilesSection ? "Hide Files" : "Show Files"}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                {showFilesSection && (
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium mb-2">Shared Files</h4>
                    {loading ? (
                      <div className="text-center py-2">
                        <Loader className="h-4 w-4 animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-1">Loading files...</p>
                      </div>
                    ) : conversationFiles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {conversationFiles.map((file) => (
                          <div
                            key={file._id}
                            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              downloadAttachment(file._id)
                                .then(() => toast.success("File downloaded successfully"))
                                .catch(() => toast.error("Failed to download file"))
                            }}
                          >
                            <FileIcon className="h-4 w-4 text-blue-600" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.attachment.filename}</p>
                              <p className="text-xs text-gray-500">{formatDate(file.createdAt)}</p>
                            </div>
                            <Download className="h-4 w-4 text-gray-500" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2">No files shared in this conversation</p>
                    )}
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  {loading ? (
                    <div className="text-center">
                      <Loader className="h-5 w-5 animate-spin mx-auto mb-2" />
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet</div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => {
                        // Check if the message sender ID matches the current user ID
                        const isCurrentUser = message.sender && message.sender._id === currentUserId
                        return (
                          <div key={message._id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${isCurrentUser ? "bg-green-600 text-white" : "bg-blue-100"
                                }`}
                            >
                              <p>{message.content}</p>
                              {message.attachment && (
                                <div className="mt-2">
                                  <button
                                    onClick={() => {
                                      downloadAttachment(message._id)
                                        .then(() => toast.success("File downloaded successfully"))
                                        .catch(() => toast.error("Failed to download file"))
                                    }}
                                    className={`flex items-center gap-1 text-sm ${isCurrentUser ? "text-green-100" : "text-blue-600"
                                      } cursor-pointer`}
                                  >
                                    <Download className="h-4 w-4" />
                                    {message.attachment.filename}
                                  </button>
                                </div>
                              )}
                              <p className={`text-xs mt-1 ${isCurrentUser ? "text-green-100" : "text-gray-500"}`}>
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        disabled={sendingMessage}
                        ref={messageInputRef}
                      />
                    </div>
                    {attachment && (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                        <span className="text-sm truncate flex-1">{attachment.name}</span>
                        <button type="button" onClick={clearAttachment} className="text-red-600 hover:text-red-800">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="application/pdf"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={sendingMessage}
                        >
                          <PaperclipIcon className="h-4 w-4 mr-1" />
                          Attach PDF
                        </Button>
                      </div>
                      <Button type="submit" disabled={(!messageContent.trim() && !attachment) || sendingMessage}>
                        {sendingMessage ? (
                          <>
                            <Loader className="h-4 w-4 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation or start a new message
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MessagesPanel
