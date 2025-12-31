import React, { useRef, useState } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateNewSupplier = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  /* ===== REQUIRED FIELDS ===== */
  const [supplierName, setSupplierName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /* ===== OTHER FIELDS ===== */
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

  const [supplies, setSupplies] = useState("");
  const [notes, setNotes] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!supplierName || !contactPerson || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    toast.success("Supplier Created Successfully");
    navigate("/suppliers-list");
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg mb-4 flex flex-wrap justify-between">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaPlusCircle className=" text-lg text-gray-500" />
            <p className="font-bold text-lg">Add New Supplier</p>
          </div>
          <p className="text-sm text-gray-500">Add new supplier to inventory</p>
        </div>

        {/* Back */}
        <div className="flex justify-end mt-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex  items-center gap-2 text-sm border bg-gray-200 hover:text-white hover:bg-fuchsia-900 border-fuchsia-700 rounded px-3 py-1  text-black cursor-pointer"
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
                  required
                  placeholder="Enter street address"
                  value={street}
                  onChange={setStreet}
                />
                <Input
                  label="City"
                  required
                  placeholder="Enter city"
                  value={city}
                  onChange={setCity}
                />
                <Input
                  label="State"
                  required
                  placeholder="Enter state"
                  value={state}
                  onChange={setState}
                />
                <Input
                  label="ZIP Code"
                  required
                  placeholder="Enter ZIP code"
                  value={zip}
                  onChange={setZip}
                />
                <Input
                  label="Country"
                  required
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
                  options={["Pharmaceutical", "Medical Equipment"]}
                />
                <Input
                  label="Tax ID / GST Number"
                  required
                  placeholder="Enter tax ID"
                  value={taxId}
                  onChange={setTaxId}
                />
                <Select
                  label="Payment Terms"
                  required
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                  options={["Immediate", "15 Days", "30 Days"]}
                />
                <Input
                  label="Credit Limit"
                  required
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
              title="Supplies"
              icon={<FaTruck className="text-blue-500 text-2xl" />}
            >
              <Textarea
                required
                placeholder="Enter supplies (comma separated)"
                value={supplies}
                onChange={setSupplies}
              />
            </Card>

            <Card
              title="Notes"
              icon={<FaStickyNote className="text-purple-800 text-2xl" />}
            >
              <Textarea
                placeholder="Add additional notes"
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
                  required
                  value={status}
                  onChange={setStatus}
                  options={["Active", "Inactive"]}
                />

                <Input
                  label="Rating (out of 5)"
                  required
                  placeholder="e.g. 4.5"
                  value={rating}
                  onChange={setRating}
                />
              </TwoCol>
            </Card>

            <Card
              title="Documents"
              icon={<FaUpload className="text-red-600 text-2xl" />}
            >
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-fuchsia-600"
              >
                <FaUpload className="mx-auto text-xl text-gray-500" />
                <p className="text-sm mt-2">
                  Drop files here or{" "}
                  <span className="underline">click to upload</span>
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>

              {fileName && (
                <p className="text-sm text-green-600 mt-2">{fileName}</p>
              )}

              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </Card>

            <div className="flex gap-4 lg:mt-70 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex cursor-pointer items-center gap-2 bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                <FaTimes /> Cancel
              </button>

              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md"
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
  <div className="bg-white border border-gray-300 rounded-xl p-4">
    <p className="font-semibold mb-4 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      {title}
    </p>
    {children}
  </div>
);

const TwoCol = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, required, placeholder, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full mt-1 bg-gray-200 px-3 py-2 rounded-md outline-0"
    />
  </div>
);

const Select = ({ label, required, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-200 px-3 py-2 rounded-md outline-0"
    >
      <option value="">Select</option>
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
    className="w-full bg-gray-200 px-3 py-2 rounded-md outline-0"
  />
);
