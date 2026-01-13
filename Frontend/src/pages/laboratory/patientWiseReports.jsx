import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Download, Printer, Search, Phone, ArrowLeft,
  AlertTriangle, Clock, FileSearch, XCircle, Eye,
  User, Calendar, Activity, FileText, Share2
} from "lucide-react";

// Import Data
import { labReportsData } from "../../data/labReportsData";

// Tests available for the dropdown
const STANDARD_TESTS = [
  "CBC", "Lipid Profile", "Thyroid Profile", 
  "MRI Scan", "X-Ray", "Glucometry", "HbA1c"
];

export default function PatientWiseReport() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [selectedTestType, setSelectedTestType] = useState("CBC");
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // --- INITIAL LOAD ---
  useEffect(() => {
    if (location.state?.reportData) {
      const { patientId, testType } = location.state.reportData;
      setCurrentPatientId(patientId);
      setSelectedTestType(testType);
      setSearchInput(patientId);
    }
  }, [location.state]);

  // --- DATA LOGIC ---
  const patientProfile = currentPatientId 
    ? labReportsData.find(r => r.patientId === currentPatientId)
    : null;

  const activeReport = currentPatientId
    ? labReportsData.find(r => r.patientId === currentPatientId && r.testType === selectedTestType)
    : null;

  // --- HANDLERS ---
  const handleSearch = () => {
    setErrorMsg("");
    if (!searchInput.trim()) return;

    const found = labReportsData.find(r => 
      r.patientId.toLowerCase() === searchInput.toLowerCase() || 
      r.patientName.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (found) {
      setCurrentPatientId(found.patientId);
      setSelectedTestType(found.testType);
    } else {
      setErrorMsg("No records found. Please check Patient ID.");
      setCurrentPatientId(null);
    }
  };

  const renderResults = () => {
    // Mock data generation for UI demonstration
    if (selectedTestType === "CBC") {
      return [
        { name: "Hemoglobin", value: "11.2", unit: "g/dL", range: "11.5 - 15.0", status: "Low" },
        { name: "RBC Count", value: "4.1", unit: "mil/µL", range: "3.8 - 4.8", status: "Normal" },
        { name: "WBC Count", value: "12500", unit: "/µL", range: "4000 - 11000", status: "High" },
        { name: "Platelets", value: "245", unit: "10³/µL", range: "150 - 450", status: "Normal" },
        { name: "HCT", value: "34.0", unit: "%", range: "36.0 - 46.0", status: "Low" },
      ];
    }
    if (selectedTestType === "Lipid Profile") {
      return [
        { name: "Total Cholesterol", value: "240", unit: "mg/dL", range: "< 200", status: "High" },
        { name: "HDL", value: "35", unit: "mg/dL", range: "> 40", status: "Low" },
        { name: "LDL", value: "160", unit: "mg/dL", range: "< 100", status: "High" },
      ];
    }
    return [];
  };

  const getStatusStyle = (status) => {
    if (status === "High") return "bg-red-50 text-red-600 border-red-100";
    if (status === "Low") return "bg-amber-50 text-amber-600 border-amber-100";
    if (status === "Abnormal") return "bg-red-50 text-red-600 border-red-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      
      {/* --- TOP HEADER --- */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 shadow-sm transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Lab Results</h1>
            <p className="text-sm text-slate-500">View and manage patient diagnostics</p>
          </div>
        </div>

        {/* Search Bar */}
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
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            Find
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto">
        
        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {!currentPatientId ? (
          /* EMPTY STATE */
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <User size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No Patient Selected</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs">Use the search bar above or select a patient from the main list to view report details.</p>
          </div>
        ) : (
          /* REPORT DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* LEFT COLUMN: PATIENT INFO & ACTIONS */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Patient Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold border border-white/20">
                    {patientProfile?.patientName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{patientProfile?.patientName}</h2>
                    <p className="text-slate-300 text-xs uppercase tracking-wider font-medium">{patientProfile?.patientId}</p>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><User size={14}/> Age / Gender</span>
                    <span className="text-sm font-medium text-slate-700">{patientProfile?.age} Yrs / {patientProfile?.gender}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Activity size={14}/> Blood Group</span>
                    <span className="text-sm font-medium text-slate-700">{patientProfile?.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-50 pb-3">
                    <span className="text-sm text-slate-500 flex items-center gap-2"><Phone size={14}/> Contact</span>
                    <span className="text-sm font-medium text-slate-700">{patientProfile?.phone}</span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    <Download size={16} /> Report
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>

              {/* Selector Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Switch Test Report</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 cursor-pointer"
                    value={selectedTestType}
                    onChange={(e) => setSelectedTestType(e.target.value)}
                  >
                    {STANDARD_TESTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ArrowLeft className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 text-slate-400 pointer-events-none" size={16}/>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: REPORT DETAILS */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] flex flex-col">
                
                {/* Report Header */}
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                      <FileText className="text-indigo-500" size={20}/> 
                      {selectedTestType}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wide">Pathology Department</p>
                  </div>
                  
                  {activeReport && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      activeReport.status === 'Completed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {activeReport.status}
                    </span>
                  )}
                </div>

                {/* Conditional Content */}
                {!activeReport ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                    <XCircle size={48} className="mb-4 text-slate-200" />
                    <p className="font-medium text-slate-600">Test Not Undergone</p>
                    <p className="text-sm mt-1">No data available for {selectedTestType}</p>
                  </div>
                ) : activeReport.status === 'Pending' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-amber-50 p-4 rounded-full mb-4 animate-pulse">
                      <Clock size={40} className="text-amber-500" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">Processing in Progress</h4>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm">
                      Sample collected on <span className="font-semibold text-slate-700">{activeReport.date}</span>. 
                      Results will be updated automatically once approved.
                    </p>
                  </div>
                ) : (
                  /* RESULTS TABLE */
                  <div className="p-6">
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Collected On</p>
                        <p className="text-sm font-semibold text-slate-700">{activeReport.date}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Sample ID</p>
                        <p className="text-sm font-semibold text-slate-700">{activeReport.reportId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Technician</p>
                        <p className="text-sm font-semibold text-slate-700">R. Kumar</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Referred By</p>
                        <p className="text-sm font-semibold text-slate-700">Dr. Smith</p>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-slate-200 mb-8">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3">Investigation</th>
                            <th className="px-6 py-3">Result</th>
                            <th className="px-6 py-3">Units</th>
                            <th className="px-6 py-3 hidden sm:table-cell">Ref. Range</th>
                            <th className="px-6 py-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {renderResults().map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-3 font-medium text-slate-700">{row.name}</td>
                              <td className="px-6 py-3 font-bold text-slate-900">{row.value}</td>
                              <td className="px-6 py-3 text-slate-500 text-xs">{row.unit}</td>
                              <td className="px-6 py-3 text-slate-500 text-xs hidden sm:table-cell">{row.range}</td>
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

                    {/* Doctor's Note */}
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-5">
                      <h5 className="text-amber-900 font-bold text-sm mb-2 flex items-center gap-2">
                        <Activity size={16}/> Pathologist Impression
                      </h5>
                      <p className="text-sm text-amber-800/80 leading-relaxed">
                        Results indicate iron deficiency anemia. White blood cell count suggests acute infection. 
                        Recommended clinical correlation and follow-up in 2 weeks.
                      </p>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}