import mongoose from "mongoose"

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: String,
      required: [true, "Service description is required"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "cash", "insurance", "bank_transfer", "other"],
    },
    paymentDate: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    items: [
      {
        name: String,
        description: String,
        quantity: Number,
        unitPrice: Number,
        amount: Number,
      },
    ],
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Pre-save hook to generate invoice number
billingSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model("Billing").countDocuments()
    const year = new Date().getFullYear().toString().substr(-2)
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0")
    this.invoiceNumber = `INV-${year}${month}-${(count + 1).toString().padStart(5, "0")}`
  }

  // Calculate total amount if not provided
  if (!this.totalAmount && this.items && this.items.length > 0) {
    const subtotal = this.items.reduce((sum, item) => sum + item.amount, 0)
    this.totalAmount = subtotal + this.tax - this.discount
  }

  next()
})

// Index for efficient queries
billingSchema.index({ patient: 1, date: -1 })
billingSchema.index({ status: 1 })
billingSchema.index({ invoiceNumber: 1 })

const Billing = mongoose.model("Billing", billingSchema)

export default Billing

