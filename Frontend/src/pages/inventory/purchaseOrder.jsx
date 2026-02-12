import React, { useMemo, useState, useContext, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaClipboardList,
  FaPlus,
  FaEdit,
  FaTrash,
  FaShoppingCart,
  FaListUl,
  FaTrashAlt,
  FaCheckSquare,
  FaSquare,
  FaArrowLeft,
  FaArrowRight,
  FaBuilding,
  FaHashtag
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const { purchaseOrders, loading, fetchPurchaseOrders, deletePurchaseOrder } =
    useContext(MedicineContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { userData } = useContext(AppContext);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((o) => {
      const matchesSearch =
        o.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, search, statusFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const totalCount = purchaseOrders.length;
  const requestedCount = purchaseOrders.filter(
    (o) => o.status === "Requested"
  ).length;
  const orderedCount = purchaseOrders.filter(
    (o) => o.status === "Ordered"
  ).length;
  const receivedCount = purchaseOrders.filter(
    (o) => o.status === "Received"
  ).length;

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentOrders.length) {
      setSelectedIds([]); 
    } else {
      setSelectedIds(currentOrders.map((o) => o.orderId));
    }
  };

  const handleDeleteSingle = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to permanently remove this purchase order?"
    );
    if (confirm) {
      await deletePurchaseOrder(orderId);
    }
  };

  const handleDeleteBatch = async () => {
    if (selectedIds.length === 0) return;

    const confirm = window.confirm(
      `Are you sure you want to permanently remove ${selectedIds.length} selected orders?`
    );
    
    if (confirm) {
      await Promise.all(selectedIds.map((id) => deletePurchaseOrder(id)));
      toast.success(`${selectedIds.length} orders removed successfully`);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaShoppingCart className="text-gray-500 text-2xl" />
            <p className="text-gray-800 font-bold text-lg">Purchase Orders</p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Create and track procurement requests
          </p>
        </div>

        <div className="flex flex-col sm:flex-row align-items-stretch sm:items-center gap-3 items-center w-full md:w-auto">
          {userData && (userData?.designation === 'Pharmacist' || userData?.designation === 'Admin') &&(
            <button
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
              }}
              className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto ${
                isSelectionMode 
                  ? "bg-gray-200 text-gray-800" 
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaListUl /> {isSelectionMode ? "Cancel Selection" : "Manage Items"}
            </button>
          )}

          {userData && (userData?.designation === 'Pharmacist' || userData?.designation === 'Admin' ) && (
            <button
              onClick={() => navigate("/create-purchase-order")}
              className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
            >
              <FaPlus />
              Create New Order
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          title="Total Orders"
          value={totalCount}
          icon={<FaClipboardList />}
          bg="bg-purple-50"
          color="text-purple-600"
          border="border-purple-200"
        />
        <SummaryCard
          title="Requested"
          value={requestedCount}
          icon={<FaClock />}
          bg="bg-yellow-50"
          color="text-yellow-600"
          border="border-yellow-200"
        />
        <SummaryCard
          title="Ordered"
          value={orderedCount}
          icon={<FaBox />}
          bg="bg-blue-50"
          color="text-blue-600"
          border="border-blue-200"
        />
        <SummaryCard
          title="Received"
          value={receivedCount}
          icon={<FaCheckCircle />}
          bg="bg-green-50"
          color="text-green-600"
          border="border-green-200"
        />
      </div>

      {/* FILTERS & BATCH ACTIONS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        
        {/* Batch Remove Button */}
        {isSelectionMode && (
          <div className="flex items-center gap-3 w-full md:w-auto animate-fadeIn">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors cursor-pointer"
            >
              {selectedIds.length === currentOrders.length ? "Deselect All" : "Select Page"}
            </button>
            
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteBatch}
                className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
              >
                <FaTrashAlt /> Remove ({selectedIds.length})
              </button>
            )}
          </div>
        )}

        <div className="relative w-full md:flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by medicine or order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-48">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <select
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="Requested">Requested</option>
            <option value="Ordered">Ordered</option>
            <option value="Received">Received</option>
          </select>
        </div>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-4">
        {currentOrders.length > 0 ? (
          currentOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.includes(order.orderId)}
              onToggle={() => toggleSelection(order.orderId)}
              onEdit={() =>
                navigate("/create-purchase-order", {
                  state: { orderId: order.orderId },
                })
              }
              onDelete={() => handleDeleteSingle(order.orderId)}
            />
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No Orders Found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* PAGINATION FOOTER */}
      {totalPages > 1 && (
        <div className="mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-800">{currentOrders.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{" "}
            <span className="text-gray-800">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of{" "}
            <span className="text-gray-800">{filteredOrders.length}</span> orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === 1
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft size={12} /> Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === totalPages
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;

/* ---------- COMPONENTS ---------- */

const SummaryCard = ({ title, value, icon, bg, color, border }) => (
  <div
    className={`bg-white border ${border} rounded-xl p-5 shadow-sm flex justify-between items-center transition-transform hover:-translate-y-1`}
  >
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3 rounded-xl text-xl ${bg} ${color}`}>{icon}</div>
  </div>
);

const OrderCard = ({
  order,
  onEdit,
  onDelete,
  isSelectionMode,
  isSelected,
  onToggle,
}) => {
  const { userData } = useContext(AppContext);
  
  const statusStyles = {
    Requested: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Ordered: "bg-blue-50 text-blue-700 border-blue-200",
    Received: "bg-green-50 text-green-700 border-green-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const isAuthorized = userData && (userData.designation === 'Pharmacist' || userData.designation === 'Admin');

  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-all shadow-sm hover:shadow-md ${
        isSelected
          ? "border-fuchsia-500 bg-fuchsia-50/10 ring-1 ring-fuchsia-500"
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
        
        {/* Left Side: Info & Checkbox */}
        <div className="flex-1 p-5 md:p-6 flex gap-4 w-full">
          
          {/* Selection Checkbox */}
          {isSelectionMode && (
            <div className="pt-1 shrink-0 animate-fadeIn">
              <button
                onClick={onToggle}
                className="text-2xl cursor-pointer text-gray-300 hover:text-fuchsia-600 transition-colors"
              >
                {isSelected ? (
                  <FaCheckSquare className="text-fuchsia-600" />
                ) : (
                  <FaSquare />
                )}
              </button>
            </div>
          )}

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            {/* Top Row: Name & Status */}
            <div className="flex justify-between items-start mb-3 gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 truncate">
                  {order.medicineName}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1 font-mono bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                    <FaHashtag className="text-gray-400 text-xs" /> {order.orderId}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <FaBuilding className="text-gray-400" /> {order.supplierName}
                  </span>
                </div>
              </div>
              <span
                className={`shrink-0 text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            {/* Bottom Row: Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <Info label="Quantity / Strength" value={`${order.quantity} units / ${order.strength}`} />
              <Info label="Total Cost" value={`₹${order.totalCost}`} />
              <Info label="Order Date" value={order.orderDate || "—"} />
              <Info label="Expected Delivery" value={order.expectedDelivery || "—"} />
            </div>
          </div>
        </div>

        {/* Right Side: Actions (Hidden in Selection Mode) */}
        {!isSelectionMode && isAuthorized && (
          <div className="w-full md:w-auto bg-gray-50 md:bg-transparent border-t md:border-t-0 md:border-l border-gray-100 p-4 md:p-6 flex flex-row md:flex-col justify-end md:justify-center gap-3 shrink-0">
            
            {(order.status === "Requested" || order.status === "Ordered") && (
              <button
                onClick={onEdit}
                className="flex-1 md:flex-none cursor-pointer flex justify-center items-center gap-2 text-sm font-bold border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <FaEdit /> Update
              </button>
            )}

            {(order.status === "Received" || order.status === "Cancelled") && (
              <button
                onClick={onDelete}
                className="flex-1 md:flex-none cursor-pointer flex justify-center items-center gap-2 text-sm font-bold border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <FaTrash /> Remove
              </button>
            )}
            
          </div>
        )}

      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider mb-1">
      {label}
    </span>
    <span className="font-semibold text-gray-800 text-sm truncate" title={value}>
      {value}
    </span>
  </div>
);