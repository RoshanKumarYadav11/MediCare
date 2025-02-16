import express from "express";
import {getAllMessages, sendMessage,} from "../controller/messageController.js";
const router = express.Router();

router.post("/send", sendMessage);
router.get("/getAll", getAllMessages);

export default router;
