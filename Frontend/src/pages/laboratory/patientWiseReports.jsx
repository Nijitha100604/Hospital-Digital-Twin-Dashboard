import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, FileText, User, Phone, Activity, 
  Download, Printer, Eye, Loader2, AlertTriangle, Search, Clock 
} from "lucide-react";
import { LabContext } from "../../context/LabContext";

export default function PatientWiseReport() {
  const { id } = useParams(); // May be undefined if on base page
  const location = useLocation();
  const navigate = useNavigate();
  
  const { fetchReportById, loading, reports } = useContext(LabContext);

  const [reportData, setReportData] = useState(location.state?.reportData || null);
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // --- 1. LOAD DATA LOGIC ---
  useEffect(() => {
    const loadData = async () => {
      // Case A: ID is present in URL (View Mode)
      if (id) {
        // If data was passed via navigation state, use it
        if (location.state?.reportData && (location.state.reportData._id === id || location.state.reportData.labReportId === id)) {
          setReportData(location.state.reportData);
          setSearchInput(location.state.reportData.patientId || ""); // Pre-fill search
          return;
        }

        // Otherwise, fetch from context or API (Page Refresh)
        const foundLocal = reports.find((r) => r._id === id || r.labReportId === id);
        if (foundLocal) {
            setReportData(foundLocal);
            setSearchInput(foundLocal.patientId || "");
        } else {
            const data = await fetchReportById(id);
            if (data) {
                setReportData(data);
                setSearchInput(data.patientId || "");
                setErrorMsg("");
            } else {
                setErrorMsg("Report not found.");
            }
        }
      } else {
        // Case B: No ID (Search Mode)
        setReportData(null);
        setSearchInput("");
      }
    };
    loadData();
  }, [id, location.state, fetchReportById, reports]);

  // --- 2. SEARCH HANDLER ---
  const handleSearch = () => {
    if (!searchInput.trim()) return;

    // Search in the loaded reports list
    const foundLocal = reports.find(
        r => r.patientId?.toLowerCase() === searchInput.toLowerCase() || 
             r.labReportId?.toLowerCase() === searchInput.toLowerCase() ||
             r.patientName?.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (foundLocal) {
        // Update URL to the found report
        navigate(`/patient-wise-reports/${foundLocal._id}`, { state: { reportData: foundLocal } });
        setErrorMsg("");
    } else {
        setErrorMsg("No report found matching this ID or Name.");
        setReportData(null);
    }
  };

  // --- UI HELPERS ---
  const getStatusStyle = (status) => {
    if (status === "High" || status === "Abnormal") return "bg-red-50 text-red-600 border-red-100";
    if (status === "Low") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- HEADER (ALWAYS VISIBLE) --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/lab-reports-list')} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 shadow-sm transition-all cursor-pointer">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lab Results</h1>
            <p className="text-sm text-slate-500">View and manage patient diagnostics</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-1.5 pl-4 rounded-xl shadow-sm border border-slate-200 flex items-center w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text"
            placeholder="Search Patient ID / Name..."
            className="flex-1 px-3 py-1.5 text-sm outline-none text-slate-700 placeholder:text-slate-400"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button 
            onClick={handleSearch}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Find
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm animate-in fade-in">
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {/* Loading State */}
        {loading && !reportData ? (
           <div className="flex justify-center p-12"><Loader2 className="animate-spin text-purple-600" size={32}/></div>
        ) : !reportData ? (
           /* --- EMPTY STATE (SEARCH PROMPT) --- */
           <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
             <div className="bg-slate-50 p-4 rounded-full mb-4">
               <User size={32} className="text-slate-400" />
             </div>
             <h3 className="text-lg font-semibold text-slate-700">No Report Selected</h3>
             <p className="text-slate-500 text-sm mt-1 max-w-xs">Enter a Patient ID or Name in the search bar above to view their report.</p>
           </div>
        ) : (
           /* --- REPORT DETAILS (VIEW MODE) --- */
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* LEFT: PATIENT INFO */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold border border-white/20">
                    {reportData.patientName ? reportData.patientName.substring(0, 2).toUpperCase() : "PT"}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{reportData.patientName}</h2>
                    <p className="text-slate-300 text-xs uppercase tracking-wider font-medium">{reportData.patientId}</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><User size={14}/> Age / Gender</span>
                    <span className="text-sm font-medium text-slate-700">{reportData.age} Yrs / {reportData.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Activity size={14}/> Doctor</span>
                    <span className="text-sm font-medium text-slate-700">{reportData.doctorName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14}/> Date</span>
                    <span className="text-sm font-medium text-slate-700">
                        {reportData.createdAt ? new Date(reportData.createdAt).toLocaleDateString() : "-"}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    <Download size={16} /> PDF
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: REPORT CONTENT */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
                
                {/* Title & Status */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="text-indigo-500" size={20}/> 
                      {reportData.testName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">
                        Report ID: {reportData.labReportId}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    reportData.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {reportData.status || "Pending"}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                   
                   {/* 1. MANUAL ENTRY TABLE */}
                   {reportData.entryType === 'Manual' && reportData.testResults?.length > 0 && (
                       <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
                         <table className="w-full text-left text-sm">
                           <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                             <tr>
                               <th className="px-6 py-3">Parameter</th>
                               <th className="px-6 py-3">Result</th>
                               <th className="px-6 py-3">Unit</th>
                               <th className="px-6 py-3 hidden sm:table-cell">Ref. Range</th>
                               <th className="px-6 py-3 text-right">Status</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {reportData.testResults.map((row, idx) => (
                               <tr key={idx} className="hover:bg-slate-50/50">
                                 <td className="px-6 py-3 font-medium text-slate-700">{row.parameter}</td>
                                 <td className="px-6 py-3 font-bold text-slate-900">{row.value}</td>
                                 <td className="px-6 py-3 text-slate-500 text-xs">{row.unit}</td>
                                 <td className="px-6 py-3 text-slate-500 text-xs hidden sm:table-cell">{row.referenceRange}</td>
                                 <td className="px-6 py-3 text-right">
                                   <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(row.status)}`}>
                                     {row.status}
                                   </span>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                   )}

                   {/* 2. UPLOADED FILE */}
                   {reportData.entryType === 'Upload' && reportData.reportDocument && (
                       <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                           <FileText size={48} className="text-slate-400 mx-auto mb-4"/>
                           <p className="text-slate-600 font-medium mb-2">Report Document Available</p>
                           <p className="text-slate-400 text-xs mb-6">Uploaded on {new Date(reportData.updatedAt || reportData.createdAt).toLocaleDateString()}</p>
                           
                           <a 
                             href={reportData.reportDocument} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
                           >
                               <Eye size={18}/> View / Download Document
                           </a>
                       </div>
                   )}

                   {/* 3. PENDING STATE */}
                   {(reportData.status === 'Requested' || reportData.status === 'Pending') && (
                       <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
                           <Clock size={48} className="mb-4 text-amber-300" />
                           <h4 className="text-lg font-bold text-slate-700">Results Pending</h4>
                           <p className="text-sm mt-1">Results have not been entered yet.</p>
                       </div>
                   )}

                   {/* COMMENTS */}
                   {reportData.comments && (
                       <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 mt-6">
                         <h5 className="text-amber-900 font-bold text-sm mb-2 flex items-center gap-2"><Activity size={16}/> Pathologist Impression</h5>
                         <p className="text-sm text-amber-800/80 leading-relaxed">{reportData.comments}</p>
                       </div>
                   )}

                   {/* META FOOTER */}
                   {reportData.technicianName && (
                     <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Verified by: <strong className="text-slate-600">{reportData.technicianName}</strong></span>
                        <span>Completed: {reportData.completedAt ? new Date(reportData.completedAt).toLocaleDateString() : "-"}</span>
                     </div>
                   )}
                </div>

              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}