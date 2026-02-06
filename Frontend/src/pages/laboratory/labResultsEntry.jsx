import React, { useState, useContext, useEffect, useRef } from "react";
import { 
  Save, Printer, CheckCircle, Activity, 
  ChevronDown, FlaskConical, AlertCircle, FileUp, ArrowLeft, Search, Loader2
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom"; // Added useParams
import { LabContext } from "../../context/LabContext"; 
import { StaffContext } from "../../context/StaffContext"; 
import { PatientContext } from "../../context/PatientContext"; 

// --- TEST TEMPLATES ---
const testTemplates = {
  "CBC (Hemogram)": [
    { id: "cbc1", param: "Hemoglobin", unit: "g/dL", min: 13.0, max: 17.0 },
    { id: "cbc2", param: "RBC Count", unit: "mill/mm³", min: 4.5, max: 5.5 },
    { id: "cbc3", param: "WBC Count", unit: "cells/mcL", min: 4000, max: 11000 },
    { id: "cbc4", param: "Platelet Count", unit: "lakh/mm³", min: 1.5, max: 4.5 },
    { id: "cbc5", param: "PCV", unit: "%", min: 40, max: 50 },
    { id: "cbc6", param: "MCV", unit: "fL", min: 80, max: 100 },
  ],
  "Lipid Profile": [
    { id: "lp1", param: "Total Cholesterol", unit: "mg/dL", min: 0, max: 200 },
    { id: "lp2", param: "HDL Cholesterol", unit: "mg/dL", min: 40, max: 60 },
    { id: "lp3", param: "LDL Cholesterol", unit: "mg/dL", min: 0, max: 100 },
    { id: "lp4", param: "Triglycerides", unit: "mg/dL", min: 0, max: 150 },
    { id: "lp5", param: "VLDL Cholesterol", unit: "mg/dL", min: 2, max: 30 },
  ],
  "Glucometry (Diabetes)": [
    { id: "glu1", param: "Fasting Blood Sugar", unit: "mg/dL", min: 70, max: 100 },
    { id: "glu2", param: "Post Prandial (PP)", unit: "mg/dL", min: 70, max: 140 },
    { id: "glu3", param: "HbA1c", unit: "%", min: 4.0, max: 5.6 },
    { id: "glu4", param: "Random Blood Sugar", unit: "mg/dL", min: 70, max: 140 },
  ],
  // ... Add other templates as needed
};

export default function LabResultEntry() {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  // --- CONTEXT ---
  const { submitLabResults, fetchReportById, loading } = useContext(LabContext);
  const { staffs } = useContext(StaffContext);
  const { patients } = useContext(PatientContext); 

  // --- STATE ---
  const [reportData, setReportData] = useState(location.state?.reportData || null);
  const [patientDetails, setPatientDetails] = useState({
    patientId: "",
    patientName: "",
    age: "",
    gender: "Male",
    referringDr: "",
    sampleDate: new Date().toISOString().split('T')[0],
    dept: "Pathology"
  });

  const [selectedTestType, setSelectedTestType] = useState("Glucometry (Diabetes)");
  const [results, setResults] = useState({});
  const [comments, setComments] = useState("");

  // Searchable Dropdown State
  const [verifierName, setVerifierName] = useState(""); 
  const [verifiedBy, setVerifiedBy] = useState("");     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- 1. LOAD DATA ON MOUNT ---
  useEffect(() => {
    const loadData = async () => {
      // Priority 1: Data passed via Navigation state (Instant)
      if (location.state?.reportData) {
        initializeForm(location.state.reportData);
        return;
      }

      // Priority 2: Fetch from ID in URL (Handles Page Refresh)
      if (id) {
        const data = await fetchReportById(id);
        if (data) {
          initializeForm(data);
        }
      }
    };
    loadData();
  }, [id, location.state, fetchReportById]);

  // Helper to fill form states
  const initializeForm = (data) => {
    setReportData(data);
    setPatientDetails({
      patientId: data.patientId || "",
      patientName: data.patientName || "",
      age: data.age || "",
      gender: data.gender || "Male",
      referringDr: data.doctorName || "",
      sampleDate: data.createdAt ? new Date(data.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      dept: data.department || "Pathology"
    });
    
    // Set Test Type if valid
    if (data.testName && testTemplates[data.testName]) {
      setSelectedTestType(data.testName);
    }
  };

  // --- FILTER TECHNICIANS ---
  const technicians = (staffs || []).filter(s => 
    (s.department === "Laboratory") || 
    (s.designation && s.designation.toLowerCase().includes("technician")) ||
    (s.role && s.role.toLowerCase().includes("technician"))
  );
  const availableStaff = technicians.length > 0 ? technicians : staffs;
  const filteredStaff = availableStaff.filter(staff => 
    staff.fullName.toLowerCase().includes(verifierName.toLowerCase())
  );

  // --- HANDLERS ---

  // Auto-Fill Patient Logic
  const handleIdBlur = () => {
    if (!patientDetails.patientId) return;
    const found = patients.find(p => p.patientId.toLowerCase() === patientDetails.patientId.toLowerCase());
    
    if (found) {
      setPatientDetails(prev => ({
        ...prev,
        patientName: found.personal.name,
        age: found.personal.age,
        gender: found.personal.gender,
      }));
    }
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleResultChange = (paramId, value) => {
    setResults(prev => ({ ...prev, [paramId]: value }));
  };

  const getFlag = (val, min, max) => {
    if (val === "" || isNaN(val)) return null;
    const num = parseFloat(val);
    if (num < min) return { label: "Low", color: "bg-yellow-100 text-yellow-700 border-yellow-200", status: "Low" };
    if (num > max) return { label: "High", color: "bg-red-100 text-red-700 border-red-200", status: "High" };
    return { label: "Normal", color: "bg-green-100 text-green-700 border-green-200", status: "Normal" };
  };

  const handleSubmit = async () => {
      if(!patientDetails.patientId) return alert("Patient ID is required");
      if(!verifiedBy) return alert("Please select a verifier");

      const currentParams = testTemplates[selectedTestType] || [];
      
      const formattedResults = currentParams.map(param => {
          const val = results[param.id] || "";
          const flag = getFlag(val, param.min, param.max);
          return {
              parameter: param.param,
              value: val,
              unit: param.unit,
              referenceRange: `${param.min} - ${param.max}`,
              status: flag ? flag.status : "Pending"
          };
      });

      // Use _id from reportData OR the ID from URL
      const finalReportId = reportData?._id || id;

      if (!finalReportId) {
          alert("Error: Report ID missing. Please go back to the list and try again.");
          return;
      }

      const payload = {
          testResults: formattedResults,
          comments,
          technicianId: verifiedBy,
          technicianName: verifierName,
          sampleDate: patientDetails.sampleDate
      };

      const success = await submitLabResults(finalReportId, payload);
      if(success) navigate('/lab-reports-list');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentParams = testTemplates[selectedTestType] || [];

  if (loading && !reportData && !patientDetails.patientId) {
      return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <button onClick={() => navigate('/lab-reports-list')} className="flex items-center text-gray-500 hover:text-purple-700 mb-2 text-sm font-bold"><ArrowLeft size={16} className="mr-1"/> Back</button>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-purple-700 shrink-0" size={24} />
            Lab Result Entry
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Entering results for: <span className="font-bold text-gray-800">{reportData?.labReportId || "New Entry"}</span></p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <button 
                onClick={() => navigate('/upload-report', { state: { reportData } })} 
                className="flex items-center gap-2 bg-white text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors shadow-sm"
            >
                <FileUp size={16}/> Upload Report Instead
            </button>
            
            <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 w-full md:w-auto">
                <FlaskConical size={18} className="text-purple-600 shrink-0"/>
                <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap hidden sm:inline">Test Type:</span>
                <div className="relative flex-1 min-w-0">
                <select 
                    value={selectedTestType}
                    onChange={(e) => { setSelectedTestType(e.target.value); setResults({}); }}
                    className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer text-sm w-full py-1 pr-4 truncate"
                >
                    {Object.keys(testTemplates).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14}/>
                </div>
            </div>
        </div>
      </div>

      {/* --- SECTION 1: PATIENT DETAILS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
          Patient Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Patient ID</label>
            <input 
              type="text" 
              name="patientId" 
              placeholder="e.g. P-1024"
              value={patientDetails.patientId} 
              onChange={handlePatientChange}
              onBlur={handleIdBlur} 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Patient Name</label>
            <input 
                type="text" 
                name="patientName"
                value={patientDetails.patientName} 
                onChange={handlePatientChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-gray-700"
            />
          </div>

          <div className="flex gap-2">
             <div className="space-y-1 flex-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Age</label>
                <input type="text" name="age" value={patientDetails.age} onChange={handlePatientChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700"/>
             </div>
             <div className="space-y-1 flex-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Gender</label>
                <select name="gender" value={patientDetails.gender} onChange={handlePatientChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white">
                    <option>Male</option><option>Female</option><option>Other</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Sample Date</label>
            <input type="date" name="sampleDate" value={patientDetails.sampleDate} onChange={handlePatientChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700 cursor-pointer"/>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Referring Dr.</label>
            <input 
                type="text" 
                name="referringDr" 
                placeholder="Dr. Name"
                value={patientDetails.referringDr} 
                onChange={handlePatientChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Department</label>
            <input 
                type="text" 
                name="dept" 
                value={patientDetails.dept} 
                onChange={handlePatientChange} 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* --- SECTION 2: RESULT ENTRY --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-gray-100 pb-2 gap-2">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">
               Test Results: <span className="text-purple-700">{selectedTestType}</span>
            </h2>
            <span className="text-[10px] text-gray-400 font-medium italic hidden sm:block">*Values flagged by ref. range</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 border-y border-gray-200">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-wider w-[30%]">Parameter</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider w-[25%]">Input Value</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider w-[15%]">Units</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider w-[15%]">Range</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider w-[15%] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentParams.map((item) => {
                const currentVal = results[item.id] || "";
                const flag = getFlag(currentVal, item.min, item.max);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-gray-700">{item.param}</td>
                    <td className="p-4">
                        <input 
                         type="number" placeholder="0.00"
                         className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono font-bold text-sm ${flag?.label === 'High' ? 'bg-red-50 border-red-200 text-red-700' : flag?.label === 'Low' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-white border-gray-300 text-gray-800'}`}
                         value={currentVal} onChange={(e) => handleResultChange(item.id, e.target.value)}
                        />
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">{item.unit}</td>
                    <td className="p-4 text-sm text-gray-500 font-medium whitespace-nowrap">{item.min} - {item.max}</td>
                    <td className="p-4 text-center">
                      {flag && (
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${flag.color}`}>
                           {flag.label === "High" ? <AlertCircle size={10}/> : null}
                           {flag.label}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION 3: FOOTER ACTIONS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
               <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2 block">Pathologist Comments</label>
               <textarea 
                 rows="3" 
                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                 placeholder="Clinical notes..."
                 value={comments} onChange={(e) => setComments(e.target.value)}
               ></textarea>
            </div>

            <div className="flex flex-col justify-between">
               <div className="mb-4 lg:mb-0">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2 block">Verified By <span className="text-red-500">*</span></label>
                  
                  {/* --- NEW SEARCHABLE DROPDOWN --- */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="relative">
                        <input 
                            type="text" 
                            className="cursor-pointer w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-700 text-sm"
                            placeholder="Type to search technician..."
                            value={verifierName}
                            onChange={(e) => {
                                setVerifierName(e.target.value);
                                setIsDropdownOpen(true);
                                if(e.target.value === "") setVerifiedBy("");
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {isDropdownOpen ? <Search size={16} className="text-purple-500" /> : <ChevronDown size={16} className="text-gray-400" />}
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map(staff => (
                                    <div 
                                        key={staff.staffId}
                                        className="p-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-none flex justify-between"
                                        onClick={() => {
                                            setVerifiedBy(staff.staffId);
                                            setVerifierName(staff.fullName);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <span className="font-bold">{staff.fullName}</span>
                                        <span className="text-xs text-gray-400">{staff.designation || staff.role}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-xs text-gray-400">No matching staff found</div>
                            )}
                        </div>
                    )}
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-4">
                  <button className="col-span-1 py-2.5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"><Save size={14} /> Draft</button>
                  <button className="col-span-1 py-2.5 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"><Printer size={14} /> Print</button>
                  <button onClick={handleSubmit} disabled={loading} className="col-span-1 py-2.5 bg-purple-700 text-white hover:bg-purple-800 font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm disabled:opacity-50">
                      {loading ? '...' : <><CheckCircle size={14} /> Submit</>}
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}