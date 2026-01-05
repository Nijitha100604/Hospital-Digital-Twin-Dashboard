import React, { useState, useMemo } from "react";
import { 
  Search, FileText, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Eye, Filter 
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
const initialReports = [
  { reportId: "LR00101", patientId: "P000123", patientName: "Alice Williams", testType: "CBC", date: "2025-10-20", status: "Completed" },
  { reportId: "LR00102", patientId: "P000124", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-21", status: "Pending" },
  { reportId: "LR00103", patientId: "P000124", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-22", status: "Pending" },
  { reportId: "LR00105", patientId: "P000125", patientName: "Korny Smith", testType: "Lipid Profile", date: "2025-10-22", status: "Completed" },
  { reportId: "LR00106", patientId: "P000126", patientName: "Alice Williams", testType: "CBC", date: "2025-10-23", status: "Completed" },
  { reportId: "LR00107", patientId: "P000127", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-24", status: "Pending" },
  { reportId: "LR00108", patientId: "P000128", patientName: "Korny Smith", testType: "Lipid Profile", date: "2025-10-25", status: "Completed" },
  { reportId: "LR00109", patientId: "P000129", patientName: "Alice Williams", testType: "Lipid Profile", date: "2025-10-26", status: "Pending" },
  { reportId: "LR00110", patientId: "P000130", patientName: "Jamn Smith", testType: "CBC", date: "2025-10-27", status: "Pending" },
  { reportId: "LR00111", patientId: "P000131", patientName: "Alice Williams", testType: "Lipid Profile", date: "2025-10-28", status: "Pending" },
  { reportId: "LR00112", patientId: "P000132", patientName: "David Rose", testType: "MRI Scan", date: "2025-10-29", status: "Completed" },
  { reportId: "LR00113", patientId: "P000133", patientName: "Emily Blunt", testType: "X-Ray", date: "2025-10-30", status: "Completed" },
  { reportId: "LR00114", patientId: "P000134", patientName: "John Doe", testType: "CBC", date: "2025-10-31", status: "Pending" },
  { reportId: "LR00115", patientId: "P000135", patientName: "Jane Doe", testType: "Thyroid Profile", date: "2025-11-01", status: "Completed" },
  { reportId: "LR00116", patientId: "P000136", patientName: "Michael Scott", testType: "Vitamin D", date: "2025-11-02", status: "Pending" },
];

export default function labReportsList() {
  /* -------------------- STATES -------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* -------------------- LOGIC -------------------- */
  // 1. Filter & Sort Data
  const filteredData = useMemo(() => {
    let data = initialReports.filter((item) => {
      const matchesSearch = 
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "All" || item.testType === filterType;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sorting
    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchTerm, filterType, filterStatus, sortOrder]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 3. Stats Calculation
  const completedCount = initialReports.filter(r => r.status === "Completed").length;
  const pendingCount = initialReports.filter(r => r.status === "Pending").length;

  /* -------------------- HANDLERS -------------------- */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusColor = (status) => {
    return status === "Completed" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-orange-100 text-orange-700 border-orange-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             Lab Report List
           </h1>
           <p className="text-sm text-gray-500 mt-1">Manage and view patient laboratory reports.</p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col sm:flex-row gap-4">
           {/* Completed Card */}
           <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[160px]">
              <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Completed Report</span>
              <span className="text-3xl font-bold text-green-600 mt-1">{completedCount}</span>
           </div>
           {/* Pending Card */}
           <div className="bg-red-50 border border-red-200 px-6 py-3 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[160px]">
              <span className="text-xs font-bold text-red-800 uppercase tracking-wide">Pending Report</span>
              <span className="text-3xl font-bold text-red-600 mt-1">{pendingCount}</span>
           </div>
        </div>
      </div>

      {/* --- FILTERS SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Patient Name or ID" 
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Test Type Filter */}
        <div className="relative">
          <select 
            className="cursor-pointer w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">Test Type: All</option>
            <option value="CBC">CBC</option>
            <option value="Lipid Profile">Lipid Profile</option>
            <option value="MRI Scan">MRI Scan</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Vitamin D">Vitamin D</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        {/* Status Filter */}
        <div className="relative">
           <select 
            className="cursor-pointer w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
           >
            <option value="All">Status: All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>

        {/* Date Sorting */}
        <div className="relative">
           <select 
            className="cursor-pointer w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
           >
            <option value="Newest">Date: Newest</option>
            <option value="Oldest">Date: Oldest</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Report ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Patient ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Patient Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Test Type</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? (
                currentData.map((report) => (
                  <tr key={report.reportId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-500">{report.reportId}</td>
                    <td className="p-4 text-sm font-mono text-gray-500">{report.patientId}</td>
                    <td className="p-4 text-sm font-bold text-gray-800">{report.patientName}</td>
                    <td className="p-4 text-sm text-gray-600">{report.testType}</td>
                    <td className="p-4 text-sm text-gray-600">{report.date}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="cursor-pointer text-purple-700 hover:text-white hover:bg-purple-700 border border-purple-200 hover:border-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <FileText className="mx-auto mb-2 opacity-30" size={48} />
                    <p>No reports found matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION FOOTER --- */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">
             Showing <span className="font-bold text-gray-800">{filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-bold text-gray-800">{filteredData.length}</span> entries
          </p>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1}
              className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
              className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
            </button>
            
            <span className="bg-purple-700 text-white px-3 py-1.5 rounded text-sm font-bold min-w-[32px] text-center shadow-sm">
              {currentPage}
            </span>

            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}