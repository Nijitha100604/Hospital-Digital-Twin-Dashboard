import mongoose from "mongoose";


async function generateSupplierId() {
  const lastSupplier = await mongoose
    .model("supplier")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerial = 1;

  if (lastSupplier && lastSupplier.supplierId) {
    const lastNum = parseInt(lastSupplier.supplierId.replace("SUP", ""));
    newSerial = lastNum + 1;
  }

  return `SUP${newSerial.toString().padStart(4, "0")}`;
}

const supplierSchema = new mongoose.Schema(
  {
    supplierId: { type: String, unique: true },

    // Basic Information
    supplierName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    // Address
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
      country: { type: String, default: "" },
    },

    // Business Information
    category: { type: String, required: true }, // Pharmaceutical, Medical Equipment...
    taxId: { type: String, default: "" }, // GST or Tax ID
    paymentTerms: { type: String, required: true }, // Immediate, 15 Days...
    creditLimit: { type: Number, default: 0 },

    // Banking Information
    bankDetails: {
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
    },

    // Supplies and notes
    itemsSupplied: { type: [String], default: [] }, // Array of strings
    totalSupplies: { type: Number, default: 0 }, // Can be calculated based on orders later
    notes: { type: String, default: "" },

    // Status and Rating
    status: { type: String, default: "Active" },
    rating: { type: Number, default: 0 },

    // Document
    documentName: { type: String, default: "" },
    documentUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-generate ID before saving
supplierSchema.pre("save", async function () {
  if (!this.supplierId) {
    this.supplierId = await generateSupplierId();
  };
});

const supplierModel =
  mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default supplierModel;