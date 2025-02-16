import Invoice from "../models/billingSchema.js";

// Create a new invoice
export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, patient, services } = req.body;

    const subtotal = services.reduce((acc, curr) => acc + curr.total, 0);
    const tax = (subtotal * 13) / 100;
    const total = subtotal + tax;

    const newInvoice = new Invoice({
      invoiceNumber,
      patient,
      services,
      subtotal,
      tax,
      total,
    });

    await newInvoice.save();
    res.status(201).json({ success: true, invoice: newInvoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json({ success: true, invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
