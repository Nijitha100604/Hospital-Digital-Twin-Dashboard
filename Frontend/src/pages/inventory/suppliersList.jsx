import React, { useState, useEffect, useContext, useMemo } from "react";
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
  FaArrowLeft,
  FaArrowRight,
  FaUserSlash, 
  FaLayerGroup 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MedicineContext } from "../../context/MedicineContext";
import ViewSupplierModal from "../../components/modals/viewSupplierModal";
import Loading from "../Loading";
import { AppContext } from "../../context/AppContext";

const SuppliersList = () => {
  const navigate = useNavigate();
  const { suppliers, loading, fetchSuppliers } = useContext(MedicineContext);
  const { userData } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All Categories"); // New State for Category
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  /* --- Calculations --- */
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === "Active").length;
  
  // New Calculation: Inactive Suppliers
  const inactiveSuppliers = suppliers.filter((s) => s.status !== "Active").length;

  const averageRating =
    totalSuppliers > 0
      ? (suppliers.reduce((acc, s) => acc + (s.rating || 0), 0) / totalSuppliers).toFixed(1)
      : 0;

  // Extract Unique Categories for Dropdown
  const categories = ["All Categories", ...new Set(suppliers.map(s => s.category))];

  /* --- Filters --- */
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      // Search Filter
      const searchMatch =
        s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        s.supplierId.toLowerCase().includes(search.toLowerCase());

      // Status Filter
      const statusMatch =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && s.status === "Active") ||
        (statusFilter === "INACTIVE" && s.status !== "Active");

      // Category Filter 
      const categoryMatch = 
        categoryFilter === "All Categories" || s.category === categoryFilter;

      return searchMatch && statusMatch && categoryMatch;
    });
  }, [search, statusFilter, categoryFilter, suppliers]);

  /* --- Pagination --- */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, categoryFilter]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaHandshake size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Supplier Management
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage relationships, contracts, and inventory sources
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          {userData && (userData?.designation === 'Pharmacist'|| userData.designation === 'Admin') && (
            <button
              onClick={() => navigate("/create-new-supplier")}
              className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
            >
              <FaPlus />
              Add New Supplier
            </button> 
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={<FaUsers className="text-purple-600" />}
          bg="bg-purple-100"
          border="border-purple-200"
        />

        <SummaryCard
          title="Active Suppliers"
          value={activeSuppliers}
          icon={<FaCheckCircle className="text-green-600" />}
          bg="bg-green-100"
          border="border-green-200"
        />

        <SummaryCard
          title="Average Rating"
          value={averageRating}
          icon={<FaStar className="text-yellow-600" />}
          bg="bg-yellow-100"
          border="border-yellow-200"
        />

        {/* Inactive Suppliers */}
        <SummaryCard
          title="Inactive Suppliers"
          value={inactiveSuppliers}
          icon={<FaUserSlash className="text-red-600" />}
          bg="bg-red-100"
          border="border-red-200"
        />
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        
        {/* Filters Toolbar */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative w-full flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by supplier name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              
              {/* Category Filter */}
              <div className="relative w-full sm:w-48">
                <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                >
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative w-full sm:w-48">
                <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-fuchsia-100 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Supplier Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentSuppliers.length > 0 ? (
                currentSuppliers.map((s) => (
                  <tr key={s.supplierId} className="hover:bg-fuchsia-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{s.supplierId}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{s.supplierName}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium border border-gray-200">
                            {s.category}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{s.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md w-fit border border-yellow-100">
                        <FaStar className="text-yellow-500 text-xs" />
                        <span className="text-xs font-bold">{s.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          s.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedSupplier(s)}
                        className="text-gray-400 hover:text-fuchsia-800 hover:bg-fuchsia-50 p-2 rounded-full transition-all cursor-pointer"
                        title="View Details"
                      >
                        <FaEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FaHashtag className="text-gray-300 text-3xl" />
                      <p>No suppliers found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-800">{currentSuppliers.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{" "}
            <span className="font-medium text-gray-800">{Math.min(indexOfLastItem, filteredSuppliers.length)}</span> of{" "}
            <span className="font-medium text-gray-800">{filteredSuppliers.length}</span> entries
          </p>

          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === 1
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft size={12} /> Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-50"
              }`}
            >
              Next <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Injection */}
      {selectedSupplier && (
        <ViewSupplierModal
          supplier={selectedSupplier}
          onClose={() => setSelectedSupplier(null)}
          onEdit={() => navigate(`/edit-supplier/${selectedSupplier.supplierId}`)}
        />
      )}
    </div>
  );
};

export default SuppliersList;

/* ---------- Summary Card Component ---------- */

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