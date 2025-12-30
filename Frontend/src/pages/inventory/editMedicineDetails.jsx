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
    return <p className="p-6 text-red-600">Medicine not found</p>;
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

  const removeImage = () => {
    setImageName("");
    fileRef.current.value = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 In real app: update API / DB here
    toast.success("Medicine details updated successfully");
    navigate(`/medicine-details/${medicine.medicineId}`);
  };

  return (
    <>
      {/* Header */}
      <div className=" flex justify-between">
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex gap-3 items-center">
            <FaEdit className="text-gray-500" />
            <p className="font-bold text-lg">Edit Medicine Details</p>
          </div>
          <p className="text-sm text-gray-500">
            Update existing medicine information
          </p>
        </div>

        <div className="m-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm border bg-gray-200 hover:text-white hover:bg-fuchsia-700 border-fuchsia-700 rounded px-3 py-1 text-black cursor-pointer"
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
            options={["Tablet", "Capsule", "Injection", "Syrup", "Inhaler"]}
          />
          <Input
            label="Strength"
            required
            value={strength}
            onChange={setStrength}
          />
          <Input label="Pack Size" value={packSize} onChange={setPackSize} />
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

        {/* Supplier */}
        <Section title="Supplier & Pricing Information" icon={<FaTruck />}>
          <Input
            label="Supplier Name"
            required
            value={supplierName}
            onChange={setSupplierName}
          />
          <Input
            label="Cost Per Unit"
            required
            value={costPerUnit}
            onChange={setCostPerUnit}
          />
          <Input
            label="Selling Price"
            value={sellingPrice}
            onChange={setSellingPrice}
          />
        </Section>

        {/* Additional Info */}
        <Section title="Additional Information" icon={<FaStickyNote />}>
          <Textarea
            label="Description"
            value={description}
            onChange={setDescription}
          />
        </Section>

        {/* Image */}
        <div>
          <label className="font-semibold text-sm flex items-center gap-2">
            <FaImage /> Medicine Image
          </label>

          <div
            onClick={() => fileRef.current.click()}
            className="mt-2 border-2 border-gray-400 border-dashed bg-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-fuchsia-600"
          >
            <FaUpload className="mx-auto text-xl text-gray-600" />
            <p className="text-md text-gray-600">Click to change image</p>
          </div>

          {imageName && (
            <div className="flex justify-between items-center mt-2 bg-green-50 px-3 py-2 rounded">
              <p className="text-sm text-green-700">{imageName}</p>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-600"
              >
                <FaTrash />
              </button>
            </div>
          )}

          <input
            type="file"
            ref={fileRef}
            onChange={handleImageChange}
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
            className="flex items-center gap-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md"
          >
            <FaSave /> Update Medicine
          </button>
        </div>
      </form>
    </>
  );
};

export default EditMedicineDetails;

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

const Input = ({ label, required, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      required={required}
      value={value}
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
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ label, value, onChange }) => (
  <div className="md:col-span-2">
    <label className="text-sm font-medium">{label}</label>
    <textarea
      rows={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-300 outline-0 rounded-md px-3 py-2 focus:ring-1 focus:ring-fuchsia-600"
    />
  </div>
);
