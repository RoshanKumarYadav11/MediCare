// routes/chatRoutes.js
import express from "express";
import { getMessages, sendMessage } from "../controller/chatController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send-message", isAuthenticated, sendMessage);
router.get("/messages/:patientId/:doctorId",isAuthenticated, getMessages);

export default router;
