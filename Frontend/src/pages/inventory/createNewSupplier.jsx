import React, { useRef, useState, useContext } from "react";
import {
  FaUser,
  FaTruck,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUniversity,
  FaUpload,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaPlusCircle,
  FaFileCsv,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../Loading";
import { MedicineContext } from "../../context/MedicineContext";

const CreateNewSupplier = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { addSupplier } = useContext(MedicineContext);

  const [isLoading, setIsLoading] = useState(false);

  // CSV File State
  const [csvFileName, setCsvFileName] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  /* Required fields */
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* Other fields */
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [status, setStatus] = useState("Active");
  const [rating, setRating] = useState("");

  const [category, setCategory] = useState("");
  const [taxId, setTaxId] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [creditLimit, setCreditLimit] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");

  // Supplies State
  const [supplyInput, setSupplyInput] = useState("");
  const [itemsSupplied, setItemsSupplied] = useState([]); // Manual entry items

  const [notes, setNotes] = useState("");

  // Handle CSV File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        selectedFile.type === "text/csv" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setCsvFileName(selectedFile.name);
        setCsvFile(selectedFile);
      } else {
        toast.error("Please upload a valid CSV file");
        e.target.value = null;
      }
    }
  };

  // Handle Supplies Input (Enter Key)
  const handleSupplyKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = supplyInput.trim();
      if (val && !itemsSupplied.includes(val)) {
        setItemsSupplied([...itemsSupplied, val]);
        setSupplyInput("");
      }
    }
  };

  // Remove Supply Item
  const removeSupplyItem = (itemToRemove) => {
    setItemsSupplied(itemsSupplied.filter((item) => item !== itemToRemove));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (
      !supplierName ||
      !contactPerson ||
      !email ||
      !phone ||
      !category ||
      !paymentTerms
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Append Basic Info
      formData.append("supplierName", supplierName);
      formData.append("contactPerson", contactPerson);
      formData.append("email", email);
      formData.append("phone", phone);

      // Append Address
      formData.append("street", street);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("zip", zip);
      formData.append("country", country);

      // Append Business Info
      formData.append("category", category);
      formData.append("taxId", taxId);
      formData.append("paymentTerms", paymentTerms);
      formData.append("creditLimit", creditLimit);
      formData.append("status", status);
      formData.append("rating", rating);

      // Append Banking
      formData.append("bankName", bankName);
      formData.append("accountNumber", accountNumber);
      formData.append("ifsc", ifsc);

      // Append Notes
      formData.append("notes", notes);

      // Append Manual Supplies
      if (itemsSupplied.length > 0) {
        formData.append("manualItems", itemsSupplied.join(","));
      }

      // Append CSV File for Bulk Supplies
      if (csvFile) {
        formData.append("document", csvFile); // Key matches multer setup in route (usually 'document' or 'file')
      }

      // Call Context Function
      const success = await addSupplier(formData);

      if (success) {
        navigate("/suppliers-list");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg mb-4 flex flex-wrap justify-between shadow-sm border border-gray-200">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaPlusCircle className=" text-lg text-gray-500" />
            <p className="font-bold text-lg text-gray-800">Add New Supplier</p>
          </div>
          <p className="text-sm text-gray-500">Add new supplier to inventory</p>
        </div>

        {/* Back */}
        <div className="flex justify-end mt-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm border bg-gray-100 hover:text-white hover:bg-fuchsia-800 border-gray-300 rounded-lg px-4 py-2 text-gray-700 cursor-pointer transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              title="Basic Information"
              icon={<FaUser className="text-blue-800 text-2xl" />}
            >
              <TwoCol>
                <Input
                  label="Supplier Name"
                  required
                  placeholder="Enter supplier name"
                  value={supplierName}
                  onChange={setSupplierName}
                />
                <Input
                  label="Contact Person"
                  required
                  placeholder="Enter contact person"
                  value={contactPerson}
                  onChange={setContactPerson}
                />
                <Input
                  label="Email Address"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={setEmail}
                />
                <Input
                  label="Phone Number"
                  required
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={setPhone}
                />
              </TwoCol>
            </Card>

            <Card
              title="Address Information"
              icon={<FaMapMarkerAlt className="text-orange-600 text-2xl" />}
            >
              <TwoCol>
                <Input
                  label="Street Address"
                  placeholder="Enter street address"
                  value={street}
                  onChange={setStreet}
                />
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={city}
                  onChange={setCity}
                />
                <Input
                  label="State"
                  placeholder="Enter state"
                  value={state}
                  onChange={setState}
                />
                <Input
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                  value={zip}
                  onChange={setZip}
                />
                <Input
                  label="Country"
                  placeholder="Enter country"
                  value={country}
                  onChange={setCountry}
                />
              </TwoCol>
            </Card>

            <Card
              title="Business Information"
              icon={<FaStickyNote className="text-green-800 text-2xl" />}
            >
              <TwoCol>
                <Select
                  label="Category"
                  required
                  value={category}
                  onChange={setCategory}
                  options={[
                    "Pharmaceuticals",
                    "Medical Equipment & Devices",
                    "Surgical Instruments",
                    "Medical Consumables & Disposables",
                    "Laboratory Reagents & Supplies",
                    "Optical Supplies",
                    "Dental Supplies",
                    "Orthopedic & Implants",
                    "Radiology & Imaging",
                    "Hospital Furniture",
                    "IT & Software Solutions",
                    "PPE & Safety Gear",
                    "Facility Management & Cleaning",
                    "Biomedical Waste Management",
                    "Food & Catering Services",
                    "Maintenance Service Provider",
                    "General Distributor",
                  ]}
                />
                <Input
                  label="Tax ID / GST Number"
                  placeholder="Enter tax ID"
                  value={taxId}
                  onChange={setTaxId}
                />
                <Select
                  label="Payment Terms"
                  required
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                  options={[
                    "Immediate",
                    "15 Days",
                    "30 Days",
                    "45 Days",
                    "60 Days",
                  ]}
                />
                <Input
                  label="Credit Limit"
                  placeholder="Enter credit limit"
                  value={creditLimit}
                  onChange={setCreditLimit}
                />
              </TwoCol>
            </Card>

            <Card
              title="Banking Information"
              icon={<FaUniversity className="text-red-800 text-2xl" />}
            >
              <TwoCol>
                <Input
                  label="Bank Name"
                  placeholder="Enter bank name"
                  value={bankName}
                  onChange={setBankName}
                />
                <Input
                  label="Account Number"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={setAccountNumber}
                />
                <Input
                  label="IFSC Code"
                  placeholder="Enter IFSC code"
                  value={ifsc}
                  onChange={setIfsc}
                />
              </TwoCol>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card
              title="Supplies Provided"
              icon={<FaTruck className="text-blue-500 text-2xl" />}
            >
              {/* CSV Upload Section */}
              <div className="mb-6 p-4 border border-dashed border-blue-300 bg-blue-50 rounded-lg text-center">
                <FaFileCsv className="mx-auto text-3xl text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Bulk Upload Items via CSV
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Upload a CSV file containing items list
                </p>

                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="bg-white border border-blue-200 text-blue-600 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  {csvFileName ? "Change File" : "Select CSV File"}
                </button>

                {csvFileName && (
                  <div className="mt-2 text-xs text-green-600 font-semibold flex items-center justify-center gap-1">
                    <span>{csvFileName}</span>
                    <FaTimes
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCsvFileName("");
                        setCsvFile(null);
                        fileRef.current.value = null;
                      }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  ref={fileRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv"
                />
              </div>

              {/* Manual Entry Section */}
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Add Item Manually (Press Enter)
                </label>
                <input
                  value={supplyInput}
                  onChange={(e) => setSupplyInput(e.target.value)}
                  onKeyDown={handleSupplyKeyDown}
                  placeholder="e.g. Paracetamol, Gloves..."
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 mb-3"
                />

                {/* Badges Container */}
                <div className="flex flex-wrap gap-2">
                  {itemsSupplied.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeSupplyItem(item)}
                        className="hover:text-red-500 focus:outline-none"
                      >
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card
              title="Notes"
              icon={<FaStickyNote className="text-purple-800 text-2xl" />}
            >
              <Textarea
                placeholder="Add additional notes about this supplier..."
                value={notes}
                onChange={setNotes}
              />
            </Card>

            <Card
              title="Supplier Status & Rating"
              icon={<FaUser className="text-yellow-600 text-2xl" />}
            >
              <TwoCol>
                <Select
                  label="Supplier Status"
                  value={status}
                  onChange={setStatus}
                  options={["Active", "Inactive", "Blacklisted"]}
                />

                <Input
                  label="Rating (0-5)"
                  placeholder="e.g. 4.5"
                  value={rating}
                  onChange={setRating}
                />
              </TwoCol>
            </Card>

            <div className="flex gap-4 lg:mt-4 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex cursor-pointer items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
              >
                <FaTimes /> Cancel
              </button>

              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 bg-fuchsia-800 hover:bg-fuchsia-900 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
              >
                <FaSave /> Add Supplier
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateNewSupplier;

/* ===== Reusable UI ===== */

const Card = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
    <p className="font-bold text-gray-800 mb-5 flex items-center gap-3 border-b border-gray-100 pb-3">
      <span className="p-2 bg-gray-100 rounded-lg">{icon}</span>
      {title}
    </p>
    {children}
  </div>
);

const TwoCol = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ label, required, placeholder, value, onChange }) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 cursor-pointer appearance-none"
    >
      <option value="">Select Option</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ placeholder, value, onChange }) => (
  <textarea
    rows={3}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
  />
);
