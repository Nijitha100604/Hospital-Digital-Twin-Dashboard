import React, { useEffect, useState, useMemo } from "react";
import {
  FaShoppingCart,
  FaBox,
  FaSave,
  FaArrowLeft,
  FaCalendarAlt,
  FaHashtag,
  FaTruck,
  FaInfoCircle,
  FaSearch,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { medicine_records } from "../../data/medicine";
import { supplier_records } from "../../data/supplier";
import { purchase_orders } from "../../data/purchaseOrders";
import { toast } from "react-toastify";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editOrderId = location.state?.orderId || null;
  const initialMedicineId = location.state?.medicineId || "";

  /* ---------- FIND ORDER IF EDIT MODE ---------- */
  const existingOrder = useMemo(
    () => purchase_orders.find((o) => o.orderId === editOrderId),
    [editOrderId]
  );

  /* ---------- STATE ---------- */
  const [orderId] = useState(existingOrder?.orderId || `PO-${Date.now()}`);
  const [medicineId, setMedicineId] = useState(
    existingOrder?.medicineId || initialMedicineId
  );
  const [medicine, setMedicine] = useState(null);

  const [supplier, setSupplier] = useState(existingOrder?.supplierName || "");
  const [quantity, setQuantity] = useState(existingOrder?.quantity || 0);
  const [unitPrice, setUnitPrice] = useState(existingOrder?.unitPrice || 0);
  const [status, setStatus] = useState(existingOrder?.status || "Requested");

  const [orderDate, setOrderDate] = useState(existingOrder?.orderDate || "");
  const [expectedDate, setExpectedDate] = useState(
    existingOrder?.expectedDelivery || ""
  );

  /* ---------- MEDICINE LOOKUP ---------- */
  useEffect(() => {
    const found = medicine_records.find((m) => m.medicineId === medicineId);
    setMedicine(found || null);

    if (found && !existingOrder) {
      setSupplier(found.supplierName);
      setQuantity(found.minimumThreshold * 2);
      setUnitPrice(Number(found.costPerUnit));
    }
  }, [medicineId, existingOrder]);

  /* ---------- CALCULATIONS ---------- */
  const subtotal = quantity * unitPrice;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  /* ---------- VALIDATION ---------- */
  const validateForm = (isUpdate = false) => {
    if (!medicine) {
      toast.error("Invalid Medicine ID");
      return false;
    }

    if (!supplier) {
      toast.error("Supplier is required");
      return false;
    }

    if (quantity <= 0) {
      toast.error("Invalid quantity");
      return false;
    }

    if (unitPrice <= 0) {
      toast.error("Invalid unit price");
      return false;
    }

    // Dates are compulsory ONLY when updating
    if (isUpdate) {
      if (!orderDate || !expectedDate) {
        toast.error("Order date and expected delivery are required");
        return false;
      }
    }

    return true;
  };

  /* ---------- UPDATE EXISTING ORDER ---------- */
  const handleUpdateDetails = () => {
    if (!validateForm(true)) return;

    const index = purchase_orders.findIndex((o) => o.orderId === orderId);
    if (index === -1) return;

    purchase_orders[index] = {
      ...purchase_orders[index],
      supplierName: supplier,
      quantity,
      unitPrice,
      totalCost: grandTotal.toFixed(2),
      orderDate,
      expectedDelivery: expectedDate,
      status,
    };

    toast.success("Purchase Order Updated Successfully");
    navigate("/purchase-order");
  };

  /* ---------- CREATE NEW ORDER ---------- */
  const handleCreateOrder = () => {
    if (!validateForm(false)) return;

    purchase_orders.unshift({
      orderId,
      medicineId: medicine.medicineId,
      medicineName: medicine.medicineName,
      strength: medicine.strength,
      supplierName: supplier,
      quantity,
      unitPrice,
      totalCost: grandTotal.toFixed(2),
      orderDate: orderDate || "", // optional
      expectedDelivery: expectedDate || "", // optional
      status: "Requested",
      stockUpdated: false,
    });

    toast.success("Purchase Order Created Successfully");
    setTimeout(() => navigate("/purchase-order"), 1200);
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 shadow-sm gap-4">
        <div className="w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <div size={24} className="p-2 text-gray-500">
              <FaShoppingCart className="text-xl" />
            </div>
            <h2 className="font-bold text-lg text-gray-800">
              {existingOrder
                ? "Update Purchase Order"
                : "Create Purchase Order"}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {existingOrder
              ? `Editing Order #${orderId}`
              : "Generate a new procurement request"}
          </p>
        </div>

        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-auto cursor-pointer"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ORDER INFORMATION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <p className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <FaBox className="text-fuchsia-700" />
              Order Information
            </p>

            {/* UPDATE DETAILS BUTTON (ALWAYS VISIBLE IN EDIT MODE) */}
            {existingOrder && (
              <button
                onClick={handleUpdateDetails}
                className="flex items-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                <FaSave />
                Update Details
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Order ID */}
            <InputGroup label="Order ID" icon={<FaHashtag />}>
              <input
                value={orderId}
                disabled
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 font-mono text-sm cursor-not-allowed"
              />
            </InputGroup>

            {/* Supplier */}
            <InputGroup label="Supplier" icon={<FaTruck />}>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 appearance-none cursor-pointer"
              >
                <option value="">Select supplier...</option>
                {supplier_records
                  .filter((s) => s.status === "Active")
                  .map((s) => (
                    <option key={s.supplierId}>{s.supplierName}</option>
                  ))}
              </select>
            </InputGroup>

            {/* Status */}
            <InputGroup label="Status" icon={<FaInfoCircle />}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 appearance-none cursor-pointer"
              >
                <option>Requested</option>
                <option>Ordered</option>
                <option>Received</option>
              </select>
            </InputGroup>

            {/* Order Date */}
            <InputGroup label="Order Date" icon={<FaCalendarAlt />}>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700"
              />
            </InputGroup>

            {/* Expected Delivery */}
            <InputGroup label="Expected Delivery" icon={<FaCalendarAlt />}>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700"
              />
            </InputGroup>
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Table Header - Hidden on Mobile, Visible on Large Screens */}
          <div className="hidden lg:grid grid-cols-12 gap-4 mb-3 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <p className="col-span-2">Medicine ID</p>
            <p className="col-span-4">Medicine Name</p>
            <p className="col-span-2 text-center">Qty</p>
            <p className="col-span-2 text-right">Unit Price</p>
            <p className="col-span-2 text-right">Total</p>
          </div>

          {/* Input Form - Stacks on Mobile, Row on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center mb-8 border-b border-gray-100 pb-6">
            {/* Field 1: Search ID */}
            <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">
                Medicine ID
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  value={medicineId}
                  onChange={(e) => setMedicineId(e.target.value.toUpperCase())}
                  placeholder="Search ID"
                  className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700 font-mono"
                />
              </div>
            </div>

            {/* Field 2: Name */}
            <div className="col-span-1 md:col-span-1 lg:col-span-4">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">
                Medicine Name
              </label>
              <input
                disabled
                value={
                  medicine
                    ? `${medicine.medicineName} - ${medicine.strength}`
                    : "Enter valid ID..."
                }
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm italic"
              />
            </div>

            {/* Field 3: Quantity */}
            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
                className="w-full px-3 py-2.5 text-left lg:text-center rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm font-semibold text-gray-800"
              />
            </div>

            {/* Field 4: Unit Price */}
            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">
                Unit Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(+e.target.value)}
                  className="w-full pl-6 pr-3 py-2.5 text-right rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700"
                />
              </div>
            </div>

            {/* Field 5: Total */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">
                Total Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                  ₹
                </span>
                <input
                  disabled
                  value={subtotal.toFixed(2)}
                  className="w-full pl-6 pr-3 py-2.5 text-right rounded-lg border border-gray-200 bg-gray-50 text-gray-800 font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-2">
            {!existingOrder ? (
              <button
                onClick={handleCreateOrder}
                className="w-full md:w-auto flex items-center justify-center gap-2 cursor-pointer bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all font-medium"
              >
                <FaShoppingCart />
                Create Purchase Order
              </button>
            ) : (
              <div /> /* Spacer if in edit mode */
            )}

            <div className="w-full md:w-72 bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (18%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800">Grand Total</span>
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

/* Helper Component for consistent inputs with icons */
const InputGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      {children}
    </div>
  </div>
);

export default CreatePurchaseOrder;
