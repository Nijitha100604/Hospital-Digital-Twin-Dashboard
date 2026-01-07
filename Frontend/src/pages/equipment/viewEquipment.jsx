import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { equipment_records } from "../../data/equipment"; // Ensure this path is correct
import { assets } from "../../assets/assets";

import {
  FaArrowLeft,
  FaEdit,
  FaMicroscope,
  FaCalendarAlt,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTools,
  FaBan,
  FaInfoCircle,
  FaCogs,
  FaFileInvoiceDollar,
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";

const ViewEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const equipment = equipment_records.find((e) => e.equipmentId === id);

  if (!equipment) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
            <FaExclamationTriangle />
          </div>
          <p className="text-gray-800 font-bold text-lg">Equipment Not Found</p>
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

  // Helper for status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Working": return "bg-green-100 text-green-700 border-green-200";
      case "Under Maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Offline": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Working": return <FaCheckCircle className="mr-2" />;
      case "Under Maintenance": return <FaTools className="mr-2" />;
      case "Offline": return <FaBan className="mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-fuchsia-100 rounded-lg text-fuchsia-700">
              <FaMicroscope className="text-xl" />
            </div>
            <h1 className="font-bold text-2xl text-gray-800">
              {equipment.equipmentName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wide">
              {equipment.equipmentId}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-12">
            Complete information about {equipment.modelName}
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto cursor-pointer"
          >
            <FaArrowLeft />
            Back
          </button>

          <button
            onClick={() => navigate(`/edit-equipment/${equipment.equipmentId}`)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto cursor-pointer"
          >
            <FaEdit />
            Edit Details
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Image & Service Info */}
        <div className="space-y-6">
          
          {/* Image & Description Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-gray-50 rounded-lg p-6 mb-4 flex items-center justify-center border border-gray-100">
              <img
                src={assets[equipment.equipmentImage]}
                alt={equipment.equipmentName}
                className="w-full h-64 object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {equipment.equipmentName}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                {equipment.modelName}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`px-3 py-1 border text-xs font-bold rounded-full flex items-center ${getStatusColor(equipment.equipmentStatus)}`}>
                {getStatusIcon(equipment.equipmentStatus)}
                {equipment.equipmentStatus}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-full">
                {equipment.category}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed">
                {equipment.description}
              </p>
            </div>
          </div>

          {/* Service Status Card (Replaces Stock Overview) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
              <p className="font-bold text-gray-800">Service Status</p>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Service</span>
                <span className="text-sm font-bold text-gray-800">{equipment.lastService}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Next Due</span>
                <span className="text-sm font-bold text-gray-800">{equipment.nextService}</span>
              </div>

              <div className="pt-2">
                <div className="w-full bg-fuchsia-900 text-white cursor-pointer text-center py-2 rounded-lg text-sm font-medium shadow-sm">
                  {equipment.equipmentStatus === "Working" ? "Scheduled Device" : "Check Schedule"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Details Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <InfoCard title="Basic Information" icon={<FaInfoCircle />}>
            <InfoRow label="Equipment ID" value={equipment.equipmentId} />
            <InfoRow label="Serial Number" value={equipment.serialNumber} />
            <InfoRow label="Model" value={equipment.modelName} />
            <InfoRow label="Manufacturer" value={equipment.manufacturer} />
            <InfoRow label="Category" value={equipment.category} />
            <InfoRow label="Department" value={equipment.department} />
            <InfoRow label="Location" value={equipment.location} fullWidth />
          </InfoCard>

          {/* Technical Specifications */}
          <InfoCard title="Technical Specifications" icon={<FaCogs />}>
            <InfoRow label="Field Strength" value={equipment.fieldStrength} />
            <InfoRow label="Bore Size" value={equipment.boreSize} />
            <InfoRow label="Max Gradient" value={equipment.maxGradient} />
            <InfoRow label="Slew Rate" value={equipment.slewRate} />
            <InfoRow label="Power Requirement" value={equipment.powerRequirement} fullWidth />
          </InfoCard>

          {/* Purchase & Warranty Details */}
          <InfoCard title="Purchase & Warranty Details" icon={<FaFileInvoiceDollar />}>
            <IconRow
              icon={<FaCalendarAlt className="text-purple-600" />}
              label="Installation Date"
              value={equipment.installationDate}
              bgColor="bg-purple-50"
            />
            <IconRow
              icon={<FaRupeeSign className="text-emerald-600" />}
              label="Purchase Cost"
              value={equipment.purchaseCost}
              bgColor="bg-emerald-50"
            />
            <IconRow
              icon={<FaClock className="text-blue-600" />}
              label="Warranty Period"
              value={equipment.warrantyPeriod}
              bgColor="bg-blue-50"
            />
            <IconRow
              icon={<FaCalendarAlt className="text-orange-600" />}
              label="Warranty Expiry"
              value={equipment.warrantyExpiry}
              bgColor="bg-orange-50"
            />
          </InfoCard>

          {/* Supplier Information */}
          <InfoCard title="Supplier Information" icon={<FaTruck />}>
            <InfoRow label="Supplier Name" value={equipment.supplierName} />
            <InfoRow label="Contact Number" value={equipment.contactNumber} />
            <InfoRow label="Email ID" value={equipment.emailId} fullWidth />
          </InfoCard>

        </div>
      </div>
    </div>
  );
};

export default ViewEquipment;

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

const InfoRow = ({ label, value, fullWidth }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? "md:col-span-2" : ""}`}>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </p>
    <p className="text-sm font-semibold text-gray-700">
      {value === "N/A" ? <span className="text-gray-400 italic">N/A</span> : value || "N/A"}
    </p>
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