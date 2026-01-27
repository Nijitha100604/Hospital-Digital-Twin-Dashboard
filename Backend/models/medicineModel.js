import mongoose from "mongoose";

// Auto-generate Medicine ID (MED0001, MED0002…)
async function generateMedicineId() {
  const lastMedicine = await mongoose
    .model("medicine")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerial = 1;

  if (lastMedicine && lastMedicine.medicineId) {
    const lastNum = parseInt(lastMedicine.medicineId.replace("MED", ""));
    newSerial = lastNum + 1;
  }

  return `MED${newSerial.toString().padStart(4, "0")}`;
}

const medicineSchema = new mongoose.Schema(
  {
    medicineId: { type: String, unique: true },

    // BASIC INFORMATION
    medicineName: { type: String, required: true },
    genericName: { type: String, required: true },
    category: { type: String, required: true }, // Analgesic, Antibiotic...
    manufacturer: { type: String, required: true },
    dosageForm: { type: String, required: true }, // Tablet, Capsule...
    strength: { type: String, required: true },
    packSize: { type: String, default: "" },
    

    // STOCK INFORMATION
    batchNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    minimumThreshold: { type: Number, default: 0 },
    manufacturingDate: { type: String, required: true },
    expiryDate: { type: String, required: true },

    storageLocation: { type: String, default: "" },
    storageConditions: { type: String, default: "" },

    // SUPPLIER & PRICING
    supplierName: { type: String, required: true },
    costPerUnit: { type: String, required: true },
    sellingPrice: { type: String, default: "0" },

    // DESCRIPTION
    description: { type: String, default: "" },

    // IMAGE FILE NAME OR URL
    medicineImageName: { type: String, default: "" }, 
    medicineImage: { type: String, default: "..." }
  },
  { timestamps: true }
);

// Auto-generate ID before saving
medicineSchema.pre("save", async function () {
  if (!this.medicineId) {
    this.medicineId = await generateMedicineId();
  };
});

const medicineModel =
  mongoose.models.medicine || mongoose.model("medicine", medicineSchema);

export default medicineModel;
