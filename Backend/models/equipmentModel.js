import mongoose from "mongoose";

async function generateEquipmentId() {
  const lastEquipment = await mongoose
    .model("equipment")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerial = 1;

  if (lastEquipment && lastEquipment.equipmentId) {
    const lastNum = parseInt(lastEquipment.equipmentId.replace("EQ", ""));
    newSerial = lastNum + 1;
  }

  return `EQ${newSerial.toString().padStart(4, "0")}`;
}

const equipmentSchema = new mongoose.Schema(
  {
    equipmentId: { type: String, unique: true },

    basicInfo: {
      equipmentName: { type: String, required: true },
      serialNumber: { type: String, required: true, unique: true },
      modelName: { type: String, required: true },
      manufacturer: { type: String, required: true },
      category: { type: String, required: true },
      department: { type: String, required: true },
      location: { type: String, required: true },
      equipmentStatus: { 
        type: String, 
        required: true, 
        enum: ["Working", "Under Maintenance", "Offline", "Disposed"],
        default: "Working"
      },
    },

    technicalSpecifications: {
      fieldStrength: { type: String, default: "" },
      boreSize: { type: String, default: "" },
      maxGradient: { type: String, default: "" },
      slewRate: { type: String, default: "" },
      powerRequirement: { type: String, default: "" },
    },

    serviceSchedule: {
      lastService: { type: String, default: "" },
      nextService: { type: String, default: "" },
    },

    purchaseInfo: {
      installationDate: { type: String, default: "" },
      purchaseCost: { type: String, default: "" },
      warrantyPeriod: { type: String, default: "" },
      warrantyExpiry: { type: String, default: "" },
    },

    supplier: {
      supplierName: { type: String, required: true },
      contactNumber: { type: String, default: "" },
      emailId: { type: String, default: "" },
    },

    description: { type: String, default: "" },
    equipmentImage: { type: String, default: "" },
    equipmentImageName: { type: String, default: "" }

  },
  { timestamps: true }
);

equipmentSchema.pre("save", async function () {
  if (!this.equipmentId) {
    this.equipmentId = await generateEquipmentId();
  }
});

const equipmentModel =
  mongoose.models.equipment || mongoose.model("equipment", equipmentSchema);

export default equipmentModel;