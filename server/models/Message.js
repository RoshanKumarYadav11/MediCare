
import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    senderModel: {
      type: String,
      enum: ["User", "Doctor", "Admin"],
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      enum: ["User", "Doctor", "Admin"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachment: {
      filename: String,
      path: String,
      mimetype: String,
      size: Number,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    conversationId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

// Create a compound index for efficient conversation retrieval
messageSchema.index({ conversationId: 1, createdAt: -1 })

const Message = mongoose.model("Message", messageSchema)

export default Message
