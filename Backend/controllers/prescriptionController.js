import prescriptionModel from '../models/prescriptionModel.js';
import medicineModel from '../models/medicineModel.js';

const getPrescriptionQueue = async (req, res) => {
    try {
        const queue = await prescriptionModel.find({}).sort({ createdAt: -1 });

        const queueWithStock = await Promise.all(queue.map(async (rx) => {
            const enrichedMedicines = await Promise.all(rx.medicines.map(async (med) => {
                const stockItem = await medicineModel.findOne({ medicineId: med.medicineId });
                const dailyCount = Array.isArray(med.frequency) ? med.frequency.length : 1;
                const days = parseInt(med.duration) || 1;
                const requiredQty = dailyCount * days;

                return {
                    ...med.toObject(), 
                    quantityNeeded: requiredQty,
                    availableStock: stockItem ? stockItem.quantity : 0,
                    inStock: stockItem ? stockItem.quantity >= requiredQty : false
                };
            }));

            return {
                ...rx.toObject(),
                medicines: enrichedMedicines
            };
        }));

        res.json({ success: true, data: queueWithStock });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const dispensePrescription = async (req, res) => {
    try {
        const { prescriptionId, items, remarks, status } = req.body; 

        if (!prescriptionId) {
            return res.json({ success: false, message: "Missing Data" });
        }

        const finalStatus = status || 'Dispensed';

        if (finalStatus === 'Dispensed' && items && items.length > 0) {
            const updateOperations = items.map(item => ({
                updateOne: {
                    filter: { medicineId: item.medicineId },
                    update: { $inc: { quantity: -item.quantityToDeduct } }
                }
            }));

            if (updateOperations.length > 0) {
                await medicineModel.bulkWrite(updateOperations);
            }
        }

        await prescriptionModel.findOneAndUpdate(
            { prescriptionId }, 
            { 
                status: finalStatus, 
                dispensedBy: 'Pharmacist', 
                remarks: remarks || ""
            }
        );

        res.json({ success: true, message: `Prescription ${finalStatus} successfully!` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getPrescriptionQueue, dispensePrescription };