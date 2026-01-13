import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  Search, FileText, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Filter, Eye 
} from "lucide-react";

// Import Initial Data
import { labReportsData } from "../../data/labReportsData"; 

export default function LabReportList() {
  const navigate = useNavigate(); 

  // --- STATE FOR REPORTS ---
  const [reports, setReports] = useState([]);

  // --- 1. LOAD DATA FROM LOCAL STORAGE ON MOUNT ---
  useEffect(() => {
    // Check if data exists in browser
    const storedReports = localStorage.getItem("labReportsDB");

    if (storedReports) {
      // If found, load it
      setReports(JSON.parse(storedReports));
    } else {
      // If empty (first time), load dummy data AND save it to storage
      setReports(labReportsData);
      localStorage.setItem("labReportsDB", JSON.stringify(labReportsData));
    }
  }, []);

  /* -------------------- FILTERS & SORTING STATE -------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* -------------------- LOGIC -------------------- */
  const filteredData = useMemo(() => {
    // Filter on 'reports' (which comes from Local Storage)
    let data = reports.filter((item) => {
      const matchesSearch = 
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reportId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "All" || item.testType === filterType;
      const matchesStatus = filterStatus === "All" || item.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchTerm, filterType, filterStatus, sortOrder, reports]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const completedCount = reports.filter(r => r.status === "Completed").length;
  const pendingCount = reports.filter(r => r.status === "Pending").length;

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

  // --- NAVIGATION HANDLER ---
  const handleViewDetails = (report) => {
    navigate('/patient-wise-reports', { state: { reportData: report } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
           <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
             Lab Report List
           </h1>
           <p className="text-xs md:text-sm text-gray-500 mt-1">Manage and view patient laboratory reports.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
           <div className="bg-green-50 border border-green-200 px-3 py-2 md:px-6 md:py-3 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] md:text-xs font-bold text-green-800 uppercase tracking-wide">Completed</span>
              <span className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{completedCount}</span>
           </div>
           <div className="bg-red-50 border border-red-200 px-3 py-2 md:px-6 md:py-3 rounded-xl shadow-sm flex flex-col items-center justify-center min-w-[120px]">
              <span className="text-[10px] md:text-xs font-bold text-red-800 uppercase tracking-wide">Pending</span>
              <span className="text-2xl md:text-3xl font-bold text-red-600 mt-1">{pendingCount}</span>
           </div>
        </div>
      </div>

      {/* --- FILTERS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search Patient / ID" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        <div className="relative">
          <select className="cursor-pointer w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">Type: All</option><option value="CBC">CBC</option><option value="Lipid Profile">Lipid Profile</option><option value="MRI Scan">MRI Scan</option><option value="X-Ray">X-Ray</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
        <div className="relative">
           <select className="cursor-pointer w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">Status: All</option><option value="Completed">Completed</option><option value="Pending">Pending</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
        <div className="relative">
           <select className="cursor-pointer w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="Newest">Date: Newest</option><option value="Oldest">Date: Oldest</option>
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Report ID</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Patient Info</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Test Type</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.map((report) => (
                <tr key={report.reportId} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-gray-500 font-bold">{report.reportId}</td>
                  <td className="p-4">
                      <div className="text-sm font-bold text-gray-800">{report.patientName}</div>
                      <div className="text-xs text-gray-400 font-mono">{report.patientId}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600 font-medium">{report.testType}</td>
                  <td className="p-4 text-sm text-gray-600">{report.date}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleViewDetails(report)}
                      className="cursor-pointer text-purple-700 hover:text-white hover:bg-purple-700 border border-purple-200 hover:border-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden bg-gray-50 p-3 space-y-3">
            {currentData.map((report) => (
                <div key={report.reportId} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3 border-b border-gray-100 pb-2">
                        <div>
                            <h3 className="font-bold text-gray-800">{report.patientName}</h3>
                            <p className="text-xs text-gray-400 font-mono">{report.patientId}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">{report.reportId}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                         <span className={`px-2 py-1 rounded text-[10px] font-bold border uppercase ${getStatusColor(report.status)}`}>{report.status}</span>
                         <button onClick={() => handleViewDetails(report)} className="cursor-pointer text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                            View
                         </button>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
           {/* (Simplified pagination controls for brevity) */}
           <p className="text-xs text-gray-500 font-medium">Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}</p>
           <div className="flex items-center gap-1">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={14}/></button>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={14}/></button>
           </div>
        </div>
      </div>
    </div>
  );
}