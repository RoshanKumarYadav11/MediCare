import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import morgan from "morgan"

// Import routes
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import appointmentRoutes from "./routes/appointment.routes.js"
import doctorRoutes from "./routes/doctor.routes.js"
import medicalRecordRoutes from "./routes/medicalRecord.routes.js"
import prescriptionRoutes from "./routes/prescription.routes.js"
import billingRoutes from "./routes/billing.routes.js"
import messageRoutes from "./routes/message.routes.js"
import notificationRoutes from "./routes/notification.routes.js"

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/medical-records", medicalRecordRoutes)
app.use("/api/prescriptions", prescriptionRoutes)
app.use("/api/billing", billingRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/notifications", notificationRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("Medicare API is running")
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

