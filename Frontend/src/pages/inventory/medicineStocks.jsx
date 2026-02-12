import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../Loading";

import {
  FaSearch,
  FaCheckCircle,
  FaBox,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaEye,
  FaHospitalUser,
  FaBell,
  FaPlus,
  FaFilter,
  FaBoxOpen,
} from "react-icons/fa";

const MedicineStocks = () => {
  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  const {
    medicines: medicineList,
    loading,
    fetchMedicines,
  } = useContext(MedicineContext);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const isExpiringSoon = (dateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(dateStr);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 90;
  };

  const getStockStatus = (m) => {
    if (m.quantity <= m.minimumThreshold) return "Low Stock";
    return "In Stock";
  };

  // Filters
  const filteredMedicines = useMemo(() => {
    return medicineList.filter((m) => {
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
  }, [search, categoryFilter, statusFilter, medicineList]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(8);
  }, [search, categoryFilter, statusFilter]);

  // --- Summary & Alert Calculations ---
  const totalItems = medicineList.length;

  const lowStockCount = medicineList.filter(
    (m) => m.quantity <= m.minimumThreshold,
  ).length;

  const expiringSoonCount = medicineList.filter((m) =>
    isExpiringSoon(m.expiryDate),
  ).length;

  const inStockCount = medicineList.filter(
    (m) => m.quantity > m.minimumThreshold
  ).length;

  const totalAlerts = lowStockCount + expiringSoonCount;

  const categories = ["All", ...new Set(medicineList.map((m) => m.category))];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-fuchsia-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaHospitalUser size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Medicine Stock Management
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Monitor and manage pharmacy inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row align-items-stretch sm:items-center gap-3 items-center w-full md:w-auto">
          {/* Alerts button */}
          <button
            onClick={() => navigate("/stock-alerts")}
            className="relative cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaBell
              className={`text-lg ${totalAlerts > 0 ? "text-red-500" : "text-gray-500"}`}
            />
            Alerts
            {totalAlerts > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-5 text-center">
                {totalAlerts}
              </span>
            )}
          </button>

          {userData &&
            (userData.designation === "Pharmacist" ||
              userData.designation === "Admin") && (
              <button
                onClick={() => navigate("/add-new-medicine")}
                className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
              >
                <FaPlus />
                Add New Medicine
              </button>
            )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Items"
          value={totalItems}
          icon={<FaBox className="text-purple-600" />}
          bg="bg-purple-100"
          border="border-purple-200"
        />

        <SummaryCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={<FaExclamationTriangle className="text-yellow-600" />}
          bg="bg-yellow-100"
          border="border-yellow-200"
        />

        <SummaryCard
          title="Expiring Soon"
          value={expiringSoonCount}
          icon={<FaCalendarAlt className="text-red-600" />}
          bg="bg-red-100"
          border="border-red-200"
        />

        <SummaryCard
          title="In Stock Items"
          value={inStockCount}
          icon={<FaCheckCircle className="text-green-600" />}
          bg="bg-green-100"
          border="border-green-200"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by medicine, ID, or batch"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Category */}
            <div className="relative w-full md:w-48">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="relative w-full md:w-48">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
              >
                <option value="All">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Cards Grid */}
      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMedicines.slice(0, visibleCount).map((m) => (
            <MedicineCard
              key={m.medicineId}
              medicine={m}
              status={getStockStatus(m)}
              expiring={isExpiringSoon(m.expiryDate)}
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FaBoxOpen className="text-gray-300 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No medicines found
          </h3>
          <p className="text-gray-500 text-sm">
            {medicineList.length === 0
              ? "Your inventory is currently empty."
              : "We couldn't find any matches for your search filters."}
          </p>

          {/* Role Based Access in Empty State */}
          {medicineList.length === 0 &&
            userData &&
            (userData.designation === "Pharmacist" ||
              userData.designation === "Admin") && (
              <button
                onClick={() => navigate("/add-new-medicine")}
                className="mt-4 px-5 py-2 bg-fuchsia-800 text-white rounded-lg text-sm font-medium hover:bg-fuchsia-900 transition-colors"
              >
                Add First Medicine
              </button>
            )}
        </div>
      )}

      {/* --- Show More / Show Less Buttons --- */}
      <div className="flex justify-center gap-4 mt-8">
        {visibleCount < filteredMedicines.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-2.5 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:text-fuchsia-800 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            Show More Medicines
          </button>
        )}

        {visibleCount > 8 && (
          <button
            onClick={() => setVisibleCount(8)}
            className="px-6 py-2.5 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-800 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            Show Less
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Showing {Math.min(visibleCount, filteredMedicines.length)} of{" "}
        {filteredMedicines.length} medicines
      </p>
    </div>
  );
};

export default MedicineStocks;

/* ---------- Internal Components---------- */
const SummaryCard = ({ title, value, icon, bg, border }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3.5 rounded-xl text-xl ${bg} ${border} border`}>
      {icon}
    </div>
  </div>
);

const MedicineCard = ({ medicine, status, expiring, navigate }) => {
  const displayedImage =
    medicine.medicineImage && medicine.medicineImage.startsWith("http")
      ? medicine.medicineImage
      : assets[medicine.medicineImage] || assets.placeholder;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
        <img
          src={displayedImage}
          alt={medicine.medicineName}
          crossOrigin="anonymous"
          className="object-contain h-full w-full group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          {expiring ? (
            <span className="text-[11px] font-semibold flex gap-1 items-center bg-red-500/90 backdrop-blur text-white px-3 py-1 rounded-sm shadow-sm">
              <FaExclamationTriangle />
              Expiring
            </span>
          ) : (
            <span />
          )}
          <span
            className={`text-[11px] font-semibold px-3 py-1 rounded-sm text-white shadow-sm ${
              status === "Low Stock"
                ? "bg-yellow-600/90 backdrop-blur"
                : "bg-green-600/90 backdrop-blur"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
            {medicine.medicineName}
          </h3>
        </div>
        <div className="mb-4">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
            {medicine.category}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-5 flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              ID
            </span>
            <span className="font-mono text-xs">{medicine.medicineId}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Stock
            </span>
            <span className="font-semibold text-gray-700">
              {medicine.quantity}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Batch
            </span>
            <span className="text-xs truncate">{medicine.batchNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Expiry
            </span>
            <span className="text-xs">{medicine.expiryDate}</span>
          </div>
        </div>
        <button
          onClick={() => {
            navigate(`/medicine-details/${medicine.medicineId}`);
            window.scrollTo(0, 0);
          }}
          className="w-full mt-auto cursor-pointer flex items-center justify-center gap-2 bg-pink-700 hover:bg-pink-600 active:bg-fuchsia-950 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FaEye />
          View Details
        </button>
      </div>
    </div>
  );
};