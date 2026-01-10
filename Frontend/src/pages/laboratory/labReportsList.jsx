import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  Search, FileText, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Filter
} from "lucide-react";

/* -------------------- DUMMY DATA -------------------- */
export const initialReports = [
  { reportId: "LR00101", patientId: "P000123", patientName: "Alice Williams", testType: "CBC", date: "2025-10-20", status: "Completed", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  { reportId: "LR00102", patientId: "P000124", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-21", status: "Pending", age: 45, gender: "Male", phone: "+1 555 019 2834", bloodGroup: "A-" },
  { reportId: "LR00103", patientId: "P000124", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-22", status: "Pending", age: 45, gender: "Male", phone: "+1 555 019 2834", bloodGroup: "A-" },
  { reportId: "LR00105", patientId: "P000125", patientName: "Korny Smith", testType: "Lipid Profile", date: "2025-10-22", status: "Completed", age: 29, gender: "Male", phone: "+1 555 091 1122", bloodGroup: "B+" },
  { reportId: "LR00106", patientId: "P000126", patientName: "Alice Williams", testType: "CBC", date: "2025-10-23", status: "Completed", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  { reportId: "LR00107", patientId: "P000127", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-24", status: "Pending", age: 45, gender: "Male", phone: "+1 555 019 2834", bloodGroup: "A-" },
  { reportId: "LR00108", patientId: "P000128", patientName: "Korny Smith", testType: "Lipid Profile", date: "2025-10-25", status: "Completed", age: 29, gender: "Male", phone: "+1 555 091 1122", bloodGroup: "B+" },
  { reportId: "LR00109", patientId: "P000129", patientName: "Alice Williams", testType: "Lipid Profile", date: "2025-10-26", status: "Pending", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  { reportId: "LR00110", patientId: "P000130", patientName: "Jamn Smith", testType: "CBC", date: "2025-10-27", status: "Pending", age: 38, gender: "Male", phone: "+1 555 088 7766", bloodGroup: "AB-" },
  { reportId: "LR00111", patientId: "P000131", patientName: "Alice Williams", testType: "Lipid Profile", date: "2025-10-28", status: "Pending", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  { reportId: "LR00112", patientId: "P000132", patientName: "David Rose", testType: "MRI Scan", date: "2025-10-29", status: "Completed", age: 52, gender: "Male", phone: "+1 555 222 3344", bloodGroup: "AB+" },
  { reportId: "LR00113", patientId: "P000133", patientName: "Emily Blunt", testType: "X-Ray", date: "2025-10-30", status: "Completed", age: 27, gender: "Female", phone: "+1 555 999 0000", bloodGroup: "O-" },
];

export default function LabReportList() {
  const navigate = useNavigate(); 

  /* -------------------- STATES & LOGIC -------------------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    data.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
    return data;
  }, [searchTerm, filterType, filterStatus, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const completedCount = initialReports.filter(r => r.status === "Completed").length;
  const pendingCount = initialReports.filter(r => r.status === "Pending").length;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
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
              {currentData.length > 0 ? (
                currentData.map((report) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <FileText className="mx-auto mb-2 opacity-30" size={48} />
                    <p>No reports found.</p>
                  </td>
                </tr>
              )}
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
                         <button 
                            onClick={() => handleViewDetails(report)}
                            className="cursor-pointer text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                         >
                            View
                         </button>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
           {/* Pagination controls... */}
        </div>
      </div>
    </div>
  );
}