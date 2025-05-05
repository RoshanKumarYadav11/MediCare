import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"
import signupRoutes from "./routes/signup.js"
import loginRoutes from "./routes/login.js"
import adminRoutes from "./routes/admin.js"
import doctorRoutes from "./routes/doctor.js"
import patientRoutes from "./routes/patient.js"
import createAdmin from "./utils/createAdmin.js"
import connectDB from "./configs/dbConnection.js"
import notificationRoutes from "./routes/notification.js"
import messageRoutes from "./routes/messages.js"
import paymentRoutes from "./routes/payment.js"

const __filename = fileURLToPath(import.meta.url  )
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/signup", signupRoutes)
app.use("/api/login", loginRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/doctor", doctorRoutes)
app.use("/api/patient", patientRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/messages", messageRoutes)
app.use ("/api/payment", paymentRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"))
  })
}

// Start server only after DB connection
const startServer = async () => {
  await connectDB()
  createAdmin()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

// Call the startServer function
startServer().catch((err) => {
  console.error("Failed to start server:", err)
  process.exit(1)
})
