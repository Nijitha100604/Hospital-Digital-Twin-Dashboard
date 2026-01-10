import React, { useMemo, useState } from "react";
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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { purchase_orders } from "../../data/purchaseOrders";
import { toast } from "react-toastify";

const PurchaseOrder = () => {
  const navigate = useNavigate();

  /*STORE ORDERS IN STATE (IMPORTANT FIX) */
  const [orders, setOrders] = useState([...purchase_orders]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  /* ---------------- FILTER & SEARCH ---------------- */
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  /* ---------------- SUMMARY COUNTS ---------------- */
  const totalCount = orders.length;
  const requestedCount = orders.filter((o) => o.status === "Requested").length;
  const orderedCount = orders.filter((o) => o.status === "Ordered").length;
  const receivedCount = orders.filter((o) => o.status === "Received").length;

  /* ---------------- DELETE HANDLER ---------------- */
  const handleDelete = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    toast.success("Purchase Order removed successfully");
  };

  return (
    <>
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg mb-4 border border-gray-300 shadow flex justify-between items-center">
        <div>
          <div className="flex gap-3 items-center">
            <div size={24} className="p-2 text-gray-500">
              <FaShoppingCart className="text-xl" />
            </div>
            <h2 className="font-bold text-lg text-gray-800">Purchase Orders</h2>
          </div>
          <p className="text-sm text-gray-500">
            Create and track purchase orders
          </p>
        </div>

        <button
          onClick={() => navigate("/create-purchase-order")}
          className="flex items-center cursor-pointer gap-2 bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <FaPlus />
          Create Order
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Orders"
          value={totalCount}
          icon={<FaClipboardList />}
          bg="bg-purple-100"
          color="text-purple-700"
        />
        <SummaryCard
          title="Requested"
          value={requestedCount}
          icon={<FaClock />}
          bg="bg-yellow-100"
          color="text-yellow-700"
        />
        <SummaryCard
          title="Ordered"
          value={orderedCount}
          icon={<FaBox />}
          bg="bg-blue-100"
          color="text-blue-700"
        />
        <SummaryCard
          title="Received"
          value={receivedCount}
          icon={<FaCheckCircle />}
          bg="bg-green-100"
          color="text-green-700"
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-5 mb-6">
        <div className="relative w-full md:flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by medicine or order ID"
            className="pl-10 pr-3 py-2 rounded-md w-full border bg-gray-300 border-gray-400 outline-0 focus:ring-1 focus:ring-fuchsia-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          <select
            className="pl-9 h-10 cursor-pointer pr-3 rounded-md border border-gray-400 outline-0"
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
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onEdit={() =>
              navigate("/create-purchase-order", {
                state: { orderId: order.orderId },
              })
            }
            onDelete={() => handleDelete(order.orderId)}
          />
        ))}

        {filteredOrders.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FaBox className="mx-auto text-5xl text-gray-400 mb-3" />
            <p className="text-lg text-gray-500">No purchase orders found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default PurchaseOrder;

/* ================= COMPONENTS ================= */

const SummaryCard = ({ title, value, icon, bg, color }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-4 shadow flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color}`}>{icon}</div>
  </div>
);

const OrderCard = ({ order, onEdit, onDelete }) => {
  const statusStyles = {
    Requested: "bg-yellow-100 text-yellow-700",
    Ordered: "bg-blue-100 text-blue-700",
    Received: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-lg">
            {order.medicineName} {order.strength}
          </p>
          <p className="text-sm text-gray-500">
            {order.orderId} • {order.supplierName}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            statusStyles[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
        <Info label="Quantity" value={`${order.quantity} units`} />
        <Info label="Total Cost" value={`₹${order.totalCost}`} />
        <Info label="Order Date" value={order.orderDate || "—"} />
        <Info label="Expected Delivery" value={order.expectedDelivery || "—"} />
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-3">
        {(order.status === "Requested" || order.status === "Ordered") && (
          <button
            onClick={onEdit}
            className="flex cursor-pointer items-center gap-2 text-sm border px-4 py-2 rounded hover:bg-gray-300 text-fuchsia-700"
          >
            <FaEdit />
            Update Info
          </button>
        )}

        {order.status === "Received" && (
          <button
            onClick={onDelete}
            className="flex cursor-pointer items-center gap-2 text-sm border px-4 py-2 rounded hover:bg-red-100 text-red-600"
          >
            <FaTrash />
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
