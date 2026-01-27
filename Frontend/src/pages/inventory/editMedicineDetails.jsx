import React, { useRef, useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { MedicineContext } from "../../context/MedicineContext"; 
import Loading from "../Loading";

const EditMedicineDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { getMedicineById, updateMedicine } = useContext(MedicineContext);

  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState(null);

  // Form state
  const [medicineName, setMedicineName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [dosageForm, setDosageForm] = useState("");
  const [strength, setStrength] = useState("");
  const [packSize, setPackSize] = useState("");
  const [prescriptionRequired, setPrescriptionRequired] = useState("No");

  const [batchNumber, setBatchNumber] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minimumThreshold, setMinimumThreshold] = useState("");
  
  // --- NEW STATE ---
  const [manufacturingDate, setManufacturingDate] = useState(""); 
  const [expiryDate, setExpiryDate] = useState("");

  const [storageLocation, setStorageLocation] = useState("");
  const [storageConditions, setStorageConditions] = useState("");

  const [supplierName, setSupplierName] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [description, setDescription] = useState("");

  const [imageName, setImageName] = useState("");

  useEffect(() => {
    const fetchMedicine = async () => {
      const data = await getMedicineById(id);

      if (data) {
        setMedicine(data);

        // Fill form states
        setMedicineName(data.medicineName);
        setGenericName(data.genericName);
        setCategory(data.category);
        setManufacturer(data.manufacturer);
        setDosageForm(data.dosageForm);
        setStrength(data.strength);
        setPackSize(data.packSize);
        setPrescriptionRequired(data.prescriptionRequired);

        setBatchNumber(data.batchNumber);
        setQuantity(data.quantity);
        setMinimumThreshold(data.minimumThreshold);
        
        // --- SET DATES ---
        setManufacturingDate(data.manufacturingDate || ""); 
        setExpiryDate(data.expiryDate);

        setStorageLocation(data.storageLocation);
        setStorageConditions(data.storageConditions);

        setSupplierName(data.supplierName);
        setCostPerUnit(data.costPerUnit);
        setSellingPrice(data.sellingPrice);
        setDescription(data.description);

        // Use saved name or fallback to URL
        setImageName(data.medicineImageName || data.medicineImage);
      } 
      
      setLoading(false);
    };

    fetchMedicine();
  }, [id, getMedicineById]);

  /* Handling image */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name);
    }
  };

  const removeImage = () => {
    fileRef.current.value = "";
    setImageName("");
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
    
    // --- APPEND DATES ---
    formData.append("manufacturingDate", manufacturingDate);
    formData.append("expiryDate", expiryDate);

    formData.append("storageLocation", storageLocation);
    formData.append("storageConditions", storageConditions);

    formData.append("supplierName", supplierName);
    formData.append("costPerUnit", costPerUnit);
    formData.append("sellingPrice", sellingPrice);
    formData.append("description", description);

    if (fileRef.current?.files[0]) {
      formData.append("medicineImage", fileRef.current.files[0]);
    }

    // Call context function
    const success = await updateMedicine(id, formData);

    if (success) {
      navigate(`/medicine-details/${id}`);
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center text-red-600 font-bold bg-slate-50 min-h-screen">
        Medicine not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
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

        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left column */}
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

              {/* --- DATES SECTION --- */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Mfg Date"
                  type="date"
                  required
                  value={manufacturingDate}
                  onChange={setManufacturingDate}
                />

                <Input
                  label="Expiry Date"
                  type="date"
                  required
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

              <Input
                label="Storage Conditions"
                value={storageConditions}
                onChange={setStorageConditions}
              />
            </Section>
          </div>

          {/* RIGHT COLUMN */}
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
              <Input
                label="Supplier Name"
                required
                value={supplierName}
                onChange={setSupplierName}
              />

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
            </Section>

            {/* Description */}
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

        {/* ACTION BUTTONS */}
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

/* ----------------- REUSABLE COMPONENTS ----------------- */
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
    <select
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-3 pr-8 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 cursor-pointer"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ value, onChange, placeholder }) => (
  <textarea
    rows={3}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
  />
);