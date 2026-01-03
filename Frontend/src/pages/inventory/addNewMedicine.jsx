import React, { useRef, useState } from "react";
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
  FaArrowLeft
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddNewMedicine = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  /* ---------- Required Fields ---------- */
  const [medicineName, setMedicineName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strength, setStrength] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const removeImage = () => {
    setImageName("");
    fileRef.current.value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("New medicine data created successfully");
    navigate("/medicine-stocks");
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaPlusCircle size={24} className="text-gray-500 text-xl" />
            <p className="text-gray-800 font-bold text-lg">
              Add New Medicine
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Add a new medicine or supply into inventory
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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-5 space-y-6"
      >
        {/* Basic Information */}
        <Section title="Basic Information" icon={<FaInfoCircle />}>
          <Input
            label="Medicine Name"
            required
            placeholder="e.g. Paracetamol 500mg"
            value={medicineName}
            onChange={setMedicineName}
          />
          <Input
            label="Generic Name"
            required
            placeholder="e.g. Acetaminophen"
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
            placeholder="e.g. PharmaCorp Ltd"
            value={manufacturer}
            onChange={setManufacturer}
          />
          <Select
            label="Dosage Form"
            required
            value={dosageForm}
            onChange={setDosageForm}
            options={["Tablet", "Capsule", "Injection", "Syrup", "Inhaler"]}
          />
          <Input
            label="Strength"
            required
            placeholder="e.g. 500 mg"
            value={strength}
            onChange={setStrength}
          />
          <Input
            label="Pack Size"
            placeholder="e.g. 10 tablets/strip"
            value={packSize}
            onChange={setPackSize}
          />
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
            placeholder="e.g. PC-2024-001"
            value={batchNumber}
            onChange={setBatchNumber}
          />
          <Input
            label="Quantity"
            type="number"
            required
            placeholder="e.g. 150"
            value={quantity}
            onChange={setQuantity}
          />
          <Input
            label="Minimum Threshold"
            type="number"
            placeholder="e.g. 20"
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
            placeholder="e.g. Rack A - Shelf 3"
            value={storageLocation}
            onChange={setStorageLocation}
          />
          <Input
            label="Storage Conditions"
            placeholder="e.g. Store below 25°C"
            value={storageConditions}
            onChange={setStorageConditions}
          />
        </Section>

        {/* Supplier & Pricing */}
        <Section title="Supplier & Pricing Information" icon={<FaTruck />}>
          <Input
            label="Supplier Name"
            required
            placeholder="e.g. HealthPlus Distributors"
            value={supplierName}
            onChange={setSupplierName}
          />
          <Input
            label="Cost Per Unit"
            required
            placeholder="e.g. 2.50"
            value={costPerUnit}
            onChange={setCostPerUnit}
          />
          <Input
            label="Selling Price"
            placeholder="e.g. 4.00"
            value={sellingPrice}
            onChange={setSellingPrice}
          />
        </Section>

        {/* Additional Info */}
        <Section title="Additional Information" icon={<FaStickyNote />}>
          <Textarea
            label="Description"
            placeholder="Add description here"
            value={description}
            onChange={setDescription}
          />
        </Section>

        {/* Upload Image */}
        <div>
          <label className="font-semibold text-sm flex items-center gap-2">
            <FaImage /> Add Medicine Image{" "}
            <span className="text-red-600">*</span>
          </label>

          <div
            onClick={() => fileRef.current.click()}
            className="mt-2 border-2 border-gray-400 border-dashed bg-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-fuchsia-600"
          >
            <FaUpload className="mx-auto text-xl text-gray-600" />
            <p className="text-md text-gray-600">
              Drag & drop files or{" "}
              <span className="font-semibold underline">browse</span>
            </p>
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG, WEBP
            </p>
          </div>

          {imageName && (
            <div className="flex justify-between items-center mt-2 bg-green-50 px-3 py-2 rounded">
              <p className="text-sm text-green-700">{imageName}</p>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
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

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            <FaTimes /> Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md"
          >
            <FaSave /> Add Medicine
          </button>
        </div>
      </form>
    </>
  );
};

export default AddNewMedicine;

/* ---------- Reusable Components ---------- */

const Section = ({ title, icon, children }) => (
  <div>
    <p className="font-semibold text-md mb-3 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      {title}
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({
  label,
  required,
  value,
  onChange,
  type = "text",
  placeholder,
}) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-300 outline-0 rounded-md px-3 py-2 focus:ring-1 focus:ring-fuchsia-600"
    />
  </div>
);

const Select = ({ label, required, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-300 outline-0 rounded-md px-3 py-2 focus:ring-1 focus:ring-fuchsia-600"
    >
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange, placeholder }) => (
  <div className="md:col-span-2">
    <label className="text-sm font-medium">{label}</label>
    <textarea
      rows={3}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-300 outline-0 rounded-md px-3 py-2 focus:ring-1 focus:ring-fuchsia-600"
    />
  </div>
);
