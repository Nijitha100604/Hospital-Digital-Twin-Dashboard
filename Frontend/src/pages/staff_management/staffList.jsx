import React, { useState, useEffect, useRef } from "react";
import { FaUserTie, FaPlus, FaSearch, FaFilter, FaEye, FaTimes } from "react-icons/fa";
import { staffList } from "../../data/staffList";
import { useNavigate } from "react-router-dom";

function StaffList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // State for which dropdown is open (e.g., "Department" or null)
  const [openFilter, setOpenFilter] = useState(null);
  
  // State to store selected values: { Department: "Cardiology", Role: "", Status: "" }
  const [selectedFilters, setSelectedFilters] = useState({
    Department: "",
    Role: "",
    Status: ""
  });

  // Helper to get unique values for the dropdowns based on your data
  const getUniqueValues = (key) => {
    // Map 'Role' in UI to 'designation' in data, lower case key match
    const dataKey = key === "Role" ? "designation" : key.toLowerCase();
    return [...new Set(staffList.map((item) => item[dataKey]))].filter(Boolean);
  };

  // Handle filtering logic
  const filteredData = staffList.filter((item) => {
    // 1. Search Filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffId.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Dropdown Filters
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

  // Handle selecting an option
  const handleFilterSelect = (category, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: value,
    }));
    setOpenFilter(null); // Close dropdown after selection
  };

  return (
    <>
      {/* HEADER SECTION */}
      <div className="bg-white px-6 py-5 rounded-xl shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Title */}
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

          {/* Add Staff Button */}
          <button
            onClick={() => navigate("/add-staff")}
            className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-xl shadow hover:bg-purple-800"
          >
            <FaPlus size={14} />
            Add New Staff
          </button>
        </div>

        {/* SEARCH + FILTER ROW */}
        <div className="flex flex-wrap items-center gap-4 mt-5">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="text"
              placeholder="Search by Staff Name or Staff ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Filters with Dropdowns */}
          <div className="flex gap-3 relative">
            {["Department", "Role", "Status"].map((filter) => (
              <div key={filter} className="relative">
                {/* Filter Button */}
                <button
                  onClick={() =>
                    setOpenFilter(openFilter === filter ? null : filter)
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm border transition-colors ${
                    selectedFilters[filter] 
                      ? "bg-purple-100 text-purple-700 border-purple-200" // Active style
                      : "bg-gray-200 text-gray-700 border-transparent" // Default style
                  }`}
                >
                  <FaFilter size={12} />
                  {/* Show selected value if exists, else show category name */}
                  {selectedFilters[filter] || filter}
                  
                  {/* Optional: 'X' icon to clear specific filter if selected */}
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

                {/* Dropdown Menu */}
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
      <div className="mt-6 bg-white rounded-xl shadow-sm overflow-x-auto min-h-[400px]">
        <table className="w-full min-w-max text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="px-6 py-4 text-left font-medium">Staff ID</th>
              <th className="px-6 py-4 text-left font-medium">Staff Name</th>
              <th className="px-6 py-4 text-left font-medium">Designation</th>
              <th className="px-6 py-4 text-left font-medium">Department</th>
              <th className="px-6 py-4 text-left font-medium">Phone Number</th>
              <th className="px-6 py-4 text-center font-medium">Status</th>
              <th className="px-6 py-4 text-center font-medium">View</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.staffId}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{item.staffId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4">{item.designation}</td>
                  <td className="px-6 py-4">{item.department}</td>
                  <td className="px-6 py-4">{item.contact}</td>

                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                        <FaEye
                        className="text-gray-400 hover:text-purple-600 cursor-pointer transition-colors text-lg"
                        onClick={() =>
                            navigate(`/staff-profile/${item.staffId}`)
                        }
                        />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  No staff members found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default StaffList;