import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({

    departmentId : { type: String, unique: true },
    departmentName: { type: String, unique: true, required: true },
    departmentType : { type: String, required: true },
    specialityLevel : { type: String, required: true },
    hod: { type: String, required: true },
    floor: { type: String, required: true },
    block : { type: String, required: true },
    status: { type: String, default: "Active" },
    beds:{
        total: { type: Number, required: true },
        general: { type: Number, required: true },
        icu: { type: Number, required: true },
        ot: { type: Number, required: true }
    },
    equipments: { type: [String], default: [] },
    powerbackup: { type: Boolean, default: false },
    fireExtinguisher: { type: Boolean, default: false },
    oxygenSupply: { type: Boolean, default: false }

},  { timestamps: true })

departmentSchema.pre("save", async function() {
  if (!this.departmentId) {
    const lastDept = await mongoose
      .model("department")
      .findOne({}, {}, { sort: { createdAt: -1 } });

    let num = 1;

    if (lastDept?.departmentId) {
      num = parseInt(lastDept.departmentId.replace("DEP-", "")) + 1;
    }

    this.departmentId = `DEP-${num.toString().padStart(5, "0")}`;
  }
});


const departmentModel = mongoose.models.department || mongoose.model('department', departmentSchema);
export default departmentModel;