import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Search, FileText, ChevronLeft, ChevronRight, 
  Filter, Eye, Loader2 
} from "lucide-react";
import { AppContext } from "../../context/AppContext"; // To get token & backendUrl

export default function LabReportList() {
  const navigate = useNavigate(); 
  const { token, backendUrl } = useContext(AppContext);

  // --- STATE ---
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- FILTERS & PAGINATION ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- 1. FETCH REAL DATA FROM BACKEND ---
  const fetchLabReports = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Ensure this endpoint exists in your backend router
      const { data } = await axios.get(`${backendUrl}/api/reports/all-reports`, {
        headers: { token }
      });

      if (data.success) {
        setReports(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lab reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLabReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredData = useMemo(() => {
    let data = reports.filter((item) => {
      // Adjust field names based on your MongoDB Schema (e.g., item.patientName vs item.name)
      const pName = item.patientName || "Unknown"; 
      const pId = item.patientId || "";
      const rId = item.labReportId || item._id || ""; // Fallback to _id if labReportId missing

      const matchesSearch = 
        pName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        pId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rId.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Adjust 'testName' field if backend sends 'testType'
      const testName = item.testName || item.testType || "General";
      const matchesType = filterType === "All" || testName === filterType;
      
      const status = item.status || "Pending";
      const matchesStatus = filterStatus === "All" || status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });

    data.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date); // Use createdAt from Mongoose
      const dateB = new Date(b.createdAt || b.date);
      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [searchTerm, filterType, filterStatus, sortOrder, reports]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Counts based on current fetched data
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

  // --- NAVIGATION ---
  const handleViewDetails = (report) => {
    // Navigate to details page, passing the report object
    navigate(`/patient-wise-reports/${report._id}`, { state: { reportData: report } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
           <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
             <FileText className="text-purple-600" /> Lab Report List
           </h1>
           <p className="text-xs md:text-sm text-gray-500 mt-1">Real-time lab requests from doctor consultations.</p>
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

      {/* FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search Patient / Report ID" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
        <div className="relative">
          <select className="cursor-pointer w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm text-sm appearance-none bg-white font-medium text-gray-700" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">Type: All</option>
            {/* You can populate these dynamically from unique test names if needed */}
            <option value="CBC">CBC</option>
            <option value="Lipid Profile">Lipid Profile</option>
            <option value="MRI Scan">MRI Scan</option>
            <option value="X-Ray">X-Ray</option>
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

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        
        {loading ? (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-600" size={40} />
            </div>
        ) : currentData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FileText size={48} className="mb-2 opacity-20"/>
                <p>No lab reports found.</p>
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
                <tr>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Report ID</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Patient Info</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Test Type</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider">Date Requested</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Status</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-center">Action</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {currentData.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-500 font-bold">
                        {report.labReportId || report._id.substring(0,8).toUpperCase()}
                    </td>
                    <td className="p-4">
                        <div className="text-sm font-bold text-gray-800">{report.patientName}</div>
                        <div className="text-xs text-gray-400 font-mono">{report.patientId}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                        {report.testName || "Unknown Test"}
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status || "Pending")}`}>
                        {report.status || "Pending"}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                        <button 
                        onClick={() => handleViewDetails(report)}
                        className="cursor-pointer text-purple-700 hover:text-white hover:bg-purple-700 border border-purple-200 hover:border-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto"
                        >
                        <Eye size={14}/> View
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}

        {/* PAGINATION */}
        {!loading && currentData.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                <p className="text-xs text-gray-500 font-medium">
                    Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length}
                </p>
                <div className="flex items-center gap-1">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={14}/></button>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-1.5 border rounded hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={14}/></button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}