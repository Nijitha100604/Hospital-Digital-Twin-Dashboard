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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";
import { toast } from "react-toastify";

const PurchaseOrder = () => {
  const navigate = useNavigate();
  const { purchaseOrders, loading, fetchPurchaseOrders, deletePurchaseOrder } =
    useContext(MedicineContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // --- SELECTION STATE ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Ensure data is fresh
  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  /* ---------------- FILTER & SEARCH ---------------- */
  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((o) => {
      const matchesSearch =
        o.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [purchaseOrders, search, statusFilter]);

  /* ---------------- SUMMARY COUNTS ---------------- */
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

  /* ---------------- SELECTION HANDLERS ---------------- */
  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]); // Deselect All
    } else {
      setSelectedIds(filteredOrders.map((o) => o.orderId)); // Select All Visible
    }
  };

  /* ---------------- DELETE HANDLER (SINGLE & BATCH) ---------------- */
  const handleDeleteSingle = async (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to remove this order record?"
    );
    if (confirm) {
      await deletePurchaseOrder(orderId);
    }
  };

  const handleDeleteBatch = async () => {
    if (selectedIds.length === 0) return;

    const confirm = window.confirm(
      `Are you sure you want to remove ${selectedIds.length} selected orders?`
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

        <div className="flex gap-3 items-center w-full md:w-auto">
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

          <button
            onClick={() => navigate("/create-purchase-order")}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaPlus />
            Create New Order
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
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
              className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-xl text-sm font-medium transition-colors"
            >
              {selectedIds.length === filteredOrders.length ? "Deselect All" : "Select All"}
            </button>
            
            {selectedIds.length > 0 && (
              <button
                onClick={handleDeleteBatch}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
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
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
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
    </div>
  );
};

export default PurchaseOrder;

/* ================= COMPONENTS ================= */

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
  const statusStyles = {
    Requested: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Ordered: "bg-blue-50 text-blue-700 border-blue-200",
    Received: "bg-green-50 text-green-700 border-green-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`bg-white border rounded-xl p-6 transition-all shadow-sm hover:shadow-md ${
        isSelected
          ? "border-fuchsia-500 bg-fuchsia-50/10 ring-1 ring-fuchsia-500"
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-start">
        
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="pt-1 animate-fadeIn">
            <button
              onClick={onToggle}
              className="text-2xl text-gray-300 hover:text-fuchsia-600 transition-colors"
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
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {order.medicineName}
                  <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                    {order.strength}
                  </span>
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                    statusStyles[order.status]
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-gray-400  mt-1 flex items-center gap-2">
                <span>#{order.orderId}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <span>{order.supplierName}</span>
              </p>
            </div>

            {/* ACTIONS */}
            {!isSelectionMode && (
              <div className="flex gap-2">
                {(order.status === "Requested" ||
                  order.status === "Ordered") && (
                  <button
                    onClick={onEdit}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-bold border border-gray-200 bg-gray-50 hover:bg-white hover:border-fuchsia-300 hover:text-fuchsia-700 text-gray-600 px-3 py-2 rounded-lg transition-all"
                  >
                    <FaEdit /> Update
                  </button>
                )}

                {(order.status === "Received" ||
                  order.status === "Cancelled") && (
                  <button
                    onClick={onDelete}
                    className="flex cursor-pointer items-center gap-1.5 text-xs font-bold border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-all"
                  >
                    <FaTrash /> Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100">
            <Info label="Quantity" value={`${order.quantity} units`} />
            <Info label="Total Cost" value={`₹${order.totalCost}`} />
            <Info label="Order Date" value={order.orderDate || "—"} />
            <Info label="Expected Delivery" value={order.expectedDelivery || "—"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-400 font-bold uppercase text-[10px] mb-0.5">
      {label}
    </p>
    <p className="font-medium text-gray-700">{value}</p>
  </div>
);