import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import {
  FaArrowLeft,
  FaEdit,
  FaBox,
  FaCalendarAlt,
  FaRupeeSign,
  FaWarehouse,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTag,
  FaBuilding,
  FaNotesMedical,
} from "react-icons/fa";

const ViewMedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/medicine/medicine/${id}`,
          { headers: { token } }
        );

        if (data.success) {
          setMedicine(data.data);
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchMedicine();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
            <FaExclamationTriangle />
          </div>
          <p className="text-gray-800 font-bold text-lg">Medicine Not Found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-fuchsia-700 hover:underline text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-fuchsia-100 rounded-lg text-fuchsia-700">
              <FaBox className="text-xl" />
            </div>
            <h1 className="font-bold text-2xl text-gray-800">
              {medicine.medicineName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wide">
              {medicine.medicineId}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-12">
            Complete details and stock information
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center cursor-pointer gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaArrowLeft />
            Back
          </button>

          <button
            onClick={() => navigate(`/edit-medicine/${medicine.medicineId}`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors shadow-sm w-full md:w-auto"
          >
            <FaEdit />
            Edit Details
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Image Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center border border-gray-100">
              <img
                src={medicine.medicineImage || assets.default_medicine}
                alt={medicine.medicineName}
                className="w-full h-64 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {medicine.medicineName}
              </h3>
              <p className="text-sm text-fuchsia-700 font-medium">
                {medicine.genericName}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 text-xs font-bold rounded-full">
                In Stock
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold rounded-full">
                {medicine.category}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {medicine.description}
              </p>
            </div>
          </div>

          {/* Stock Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <p className="font-bold text-gray-800 flex items-center gap-2">
                <FaBox className="text-fuchsia-600" />
                Stock Level
              </p>
              <span className="text-lg font-bold text-gray-800">
                {medicine.quantity}{" "}
                <span className="text-xs font-normal text-gray-500">units</span>
              </span>
            </div>

            <div className="p-5">
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${
                    medicine.quantity < medicine.minimumThreshold
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      (medicine.quantity / 500) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs text-gray-500 font-medium">
                <span>Min: {medicine.minimumThreshold}</span>
                <span>Max Capacity: 500</span>
              </div>
            </div>
          </div>

          {/* Expiry Alert */}
          <div className="bg-red-50 p-5 rounded-xl border border-red-200 flex items-start gap-4">
            <div className="p-2 bg-white rounded-full border border-red-100 shrink-0">
              <FaExclamationTriangle className="text-red-500" />
            </div>
            <div>
              <p className="font-bold text-red-800">Expiry Alert</p>
              <p className="text-sm text-red-600 mt-1">
                This medicine expires on{" "}
                <span className="font-bold">{medicine.expiryDate}</span>. Check
                batch details.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <InfoCard title="Basic Information" icon={<FaInfoCircle />}>
            <InfoRow label="Medicine ID" value={medicine.medicineId} />
            <InfoRow label="Generic Name" value={medicine.genericName} />
            <InfoRow label="Dosage Form" value={medicine.dosageForm} />
            <InfoRow label="Strength" value={medicine.strength} />
            <InfoRow label="Pack Size" value={medicine.packSize} />
            <InfoRow
              label="Prescription Required"
              value={medicine.prescriptionRequired}
            />
            <InfoRow label="Manufacturer" value={medicine.manufacturer} />
            <InfoRow label="Category" value={medicine.category} />
          </InfoCard>

          {/* Stock & Pricing */}
          <InfoCard title="Stock & Pricing Details" icon={<FaTag />}>
            <IconRow
              icon={<FaBox className="text-purple-600" />}
              label="Batch Number"
              value={medicine.batchNumber}
              bgColor="bg-purple-50"
            />
            <IconRow
              icon={<FaRupeeSign className="text-emerald-600" />}
              label="Cost Per Unit"
              value={`₹ ${medicine.costPerUnit}`}
              bgColor="bg-emerald-50"
            />
            <IconRow
              icon={<FaRupeeSign className="text-blue-600" />}
              label="Selling Price"
              value={`₹ ${medicine.sellingPrice}`}
              bgColor="bg-blue-50"
            />
            <IconRow
              icon={<FaWarehouse className="text-orange-600" />}
              label="Storage Location"
              value={medicine.storageLocation}
              bgColor="bg-orange-50"
            />
            <IconRow
              icon={<FaCalendarAlt className="text-red-600" />}
              label="Expiry Date"
              value={medicine.expiryDate}
              bgColor="bg-red-50"
            />
          </InfoCard>

          {/* Medical Info */}
          <InfoCard title="Medical Information" icon={<FaNotesMedical />}>
            <InfoRow
              label="Storage Conditions"
              value={medicine.storageConditions}
            />
            <InfoRow
              label="Side Effects"
              value="Nausea, rash, hypersensitivity reactions"
            />
          </InfoCard>

          {/* Supplier Info */}
          <InfoCard title="Supplier Information" icon={<FaBuilding />}>
            <InfoRow label="Supplier Name" value={medicine.supplierName} />
            <InfoRow label="Email" value="sales@phco.com" />
            <InfoRow label="Contact No" value="+91 9876543210" />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicineDetails;

/* ---------- Reusable Components ---------- */

const InfoCard = ({ title, children, icon }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
    </div>
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        {children}
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </p>
    <p className="text-sm font-semibold text-gray-700">{value || "N/A"}</p>
  </div>
);

const IconRow = ({ icon, label, value, bgColor }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white">
    <div className={`p-3 rounded-lg text-lg ${bgColor}`}>{icon}</div>
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  </div>
);
