import purchaseModel from "../models/purchaseModel.js";
import medicineModel from "../models/medicineModel.js";

const createOrder = async (req, res) => {
    try {
        const { 
            medicineId, medicineName, strength, 
            supplierName, quantity, unitPrice, 
            totalCost, orderDate, expectedDelivery, 
            notes, status 
        } = req.body;

        if (!medicineId || !quantity || !unitPrice || !supplierName) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        const newOrder = new purchaseModel({
            medicineId,
            medicineName,
            strength,
            supplierName,
            quantity,
            unitPrice,
            totalCost,
            taxAmount: (totalCost - (quantity * unitPrice)).toFixed(2), 
            orderDate,
            expectedDelivery,
            notes,
            status: status || "Requested"
        });

        await newOrder.save();
        res.json({ success: true, message: "Purchase Order Created Successfully!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await purchaseModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const order = await purchaseModel.findOne({ orderId: id });
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        if (order.stockUpdated && req.body.status !== "Received") {

        }

        // Update fields from request body
        const { 
            status, quantity, unitPrice, totalCost, 
            orderDate, expectedDelivery, notes, supplierName 
        } = req.body;

        if (status) order.status = status;
        if (quantity) order.quantity = quantity;
        if (unitPrice) order.unitPrice = unitPrice;
        if (totalCost) order.totalCost = totalCost;
        if (orderDate) order.orderDate = orderDate;
        if (expectedDelivery) order.expectedDelivery = expectedDelivery;
        if (notes) order.notes = notes;
        if (supplierName) order.supplierName = supplierName;

        if (status === "Received" && !order.stockUpdated) {
        
            const medicine = await medicineModel.findOne({ medicineId: order.medicineId });
            
            if (medicine) {
                medicine.quantity += Number(order.quantity);
                medicine.costPerUnit = Number(order.unitPrice); 
                
                await medicine.save();
        
                order.stockUpdated = true;
                order.receivedDate = new Date().toISOString().split('T')[0];
                
            } else {
                return res.json({ success: false, message: "Linked medicine not found in inventory. Cannot update stock." });
            }
        }

        await order.save();
        res.json({ success: true, message: "Order Updated Successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await purchaseModel.findOne({ orderId: id });

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }


        await purchaseModel.deleteOne({ orderId: id });
        res.json({ success: true, message: "Order Deleted Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createOrder, getAllOrders, updateOrder, deleteOrder };