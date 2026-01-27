import React, { useRef, useState, useContext } from "react";
import {
  FaPlusCircle,
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
  FaPills,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";

const AddNewMedicine = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { addMedicine } = useContext(MedicineContext);

  /* ---------- Loading State ---------- */
  const [isLoading, setIsLoading] = useState(false);

  /* ---------- Required Fields ---------- */
  const [medicineName, setMedicineName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strength, setStrength] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  
  // New State for Manufacturing Date
  const [manufacturingDate, setManufacturingDate] = useState(""); 
  const [expiryDate, setExpiryDate] = useState("");
  
  const [supplierName, setSupplierName] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");

  /* ---------- Optional Fields ---------- */
  const [packSize, setPackSize] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState("No");
  const [minimumThreshold, setMinimumThreshold] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [storageConditions, setStorageConditions] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [description, setDescription] = useState("");

  /* ---------- Image ---------- */
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name);
      setImageFile(e.target.files[0]);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageName("");
    fileRef.current.value = null;
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("medicineName", medicineName);
    formData.append("genericName", genericName);
    formData.append("category", category);
    formData.append("manufacturer", manufacturer);
    formData.append("dosageForm", dosageForm);
    formData.append("strength", strength);
    formData.append("packSize", packSize);
    formData.append("prescriptionRequired", prescriptionRequired);
    formData.append("batchNumber", batchNumber);
    formData.append("quantity", quantity);
    formData.append("minimumThreshold", minimumThreshold);
    
    // Append Dates
    formData.append("manufacturingDate", manufacturingDate); // <--- Added
    formData.append("expiryDate", expiryDate);
    
    formData.append("storageLocation", storageLocation);
    formData.append("storageConditions", storageConditions);
    formData.append("supplierName", supplierName);
    formData.append("costPerUnit", costPerUnit);
    formData.append("sellingPrice", sellingPrice);
    formData.append("description", description);

    if (imageFile) {
      formData.append("medicineImage", imageFile);
    }

    const success = await addMedicine(formData);

    if (success) {
      navigate("/medicine-stocks");
    } else {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaPlusCircle size={24} className="text-gray-500 text-xl" />
            <p className="text-gray-800 font-bold text-lg">Add New Medicine</p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Add a new medicine or supply into inventory
          </p>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
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
                  "Antihistamine",
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
                required
                type="number"
                value={quantity}
                onChange={setQuantity}
              />
              <Input
                label="Minimum Threshold"
                type="number"
                value={minimumThreshold}
                onChange={setMinimumThreshold}
              />
              
              {/* --- DATES SECTION --- */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Mfg Date"
                  required
                  type="date"
                  value={manufacturingDate}
                  onChange={setManufacturingDate}
                />
                <Input
                  label="Expiry Date"
                  required
                  type="date"
                  value={expiryDate}
                  onChange={setExpiryDate}
                />
              </div>
              {/* --------------------- */}

              <Input
                label="Storage Location"
                value={storageLocation}
                onChange={setStorageLocation}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Storage Conditions"
                  value={storageConditions}
                  onChange={setStorageConditions}
                />
              </div>
            </Section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Upload Image */}
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
                        <FaPills size={20} />
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
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG (max 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileRef}
                    onChange={handleImageChange}
                    accept=".png,.jpg,.jpeg,.webp"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Supplier & Pricing */}
            <Section title="Supplier & Pricing" icon={<FaTruck />}>
              <Input
                label="Supplier Name"
                required
                value={supplierName}
                onChange={setSupplierName}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Cost Price"
                  required
                  type="number"
                  value={costPerUnit}
                  onChange={setCostPerUnit}
                  prefix="₹"
                />
                <Input
                  label="Selling Price"
                  type="number"
                  value={sellingPrice}
                  onChange={setSellingPrice}
                  prefix="₹"
                />
              </div>
            </Section>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FaStickyNote className="text-gray-400" />
                <h3 className="font-bold text-gray-800">Description</h3>
              </div>
              <div className="p-5">
                <textarea
                  rows={4}
                  value={description}
                  placeholder="Enter detailed description..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <FaTimes /> Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 cursor-pointer bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <FaSave /> Save Medicine
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewMedicine;

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

const Input = ({
  label,
  required,
  value,
  onChange,
  type = "text",
  placeholder,
  prefix,
}) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {prefix && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 text-sm">{prefix}</span>
        </div>
      )}
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${
          prefix ? "pl-7" : "pl-3"
        } pr-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400`}
      />
    </div>
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
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
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