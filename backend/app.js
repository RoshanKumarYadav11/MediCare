import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRouter.js";
import { serverConnection } from "./server.js";

const app = express();
// Should be changed to
config({ path: "./.env" });
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Adjust if needed for the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/user", userRouter);

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
