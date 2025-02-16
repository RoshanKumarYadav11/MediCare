import express from "express";
import { getNotifications, markAsRead, sendNotification } from "../controller/notificationController.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.put("/mark-read/:id", markAsRead);
router.post("/send", sendNotification); 

export default router;
