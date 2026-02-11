import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, FileText, User, Phone, Activity, Download, Printer, Eye,
  Loader2, AlertTriangle, Search, Clock, X, ChevronRight, Maximize2,
  Trash2, Edit3, History, FileClock
} from "lucide-react";
import { LabContext } from "../../context/LabContext";
import { AppContext } from "../../context/AppContext"; // Import AppContext for Role
import AccessDenied from "../../components/AccessDenied"; // Import AccessDenied

export default function PatientWiseReport() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Access Context
  const { fetchReportById, fetchLabReports, deleteLabReport, loading, reports } = useContext(LabContext);
  const { userData } = useContext(AppContext); // Get User Data

  // --- 1. ACCESS CONTROL CHECKS ---
  const userRole = userData?.designation || "";
  
  // Who can VIEW this page?
  const canView = ['Admin', 'Doctor', 'Nurse', 'Technician'].includes(userRole);
  
  // Who can AMEND/DELETE? (Strictly Technician)
  const isTechnician = userRole === 'Technician';

  // --- STATE ---
  const [reportData, setReportData] = useState(location.state?.reportData || null);
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [matchingReports, setMatchingReports] = useState([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Toggle for History Section

  // --- AUTO-FETCH & LOAD DATA ---
  useEffect(() => {
    if (reports.length === 0) fetchLabReports();
  }, []); 

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        if (location.state?.reportData && (location.state.reportData._id === id || location.state.reportData.labReportId === id)) {
          setReportData(location.state.reportData);
          setSearchInput(location.state.reportData.patientId || "");
          return;
        }
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
      }
    };
    loadData();
  }, [id, location.state, fetchReportById, reports]);

  // --- HANDLERS ---
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    const query = searchInput.trim().toLowerCase();
    if(reports.length === 0) { fetchLabReports(); return; }

    const foundMatches = reports.filter((r) => {
        const pId = r.patientId ? r.patientId.toLowerCase() : "";
        const rId = r.labReportId ? r.labReportId.toLowerCase() : "";
        const pName = r.patientName ? r.patientName.toLowerCase() : "";
        return pId.includes(query) || rId.includes(query) || pName.includes(query);
    });

    if (foundMatches.length === 0) {
      setErrorMsg(`No reports found matching "${searchInput}".`);
      setReportData(null);
      setMatchingReports([]);
      setShowResultModal(false);
    } else if (foundMatches.length === 1) {
      const target = foundMatches[0];
      navigate(`/patient-wise-reports/${target.labReportId || target._id}`, { state: { reportData: target } });
      setErrorMsg("");
      setShowResultModal(false);
    } else {
      setMatchingReports(foundMatches);
      setShowResultModal(true);
      setErrorMsg("");
    }
  };

  const selectReport = (report) => {
    navigate(`/patient-wise-reports/${report.labReportId || report._id}`, { state: { reportData: report } });
    setShowResultModal(false);
  };

  const handleDelete = async () => {
    if(!reportData) return;
    const reason = window.prompt("⚠️ CAUTION: You are about to delete this report.\n\nPlease enter a reason for deletion:");
    if (reason === null) return;
    if (reason.trim() === "") { alert("Deletion Cancelled: A reason is mandatory."); return; }

    const success = await deleteLabReport(reportData._id, reason);
    if(success) { setReportData(null); navigate('/lab-reports-list'); }
  };

  const handleAmend = () => {
    if (!reportData) return;
    if (reportData.entryType === "Upload") {
        navigate('/upload-report', { state: { reportData } });
    } else {
        navigate(`/lab-results-entry/${reportData.labReportId || reportData._id}`, { state: { reportData } });
    }
  };

  const handlePrint = () => window.print();

  const getStatusStyle = (status) => {
    if (status === "High" || status === "Abnormal") return "bg-red-50 text-red-600 border-red-100";
    if (status === "Low") return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const isPdf = reportData?.reportDocument?.toLowerCase().endsWith(".pdf");

  // --- 2. SECURITY CHECK (VIEW) ---
  if (!canView) return <AccessDenied />;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      <style>{`@media print { body * { visibility: hidden; } #printable-report, #printable-report * { visibility: visible; } #printable-report { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 20px; background: white; border: none; } .no-print { display: none !important; } }`}</style>

      {/* --- IMAGE MODAL --- */}
      {isImageModalOpen && reportData?.reportDocument && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 no-print" onClick={() => setIsImageModalOpen(false)}>
            <button onClick={() => setIsImageModalOpen(false)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-[110]"><X size={28}/></button>
            <img src={reportData.reportDocument} alt="Full Report" className="max-w-full max-h-[95vh] object-contain rounded shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* --- SELECTION MODAL --- */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in no-print">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div><h3 className="font-bold text-slate-800 text-lg">Select Report</h3><p className="text-xs text-slate-500">Found {matchingReports.length} results</p></div>
                    <button onClick={() => setShowResultModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} className="text-slate-500"/></button>
                </div>
                <div className="overflow-y-auto p-2 space-y-2">
                    {matchingReports.map((item) => (
                        <div key={item._id} onClick={() => selectReport(item)} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-indigo-100 group-hover:text-indigo-600">{item.testName ? item.testName.substring(0,1) : "T"}</div>
                                <div><h4 className="font-bold text-slate-800 text-sm">{item.testName || "Unknown Test"}</h4><div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5"><span className="font-mono font-medium text-slate-400">{item.labReportId}</span><span>•</span><span>{item.patientName}</span></div></div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-400 ml-2"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/lab-reports-list")} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 shadow-sm transition-all cursor-pointer"><ArrowLeft size={18} /></button>
          <div><h1 className="text-2xl font-bold text-slate-800">Lab Results</h1><p className="text-sm text-slate-500">View and manage patient diagnostics</p></div>
        </div>
        <div className="bg-white p-1.5 pl-4 rounded-xl shadow-sm border border-slate-200 flex items-center w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search Report ID / Patient ID..." className="flex-1 px-3 py-1.5 text-sm outline-none text-slate-700 placeholder:text-slate-400" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer">Find</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {errorMsg && <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm animate-in fade-in no-print"><AlertTriangle size={16} /> {errorMsg}</div>}

        {loading && !reportData ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
        ) : !reportData ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-slate-50 p-4 rounded-full mb-4"><User size={32} className="text-slate-400" /></div>
            <h3 className="text-lg font-semibold text-slate-700">No Report Selected</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">Enter a Report ID or Patient ID in the search bar above to view.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* LEFT: PATIENT INFO & ACTIONS */}
            <div className="lg:col-span-4 space-y-6 no-print">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold border border-white/20">{reportData.patientName ? reportData.patientName.substring(0, 2).toUpperCase() : "PT"}</div>
                  <div><h2 className="text-lg font-bold">{reportData.patientName}</h2><p className="text-slate-300 text-xs uppercase tracking-wider font-medium">{reportData.patientId}</p></div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-3"><span className="text-sm text-slate-500 flex items-center gap-2"><User size={14}/> Age / Gender</span><span className="text-sm font-medium text-slate-700">{reportData.age} Yrs / {reportData.gender}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-3"><span className="text-sm text-slate-500 flex items-center gap-2"><Activity size={14}/> Doctor</span><span className="text-sm font-medium text-slate-700">{reportData.doctorName}</span></div>
                  <div className="flex justify-between border-b border-slate-50 pb-3"><span className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14}/> Date</span><span className="text-sm font-medium text-slate-700">{reportData.createdAt ? new Date(reportData.createdAt).toLocaleDateString() : "-"}</span></div>
                </div>

                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                  <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"><Download size={16} /> PDF</button>
                  <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"><Printer size={16} /> Print</button>
                  
                  {/* --- 3. SECURITY CHECK (ACTIONS): TECHNICIAN ONLY --- */}
                  {isTechnician && (
                    <>
                        <button onClick={handleAmend} className="col-span-2 flex items-center justify-center gap-2 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                            <Edit3 size={16} /> Amend Report
                        </button>

                        <button onClick={handleDelete} className="col-span-2 flex items-center justify-center gap-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                            <Trash2 size={16} /> Delete Report
                        </button>
                    </>
                  )}
                </div>
              </div>

              {/* --- NEW: REVISION HISTORY (Collapsible) --- */}
              {reportData.revisionHistory && reportData.revisionHistory.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div 
                        className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setShowHistory(!showHistory)}
                      >
                          <h4 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                              <History size={16} className="text-purple-600"/> Revision History
                          </h4>
                          <ChevronRight size={16} className={`text-gray-400 transition-transform ${showHistory ? 'rotate-90' : ''}`}/>
                      </div>
                      
                      {showHistory && (
                          <div className="p-4 bg-gray-50/50 border-t border-gray-200 space-y-3">
                              {reportData.revisionHistory.map((rev, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 text-xs shadow-sm">
                                      <div className="flex justify-between mb-1">
                                          <span className="font-bold text-gray-800">{rev.amendedBy}</span>
                                          <span className="text-gray-400">{new Date(rev.amendedAt).toLocaleDateString()}</span>
                                      </div>
                                      <p className="text-gray-600 italic mb-2">"{rev.reason}"</p>
                                      
                                      {/* View Previous File Link */}
                                      {rev.previousFile && (
                                          <a href={rev.previousFile} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                                              <FileClock size={12}/> View Old File
                                          </a>
                                      )}
                                      
                                      {/* View Previous Results (Manual) */}
                                      {rev.previousResults && rev.previousResults.length > 0 && (
                                          <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                              <p className="font-bold text-gray-500 mb-1">Previous Values:</p>
                                              {rev.previousResults.slice(0, 3).map((r, i) => (
                                                  <div key={i} className="flex justify-between text-gray-500">
                                                      <span>{r.parameter}:</span>
                                                      <span>{r.value}</span>
                                                  </div>
                                              ))}
                                              {rev.previousResults.length > 3 && <span className="text-gray-400 italic">...and more</span>}
                                          </div>
                                      )}
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}
            </div>

            {/* RIGHT: REPORT CONTENT */}
            <div className="lg:col-span-8">
              <div id="printable-report" className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-indigo-500" size={20} />{reportData.testName}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">Report ID: {reportData.labReportId}</p>
                    <div className="hidden print:block mt-2"><p className="font-bold">Patient: {reportData.patientName} ({reportData.patientId})</p></div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${reportData.status === "Completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>{reportData.status || "Pending"}</span>
                </div>

                <div className="p-6">
                  {reportData.entryType === "Manual" && reportData.testResults?.length > 0 && (
                      <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr><th className="px-6 py-3">Parameter</th><th className="px-6 py-3">Result</th><th className="px-6 py-3">Unit</th><th className="px-6 py-3 hidden sm:table-cell">Ref. Range</th><th className="px-6 py-3 text-right">Status</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {reportData.testResults.map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="px-6 py-3 font-medium text-slate-700">{row.parameter}</td>
                                <td className="px-6 py-3 font-bold text-slate-900">{row.value}</td>
                                <td className="px-6 py-3 text-slate-500 text-xs">{row.unit}</td>
                                <td className="px-6 py-3 text-slate-500 text-xs hidden sm:table-cell">{row.referenceRange}</td>
                                <td className="px-6 py-3 text-right"><span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusStyle(row.status)}`}>{row.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                  )}

                  {reportData.entryType === "Upload" && reportData.reportDocument && (
                      <div className="w-full">
                        {isPdf ? (
                          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                            <FileText size={48} className="text-red-500 mx-auto mb-4" /><p className="text-slate-700 font-bold mb-2 text-lg">PDF Report Available</p>
                            <a href={reportData.reportDocument} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-600 transition shadow-sm cursor-pointer"><Eye size={18} /> View PDF Document</a>
                          </div>
                        ) : (
                          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-black/5 cursor-zoom-in group relative" onClick={() => setIsImageModalOpen(true)}>
                            <img src={reportData.reportDocument} alt="Lab Report" className="w-full h-auto object-contain max-h-[500px] group-hover:opacity-95 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"><div className="bg-white/90 text-slate-800 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-sm backdrop-blur-sm"><Maximize2 size={16}/> Click to Expand</div></div>
                          </div>
                        )}
                      </div>
                  )}

                  {(reportData.status === "Requested" || reportData.status === "Pending") && (<div className="flex flex-col items-center justify-center p-12 text-center text-slate-400"><Clock size={48} className="mb-4 text-amber-300" /><h4 className="text-lg font-bold text-slate-700">Results Pending</h4></div>)}
                  {reportData.comments && (<div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5 mt-6"><h5 className="text-amber-900 font-bold text-sm mb-2 flex items-center gap-2"><Activity size={16} /> Pathologist Impression</h5><p className="text-sm text-amber-800/80 leading-relaxed">{reportData.comments}</p></div>)}
                  {reportData.technicianName && (<div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400"><span>Verified by: <strong className="text-slate-600">{reportData.technicianName}</strong></span><span>Completed: {reportData.completedAt ? new Date(reportData.completedAt).toLocaleDateString() : "-"}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}