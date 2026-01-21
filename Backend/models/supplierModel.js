import mongoose from "mongoose";

// Auto-generate Supplier ID (SUP001, SUP002...)
async function generateSupplierId() {
  const lastSupplier = await mongoose
    .model("supplier")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerialNumber = 1;

  if (lastSupplier && lastSupplier.supplierId) {
    const lastIdNumber = parseInt(
      lastSupplier.supplierId.replace("SUP", "")
    );
    newSerialNumber = lastIdNumber + 1;
  }

  return `SUP${newSerialNumber.toString().padStart(3, "0")}`;
}

const supplierSchema = new mongoose.Schema(
  {
    supplierId: { type: String, unique: true },

    supplierName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },

    // Address (nested object)
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },

    category: { type: String, required: true }, // Medicine Distributor / Medical Equipment
    paymentTerms: { type: String, default: "" }, // 30 Days / Advance
    creditLimit: { type: Number, default: 0 },

    bankDetails: {
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifsc: { type: String, required: true },
    },

    itemsSupplied: { type: [String], default: [] }, // List of product names
    totalSupplies: { type: Number, default: 0 },

    rating: { type: Number, default: 0 },
    status: { type: String, default: "Active" }, // Active / Inactive
  },
  { timestamps: true }
);

// Auto-generate Supplier ID before saving
supplierSchema.pre("save", async function () {
  if (!this.supplierId) {
    this.supplierId = await generateSupplierId();
  };
});

const supplierModel =
  mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default supplierModel;
