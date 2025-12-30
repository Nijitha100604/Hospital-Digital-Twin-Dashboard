import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { medicine_records } from "../../data/medicine";
import { assets } from "../../assets/assets";

import {
  FaArrowLeft,
  FaEdit,
  FaBox,
  FaCalendarAlt,
  FaRupeeSign,
  FaWarehouse,
  FaExclamationTriangle,
} from "react-icons/fa";

const ViewMedicineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const medicine = medicine_records.find((m) => m.medicineId === id);

  if (!medicine) {
    return <p className="p-6 text-red-600">Medicine not found</p>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer font-bold text-lg items-center gap-3 hover:text-gray-600 text-black"
          >
            <FaArrowLeft className=" cursor-pointer text-gray-500 text-xl" />{" "}
            Medicine Details
          </button>
          <p className="text-sm text-gray-500">
            Complete information about {medicine.medicineName}
          </p>
        </div>

        <button
          onClick={() => navigate(`/edit-medicine/${medicine.medicineId}`)}
          className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white rounded-md text-sm"
        >
          <FaEdit />
          Edit Details
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Image Card */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-300 shadow">
            <img
              src={assets[medicine.medicineImage]}
              alt={medicine.medicineName}
              className="w-full h-70  rounded-lg shadow shadow-gray-400 object-contain mb-3"
            />

            <h3 className=" text-xl font-semibold">{medicine.medicineName}</h3>
            <p className="text-sm text-gray-500">{medicine.genericName}</p>

            <div className="flex gap-2 mt-2">
              <span className="px-3 py-2 bg-green-200 text-green-700  font-medium text-md rounded">
                In Stock
              </span>
              <span className="px-3 py-2 bg-gray-200 font-light text-md rounded">
                {medicine.category}
              </span>
            </div>

            <p className="text-md text-gray-600 mt-3">
              <h2 className="mb-2">Description :</h2>
              {medicine.description}
            </p>
          </div>

          {/* Stock Overview */}
          <div className="bg-white rounded-lg border-2 border-gray-300 shadow">
            <div>
              <p className="font-medium p-3 text-lg ">Stock Overview</p>
              <hr className="w-full mb-3 text-gray-300" />
            </div>
            <div className="p-4">
              <p className="text-md text-gray-600 mb-3">
                Current Stock:{" "}
                <span className="font-semibold">{medicine.quantity} units</span>
              </p>

              <div className="h-3 bg-gray-200 rounded mt-2 ">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{
                    width: `${Math.min((medicine.quantity / 500) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <p className="text-sm px-4 mb-2 text-gray-500 mt-1">
              Min: {medicine.minimumThreshold} | Max: 500
            </p>
          </div>

          {/* Expiry Alert */}
          <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <FaExclamationTriangle />
              <p className="font-semibold text-lg ">Expiry Alert</p>
            </div>
            <p className="text-[15px] text-red-600 mt-1">
              This medicine expires on {medicine.expiryDate}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <InfoCard title="Basic Information">
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
          <InfoCard title="Stock & Pricing Details">
            <IconRow
              icon={<FaBox className="text-purple-600 text-3xl" />}
              label="Batch Number"
              value={medicine.batchNumber}
            />
            <IconRow
              icon={<FaRupeeSign className="text-green-600 text-3xl" />}
              label="Cost Per Unit"
              value={`Rs. ${medicine.costPerUnit}`}
            />
            <IconRow
              icon={<FaRupeeSign className="text-blue-900 text-3xl" />}
              label="Selling Price"
              value={`Rs. ${medicine.sellingPrice}`}
            />
            <IconRow
              icon={<FaWarehouse className="text-orange-500 text-3xl" />}
              label="Storage Location"
              value={medicine.storageLocation}
            />
            <IconRow
              icon={<FaCalendarAlt className="text-red-500 text-3xl" />}
              label="Expiry Date"
              value={medicine.expiryDate}
            />
          </InfoCard>

          {/* Supplier Info */}
          <InfoCard title="Supplier Information">
            <InfoRow label="Supplier Name" value={medicine.supplierName} />
            <InfoRow label="Email" value="sales@phco.com" />
            <InfoRow label="Contact No" value="+91 9876543210" />
          </InfoCard>

          {/* Medical Info */}
          <InfoCard title="Medical Information">
            <InfoRow
              label="Storage Conditions"
              value={medicine.storageConditions}
            />
            <InfoRow
              label="Side Effects"
              value="Nausea, rash, hypersensitivity reactions"
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicineDetails;

/* ---------- Reusable Components ---------- */

const InfoCard = ({ title, children }) => (
  <div className="bg-white  rounded-lg border-2 border-gray-300 shadow">
    <p className="font-semibold p-4 text-lg ">{title}</p>
    <hr className="text-gray-300" />
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3">{children}</div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="space-y-2 p-1">
    <p className="text-md text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

const IconRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="p-2  bg-gray-200 rounded">{icon}</div>
    <div className="p-3 ">
      <p className="text-md mb-2 text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);
