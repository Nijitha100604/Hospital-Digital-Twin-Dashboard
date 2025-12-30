import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

import {
  FaSearch,
  FaRupeeSign,
  FaBox,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaEye,
  FaHospitalUser,
  FaBell,
  FaPlus,
  FaFilter,
} from "react-icons/fa";
import { medicine_records } from "../../data/medicine";

const MedicineStocks = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------- Helpers ---------- */
  const today = new Date();

  // Initialize navigate
  const navigate = useNavigate();

  const isExpiringSoon = (dateStr) => {
    const expiry = new Date(dateStr);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 180;
  };

  const getStockStatus = (m) => {
    if (m.quantity <= m.minimumThreshold) return "Low Stock";
    return "In Stock";
  };

  /* ---------- Filters ---------- */
  const filteredMedicines = useMemo(() => {
    return medicine_records.filter((m) => {
      const matchesSearch =
        m.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        m.medicineId.toLowerCase().includes(search.toLowerCase()) ||
        m.batchNumber.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || m.category === categoryFilter;

      const status = getStockStatus(m);
      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, categoryFilter, statusFilter]);

  /* ---------- Summary ---------- */
  const totalItems = medicine_records.length;
  const lowStockCount = medicine_records.filter(
    (m) => m.quantity <= m.minimumThreshold
  ).length;
  const expiringSoonCount = medicine_records.filter((m) =>
    isExpiringSoon(m.expiryDate)
  ).length;

  const categories = [
    "All",
    ...new Set(medicine_records.map((m) => m.category)),
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header + Actions */}
      <div className="flex flex-col md:flex-row justify-between mb-5 gap-4">
        <div>
          <div className="flex gap-3 items-center">
            <FaHospitalUser size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Medicine Stock Management
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            Monitor and manage pharmacy inventory
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <button className="relative flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md text-sm cursor-pointer">
            <FaBell />
            Alerts
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
              {lowStockCount}
            </span>
          </button>

          <button
  onClick={() => navigate("/add-new-medicine")}
  className="flex items-center gap-2 px-4 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white rounded-md text-sm cursor-pointer"
>
  <FaPlus />
  Add New Medicine
</button>

        </div>
      </div>

      {/* Summary Cards*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Items"
          value={totalItems}
          icon={<FaBox className="text-purple-600 text-xl" />}
        />
        <SummaryCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<FaExclamationTriangle className="text-yellow-600 text-xl" />}
        />
        <SummaryCard
          title="Expiring Soon"
          value={expiringSoonCount}
          icon={<FaCalendarAlt className="text-red-600 text-xl" />}
        />
        <SummaryCard
          title="Total Value"
          value={totalItems}
          icon={<FaRupeeSign className="text-green-600  bg-gre text-xl" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-5 mb-6">
        {/* Search */}
        <div className="relative w-full flex-1 md:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by medicine, ID, or batch"
            className="pl-10 pr-3 py-2 rounded-md w-full border bg-gray-300 border-gray-400
                 focus:ring-1 focus:ring-fuchsia-600 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-5">
          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="pl-9 h-10 pr-3 py-2 cursor-pointer rounded-md border border-gray-400
                   focus:ring-1 focus:ring-fuchsia-600 outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="pl-9 h-10 pr-3 py-2 cursor-pointer rounded-md border border-gray-400
                   focus:ring-1 focus:ring-fuchsia-600 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Medicine Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMedicines.map((m) => (
          <MedicineCard
            key={m.medicineId}
            medicine={m}
            status={getStockStatus(m)}
            expiring={isExpiringSoon(m.expiryDate)}
          />
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-6">
        Showing {filteredMedicines.length} of {medicine_records.length}{" "}
        medicines
      </p>
    </div>
  );
};

export default MedicineStocks;

/* ---------- Components ---------- */

const SummaryCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow  border border-gray-300 p-4 flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className="p-3 bg-gray-300 rounded-lg">{icon}</div>
  </div>
);

const MedicineCard = ({ medicine, status, expiring }) => (
  <div className="bg-white w-full rounded-xl border border-gray-300 shadow hover:shadow-2xl hover:shadow-gray-500 transition overflow-hidden">
    {/* Image with badges */}
    <div className="relative h-40 bg-gray-100 flex items-center justify-center">
      <img
        src={assets[medicine.medicineImage]}
        alt={medicine.medicineName}
        className="object-contain h-full w-250"
      />

      <div className="absolute top-2 left-2 right-2 flex justify-between">
        {expiring ? (
          <span className="text-xs flex gap-1 bg-red-500 text-white px-2 py-1 rounded">
            <FaExclamationTriangle className="mt-0.5" />
            Expiring Soon
          </span>
        ) : (
          <span />
        )}

        <span
          className={`text-xs px-2 py-1 rounded text-white ${
            status === "Low Stock" ? "bg-yellow-600" : "bg-green-500"
          }`}
        >
          {status}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="p-4">
      <h3 className="font-semibold">{medicine.medicineName}</h3>
      <p className="text-xs p-2 bg-blue-100 w-fit border border-gray-400 rounded-xl text-gray-500 mb-3">
        {medicine.category}
      </p>

      <div className="text-sm ml-4 text-gray-600 grid grid-cols-2 gap-y-1">
        <span className="font-medium text-gray-500">ID</span>
        <span>{medicine.medicineId}</span>

        <span className="font-medium text-gray-500">Quantity</span>
        <span>{medicine.quantity}</span>

        <span className="font-medium text-gray-500">Batch</span>
        <span>{medicine.batchNumber}</span>

        <span className="font-medium text-gray-500">Expiry</span>
        <span>{medicine.expiryDate}</span>
      </div>

      <hr className="my-3 text-gray-400" />

      <button className="w-full cursor-pointer flex items-center justify-center gap-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white py-2 rounded-md text-sm">
        <FaEye />
        View Details
      </button>
    </div>
  </div>
);
