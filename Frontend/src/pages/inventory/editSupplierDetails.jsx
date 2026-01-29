import React, { useRef, useState, useEffect, useContext } from "react";
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
import { MedicineContext } from "../../context/MedicineContext"; 
import Loading from "../Loading"; 

const EditSupplierDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const fileRef = useRef(null);

 
  const { getSupplierById, updateSupplier } = useContext(MedicineContext);

  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

 
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

  const [supplies, setSupplies] = useState("");
  const [totalSupplies, setTotalSupplies] = useState(""); // Added Total Supplies
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

        
        setSupplies(data.itemsSupplied ? data.itemsSupplied.join(", ") : "");
        setTotalSupplies(data.totalSupplies || 0);
        setNotes(data.notes || "");

        if (data.documentName) {
          setFileName(data.documentName);
        }
      } else {
        
        navigate("/suppliers-list");
      }
      setLoading(false);
    };

    fetchSupplier();
  }, [id, getSupplierById, navigate]);

  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setFile(e.target.files[0]);
    }
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

      // Append Supplies & Notes
      formData.append("itemsSupplied", supplies);
      formData.append("totalSupplies", totalSupplies);
      formData.append("notes", notes);

      // Append File if a new one is selected
      if (file) {
        formData.append("document", file);
      }

      // Call Update Function from Context
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
                  value={category}
                  onChange={setCategory}
                  options={["Pharmaceutical", "Medical Equipment", "Consumables", "Distributor"]}
                />
                <Input label="Tax ID" value={taxId} onChange={setTaxId} />
                <Select
                  label="Payment Terms"
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                  options={["Immediate", "15 Days", "30 Days", "45 Days", "60 Days"]}
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
              <div className="flex flex-col gap-4">
                <Textarea value={supplies} onChange={setSupplies} />
                <Input
                  label="Total Supplies Count"
                  type="number"
                  value={totalSupplies}
                  onChange={setTotalSupplies}
                />
              </div>
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

            <Card
              title="Documents"
              icon={<FaUpload className="text-red-600 text-2xl" />}
            >
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-fuchsia-600 bg-gray-50 transition-colors"
              >
                <FaUpload className="mx-auto text-xl text-gray-500" />
                <p className="text-sm mt-2 font-medium text-gray-700">
                  Click to update file
                </p>
              </div>

              {fileName && (
                <div className="mt-3 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm flex items-center gap-2">
                  <FaStickyNote /> {fileName}
                </div>
              )}

              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                className="hidden"
              />
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
                className="flex cursor-pointer items-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
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

/* ===== Reusable UI (Unchanged) ===== */

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