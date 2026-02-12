import React, { useState, useEffect, useContext } from "react";
import { 
  FaUserTie, FaPlus, FaSearch, FaFilter, FaEye, FaTimes, 
  FaAngleDoubleLeft, FaAngleDoubleRight 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";

function StaffList() {
  const navigate = useNavigate();
  
  // --- CONTEXT ---
  const { fetchStaffs, staffs, loading } = useContext(StaffContext);
  const { token, userData } = useContext(AppContext); // Ensure userData is available
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [openFilter, setOpenFilter] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [selectedFilters, setSelectedFilters] = useState({
    Department: "",
    Role: "",
    Status: ""
  });

  useEffect(() => {
    if(token){
      fetchStaffs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // --- HELPER: Get Unique Values for Dropdowns ---
  const getUniqueValues = (key) => {
    const dataKey = key === "Role" ? "designation" : key.toLowerCase();
    return [...new Set(staffs.map((item) => item[dataKey]))].filter(Boolean);
  };

  // --- FILTER LOGIC ---
  const filteredData = staffs.filter((item) => {
    // Safety check for undefined fields
    const nameMatch = item.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = item.staffId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = nameMatch || idMatch;

    const matchesDept = selectedFilters.Department 
      ? item.department === selectedFilters.Department 
      : true;
    const matchesRole = selectedFilters.Role 
      ? item.designation === selectedFilters.Role 
      : true;
    const matchesStatus = selectedFilters.Status 
      ? item.status === selectedFilters.Status 
      : true;

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  // --- PAGINATION LOGIC ---
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // --- HANDLERS ---
  const handleFilterSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
    setOpenFilter(null);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  return (
    <>
      {/* HEADER SECTION */}
      <div className="bg-white px-6 py-5 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <FaUserTie className="text-gray-600" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">
                Staff Records
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Centralized Staff Details and Role Information
            </p>
          </div>

          {/* --- RESTRICTION: ONLY ADMIN CAN ADD STAFF --- */}
          {userData?.designation === 'Admin' && (
            <button
              onClick={() => navigate("/add-staff")}
              className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-xl shadow hover:bg-purple-800 transition-colors"
            >
              <FaPlus size={14} />
              Add New Staff
            </button>
          )}
        </div>

        {/* SEARCH + FILTER ROW */}
        <div className="flex flex-wrap items-center gap-4 mt-5">
          <div className="relative flex-1 min-w-65">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search by Staff Name or Staff ID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl text-sm border border-transparent focus:bg-white focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div className="flex gap-3 relative">
            {["Department", "Role", "Status"].map((filter) => (
              <div key={filter} className="relative">
                <button
                  onClick={() => setOpenFilter(openFilter === filter ? null : filter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors ${
                    selectedFilters[filter] 
                      ? "bg-purple-100 text-purple-700 border-purple-200" 
                      : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <FaFilter size={12} />
                  {selectedFilters[filter] || filter}
                  {selectedFilters[filter] && (
                    <FaTimes 
                      size={10} 
                      className="ml-1 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterSelect(filter, "");
                      }}
                    />
                  )}
                </button>

                {openFilter === filter && (
                  <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <ul className="py-1 max-h-60 overflow-y-auto">
                      <li
                        className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-500 cursor-pointer border-b"
                        onClick={() => handleFilterSelect(filter, "")}
                      >
                        All {filter}s
                      </li>
                      {getUniqueValues(filter).map((option, idx) => (
                        <li
                          key={idx}
                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-purple-50 hover:text-purple-700 ${
                            selectedFilters[filter] === option ? "font-semibold text-purple-700 bg-purple-50" : "text-gray-700"
                          }`}
                          onClick={() => handleFilterSelect(filter, option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="w-full overflow-x-auto min-h-100">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Staff ID</th>
                <th className="px-6 py-4 text-left font-semibold">Staff Name</th>
                <th className="px-6 py-4 text-left font-semibold">Designation</th>
                <th className="px-6 py-4 text-left font-semibold">Department</th>
                <th className="px-6 py-4 text-left font-semibold">Phone Number</th>
                <th className="px-6 py-4 text-center font-semibold">Status</th>
                <th className="px-6 py-4 text-center font-semibold">View</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-500 flex flex-col items-center justify-center w-full">
                    Loading staff data...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr
                    key={item._id || item.staffId} 
                    className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-500">{item.staffId}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{item.fullName}</td>
                    <td className="px-6 py-4">{item.designation}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600">
                            {item.department}
                        </span>
                    </td>
                    <td className="px-6 py-4">{item.contactNumber}</td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        {/* VIEW is accessible to everyone */}
                        <button
                          className="text-purple-600 hover:bg-purple-100 p-2 rounded-full transition-colors"
                          title="View Profile"
                          onClick={() => {
                            navigate(`/staff-profile/${item.staffId}`);
                            window.scrollTo(0, 0);
                          }}
                        >
                          <FaEye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <FaSearch size={24} className="text-gray-300"/>
                        <p>No staff members found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="text-gray-500 text-xs">
            Showing {paginatedData.length} of {filteredData.length} records
          </div>

          <div className="flex gap-2 items-center">
            <button 
              disabled={currentPage === 1}
              className="px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-50 transition-colors" 
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <FaAngleDoubleLeft size={16}/>
            </button>

            <span className="text-xs px-3 py-1 font-semibold text-gray-700 bg-gray-100 rounded-md">
                Page {currentPage} of {totalPages === 0 ? 1 : totalPages}
            </span>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-50 transition-colors" 
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <FaAngleDoubleRight size={16}/>
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default StaffList;