import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    patient: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    services: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        rate: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
