import React, { useState, useMemo, useContext, useEffect } from "react";
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
  FaCheck,
  FaDownload,
  FaListUl,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AppContext } from "../../context/AppContext";

const StockAlerts = () => {
  const navigate = useNavigate();
  const { medicines, loading, fetchMedicines } = useContext(MedicineContext);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const {userData} = useContext(AppContext)

  // Interaction State
  const [hiddenIds, setHiddenIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const daysLeft = (d) => {
    const expiry = new Date(d);
    expiry.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (expiry - today) / (1000 * 60 * 60 * 24);
  };

  const processedData = useMemo(() => {
    const base = medicines.filter(
      (m) => !hiddenIds.includes(m.medicineId)
    );

    let expired = [], lowStock = [], expiringSoon = [];

    base.forEach((m) => {
      const d = daysLeft(m.expiryDate);
      const isLow = m.quantity <= m.minimumThreshold;
      
      // Assign Status Flags for Table
      const item = { ...m, daysRemaining: d };

      if (d <= 0) {
        expired.push({ ...item, alertType: "EXPIRED" });
      } else if (d > 0 && d <= 90) {
        expiringSoon.push({ ...item, alertType: "EXPIRING" });
      }
      
      if (isLow && d > 0) {
        lowStock.push({ ...item, alertType: "LOW" });
      }
    });

    return { expired, lowStock, expiringSoon };
  }, [medicines, hiddenIds]);

  const tableData = useMemo(() => {
    let data = [];
    const { expired, lowStock, expiringSoon } = processedData;

    if (filterType === "ALL") {
      const combined = [...expired, ...lowStock, ...expiringSoon];
      const uniqueIds = new Set();
      data = combined.filter(item => {
        if (!uniqueIds.has(item.medicineId)) {
          uniqueIds.add(item.medicineId);
          return true;
        }
        return false;
      });
    } else if (filterType === "EXPIRED") {
      data = expired;
    } else if (filterType === "LOW") {
      data = lowStock;
    } else if (filterType === "EXPIRING") {
      data = expiringSoon;
    }

    // Apply Search
    return data.filter(m => 
      m.medicineName.toLowerCase().includes(search.toLowerCase()) ||
      m.medicineId.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [processedData, filterType, search]);

  /*Action */
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirmRemove = () => {
    setHiddenIds((prev) => [...prev, ...selectedIds]);
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Inventory Alerts Report (${filterType})`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);

    const tableRows = tableData.map((item) => [
      item.medicineName,
      item.medicineId,
      item.batchNumber,
      item.quantity,
      item.minimumThreshold,
      item.expiryDate,
      item.alertType
    ]);

    autoTable(doc, {
      head: [["Medicine Name", "ID", "Batch", "Stock", "Threshold", "Expiry", "Status"]],
      body: tableRows,
      startY: 35,
      theme: "grid",
      headStyles: { fillColor: [162, 28, 175] },
    });
    doc.save(`Alerts_Report.pdf`);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* --- Header --- */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaExclamationTriangle className="text-gray-500 text-2xl" />
            <p className="text-gray-800 font-bold text-lg">Inventory Alerts</p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Monitor expired stock, low inventory, and upcoming expirations
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          { userData && (userData?.designation === 'Pharmacist' || userData?.designation === 'Admin') &&( <button
            onClick={handleDownloadPDF}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaDownload /> Download List
          </button> )}


          {userData && (userData?.designation === 'Pharmacist' || userData?.designation === 'Admin') && (<button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedIds([]);
            }}
            className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto ${
              isSelectionMode 
                ? "bg-gray-200 text-gray-800" 
                : "bg-fuchsia-800 hover:bg-fuchsia-900 text-white"
            }`}
          >
            <FaListUl /> {isSelectionMode ? "Cancel Selection" : "Manage Items"}
          </button>)}

        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          title="Expired Items"
          value={processedData.expired.length}
          icon={<FaTimesCircle className="text-red-600" />}
          bg="bg-red-100"
          border="border-red-200"
        />
        <SummaryCard
          title="Low Stock"
          value={processedData.lowStock.length}
          icon={<FaExclamationTriangle className="text-yellow-600" />}
          bg="bg-yellow-100"
          border="border-yellow-200"
        />
        <SummaryCard
          title="Expiring Soon"
          value={processedData.expiringSoon.length}
          icon={<FaCalendarAlt className="text-blue-600" />}
          bg="bg-blue-100"
          border="border-blue-200"
        />
      </div>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        
        {/* Toolbar (Search & Filter) */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            
            {/* Search */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by medicine, ID or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            {/* Filter & Actions */}
            <div className="flex gap-4 items-center w-full md:w-auto">
              {isSelectionMode && selectedIds.length > 0 && (
                <button
                  onClick={handleConfirmRemove}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                >
                  <FaTrashAlt /> Remove ({selectedIds.length})
                </button>
              )}

              <div className="relative w-full md:w-48">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                >
                  <option value="ALL">All Alerts</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="LOW">Low Stock</option>
                  <option value="EXPIRING">Expiring</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* --- Table--- */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-fuchsia-50 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                {isSelectionMode && <th className="px-6 py-4 w-10"></th>}
                <th className="px-6 py-4">Medicine Name</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tableData.length > 0 ? (
                tableData.map((m) => (
                  <tr 
                    key={m.medicineId} 
                    className={`hover:bg-gray-50 transition-colors group ${selectedIds.includes(m.medicineId) ? 'bg-fuchsia-50/50' : ''}`}
                  >
                    {/* Checkbox Column */}
                    {isSelectionMode && (
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleSelection(m.medicineId)} 
                          className="text-lg text-gray-400 hover:text-fuchsia-600 transition-colors"
                        >
                          {selectedIds.includes(m.medicineId) ? (
                            <FaCheckSquare className="text-fuchsia-600" />
                          ) : (
                            <FaSquare />
                          )}
                        </button>
                      </td>
                    )}

                    {/* Data Columns */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 text-base">{m.medicineName}</span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          ID: {m.medicineId} <span className="text-gray-300">•</span> {m.strength}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${m.alertType === 'LOW' ? 'text-amber-600' : 'text-gray-700'}`}>
                          {m.quantity}
                        </span>
                        <span className="text-xs text-gray-400">/ {m.minimumThreshold}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${m.alertType !== 'LOW' ? 'text-red-600' : 'text-gray-700'}`}>
                          {m.expiryDate}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium">
                          {m.alertType === 'EXPIRED' && `${Math.abs(Math.floor(m.daysRemaining))} days ago`}
                          {m.alertType === 'EXPIRING' && `In ${Math.ceil(m.daysRemaining)} days`}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600 max-w-37.5 truncate">
                      {m.supplierName}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge type={m.alertType} />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        {userData && (userData?.designation === 'Pharmacist' || userData?.designation === 'Admin') && (<button
                          onClick={() => navigate("/create-purchase-order", { state: { medicineId: m.medicineId } })}
                          className="p-2 text-gray-400 cursor-pointer hover:text-fuchsia-700 hover:bg-fuchsia-50 rounded-full transition-colors"
                          title="Order Stock"
                        >
                          <FaShoppingCart />
                        </button>)}
                        <button
                          onClick={() => navigate(`/medicine-details/${m.medicineId}`)}
                          className="p-2 text-gray-400 cursor-pointer hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isSelectionMode ? 7 : 6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                        <FaBoxOpen className="text-gray-300 text-2xl" />
                      </div>
                      <p className="text-gray-500 font-medium">No alerts found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Info (Simulating Pagination Look) */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            Showing <span className="font-bold text-gray-800">{tableData.length}</span> critical items requiring attention.
          </p>
        </div>

      </div>
    </div>
  );
};

export default StockAlerts;

/* ================= HELPER COMPONENTS ================= */

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

const StatusBadge = ({ type }) => {
  const styles = {
    EXPIRED: "bg-red-50 text-red-700 border-red-200",
    LOW: "bg-amber-50 text-amber-700 border-amber-200",
    EXPIRING: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const labels = {
    EXPIRED: "Expired",
    LOW: "Low Stock",
    EXPIRING: "Expiring Soon"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {labels[type]}
    </span>
  );
};