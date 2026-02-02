import React, { useRef, useState, useContext } from "react";
import {
  FaPlusCircle,
  FaUpload,
  FaSave,
  FaTimes,
  FaMicroscope,
  FaTools,
  FaTruck,
  FaStickyNote,
  FaImage,
  FaTrash,
  FaArrowLeft,
  FaCogs,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { EquipmentContext } from "../../context/EquipmentContext"; 

const AddEquipment = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { addEquipment } = useContext(EquipmentContext);

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- Basic Info ---------- */
  const [equipmentName, setEquipmentName] = useState("");
  const [modelName, setModelName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [equipmentStatus, setEquipmentStatus] = useState("Working");

  /* ---------- Technical Specs ---------- */
  const [powerRequirement, setPowerRequirement] = useState("");
  const [fieldStrength, setFieldStrength] = useState("");
  const [boreSize, setBoreSize] = useState("");

  /* ---------- Service & Maintenance ---------- */
  const [lastService, setLastService] = useState("");
  const [nextService, setNextService] = useState("");

  /* ---------- Purchase & Warranty ---------- */
  const [installationDate, setInstallationDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");

  /* ---------- Supplier Info ---------- */
  const [supplierName, setSupplierName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emailId, setEmailId] = useState("");

  /* ---------- Additional ---------- */
  const [description, setDescription] = useState("");
  
  // Image State
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  /* ---------- Handlers ---------- */
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageName(e.target.files[0].name);
      setImageFile(e.target.files[0]); 
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setImageName("");
    setImageFile(null);
    fileRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();

    // Basic Info
    formData.append("equipmentName", equipmentName);
    formData.append("modelName", modelName);
    formData.append("serialNumber", serialNumber);
    formData.append("manufacturer", manufacturer);
    formData.append("category", category);
    formData.append("department", department);
    formData.append("location", location);
    formData.append("equipmentStatus", equipmentStatus);

    // Technical
    formData.append("powerRequirement", powerRequirement);
    formData.append("fieldStrength", fieldStrength);
    formData.append("boreSize", boreSize);

    // Service
    formData.append("lastService", lastService);
    formData.append("nextService", nextService);

    // Purchase
    formData.append("installationDate", installationDate);
    formData.append("purchaseCost", purchaseCost);
    formData.append("warrantyPeriod", warrantyPeriod);
    formData.append("warrantyExpiry", warrantyExpiry);

    // Supplier
    formData.append("supplierName", supplierName);
    formData.append("contactNumber", contactNumber);
    formData.append("emailId", emailId);

    formData.append("description", description);

    // Image
    if (imageFile) {
      formData.append("equipmentImage", imageFile);
    }

    const success = await addEquipment(formData);

    if (success) {
      navigate("/equipment-list"); 
    } else {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaPlusCircle size={24} className="text-gray-500 text-xl" />
            <p className="text-gray-800 font-bold text-lg">
              Add New Equipment
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Add new medical machinery or device into the asset system
          </p>
        </div>

        <div className="w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto cursor-pointer"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Section title="Basic Information" icon={<FaMicroscope />}>
              <Input
                label="Equipment Name"
                required
                placeholder="e.g. MRI Scanner"
                value={equipmentName}
                onChange={setEquipmentName}
              />
              <Input
                label="Model Name"
                required
                placeholder="e.g. Magnetom Skyra"
                value={modelName}
                onChange={setModelName}
              />
              <Input
                label="Serial Number"
                required
                placeholder="e.g. SN-MRI-2301"
                value={serialNumber}
                onChange={setSerialNumber}
              />
              <Input
                label="Manufacturer"
                required
                placeholder="e.g. Siemens"
                value={manufacturer}
                onChange={setManufacturer}
              />
              <Select
                label="Category"
                required
                value={category}
                onChange={setCategory}
                options={[
                  "Diagnostic",
                  "Surgical",
                  "ICU",
                  "Emergency",
                  "Sterilization",
                  "Laboratory",
                  "Therapeutic"
                ]}
              />
              <Select
                label="Department"
                required
                value={department}
                onChange={setDepartment}
                options={[
                  "General",
                  "Radiology",
                  "Cardiology",
                  "ICU",
                  "Emergency",
                  "Operation Theatre",
                  "CSSD",
                  "Dermatology",
                  "Orthopedics",
                  "Laboratory Services",
                  "Gynecology",
                  "Neurology",
                  "Nephrology",
                  "Pediatrics",
                ]}
              />
              <Input
                label="Location"
                required
                placeholder="e.g. Radiology - Room 1"
                value={location}
                onChange={setLocation}
              />
              <Select
                label="Initial Status"
                required
                value={equipmentStatus}
                onChange={setEquipmentStatus}
                options={["Working", "Under Maintenance", "Offline"]}
              />
            </Section>

            {/* Technical & Service Info */}
            <Section title="Technical & Service Specs" icon={<FaCogs />}>
              <Input
                label="Power Requirement"
                placeholder="e.g. 480V, 3 Phase"
                value={powerRequirement}
                onChange={setPowerRequirement}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Field Strength (Optional)"
                  placeholder="e.g. 3 Tesla"
                  value={fieldStrength}
                  onChange={setFieldStrength}
                />
                <Input
                  label="Bore Size (Optional)"
                  placeholder="e.g. 70 cm"
                  value={boreSize}
                  onChange={setBoreSize}
                />
              </div>
              <Input
                label="Last Service Date"
                type="date"
                value={lastService}
                onChange={setLastService}
              />
              <Input
                label="Next Service Due"
                type="date"
                required
                value={nextService}
                onChange={setNextService}
              />
            </Section>

            {/* Purchase & Warranty */}
            <Section title="Purchase & Warranty" icon={<FaStickyNote />}>
              <Input
                label="Installation Date"
                type="date"
                required
                value={installationDate}
                onChange={setInstallationDate}
              />
              <Input
                label="Purchase Cost"
                required
                placeholder="e.g. 1,50,000"
                value={purchaseCost}
                onChange={setPurchaseCost}
                prefix="₹"
              />
              <Input
                label="Warranty Period"
                placeholder="e.g. 5 Years"
                value={warrantyPeriod}
                onChange={setWarrantyPeriod}
              />
              <Input
                label="Warranty Expiry"
                type="date"
                value={warrantyExpiry}
                onChange={setWarrantyExpiry}
              />
            </Section>
          </div>

          {/* RIGHT COLUMN: Supplier & Extras */}
          <div className="space-y-6">
            {/* Upload Image */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <FaImage className="text-gray-400" />
                <h3 className="font-bold text-gray-800">Equipment Image</h3>
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
                        className="mt-3 text-xs  text-red-600 cursor-pointer hover:text-red-800 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded border border-red-200 shadow-sm"
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
                        JPG, PNG (max 5MB)
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

            {/* Supplier Info */}
            <Section title="Supplier & Support" icon={<FaTruck />}>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Supplier Name"
                  required
                  placeholder="e.g. Siemens Medical"
                  value={supplierName}
                  onChange={setSupplierName}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Contact Number"
                  required
                  placeholder="+91 9876543210"
                  value={contactNumber}
                  onChange={setContactNumber}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <Input
                  label="Support Email"
                  type="email"
                  placeholder="support@company.com"
                  value={emailId}
                  onChange={setEmailId}
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
                <textarea
                  rows={4}
                  value={description}
                  placeholder="Enter detailed equipment description or notes..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions (Bottom Right) */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            className="flex items-center cursor-pointer gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <FaTimes /> Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center cursor-pointer gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md transition-colors ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FaSave /> {isSubmitting ? "Saving..." : "Save Equipment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEquipment;

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