import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRouter.js";
import messageRouter from "./router/messageRouter.js";
import appointmentRouter from "./router/appointmentsRouter.js";
import { serverConnection } from "./server.js";
import chatRouter from "./router/chatRouter.js";
import notificationRouter from "./router/notificationRouter.js";
import prescriptionRouter from "./router/prescriptionRouter.js";
import billingRouter from "./router/billingRouter.js";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/appointment", appointmentRouter);
app.use('/api/v1/chat', chatRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/prescriptions", prescriptionRouter);
app.use("/api/v1/billing", billingRouter);

// Error handling middleware
app.use(errorMiddleware);

// Initialize the app only after the database connection is established
dbConnection()
  .then(() => {
    console.log("Database connected successfully");
    serverConnection();
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit with failure if the database connection fails
  });

export default app;
