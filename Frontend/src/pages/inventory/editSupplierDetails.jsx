import React, { useRef, useState, useEffect, useContext } from "react";
import {
  FaUser,
  FaTruck,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUniversity,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaEdit,
  FaFileCsv,
  FaSearch,
  FaFileAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";

const EditSupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const csvFileRef = useRef(null);
  const docFileRef = useRef(null);

  const { getSupplierById, updateSupplier } = useContext(MedicineContext);

  const [loading, setLoading] = useState(true);

  // CSV Import State
  const [csvFileName, setCsvFileName] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  // Document Upload State
  const [docFileName, setDocFileName] = useState("");
  const [docFile, setDocFile] = useState(null);
  const [existingDocName, setExistingDocName] = useState(""); // Store DB file name

  /* Form Fields */
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
  const [itemsSupplied, setItemsSupplied] = useState([]);
  const [showAllSupplies, setShowAllSupplies] = useState(false);

  // New: Search State
  const [supplySearch, setSupplySearch] = useState("");

  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      const data = await getSupplierById(id);

      if (data) {
        setSupplierName(data.supplierName);
        setContactPerson(data.contactPerson);
        setEmail(data.email);
        setPhone(data.phone);

        setStreet(data.address?.street || "");
        setCity(data.address?.city || "");
        setState(data.address?.state || "");
        setZip(data.address?.zip || "");
        setCountry(data.address?.country || "");

        setStatus(data.status);
        setRating(data.rating);

        setCategory(data.category);
        setTaxId(data.taxId || "");
        setPaymentTerms(data.paymentTerms);
        setCreditLimit(data.creditLimit);

        setBankName(data.bankDetails?.bankName || "");
        setAccountNumber(data.bankDetails?.accountNumber || "");
        setIfsc(data.bankDetails?.ifsc || "");

        // Set Supplies
        if (Array.isArray(data.itemsSupplied)) {
          setItemsSupplied(data.itemsSupplied);
        } else if (typeof data.itemsSupplied === "string") {
          setItemsSupplied(data.itemsSupplied.split(",").map((i) => i.trim()));
        } else {
          setItemsSupplied([]);
        }

        setNotes(data.notes || "");

        // Set Existing Document Name
        if (data.documentName) {
          setExistingDocName(data.documentName);
        }
      } else {
        navigate("/suppliers-list");
      }
      setLoading(false);
    };

    fetchSupplier();
  }, [id, getSupplierById, navigate]);

  // Handle CSV Selection (For importing items)
  const handleCsvChange = (e) => {
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

  // Handle Document Selection (For saving file)
  const handleDocChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setDocFileName(selectedFile.name);
      setDocFile(selectedFile);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplierName || !contactPerson || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

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
        formData.append("itemsSupplied", itemsSupplied.join(","));
      } else {
        formData.append("itemsSupplied", "");
      }

      // Append CSV File (for bulk add)
      if (csvFile) {
        formData.append("document", csvFile);
      }

      if (!csvFile && docFile) {
        formData.append("document", docFile);
      }

      const success = await updateSupplier(id, formData);

      if (success) {
        navigate("/suppliers-list");
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // --- Filtering Logic for Supplies ---
  const filteredSupplies = itemsSupplied.filter((item) =>
    item.toLowerCase().includes(supplySearch.toLowerCase()),
  );

  const VISIBLE_LIMIT = 10;
  const visibleItems = supplySearch
    ? filteredSupplies
    : showAllSupplies
      ? filteredSupplies
      : filteredSupplies.slice(0, VISIBLE_LIMIT);

  const hiddenCount = filteredSupplies.length - VISIBLE_LIMIT;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white p-4 rounded-lg mb-4 flex justify-between shadow-sm border border-gray-200">
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaEdit className=" text-lg text-gray-500" />
            <p className="font-bold text-lg">Edit Supplier Details</p>
          </div>
          <p className="text-sm text-gray-500">
            Edit {supplierName} and update information
          </p>
        </div>

        <div className="flex justify-end mt-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm border bg-gray-100 hover:text-white hover:bg-fuchsia-800 border-gray-300 rounded-lg px-4 py-2 text-gray-700 cursor-pointer transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* FORM */}
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
                  value={supplierName}
                  onChange={setSupplierName}
                />
                <Input
                  label="Contact Person"
                  required
                  value={contactPerson}
                  onChange={setContactPerson}
                />
                <Input
                  label="Email Address"
                  required
                  value={email}
                  onChange={setEmail}
                />
                <Input
                  label="Phone Number"
                  required
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
                <Input label="Street" value={street} onChange={setStreet} />
                <Input label="City" value={city} onChange={setCity} />
                <Input label="State" value={state} onChange={setState} />
                <Input label="ZIP" value={zip} onChange={setZip} />
                <Input label="Country" value={country} onChange={setCountry} />
              </TwoCol>
            </Card>

            <Card
              title="Business Information"
              icon={<FaStickyNote className="text-green-600 text-2xl" />}
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
                <Input label="Tax ID" value={taxId} onChange={setTaxId} />
                <Select
                  label="Payment Terms"
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
                  value={bankName}
                  onChange={setBankName}
                />
                <Input
                  label="Account Number"
                  value={accountNumber}
                  onChange={setAccountNumber}
                />
                <Input label="IFSC Code" value={ifsc} onChange={setIfsc} />
              </TwoCol>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card
              title="Supplies Provided"
              icon={<FaTruck className="text-blue-600 text-2xl" />}
            >
              {/* CSV Upload Section */}
              <div className="mb-6 p-4 border border-dashed border-blue-300 bg-blue-50 rounded-lg text-center">
                <FaFileCsv className="mx-auto text-3xl text-blue-500 mb-2" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Bulk Add Items via CSV
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Upload to append new items
                </p>

                <button
                  type="button"
                  onClick={() => csvFileRef.current.click()}
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
                        csvFileRef.current.value = null;
                      }}
                    />
                  </div>
                )}

                <input
                  type="file"
                  ref={csvFileRef}
                  onChange={handleCsvChange}
                  className="hidden"
                  accept=".csv"
                />
              </div>

              {/* Search Bar */}
              <div className="relative mb-3">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search added supplies..."
                  value={supplySearch}
                  onChange={(e) => setSupplySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Manual Entry */}
              <div className="w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  Add Item (Press Enter)
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
                  {visibleItems.length > 0 ? (
                    visibleItems.map((item, index) => (
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
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">
                      {supplySearch
                        ? "No items match search."
                        : itemsSupplied.length === 0
                          ? "No items added."
                          : ""}
                    </span>
                  )}

                  {/* Show More / Show Less Button (Only show if not searching) */}
                  {!supplySearch && filteredSupplies.length > VISIBLE_LIMIT && (
                    <button
                      type="button"
                      onClick={() => setShowAllSupplies(!showAllSupplies)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-1 self-center"
                    >
                      {showAllSupplies ? "Show Less" : `+${hiddenCount} more`}
                    </button>
                  )}
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
                  label="Status"
                  value={status}
                  onChange={setStatus}
                  options={["Active", "Inactive", "Blacklisted"]}
                />
                <Input label="Rating" value={rating} onChange={setRating} />
              </TwoCol>
            </Card>

            <div className="flex gap-4 lg:mt-4 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex w-full sm:w-auto justify-center whitespace-nowrap cursor-pointer items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
              >
                <FaTimes /> Cancel
              </button>

              <button
                type="submit"
                className="flex w-full sm:w-auto justify-center whitespace-nowrap cursor-pointer items-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
              >
                <FaSave /> Update Supplier
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditSupplierDetails;

/* ===== Reusable UI ===== */

const Card = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
    <p className="font-bold text-gray-800 mb-5 flex gap-3 items-center border-b border-gray-100 pb-3">
      <span className="p-2 bg-gray-100 rounded-lg">{icon}</span> {title}
    </p>
    {children}
  </div>
);

const TwoCol = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ label, required, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 cursor-pointer appearance-none"
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Textarea = ({ value, onChange }) => (
  <textarea
    rows={3}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none"
  />
);
