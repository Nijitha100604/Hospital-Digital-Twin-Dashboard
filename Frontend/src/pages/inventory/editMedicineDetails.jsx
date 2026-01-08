import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { medicine_records } from "../../data/medicine";
import {
  FaEdit,
  FaUpload,
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaWarehouse,
  FaTruck,
  FaStickyNote,
  FaImage,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";

const EditMedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const medicine = medicine_records.find((m) => m.medicineId === id);

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-red-600 font-bold bg-slate-50 min-h-screen">
        Medicine not found
      </div>
    );
  }

  /* ---------- State (PRE-FILLED) ---------- */
  const [medicineName, setMedicineName] = useState(medicine.medicineName);
  const [genericName, setGenericName] = useState(medicine.genericName);
  const [category, setCategory] = useState(medicine.category);
  const [manufacturer, setManufacturer] = useState(medicine.manufacturer);
  const [dosageForm, setDosageForm] = useState(medicine.dosageForm);
  const [strength, setStrength] = useState(medicine.strength);
  const [batchNumber, setBatchNumber] = useState(medicine.batchNumber);
  const [quantity, setQuantity] = useState(medicine.quantity);
  const [expiryDate, setExpiryDate] = useState(medicine.expiryDate);
  const [supplierName, setSupplierName] = useState(medicine.supplierName);
  const [costPerUnit, setCostPerUnit] = useState(medicine.costPerUnit);

  const [packSize, setPackSize] = useState(medicine.packSize || "");
  const [prescriptionRequired, setPrescriptionRequired] = useState(
    medicine.prescriptionRequired || "No"
  );
  const [minimumThreshold, setMinimumThreshold] = useState(
    medicine.minimumThreshold || ""
  );
  const [storageLocation, setStorageLocation] = useState(
    medicine.storageLocation || ""
  );
  const [storageConditions, setStorageConditions] = useState(
    medicine.storageConditions || ""
  );
  const [sellingPrice, setSellingPrice] = useState(medicine.sellingPrice || "");
  const [description, setDescription] = useState(medicine.description || "");

  const [imageName, setImageName] = useState(medicine.medicineImage || "");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageName("");
    fileRef.current.value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app: update API / DB here
    toast.success("Medicine details updated successfully");
    navigate(`/medicine-details/${medicine.medicineId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header - Preserved as requested */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaEdit size={24} className="text-gray-500 text-xl" />
            <p className="text-gray-800 font-bold text-lg">Edit Medicine</p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Update existing medicine information
          </p>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto cursor-pointer"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Section title="Basic Information" icon={<FaInfoCircle />}>
              <Input
                label="Medicine Name"
                required
                value={medicineName}
                onChange={setMedicineName}
              />
              <Input
                label="Generic Name"
                required
                value={genericName}
                onChange={setGenericName}
              />
              <Select
                label="Category"
                required
                value={category}
                onChange={setCategory}
                options={[
                  "Analgesic",
                  "Antibiotic",
                  "Antidiabetic",
                  "Antacid",
                  "Supplement",
                ]}
              />
              <Input
                label="Manufacturer"
                required
                value={manufacturer}
                onChange={setManufacturer}
              />
              <Select
                label="Dosage Form"
                required
                value={dosageForm}
                onChange={setDosageForm}
                options={[
                  "Tablet",
                  "Capsule",
                  "Injection",
                  "Syrup",
                  "Inhaler",
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Strength"
                  required
                  value={strength}
                  onChange={setStrength}
                />
                <Input
                  label="Pack Size"
                  value={packSize}
                  onChange={setPackSize}
                />
              </div>
              <Select
                label="Prescription Required"
                required
                value={prescriptionRequired}
                onChange={setPrescriptionRequired}
                options={["Yes", "No"]}
              />
            </Section>

            {/* Stock Information */}
            <Section title="Stock Information" icon={<FaWarehouse />}>
              <Input
                label="Batch Number"
                required
                value={batchNumber}
                onChange={setBatchNumber}
              />
              <Input
                label="Quantity"
                type="number"
                required
                value={quantity}
                onChange={setQuantity}
              />
              <Input
                label="Minimum Threshold"
                type="number"
                value={minimumThreshold}
                onChange={setMinimumThreshold}
              />
              <Input
                label="Expiry Date"
                type="date"
                required
                value={expiryDate}
                onChange={setExpiryDate}
              />
              <Input
                label="Storage Location"
                value={storageLocation}
                onChange={setStorageLocation}
              />
              <Input
                label="Storage Conditions"
                value={storageConditions}
                onChange={setStorageConditions}
              />
            </Section>
          </div>

          {/* RIGHT COLUMN: Extras */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FaImage className="text-gray-400" />
                <h3 className="font-bold text-gray-800">Medicine Image</h3>
              </div>
              <div className="p-5">
                <div
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    imageName
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-fuchsia-500 hover:bg-gray-50"
                  }`}
                >
                  {imageName ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <FaImage size={20} />
                      </div>
                      <p className="text-sm font-medium text-green-800 break-all">
                        {imageName}
                      </p>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="mt-3 text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded border border-red-200 shadow-sm"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <FaUpload className="text-3xl text-gray-400 mb-3" />
                      <p className="text-sm font-medium text-gray-700">
                        Click to change
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Supplier & Pricing */}
            <Section title="Supplier & Pricing" icon={<FaTruck />}>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Supplier Name"
                  required
                  value={supplierName}
                  onChange={setSupplierName}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <Input
                  label="Cost Per Unit"
                  required
                  type="number"
                  value={costPerUnit}
                  onChange={setCostPerUnit}
                />
                <Input
                  label="Selling Price"
                  type="number"
                  value={sellingPrice}
                  onChange={setSellingPrice}
                />
              </div>
            </Section>

            {/* Additional Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FaStickyNote className="text-gray-400" />
                <h3 className="font-bold text-gray-800">Description</h3>
              </div>
              <div className="p-5">
                <Textarea
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter detailed description..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <FaTimes /> Cancel
          </button>

          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <FaSave /> Update Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMedicineDetails;

/* ---------- Reusable Components ---------- */

const Section = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Input = ({ label, required, value, onChange, type = "text" }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
    />
  </div>
);

const Select = ({ label, required, value, onChange, options }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
    )}
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
    />
  </div>
);