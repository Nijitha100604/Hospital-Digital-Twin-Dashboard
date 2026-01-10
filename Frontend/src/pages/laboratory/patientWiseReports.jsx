import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import { 
  Search, Printer, Download, FileText, User, 
  Phone, CheckCircle, ChevronDown, ArrowLeft, 
  FileSearch, AlertTriangle, Clock, FlaskConical,
  XCircle
} from "lucide-react";

// --- 1. MOCK DATABASE ---
// Added multiple tests for "Alice (P000123)" to demonstrate switching
const MOCK_DB = [
  // Alice - Has CBC (Completed) AND Lipid Profile (Pending)
  { reportId: "LR00101", patientId: "P000123", patientName: "Alice Williams", testType: "Complete Blood Count (CBC)", date: "2025-10-20", status: "Completed", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  { reportId: "LR00199", patientId: "P000123", patientName: "Alice Williams", testType: "Lipid Profile", date: "2025-10-21", status: "Pending", age: 34, gender: "Female", phone: "+1 555 010 9988", bloodGroup: "O+" },
  
  // Bob
  { reportId: "LR00102", patientId: "P000124", patientName: "Bob Gruns", testType: "Lipid Profile", date: "2025-10-21", status: "Pending", age: 45, gender: "Male", phone: "+1 555 019 2834", bloodGroup: "A-" },
  
  // Korny
  { reportId: "LR00105", patientId: "P000125", patientName: "Korny Smith", testType: "Lipid Profile", date: "2025-10-22", status: "Completed", age: 29, gender: "Male", phone: "+1 555 091 1122", bloodGroup: "B+" },
  
  // David
  { reportId: "LR00112", patientId: "P000132", patientName: "David Rose", testType: "MRI Scan", date: "2025-10-29", status: "Completed", age: 52, gender: "Male", phone: "+1 555 222 3344", bloodGroup: "AB+" },
];

// List of all possible tests available in the drop-down
const STANDARD_TESTS = [
  "Complete Blood Count (CBC)",
  "Lipid Profile",
  "Thyroid Profile",
  "Liver Function Test",
  "Glucometry",
  "MRI Scan",
  "X-Ray"
];

export default function PatientWiseReport() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [currentPatient, setCurrentPatient] = useState(null); // Stores basic patient info
  const [selectedTestType, setSelectedTestType] = useState(""); // Currently selected test
  const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 1. INITIALIZATION
  useEffect(() => {
    if (location.state?.reportData) {
      const data = location.state.reportData;
      // Set Patient Info
      setCurrentPatient({
        id: data.patientId,
        name: data.patientName,
        age: data.age || 40,
        gender: data.gender || "Male",
        bloodGroup: data.bloodGroup || "O+",
        phone: data.phone || "+1 555 000 0000",
        initials: data.patientName.substring(0, 2).toUpperCase()
      });
      // Set the test type that was clicked
      setSelectedTestType(data.testType === "CBC" ? "Complete Blood Count (CBC)" : data.testType);
    }
  }, [location.state]);

  // 2. SEARCH LOGIC
  const handleSearch = () => {
    setErrorMsg("");
    if(!searchInput.trim()) return;

    // Find ANY report for this patient to get their basic details
    const found = MOCK_DB.find(item => 
      item.patientName.toLowerCase().includes(searchInput.toLowerCase()) || 
      item.patientId.toLowerCase() === searchInput.toLowerCase() ||
      item.reportId.toLowerCase() === searchInput.toLowerCase()
    );

    if (found) {
      setCurrentPatient({
        id: found.patientId,
        name: found.patientName,
        age: found.age,
        gender: found.gender,
        bloodGroup: found.bloodGroup,
        phone: found.phone,
        initials: found.patientName.substring(0, 2).toUpperCase()
      });
      // Default to the test found, or the first standard one
      setSelectedTestType(found.testType === "CBC" ? "Complete Blood Count (CBC)" : found.testType);
    } else {
      setErrorMsg("Patient not found. Try 'Alice' or 'P000123'");
      setCurrentPatient(null);
    }
  };

  // 3. GET REPORT FOR SELECTED TEST
  // Looks through DB to see if the current patient has a report for the selected test
  const activeReport = currentPatient 
    ? MOCK_DB.find(r => r.patientId === currentPatient.id && (r.testType === selectedTestType || (selectedTestType.includes("CBC") && r.testType === "CBC"))) 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <ArrowLeft size={20} className="text-gray-600"/>
           </button>
           <h1 className="text-xl md:text-2xl font-bold text-gray-800">Patient-Wise Report</h1>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-4">
           <div className="w-full max-w-2xl relative">
              <input 
                type="text" 
                placeholder="Search Patient Name or ID..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg shadow-inner"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
              <button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-bold transition-colors cursor-pointer"
              >
                Search
              </button>
           </div>
           {errorMsg && <p className="text-red-500 font-medium flex items-center gap-2"><AlertTriangle size={16}/> {errorMsg}</p>}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {currentPatient ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          
          {/* 1. Patient Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
               <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-3xl font-bold text-purple-600 uppercase">
                  {currentPatient.initials}
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">{currentPatient.name}</h2>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mt-2">
                     <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"><strong>ID:</strong> {currentPatient.id}</span>
                     <span className="flex items-center gap-1"><User size={14}/> {currentPatient.age} Yrs / {currentPatient.gender}</span>
                     <span className="flex items-center gap-1"><SimpleCheckIcon size={14} className="text-gray-400"/> {currentPatient.bloodGroup}</span>
                     <span className="flex items-center gap-1"><Phone size={14}/> {currentPatient.phone}</span>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="px-4 py-2 bg-[#A03657] text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#8a2d4a] transition cursor-pointer"><Download size={16}/> Download</button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition cursor-pointer"><Printer size={16}/> Print</button>
               </div>
            </div>
          </div>

          {/* 2. Test Selection Dropdown */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <span className="text-sm font-bold text-gray-500 uppercase whitespace-nowrap"><FlaskConical size={16} className="inline mb-1 text-purple-600"/> Select Test:</span>
             <div className="relative w-full md:w-1/3">
                <select 
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none font-bold text-gray-700 appearance-none cursor-pointer focus:ring-2 focus:ring-purple-500"
                  value={selectedTestType}
                  onChange={(e) => setSelectedTestType(e.target.value)}
                >
                  {STANDARD_TESTS.map(test => (
                    <option key={test} value={test}>{test}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16}/>
             </div>
          </div>

          {/* 3. REPORT CONTENT (CONDITIONAL RENDERING) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
             
             {/* CASE A: No Data Found for this Test */}
             {!activeReport && (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                   <div className="bg-gray-100 p-4 rounded-full mb-4">
                      <XCircle size={48} className="text-gray-400" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-700">Test Not Undergone</h3>
                   <p className="text-gray-500 mt-2 max-w-md">
                      No records found for <strong>{selectedTestType}</strong>. The patient has not undergone this test or the data hasn't been entered into the system yet.
                   </p>
                </div>
             )}

             {/* CASE B: Report is Pending */}
             {activeReport && activeReport.status === "Pending" && (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center bg-orange-50/30">
                   <div className="bg-orange-100 p-4 rounded-full mb-4">
                      <Clock size={48} className="text-orange-500" />
                   </div>
                   <h3 className="text-2xl font-bold text-orange-800">Report Not Yet Uploaded</h3>
                   <p className="text-orange-600 mt-2 max-w-md">
                      The results for <strong>{activeReport.testType}</strong> (Date: {activeReport.date}) are currently processing or pending verification.
                   </p>
                   <button className="mt-6 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition cursor-pointer">
                      Notify When Ready
                   </button>
                </div>
             )}

             {/* CASE C: Report Completed (Show Table) */}
             {activeReport && activeReport.status === "Completed" && (
                <div className="animate-in fade-in">
                   {/* Meta Header */}
                   <div className="bg-gray-50/50 p-6 border-b border-gray-200 flex flex-wrap gap-6 text-sm">
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-1">Sample Date</p>
                         <p className="font-bold text-gray-700">{activeReport.date}</p>
                      </div>
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-1">Technician</p>
                         <p className="font-bold text-gray-700 flex items-center gap-1"><User size={14}/> R. Kumar</p>
                      </div>
                      <div>
                         <p className="text-gray-400 text-xs font-bold uppercase mb-1">Status</p>
                         <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-xs font-bold uppercase">Completed</span>
                      </div>
                   </div>

                   {/* Results Table */}
                   <div className="p-6">
                      <h4 className="font-bold text-gray-800 mb-4 text-lg border-l-4 border-purple-600 pl-3">Detailed Analysis</h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-100">
                         <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                               <tr><th className="p-3 text-xs">Test Parameter</th><th className="p-3 text-xs">Result</th><th className="p-3 text-xs">Ref Range</th><th className="p-3 text-xs">Flag</th></tr>
                            </thead>
                            <tbody>
                               {/* Mock Data based on Test Type - simplified for demo */}
                               <tr className="border-b border-gray-50 hover:bg-gray-50">
                                  <td className="p-3 text-sm font-medium">Parameter 1</td>
                                  <td className="p-3 text-sm font-bold">12.5 <span className="text-xs font-normal text-gray-400">units</span></td>
                                  <td className="p-3 text-xs text-gray-500">10.0 - 15.0</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-green-100 text-green-700 border-green-200">Normal</span></td>
                               </tr>
                               <tr className="border-b border-gray-50 hover:bg-gray-50">
                                  <td className="p-3 text-sm font-medium">Parameter 2</td>
                                  <td className="p-3 text-sm font-bold">8.0 <span className="text-xs font-normal text-gray-400">units</span></td>
                                  <td className="p-3 text-xs text-gray-500">9.0 - 20.0</td>
                                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-red-100 text-red-600 border-red-200">Low</span></td>
                               </tr>
                            </tbody>
                         </table>
                      </div>
                      
                      {/* Impression */}
                      <div className="mt-6 bg-[#FFF8F0] border border-[#FFE4C4] rounded-lg p-4">
                         <h5 className="font-bold text-gray-800 mb-2">Pathologist Impression</h5>
                         <p className="text-sm text-gray-700">Results correlate with clinical findings. Mild deviation observed in Parameter 2.</p>
                      </div>
                   </div>
                </div>
             )}

          </div>

        </div>
      ) : (
        // --- EMPTY STATE (Initial View) ---
        <div className="flex flex-col items-center justify-center h-[50vh] text-center text-gray-400 animate-in fade-in zoom-in-95 duration-300">
           <div className="bg-white p-6 rounded-full shadow-sm mb-4">
              <FileSearch size={64} className="text-purple-200" />
           </div>
           <h3 className="text-xl font-bold text-gray-700">No Patient Selected</h3>
           <p className="text-sm mt-2 max-w-xs mx-auto">Use the search bar above to find a patient by Name or ID, or select "View Details" from the Report List.</p>
        </div>
      )}
    </div>
  );
}

// Simple Icon
function SimpleCheckIcon({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}