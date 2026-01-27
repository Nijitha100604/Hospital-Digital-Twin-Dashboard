import React, { useState, useMemo, useContext, useEffect, useRef } from "react";
import {
  FaExclamationTriangle,
  FaCalendarAlt,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaEye,
  FaBoxOpen,
  FaFilePdf,
  FaTrashAlt,
  FaTimesCircle,
  FaCheckSquare,
  FaSquare,
  FaEllipsisV,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockAlerts = () => {
  const navigate = useNavigate();
  const { medicines, loading, fetchMedicines } = useContext(MedicineContext);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // State for interactions
  const [hiddenIds, setHiddenIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectionMode, setSelectionMode] = useState(null); 
  const [activeMenu, setActiveMenu] = useState(null); 

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  /* ---------- Logic Helpers ---------- */
  const daysLeft = (d) => {
    const expiry = new Date(d);
    expiry.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (expiry - today) / (1000 * 60 * 60 * 24);
  };

  /* ---------- Data Processing ---------- */
  const filteredData = useMemo(() => {
    const base = medicines.filter(
      (m) =>
        !hiddenIds.includes(m.medicineId) &&
        (m.medicineName.toLowerCase().includes(search.toLowerCase()) ||
          m.medicineId.toLowerCase().includes(search.toLowerCase()) ||
          m.category.toLowerCase().includes(search.toLowerCase())),
    );

    let expired = [],
      lowStock = [],
      expiringSoon = [];

    base.forEach((m) => {
      const d = daysLeft(m.expiryDate);
      if (d <= 0) expired.push(m);
      else if (d > 0 && d <= 90) expiringSoon.push(m);

      if (m.quantity <= m.minimumThreshold && d > 0) lowStock.push(m);
    });

    return { expired, lowStock, expiringSoon };
  }, [search, medicines, hiddenIds]);

  const { expired, lowStock, expiringSoon } = filteredData;

  /* ---------- Actions ---------- */
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleConfirmRemove = () => {
    setHiddenIds((prev) => [...prev, ...selectedIds]);
    setSelectedIds([]);
    setSelectionMode(null);
  };

  const handleDownloadPDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(`${title} Report`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);

    const tableRows = data.map((item) => [
      item.medicineName,
      item.medicineId,
      item.batchNumber,
      item.quantity,
      item.minimumThreshold,
      item.expiryDate,
      item.supplierName,
    ]);

    autoTable(doc, {
      head: [
        [
          "Medicine Name",
          "ID",
          "Batch",
          "Stock",
          "Threshold",
          "Expiry",
          "Supplier",
        ],
      ],
      body: tableRows,
      startY: 35,
      theme: "grid",
      headStyles: { fillColor: [162, 28, 175] },
    });
    doc.save(`${title}.pdf`);
  };

  if (loading) return <Loading />;

  /* ---------- Render Helper ---------- */
  const renderSection = (title, type, data, theme, icon) => {
    // If filter is active, hide other sections
    if (filterType !== "ALL" && filterType !== type) return null;

    const isSelecting = selectionMode === type;
    const isMenuOpen = activeMenu === type;

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8 overflow-visible">
        {/* Header */}
        <div
          className={`px-6 py-4 border-b border-gray-100 flex justify-between items-center rounded-t-xl ${theme.bg}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`p-2 rounded-lg bg-white shadow-sm ${theme.iconColor}`}
            >
              {icon}
            </span>
            <div>
              <h2 className="font-bold text-lg text-gray-800 leading-tight">
                {title}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {data.length} items
              </p>
            </div>
          </div>

          {/* Controls */}
          <div
            className="flex items-center gap-2 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {isSelecting ? (
              <div className="flex items-center gap-2 animate-fadeIn">
                <button
                  onClick={() => {
                    setSelectionMode(null);
                    setSelectedIds([]);
                  }}
                  className="px-3 py-1.5 cursor-pointer text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  disabled={selectedIds.length === 0}
                  className={`flex items-center cursor-pointer gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition-all shadow-sm ${
                    selectedIds.length > 0
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-300 cursor-not-allowed"
                  }`}
                >
                  <FaTrashAlt /> Remove ({selectedIds.length})
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(isMenuOpen ? null : type)}
                  className="p-2 cursor-pointer text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaEllipsisV />
                </button>

                {/* 3-Dot Dropdown */}
                {isMenuOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 animate-fadeIn transform origin-top-right">
                    <button
                      disabled={data.length === 0}
                      onClick={() => {
                        handleDownloadPDF(data, title);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-700 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaFilePdf className="cursor-pointer text-gray-400" /> Download List
                    </button>
                    <button
                      disabled={data.length === 0}
                      onClick={() => {
                        setSelectionMode(type);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left cursor-pointer px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaTrashAlt className="cursor-pointer text-red-400" /> Remove Items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {data.length > 0 ? (
            <div className="grid gap-4">
              {data.map((m) => (
                <AlertCard
                  key={m.medicineId}
                  medicine={m}
                  type={type}
                  theme={theme}
                  days={daysLeft(m.expiryDate)}
                  isSelecting={isSelecting}
                  isSelected={selectedIds.includes(m.medicineId)}
                  onToggle={() => toggleSelection(m.medicineId)}
                  navigate={navigate}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                <FaCheck className="text-green-500 text-xl" />
              </div>
              <p className="text-gray-500 font-medium">
                No {title.toLowerCase()} right now.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm gap-4">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaExclamationTriangle
              size={24}
              className="text-gray-500 text-xl"
            />

            <p className="text-gray-800 font-bold text-lg">Inventory Alerts</p>
          </div>

          <p className="text-gray-500 text-sm mt-1">
            Monitor expired stock, low inventory, and upcoming expirations.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-fuchsia-600 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 rounded-xl w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-100 focus:border-fuchsia-500 outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative w-40">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-100 focus:border-fuchsia-500 outline-none appearance-none cursor-pointer hover:border-gray-400 transition-colors"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">All Alerts</option>
              <option value="EXPIRED">Expired</option>
              <option value="LOW">Low Stock</option>
              <option value="EXPIRING">Expiring</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Expired Items"
          value={expired.length}
          icon={<FaTimesCircle />}
          color="rose"
        />
        <SummaryCard
          title="Low Stock"
          value={lowStock.length}
          icon={<FaExclamationTriangle />}
          color="amber"
        />
        <SummaryCard
          title="Expiring Soon"
          value={expiringSoon.length}
          icon={<FaCalendarAlt />}
          color="blue"
        />
      </div>

      {/* Render Sections */}
      {renderSection(
        "Expired Medicines",
        "EXPIRED",
        expired,
        {
          bg: "bg-rose-100",
          iconColor: "text-rose-600",
          border: "border-rose-200",
          badge: "bg-rose-100 text-rose-700",
        },
        <FaTimesCircle />,
      )}

      {renderSection(
        "Low Stock Alerts",
        "LOW",
        lowStock,
        {
          bg: "bg-amber-100",
          iconColor: "text-amber-600",
          border: "border-amber-200",
          badge: "bg-amber-100 text-amber-800",
        },
        <FaExclamationTriangle />,
      )}

      {renderSection(
        "Expiring Soon",
        "EXPIRING",
        expiringSoon,
        {
          bg: "bg-blue-100",
          iconColor: "text-blue-600",
          border: "border-blue-200",
          badge: "bg-blue-100 text-blue-700",
        },
        <FaCalendarAlt />,
      )}
    </div>
  );
};

export default StockAlerts;

/* ================= SUB-COMPONENTS ================= */

const AlertCard = ({
  medicine,
  type,
  theme,
  days,
  isSelecting,
  isSelected,
  onToggle,
  navigate,
}) => {
  return (
    <div
      className={`
        bg-white border rounded-xl p-4 transition-all duration-200 group
        ${isSelected ? "border-fuchsia-500 bg-fuchsia-50/20 ring-1 ring-fuchsia-500" : "border-gray-200 hover:border-fuchsia-300 hover:shadow-md"}
      `}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Conditional Selection Checkbox */}
        {isSelecting && (
          <div className="flex items-center justify-center pt-1 animate-fadeIn">
            <button
              onClick={onToggle}
              className="text-2xl transition-transform active:scale-90 text-gray-300 hover:text-fuchsia-600"
            >
              {isSelected ? (
                <FaCheckSquare className="text-fuchsia-600" />
              ) : (
                <FaSquare />
              )}
            </button>
          </div>
        )}

        <div className="flex-1 w-full">
          {/* Card Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                {medicine.medicineName}
                <span className="text-[10px] uppercase font-bold text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded bg-gray-50">
                  {medicine.strength}
                </span>
              </h3>
              <p className="text-xs text-gray-400  mt-1 flex items-center gap-2">
                <span>ID: {medicine.medicineId}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>Batch: {medicine.batchNumber}</span>
              </p>
            </div>

            {/* Status Badge */}
            <div className="text-right">
              {type === "EXPIRED" && (
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  Expired {Math.abs(Math.floor(days))} days ago
                </span>
              )}
              {type === "EXPIRING" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  Expires in {Math.ceil(days)} days
                </span>
              )}
              {type === "LOW" && (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  Low Stock
                </span>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                Stock
              </p>
              <p
                className={`font-bold text-sm ${type === "LOW" ? "text-amber-600" : "text-gray-700"}`}
              >
                {medicine.quantity}{" "}
                <span className="text-gray-400 text-[10px] font-normal">
                  / {medicine.minimumThreshold}
                </span>
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                Expiry
              </p>
              <p
                className={`font-bold text-sm ${type !== "LOW" ? "text-rose-600" : "text-gray-700"}`}
              >
                {medicine.expiryDate}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                Category
              </p>
              <p className="text-gray-700 font-medium">{medicine.category}</p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                Supplier
              </p>
              <p className="text-gray-700 font-medium truncate">
                {medicine.supplierName}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
          <button
            onClick={() =>
              navigate("/create-purchase-order", {
                state: { medicineId: medicine.medicineId },
              })
            }
            className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95"
          >
            <FaShoppingCart /> Order
          </button>
          <button
            onClick={() => navigate(`/medicine-details/${medicine.medicineId}`)}
            className="flex-1 cursor-pointer md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 hover:border-fuchsia-300 hover:text-fuchsia-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
          >
            <FaEye /> Details
          </button>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => {
  const styles = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-5 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow`}
    >
      <div>
        <p className="text-sm font-medium text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-xl text-xl border ${styles[color]}`}>
        {icon}
      </div>
    </div>
  );
};
