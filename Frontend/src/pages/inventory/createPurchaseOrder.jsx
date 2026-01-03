import React, { useEffect, useState, useMemo } from "react";
import {
  FaShoppingCart,
  FaBox,
  FaCalendarAlt,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { medicine_records } from "../../data/medicine";
import { supplier_records } from "../../data/supplier";
import { purchase_orders } from "../../data/purchaseOrders";
import { toast } from "react-toastify";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { medicineId } = location.state || {};

  const medicine = useMemo(
    () => medicine_records.find((m) => m.medicineId === medicineId),
    [medicineId]
  );

  /* ---------------- STATE ---------------- */
  const [orderNumber] = useState(`PO-${Date.now()}`);
  const [supplier, setSupplier] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");

  /* ---------------- PREFILL ---------------- */
  useEffect(() => {
    if (medicine) {
      setSupplier(medicine.supplierName);
      setQuantity(Math.max(medicine.minimumThreshold * 2, 1));
    }
  }, [medicine]);

  /* ---------------- ERROR STATE ---------------- */
  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
        <div className="bg-white p-10 rounded-xl border border-red-200 shadow-sm text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            Invalid Selection
          </h3>
          <p className="text-gray-500 mt-2">
            Please select a medicine from the inventory list to create an order.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 text-fuchsia-700 font-medium hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- CALCULATIONS ---------------- */
  const unitPrice = Number(medicine.costPerUnit);
  const subtotal = unitPrice * quantity;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  /* ---------------- CREATE ORDER ---------------- */
  const handleCreateOrder = () => {
    if (!orderDate || !expectedDate) {
      toast.error("Please select order & delivery dates");
      return;
    }

    const newOrder = {
      orderId: orderNumber,
      medicineId: medicine.medicineId,
      medicineName: medicine.medicineName,
      strength: medicine.strength,
      supplierName: supplier,
      quantity,
      unitPrice,
      totalCost: grandTotal.toFixed(2),
      orderDate,
      expectedDelivery: expectedDate,
      status: "Requested",
    };

    purchase_orders.unshift(newOrder);

    toast.success("Purchase Order Created Successfully");

    setTimeout(() => {
      navigate("/purchase-order");
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6 flex justify-between items-center border border-gray-200 shadow-sm">
        <div>
          <div className="flex gap-3 items-center">
            <FaShoppingCart className="text-gray-500 text-xl" />
            <p className="font-bold text-lg text-gray-800">
              Create Purchase Order
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to create a new purchase order
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ORDER INFORMATION SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <FaBox className="text-fuchsia-700" />
              Order Information
            </p>

            <button className="flex items-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
              <FaSave />
              Update Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Order ID
              </label>
              <input
                value={orderNumber}
                disabled
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 font-mono text-sm cursor-not-allowed"
              />
            </div>

            {/* Supplier Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Supplier
              </label>
              <select
                className="w-full p-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all cursor-pointer text-sm"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              >
                <option value="">Select supplier</option>
                {supplier_records
                  .filter((s) => s.status === "Active")
                  .map((s) => (
                    <option key={s.supplierId} value={s.supplierName}>
                      {s.supplierName}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <input
                value="Requested"
                disabled
                className="w-full p-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 font-medium text-sm cursor-not-allowed"
              />
            </div>

            {/* Order Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Order Date
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-gray-700 text-sm"
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>
            </div>

            {/* Expected Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Expected Delivery
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-gray-700 text-sm"
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ORDER ITEMS SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <p className="font-bold text-lg mb-6 text-gray-800">Order Items</p>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
            <p className="col-span-1">Medicine Name</p>
            <p className="col-span-1 text-center">Quantity</p>
            <p className="col-span-1 text-right">Unit Price</p>
            <p className="col-span-1 text-right">Total</p>
            <p className="col-span-1"></p>
          </div>

          {/* Table Row */}
          <div className="grid grid-cols-5 gap-4 items-center mb-8 border-b border-gray-100 pb-6">
            <div className="col-span-1">
              <input
                value={`${medicine.medicineName} ${medicine.strength}`}
                disabled
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 text-sm font-medium"
              />
            </div>

            <div className="col-span-1">
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 text-center rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all font-semibold text-gray-800 text-sm"
              />
            </div>

            <div className="col-span-1 text-right">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  ₹
                </span>
                <input
                  value={unitPrice.toFixed(2)}
                  disabled
                  className="w-full p-2.5 pl-8 text-right rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm"
                />
              </div>
            </div>

            <div className="col-span-1 text-right">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  ₹
                </span>
                <input
                  value={subtotal.toFixed(2)}
                  disabled
                  className="w-full p-2.5 pl-8 text-right rounded-lg border border-gray-200 bg-gray-50 text-gray-800 font-bold text-sm"
                />
              </div>
            </div>
            
            <div className="col-span-1"></div>
          </div>

          {/* TOTAL & ACTIONS */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <button
              onClick={handleCreateOrder}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 active:bg-fuchsia-950 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all font-medium"
            >
              <FaShoppingCart />
              Create Purchase Order
            </button>

            <div className="w-full md:w-64 space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal:</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (18%):</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-bold text-gray-700">Grand Total:</span>
                <span className="text-xl font-bold text-fuchsia-800">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;