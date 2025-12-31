import React, { useRef, useState, useEffect } from "react";
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
  FaEdit,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { supplier_records } from "../../data/supplier";

const EditSupplierDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const supplier = supplier_records.find((s) => s.supplierId === id);

  if (!supplier) {
    return <p className="text-red-600 p-4">Supplier not found</p>;
  }

  /* ===== STATES (PRE-FILLED) ===== */
  const [supplierName, setSupplierName] = useState(supplier.supplierName);
  const [contactPerson, setContactPerson] = useState(supplier.contactPerson);
  const [email, setEmail] = useState(supplier.email);
  const [phone, setPhone] = useState(supplier.phone);

  const [street, setStreet] = useState(supplier.address.street);
  const [city, setCity] = useState(supplier.address.city);
  const [state, setState] = useState(supplier.address.state);
  const [zip, setZip] = useState(supplier.address.zip);
  const [country, setCountry] = useState(supplier.address.country);

  const [status, setStatus] = useState(supplier.status);
  const [rating, setRating] = useState(supplier.rating);

  const [category, setCategory] = useState(supplier.category);
  const [taxId, setTaxId] = useState(supplier.taxId || "");
  const [paymentTerms, setPaymentTerms] = useState(supplier.paymentTerms);
  const [creditLimit, setCreditLimit] = useState(supplier.creditLimit);

  const [bankName, setBankName] = useState(supplier.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(
    supplier.bankDetails.accountNumber
  );
  const [ifsc, setIfsc] = useState(supplier.bankDetails.ifsc);

  const [supplies, setSupplies] = useState(supplier.itemsSupplied.join(", "));
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!supplierName || !contactPerson || !email || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    // 🔹 Mock update (DB later)
    toast.success("Supplier details updated successfully");
    navigate("/suppliers-list");
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white p-4 rounded-lg mb-4 flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaEdit className=" text-lg text-gray-500" />
            <p className="font-bold text-lg">Edit Supplier Details</p>
          </div>
          <p className="text-sm text-gray-500">
            Edit {supplier.supplierName} and update
          </p>
        </div>

        <div className="flex justify-end mt-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="flex  items-center gap-2 text-sm border bg-gray-200 hover:text-white hover:bg-fuchsia-900 border-fuchsia-700 rounded px-3 py-1  text-black cursor-pointer"
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* FORM (SAME DESIGN AS CREATE) */}
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
                  value={category}
                  onChange={setCategory}
                  options={["Pharmaceutical", "Medical Equipment"]}
                />
                <Input label="Tax ID" value={taxId} onChange={setTaxId} />
                <Select
                  label="Payment Terms"
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                  options={["Immediate", "15 Days", "30 Days"]}
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
              title="Supplies"
              icon={<FaTruck className="text-blue-600 text-2xl" />}
            >
              <Textarea value={supplies} onChange={setSupplies} />
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
                  options={["Active", "Inactive"]}
                />
                <Input label="Rating" value={rating} onChange={setRating} />
              </TwoCol>
            </Card>

            <Card title="Documents" icon={<FaUpload className="text-red-600 text-2xl"/>}>
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

            <div className="flex gap-4 lg:mt-118 justify-end">
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
  <div className="bg-white border border-gray-300 rounded-xl p-4">
    <p className="font-semibold mb-4 flex gap-2 items-center">
      {icon} {title}
    </p>
    {children}
  </div>
);

const TwoCol = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
);

const Input = ({ label, required, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-200 px-3 py-2 rounded-md outline-0"
    />
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-sm font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mt-1 bg-gray-200 px-3 py-2 rounded-md outline-0"
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
    className="w-full bg-gray-200 px-3 py-2 rounded-md outline-0"
  />
);
