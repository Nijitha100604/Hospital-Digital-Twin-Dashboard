import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    

    medicineId: { type: String, required: true },
    medicineName: { type: String, required: true },
    strength: { type: String, default: "" },
    
    supplierId: { type: String, default: "" }, 
    supplierName: { type: String, required: true },
    
    
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    taxPercent: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
 
    orderDate: { type: String, default: "" }, 
    expectedDelivery: { type: String, default: "" },
    receivedDate: { type: String, default: "" },
    
    status: { 
        type: String, 
        default: "Requested", 
        enum: ["Requested", "Ordered", "Received", "Cancelled"] 
    },
    
    stockUpdated: { type: Boolean, default: false }, // Prevents double counting
    createdBy: { type: String, default: "Admin" },
    notes: { type: String, default: "" }

}, { timestamps: true });

// Auto-generate Order ID (PO-YYYYMMDD-001)
purchaseSchema.pre("save", async function () {
    if (!this.orderId) {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ""); // 20251025
        
        const lastOrder = await mongoose.model("purchase").findOne(
            { orderId: { $regex: `^PO-${dateStr}` } },
            {},
            { sort: { createdAt: -1 } }
        );

        let nextNum = 1;
        if (lastOrder && lastOrder.orderId) {
            const parts = lastOrder.orderId.split("-");
            nextNum = parseInt(parts[2]) + 1;
        }

        this.orderId = `PO-${dateStr}-${nextNum.toString().padStart(3, "0")}`;
    }
});

const purchaseModel = mongoose.models.purchase || mongoose.model("purchase", purchaseSchema);
export default purchaseModel;