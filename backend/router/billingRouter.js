import express from "express";
import { createInvoice, getInvoices, getInvoiceById, deleteInvoice } from "../controller/billingController.js";

const router = express.Router();

router.post("/create", createInvoice);
router.get("/get", getInvoices);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);

export default router;
