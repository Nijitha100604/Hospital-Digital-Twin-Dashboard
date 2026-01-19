import mongoose from "mongoose";

// Auto–Generate Increment ID  (M001, M002…)
async function generateMedicineId() {
  const lastRecord = await medicineModel.findOne().sort({ _id: -1 });
  if (!lastRecord) return "MED0001";

  const lastId = lastRecord.medicineId;
  const numeric = parseInt(lastId.substring(3)) + 1;
  return "MED" + numeric.toString().padStart(4, "0");
}

const medicineSchema = new mongoose.Schema({
    medicineId: {
        type: String,
        unique: true,
    },
    medicineName: {
        type: String,
        required: true,
    },
    genericName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    manufacturer: {
        type: String,
        required: true,
    },
    dosageForm: {
        type: String,
        required: true,
    },
    strength: {
        type: String,
        required: true,
    },
    packSize: {
        type: String,
        default: "",
    },
    prescriptionRequired: {
        type: String,
        default: "No",
    },
    batchNumber: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    minimumThreshold: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    storageLocation: {
        type: String,
        default: "",
    },
    storageConditions: {
        type: String,
        default: "",
    },
    supplierName: {
        type: String,
        required: true,
    },
    costPerUnit: {
        type: String,
        required: true,
    },
    sellingPrice: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },

    // Store medicine image as BASE64
    medicineImage: {
        type: String,
        default: "",
    },
});

// Auto-generate ID before saving
medicineSchema.pre("save", async function (next) {
  if (!this.medicineId) {
    this.medicineId = await generateMedicineId();
  }
  next();
});

const medicineModel =
  mongoose.models.medicine || mongoose.model("medicine", medicineSchema);

export default medicineModel;
