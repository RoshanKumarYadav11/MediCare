
import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "participants.model",
          required: true,
        },
        model: {
          type: String,
          enum: ["User", "Doctor", "Admin"],
          required: true,
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
)

// Create a compound index for efficient participant lookup
conversationSchema.index({ "participants.id": 1 })

const Conversation = mongoose.model("Conversation", conversationSchema)

export default Conversation
