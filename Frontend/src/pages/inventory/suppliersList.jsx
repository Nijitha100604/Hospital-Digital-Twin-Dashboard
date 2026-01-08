import React, { useState } from "react";
import {
  FaHandshake,
  FaPlus,
  FaSearch,
  FaStar,
  FaEye,
  FaUsers,
  FaCheckCircle,
  FaHashtag,
  FaFilter,
} from "react-icons/fa";
import { supplier_records } from "../../data/supplier";
import { useNavigate } from "react-router-dom";
import ViewSupplierModal from "./viewSupplierModel";

const SuppliersList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  /* ---------- Summary Calculations ---------- */
  const totalSuppliers = supplier_records.length;
  const activeSuppliers = supplier_records.filter(
    (s) => s.status === "Active"
  ).length;

  const averageRating = (
    supplier_records.reduce((acc, s) => acc + s.rating, 0) /
    supplier_records.length
  ).toFixed(1);

  const totalItemsSupplied = supplier_records.reduce(
    (acc, s) => acc + s.totalSupplies,
    0
  );

  /* ---------- Search and Status Filter ---------- */
  const [statusSort, setStatusSort] = useState("ALL");
  const filteredSuppliers = supplier_records.filter((s) => {
    // Search filter
    const searchMatch =
      s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      s.supplierId.toLowerCase().includes(search.toLowerCase());

    // Status filter
    const statusMatch =
      statusSort === "ALL" ||
      (statusSort === "ACTIVE" && s.status === "Active") ||
      (statusSort === "INACTIVE" && s.status === "Inactive");

    return searchMatch && statusMatch;
  });

  //view supplier
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  return (
    <>
      {/* Header */}
      <div className="bg-white p-6 rounded-lg mb-4 flex flex-wrap justify-between items-center border border-gray-300 shadow">
        <div>
          <div className="flex gap-3 items-center">
            <FaHandshake className="text-gray-500 text-xl" />
            <p className="font-bold text-lg">Supplier Management</p>
          </div>
          <p className="text-sm text-gray-500">
            Manage supplier information and relationships
          </p>
        </div>

        <button
          onClick={() => navigate("/create-new-supplier")}
          className="flex gap-2 items-center bg-fuchsia-900 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-fuchsia-800"
        >
          <FaPlus /> Add New Supplier
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={<FaUsers className="text-purple-700 text-2xl" />}
          iconBg="bg-purple-200"
        />

        <SummaryCard
          title="Active Suppliers"
          value={activeSuppliers}
          icon={<FaCheckCircle className="text-green-700 text-2xl" />}
          iconBg="bg-green-200"
        />

        <SummaryCard
          title="Average Rating"
          value={averageRating}
          icon={<FaStar className="text-yellow-500 text-2xl" />}
          iconBg="bg-yellow-200"
        />

        <SummaryCard
          title="Items Supplied"
          value={totalItemsSupplied}
          icon={<FaHashtag className="text-blue-700 text-2xl" />}
          iconBg="bg-blue-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-5 mb-6">
        {/* Search */}
        <div className="relative w-full flex-1 md:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by supplier name or ID"
            className="pl-10 pr-3 py-2 rounded-md w-full border bg-gray-300 border-gray-400 focus:ring-1 focus:ring-fuchsia-600 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort / Status Filter */}
        <div className="flex gap-5">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="pl-9 h-10 pr-3 cursor-pointer  rounded-md outline-0 border border-gray-400"
              value={statusSort}
              onChange={(e) => setStatusSort(e.target.value)}
            >
              <option
                className="font-medium"
                value="ALL"
              >
                All Status
              </option>

              <option
                className=" font-medium"
                value="ACTIVE"
              >
                Active
              </option>

              <option
                className="font-medium"
                value="INACTIVE"
              >
                Inactive
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-lg overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-pink-100 text-gray-800">
            <tr>
              <th className="px-4 py-3 text-left">Supplier ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Total Supplies</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((s) => (
              <tr
                key={s.supplierId}
                className="border-b text-gray-700 hover:bg-gray-100"
              >
                <td className="px-4 py-3">{s.supplierId}</td>
                <td className="px-4 py-3">{s.supplierName}</td>
                <td className="px-4 py-3">{s.phone}</td>
                <td className="px-4 py-3">{s.totalSupplies} Items</td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  {s.rating}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-2 rounded-xl text-sm font-medium ${
                      s.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedSupplier(s)}
                    className="text-gray-600 p-2 text-xl hover:text-gray-900 cursor-pointer"
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-gray-500 mt-3">
          Showing {filteredSuppliers.length} of {supplier_records.length}{" "}
          suppliers
        </p>
      </div>

      {selectedSupplier && (
        <ViewSupplierModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onEdit={() =>
            navigate(`/edit-supplier/${selectedSupplier.supplierId}`)
          }
        />
      )}
    </>
  );
};

export default SuppliersList;

/* ---------- Reusable Components ---------- */

const SummaryCard = ({ title, value, icon, iconBg = "bg-gray-200" }) => (
  <div className="bg-white rounded-lg border border-gray-300 p-4 flex justify-between items-center shadow">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>

    <div className={`p-3 border border-gray-300 rounded-lg ${iconBg}`}>
      {icon}
    </div>
  </div>
);
