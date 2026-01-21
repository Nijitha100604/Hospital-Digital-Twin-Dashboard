import React, { useState, useEffect } from "react";
import { 
  Upload, FileText, X, CheckCircle, Calendar, User, 
  FlaskConical, Hash, Save, Activity, ChevronDown, 
  AlertCircle, FileUp, Keyboard, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- MOCK PATIENT DATA (Replace with API call in production) ---
import { patient_records } from "../../data/patient"; 

/* -------------------- TEST PARAMETERS CONFIG -------------------- */
const testTemplates = {
  "CBC (Hemogram)": [
    { id: "cbc1", param: "Hemoglobin", unit: "g/dL", min: 13.0, max: 17.0 },
    { id: "cbc2", param: "RBC Count", unit: "mill/mm³", min: 4.5, max: 5.5 },
    { id: "cbc3", param: "WBC Count", unit: "cells/mcL", min: 4000, max: 11000 },
    { id: "cbc4", param: "Platelet Count", unit: "lakh/mm³", min: 1.5, max: 4.5 },
    { id: "cbc5", param: "PCV", unit: "%", min: 40, max: 50 },
  ],
  "Lipid Profile": [
    { id: "lp1", param: "Total Cholesterol", unit: "mg/dL", min: 0, max: 200 },
    { id: "lp2", param: "HDL Cholesterol", unit: "mg/dL", min: 40, max: 60 },
    { id: "lp3", param: "LDL Cholesterol", unit: "mg/dL", min: 0, max: 100 },
    { id: "lp4", param: "Triglycerides", unit: "mg/dL", min: 0, max: 150 },
  ],
  "Liver Function Test (LFT)": [
    { id: "lft1", param: "Bilirubin Total", unit: "mg/dL", min: 0.1, max: 1.2 },
    { id: "lft2", param: "SGOT (AST)", unit: "U/L", min: 5, max: 40 },
    { id: "lft3", param: "SGPT (ALT)", unit: "U/L", min: 7, max: 56 },
  ],
  "Thyroid Profile": [
    { id: "th1", param: "T3", unit: "ng/dL", min: 80, max: 200 },
    { id: "th2", param: "T4", unit: "µg/dL", min: 5.0, max: 12.0 },
    { id: "th3", param: "TSH", unit: "µIU/mL", min: 0.4, max: 4.0 },
  ],
  "Glucometry (Diabetes)": [
    { id: "glu1", param: "Fasting Blood Sugar", unit: "mg/dL", min: 70, max: 100 },
    { id: "glu2", param: "Post Prandial (PP)", unit: "mg/dL", min: 70, max: 140 },
    { id: "glu3", param: "HbA1c", unit: "%", min: 4.0, max: 5.6 },
  ],
  "Kidney Function Test (KFT)": [
    { id: "kft1", param: "Blood Urea", unit: "mg/dL", min: 15, max: 40 },
    { id: "kft2", param: "Creatinine", unit: "mg/dL", min: 0.6, max: 1.2 },
  ],
  "General Report": [], 
  "MRI Scan": [],
  "X-Ray": [],
  "CT Scan": [],
  "Ultrasound": []
};

const TEST_TYPES = Object.keys(testTemplates);

export default function AddLabReport() {
  const navigate = useNavigate();

  // --- STATE ---
  const [entryMode, setEntryMode] = useState("manual"); // 'manual' | 'upload'
  
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    ageGender: "", // Display field
    testType: "Glucometry (Diabetes)",
    referringDr: "",
    sampleDate: new Date().toISOString().split('T')[0],
    techName: "",
    techId: "",
    dept: "Pathology",
    phone: "" // Hidden but needed for payload
  });

  const [results, setResults] = useState({});
  const [comments, setComments] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // --- AUTO-FILL LOGIC ---
  const handleIdBlur = () => {
    if (!formData.patientId) return;
    const found = patient_records.find(p => p.patientId.toLowerCase() === formData.patientId.toLowerCase());
    if (found) {
      setFormData(prev => ({
        ...prev,
        patientName: found.patientName,
        ageGender: `${found.age} / ${found.gender}`,
        phone: found.mobileNumber
      }));
    }
  };

  const handleNameBlur = () => {
    if (!formData.patientName) return;
    const found = patient_records.find(p => p.patientName.toLowerCase() === formData.patientName.toLowerCase());
    if (found) {
      setFormData(prev => ({
        ...prev,
        patientId: found.patientId,
        ageGender: `${found.age} / ${found.gender}`,
        phone: found.mobileNumber
      }));
    }
  };

  // --- HELPER: Status Flag ---
  const getFlag = (val, min, max) => {
    if (val === "" || isNaN(val)) return null;
    const num = parseFloat(val);
    if (num < min) return { label: "Low", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (num > max) return { label: "High", color: "bg-red-50 text-red-700 border-red-200" };
    return { label: "Normal", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  };

  // --- HANDLERS ---
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    // 1. Validation
    if (!formData.patientId || !formData.patientName) {
      alert("Please enter Patient ID and Name.");
      return;
    }
    if (entryMode === "upload" && !file) {
      alert("Please upload a file.");
      return;
    }

    // 2. Construct Payload for Backend (Matches labReportModel.js)
    const payload = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      age: formData.ageGender.split('/')[0]?.trim() || "Unknown",
      gender: formData.ageGender.split('/')[1]?.trim() || "Unknown",
      phone: formData.phone,
      referringDoctor: formData.referringDr,
      sampleDate: formData.sampleDate,
      testType: formData.testType,
      department: formData.dept,
      technicianName: formData.techName,
      technicianId: formData.techId,
      
      // Mode Specific
      entryType: entryMode === "upload" ? "Upload" : "Manual",
      reportDocument: entryMode === "upload" ? file.name : null, // In real app use URL
      
      testResults: entryMode === "manual" ? Object.entries(results).map(([key, val]) => {
         const config = testTemplates[formData.testType].find(p => p.id === key);
         return {
           parameter: config.param,
           value: val,
           unit: config.unit,
           referenceRange: `${config.min} - ${config.max}`,
           status: getFlag(val, config.min, config.max)?.label || "Normal"
         };
      }) : [],
      
      comments: comments,
      status: "Completed"
    };

    console.log("PAYLOAD TO SAVE:", payload);
    
    // 3. Simulated Save
    const existing = localStorage.getItem("labReportsDB");
    let arr = existing ? JSON.parse(existing) : [];
    arr.unshift({ ...payload, reportId: "LR" + Math.floor(10000 + Math.random() * 90000), date: payload.sampleDate });
    localStorage.setItem("labReportsDB", JSON.stringify(arr));

    alert("Report Saved Successfully!");
    navigate('/lab-reports-list');
  };

  const currentParams = testTemplates[formData.testType] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Activity className="text-purple-600"/> Lab Report Entry
           </h1>
           <p className="text-sm text-slate-500 mt-1">Create new patient reports via manual entry or file upload.</p>
        </div>

        {/* Entry Mode Toggle */}
        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
           <button 
             onClick={() => setEntryMode("manual")}
             className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${entryMode === 'manual' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             <Keyboard size={16}/> Manual Entry
           </button>
           <button 
             onClick={() => setEntryMode("upload")}
             className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${entryMode === 'upload' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             <FileUp size={16}/> Upload Report
           </button>
        </div>
      </div>

      {/* --- SECTION 1: PATIENT & TEST DETAILS (Matches your Image) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
            <User size={20} className="text-purple-600"/>
            <h2 className="text-lg font-bold text-slate-800">Patient & Test Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Row 1 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Patient ID</label>
            <div className="relative">
                <input 
                  type="text" 
                  value={formData.patientId} 
                  onChange={(e) => setFormData({...formData, patientId: e.target.value})} 
                  onBlur={handleIdBlur}
                  placeholder="e.g. P000123" 
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Age / Gender</label>
            <input 
              type="text" 
              value={formData.ageGender} 
              readOnly
              placeholder="Auto-filled" 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-slate-500 focus:outline-none" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Test Type</label>
            <div className="relative">
                <select 
                  value={formData.testType} 
                  onChange={(e) => { 
                    setFormData({...formData, testType: e.target.value}); 
                    setResults({}); 
                  }} 
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                    {TEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Patient Name</label>
            <input 
              type="text" 
              value={formData.patientName} 
              onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
              onBlur={handleNameBlur}
              placeholder="Enter Full Name" 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Referring Dr.</label>
            <input 
              type="text" 
              value={formData.referringDr} 
              onChange={(e) => setFormData({...formData, referringDr: e.target.value})} 
              placeholder="Dr. Name" 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Sample Date</label>
            <div className="relative">
                <input 
                  type="date" 
                  value={formData.sampleDate} 
                  onChange={(e) => setFormData({...formData, sampleDate: e.target.value})} 
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer" 
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>
          
          {/* Row 3 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Technician Name</label>
            <input 
              type="text" 
              value={formData.techName} 
              onChange={(e) => setFormData({...formData, techName: e.target.value})} 
              placeholder="Tech Name" 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Technician ID</label>
            <input 
              type="text" 
              value={formData.techId} 
              onChange={(e) => setFormData({...formData, techId: e.target.value})} 
              placeholder="Tech ID" 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Department</label>
            <input 
              type="text" 
              value={formData.dept} 
              onChange={(e) => setFormData({...formData, dept: e.target.value})} 
              placeholder="Department" 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

        </div>
      </div>

      {/* --- SECTION 2: ENTRY MODE CONTENT --- */}
      
      {/* MODE A: MANUAL ENTRY */}
      {entryMode === "manual" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-in fade-in">
           <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Results for <span className="text-purple-600">{formData.testType}</span></h2>
              <span className="text-xs text-slate-400 italic hidden sm:inline">* Status flagged automatically</span>
           </div>

           <div className="overflow-x-auto rounded-lg border border-gray-100">
             <table className="w-full text-left">
               <thead className="bg-gray-50 text-slate-500 text-xs uppercase font-semibold">
                 <tr>
                   <th className="p-3 w-[30%]">Parameter</th>
                   <th className="p-3 w-[25%]">Result Value</th>
                   <th className="p-3 w-[15%]">Unit</th>
                   <th className="p-3 w-[15%]">Reference</th>
                   <th className="p-3 w-[15%] text-center">Flag</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                 {currentParams.map((item) => {
                   const val = results[item.id] || "";
                   const flag = getFlag(val, item.min, item.max);
                   return (
                     <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                       <td className="p-3 font-medium text-slate-700">{item.param}</td>
                       <td className="p-3">
                         <input 
                           type="number" 
                           placeholder="0.00"
                           className={`w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-purple-500 font-mono font-bold text-slate-700 transition-all
                             ${flag?.label === 'High' ? 'bg-red-50 border-red-200 text-red-700' : flag?.label === 'Low' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-300'}`}
                           value={val}
                           onChange={(e) => setResults({...results, [item.id]: e.target.value})}
                         />
                       </td>
                       <td className="p-3 text-slate-500">{item.unit}</td>
                       <td className="p-3 text-slate-500 whitespace-nowrap">{item.min} - {item.max}</td>
                       <td className="p-3 text-center">
                         {flag && (
                           <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${flag.color}`}>
                             {flag.label === "High" && <AlertCircle size={10}/>}
                             {flag.label}
                           </span>
                         )}
                       </td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
             {currentParams.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm italic bg-slate-50">
                   No parameters defined for this test type. Please use the comments section or switch to File Upload mode.
                </div>
             )}
           </div>

           <div className="mt-6">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2 block">Pathologist Comments</label>
              <textarea 
                rows="3" 
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter clinical observations, recommendations, or summary..." 
                className="w-full p-3 border border-gray-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
           </div>
        </div>
      )}

      {/* MODE B: FILE UPLOAD */}
      {entryMode === "upload" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-in fade-in">
           <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">Upload Scanned Report</h2>
           
           <div 
             className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 
               ${dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-slate-50 hover:bg-slate-100"}`}
             onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
           >
             <input 
               type="file" 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
               onChange={(e) => e.target.files[0] && setFile(e.target.files[0])} 
               accept=".pdf,.jpg,.png,.jpeg" 
             />
             {!file ? (
               <div className="text-center z-0 pointer-events-none p-4">
                 <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-200">
                   <Upload size={32} className="text-purple-600" strokeWidth={1.5} />
                 </div>
                 <p className="text-base font-bold text-slate-700">Click to upload or drag and drop</p>
                 <p className="text-xs text-slate-400 mt-1 font-medium">SVG, PNG, JPG or PDF (max. 10MB)</p>
               </div>
             ) : (
               <div className="flex flex-col items-center z-20">
                  <div className="bg-emerald-50 p-4 rounded-full shadow-sm mb-3 border border-emerald-100">
                     <FileText size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-slate-800 font-bold text-lg">{file.name}</p>
                  <p className="text-slate-500 text-xs mt-1 font-medium">{(file.size / 1024).toFixed(2)} KB</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                    className="mt-4 text-red-600 flex items-center gap-1.5 text-xs font-bold bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-sm relative z-20"
                  >
                    <X size={14} /> Remove File
                  </button>
               </div>
             )}
           </div>
        </div>
      )}

      {/* --- ACTION FOOTER --- */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-sm"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit}
          className="bg-purple-700 hover:bg-purple-800 text-white px-8 py-2.5 rounded-lg font-bold shadow-md shadow-purple-200 transition-all active:scale-95 flex items-center gap-2 text-sm"
        >
          <Save size={18} /> Save Report
        </button>
      </div>

    </div>
  );
}