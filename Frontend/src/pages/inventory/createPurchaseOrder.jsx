import React, { useEffect, useState, useMemo, useContext, useRef } from "react";
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
  FaChevronDown
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import { toast } from "react-toastify";
import Loading from "../Loading";

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    medicines, 
    suppliers, 
    purchaseOrders, 
    createPurchaseOrder, 
    updatePurchaseOrder,
    loading 
  } = useContext(MedicineContext);

  const editOrderId = location.state?.orderId || null;
  const initialMedicineId = location.state?.medicineId || "";

  /* ---------- FIND ORDER IF EDIT MODE ---------- */
  const existingOrder = useMemo(
    () => purchaseOrders.find((o) => o.orderId === editOrderId),
    [editOrderId, purchaseOrders]
  );

  /* ---------- STATE ---------- */
  const [medicineId, setMedicineId] = useState(initialMedicineId || "");
  const [medicineDetails, setMedicineDetails] = useState(null);

  const [supplierName, setSupplierName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [status, setStatus] = useState("Requested");

  const [orderDate, setOrderDate] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- INITIALIZATION (Edit Mode) ---------- */
  useEffect(() => {
    if (existingOrder) {
      setMedicineId(existingOrder.medicineId);
      setSupplierName(existingOrder.supplierName);
      setQuantity(existingOrder.quantity);
      setUnitPrice(existingOrder.unitPrice);
      setStatus(existingOrder.status);
      setOrderDate(existingOrder.orderDate || "");
      setExpectedDate(existingOrder.expectedDelivery || "");
      setNotes(existingOrder.notes || "");
    }
  }, [existingOrder]);

  /* ---------- MEDICINE LOOKUP & AUTO-FILL ---------- */
  useEffect(() => {
    if (!medicineId) return;

    const found = medicines.find((m) => m.medicineId === medicineId);
    setMedicineDetails(found || null);

    if (found && !existingOrder) {
      setSupplierName(found.supplierName || ""); 
      setUnitPrice(Number(found.costPerUnit) || 0);
      if (quantity === 0) setQuantity(found.minimumThreshold * 2);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId, medicines, existingOrder]);

  /* ---------- CALCULATIONS ---------- */
  const subtotal = quantity * unitPrice;
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  /* ---------- VALIDATION ---------- */
  const validateForm = () => {
    if (!medicineId || !medicineDetails) {
      toast.error("Please select a valid medicine");
      return false;
    }
    if (!supplierName) {
      toast.error("Supplier is required");
      return false;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return false;
    }
    return true;
  };

  /* ---------- SUBMIT HANDLER ---------- */
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      medicineId: medicineDetails.medicineId,
      medicineName: medicineDetails.medicineName,
      strength: medicineDetails.strength,
      supplierName,
      quantity: Number(quantity),
      unitPrice: Number(unitPrice),
      totalCost: Number(grandTotal.toFixed(2)),
      status,
      orderDate,
      expectedDelivery: expectedDate,
      notes
    };

    let success = false;

    if (existingOrder) {
      success = await updatePurchaseOrder(existingOrder.orderId, payload);
    } else {
      success = await createPurchaseOrder(payload);
    }

    setIsSubmitting(false);

    if (success) {
      navigate("/purchase-order");
    }
  };

  if (loading && !medicines.length) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 shadow-sm gap-4">
        <div className="w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
              <FaShoppingCart className="text-xl" />
            </div>
            <h2 className="font-bold text-lg text-gray-800">
              {existingOrder ? "Update Purchase Order" : "Create Purchase Order"}
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-11">
            {existingOrder
              ? `Editing Order #${existingOrder.orderId}`
              : "Generate a new procurement request"}
          </p>
        </div>

        <div className="w-full md:w-auto flex justify-start md:justify-end">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-auto cursor-pointer"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ORDER FORM */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <p className="font-bold text-lg flex items-center gap-2 text-gray-800">
              <FaBox className="text-fuchsia-700" />
              Order Information
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md whitespace-nowrap cursor-pointer ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              <FaSave />
              {isSubmitting ? "Saving..." : existingOrder ? "Update Order" : "Create Order"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Order ID */}
            <InputGroup label="Order ID" icon={<FaHashtag />}>
              <input
                value={existingOrder?.orderId || "Auto-generated"}
                disabled
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 font-mono text-sm cursor-not-allowed"
              />
            </InputGroup>

            
            <SearchableDropdown 
              label="Select Medicine"
              icon={<FaSearch />}
              options={medicines}
              labelKey="medicineName" 
              valueKey="medicineId"   
              secondaryLabel="strength"
              selectedVal={medicineId}
              handleChange={setMedicineId}
              disabled={!!existingOrder} 
              placeholder="Type to search medicine..."
            />

            <SearchableDropdown 
              label="Supplier"
              icon={<FaTruck />}
              options={suppliers}
              labelKey="supplierName"
              valueKey="supplierName" // Storing Name as per your previous code
              selectedVal={supplierName}
              handleChange={setSupplierName}
              placeholder="Type to search supplier..."
            />

            {/* Status */}
            <InputGroup label="Status" icon={<FaInfoCircle />}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700 cursor-pointer"
              >
                <option value="Requested">Requested</option>
                <option value="Ordered">Ordered</option>
                <option value="Received">Received (Updates Stock)</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </InputGroup>

            {/* Order Date */}
            <InputGroup label="Order Date" icon={<FaCalendarAlt />}>
              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700"
              />
            </InputGroup>

            {/* Expected Delivery */}
            <InputGroup label="Expected Delivery" icon={<FaCalendarAlt />}>
              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700"
              />
            </InputGroup>
          </div>
        </div>

        {/* FINANCIAL DETAILS */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 mb-3 px-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <p className="col-span-2">Medicine ID</p>
            <p className="col-span-4">Medicine Details</p>
            <p className="col-span-2 text-center">Qty</p>
            <p className="col-span-2 text-right">Unit Price</p>
            <p className="col-span-2 text-right">Total</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center mb-8 border-b border-gray-100 pb-6">
            
            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">Medicine ID</label>
              <input disabled value={medicineId || "—"} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm font-mono" />
            </div>

            <div className="col-span-1 lg:col-span-4">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">Name</label>
              <input disabled value={medicineDetails ? `${medicineDetails.medicineName} (${medicineDetails.category})` : "Select a medicine above"} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm" />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(+e.target.value)} className="w-full px-3 py-2.5 text-left lg:text-center rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm font-semibold text-gray-800" />
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">Unit Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <input type="number" min="0" value={unitPrice} onChange={(e) => setUnitPrice(+e.target.value)} className="w-full pl-6 pr-3 py-2.5 text-right rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700" />
              </div>
            </div>

            <div className="col-span-1 lg:col-span-2">
              <label className="lg:hidden text-xs font-bold text-gray-500 uppercase mb-1 block">Total</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <input disabled value={subtotal.toFixed(2)} className="w-full pl-6 pr-3 py-2.5 text-right rounded-lg border border-gray-200 bg-gray-50 text-gray-800 font-bold text-sm" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-2">
            <div className="w-full md:w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Notes / Remarks</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g. Urgent requirement, Cold storage needed..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700 resize-none" />
            </div>

            <div className="w-full md:w-72 bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
              <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span className="font-medium">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-gray-500"><span>Tax (18%)</span><span className="font-medium">₹{tax.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center"><span className="font-bold text-gray-800">Grand Total</span><span className="text-xl font-bold text-fuchsia-800">₹{grandTotal.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- REUSABLE COMPONENTS --- */

const InputGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-1.5 relative">
    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{icon}</div>
      {children}
    </div>
  </div>
);

const SearchableDropdown = ({ 
  label, 
  icon, 
  options, 
  labelKey, 
  valueKey, 
  secondaryLabel, 
  selectedVal, 
  handleChange, 
  disabled, 
  placeholder 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set initial display text based on selected value
  useEffect(() => {
    if (selectedVal && options.length > 0) {
      const selectedItem = options.find(opt => opt[valueKey] === selectedVal);
      if (selectedItem) {
        let display = selectedItem[labelKey];
        if (secondaryLabel && selectedItem[secondaryLabel]) {
          display += ` (${selectedItem[secondaryLabel]})`;
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuery(display);
      }
    } else if (!selectedVal) {
      setQuery("");
    }
  }, [selectedVal, options, labelKey, valueKey, secondaryLabel]);

  // Filter options based on input
  const filteredOptions = options.filter((opt) =>
    opt[labelKey].toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") handleChange(""); // Clear selection if text cleared
          }}
          onClick={() => {
            if (!disabled) setIsOpen(true);
          }}
          disabled={disabled}
          className={`w-full pl-10 pr-8 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm text-gray-700 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        
        {!disabled && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            <FaChevronDown size={10} />
          </div>
        )}

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt[valueKey]}
                  onClick={() => {
                    handleChange(opt[valueKey]);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 cursor-pointer flex justify-between items-center"
                >
                  <span>{opt[labelKey]}</span>
                  {secondaryLabel && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                      {opt[secondaryLabel]}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">No matches found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;