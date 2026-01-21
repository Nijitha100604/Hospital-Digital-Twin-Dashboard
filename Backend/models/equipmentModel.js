import mongoose from "mongoose";

async function generateEquipmentId() {
  const lastEquipment = await mongoose
    .model("equipment")
    .findOne({}, {}, { sort: { createdAt: -1 } });

  let newSerialNumber = 1;

  if (lastEquipment && lastEquipment.equipmentId) {
    const lastIdNumber = parseInt(
      lastEquipment.equipmentId.replace("EQ", "")
    );
    newSerialNumber = lastIdNumber + 1;
  }

  
  return `EQ${newSerialNumber.toString().padStart(4, "0")}`;
}

const equipmentSchema = new mongoose.Schema(
  {
    equipmentId: { type: String, unique: true },

    // Basic Info
    equipmentName: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    modelName: { type: String, required: true },
    manufacturer: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    equipmentStatus: { type: String, default: "Working" },

    // Technical Specifications
    fieldStrength: { type: String, default: "N/A" },
    boreSize: { type: String, default: "N/A" },
    maxGradient: { type: String, default: "N/A" },
    slewRate: { type: String, default: "N/A" },
    powerRequirement: { type: String, default: "" },

    // Service
    lastService: { type: String, default: "" },
    nextService: { type: String, default: "" },

    // Purchase & Warranty
    installationDate: { type: String, required: true },
    purchaseCost: { type: String, required: true },
    warrantyPeriod: { type: String, required: true },
    warrantyExpiry: { type: String, required: true },

    // Supplier
    supplierName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emailId: { type: String, required: true },

    // Additional info
    description: { type: String, default: "" },

    // Image (Base64 string or URL)
    equipmentImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Pre-save ID generator
equipmentSchema.pre("save", async function () {
  if (!this.equipmentId) {
    this.equipmentId = await generateEquipmentId();
  }
  ;
});

const equipmentModel = mongoose.models.equipment || mongoose.model("equipment", equipmentSchema);

export default equipmentModel;
