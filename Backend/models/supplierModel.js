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
    category: { type: String, required: true }, 
    taxId: { type: String, default: "" }, 
    paymentTerms: { type: String, required: true }, 
    creditLimit: { type: Number, default: 0 },

    // Banking Information
    bankDetails: {
      bankName: { type: String, default: "" },
      accountNumber: { type: String, default: "" },
      ifsc: { type: String, default: "" },
    },

    // Supplies and notes
    itemsSupplied: { type: [String], default: [] }, 
    notes: { type: String, default: "" },

    // Status and Rating
    status: { type: String, default: "Active" },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

supplierSchema.pre("save", async function () {
  if (!this.supplierId) {
    this.supplierId = await generateSupplierId();
  };
});

supplierSchema.set('toJSON', { virtuals: true });
supplierSchema.set('toObject', { virtuals: true });

supplierSchema.virtual('totalSupplies').get(function() {
  return this.itemsSupplied ? this.itemsSupplied.length : 0;
});

const supplierModel =
  mongoose.models.supplier || mongoose.model("supplier", supplierSchema);

export default supplierModel;