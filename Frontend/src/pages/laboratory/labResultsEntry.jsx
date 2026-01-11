import React, { useState } from "react";
import { 
  Save, Printer, CheckCircle, Activity, 
  ChevronDown, FlaskConical, AlertCircle 
} from "lucide-react";

/* -------------------- CONFIGURATION DATA -------------------- */

const technicians = [
  { id: "T001", name: "Tech. Kumar R" },
  { id: "T002", name: "Tech. Sarah J" },
  { id: "T003", name: "Tech. Mike L" },
  { id: "T004", name: "Dr. Emily W (Pathologist)" },
];

// EXPANDED TEST TEMPLATES
const testTemplates = {
  "CBC (Hemogram)": [
    { id: "cbc1", param: "Hemoglobin", unit: "g/dL", min: 13.0, max: 17.0 },
    { id: "cbc2", param: "RBC Count", unit: "mill/mm³", min: 4.5, max: 5.5 },
    { id: "cbc3", param: "WBC Count (Total)", unit: "cells/mcL", min: 4000, max: 11000 },
    { id: "cbc4", param: "Platelet Count", unit: "lakh/mm³", min: 1.5, max: 4.5 },
    { id: "cbc5", param: "PCV (Hematocrit)", unit: "%", min: 40, max: 50 },
    { id: "cbc6", param: "MCV", unit: "fL", min: 80, max: 100 },
  ],
  "Lipid Profile": [
    { id: "lp1", param: "Total Cholesterol", unit: "mg/dL", min: 0, max: 200 },
    { id: "lp2", param: "HDL Cholesterol (Good)", unit: "mg/dL", min: 40, max: 60 },
    { id: "lp3", param: "LDL Cholesterol (Bad)", unit: "mg/dL", min: 0, max: 100 },
    { id: "lp4", param: "Triglycerides", unit: "mg/dL", min: 0, max: 150 },
    { id: "lp5", param: "VLDL Cholesterol", unit: "mg/dL", min: 2, max: 30 },
  ],
  "Liver Function Test (LFT)": [
    { id: "lft1", param: "Bilirubin Total", unit: "mg/dL", min: 0.1, max: 1.2 },
    { id: "lft2", param: "Bilirubin Direct", unit: "mg/dL", min: 0, max: 0.3 },
    { id: "lft3", param: "SGOT (AST)", unit: "U/L", min: 5, max: 40 },
    { id: "lft4", param: "SGPT (ALT)", unit: "U/L", min: 7, max: 56 },
    { id: "lft5", param: "Alkaline Phosphatase", unit: "U/L", min: 44, max: 147 },
    { id: "lft6", param: "Total Protein", unit: "g/dL", min: 6.0, max: 8.3 },
    { id: "lft7", param: "Albumin", unit: "g/dL", min: 3.5, max: 5.5 },
  ],
  "Kidney Function Test (KFT)": [
    { id: "kft1", param: "Blood Urea", unit: "mg/dL", min: 15, max: 40 },
    { id: "kft2", param: "Serum Creatinine", unit: "mg/dL", min: 0.6, max: 1.2 },
    { id: "kft3", param: "Uric Acid", unit: "mg/dL", min: 3.5, max: 7.2 },
    { id: "kft4", param: "Calcium (Total)", unit: "mg/dL", min: 8.5, max: 10.2 },
    { id: "kft5", param: "Phosphorus", unit: "mg/dL", min: 2.5, max: 4.5 },
  ],
  "Thyroid Profile": [
    { id: "th1", param: "T3 (Triiodothyronine)", unit: "ng/dL", min: 80, max: 200 },
    { id: "th2", param: "T4 (Thyroxine)", unit: "µg/dL", min: 5.0, max: 12.0 },
    { id: "th3", param: "TSH (Thyroid Stimulating Hormone)", unit: "µIU/mL", min: 0.4, max: 4.0 },
  ],
  "Glucometry (Diabetes)": [
    { id: "glu1", param: "Fasting Blood Sugar (FBS)", unit: "mg/dL", min: 70, max: 100 },
    { id: "glu2", param: "Post Prandial (PPBS)", unit: "mg/dL", min: 70, max: 140 },
    { id: "glu3", param: "HbA1c", unit: "%", min: 4.0, max: 5.6 },
    { id: "glu4", param: "Random Blood Sugar", unit: "mg/dL", min: 70, max: 140 },
  ],
  "Electrolytes": [
    { id: "ele1", param: "Sodium (Na+)", unit: "mEq/L", min: 135, max: 145 },
    { id: "ele2", param: "Potassium (K+)", unit: "mEq/L", min: 3.5, max: 5.1 },
    { id: "ele3", param: "Chloride (Cl-)", unit: "mEq/L", min: 96, max: 106 },
  ],
  "Iron Profile": [
    { id: "irp1", param: "Serum Iron", unit: "mcg/dL", min: 60, max: 170 },
    { id: "irp2", param: "TIBC", unit: "mcg/dL", min: 240, max: 450 },
    { id: "irp3", param: "Transferrin Saturation", unit: "%", min: 20, max: 50 },
    { id: "irp4", param: "Ferritin", unit: "ng/mL", min: 12, max: 150 },
  ],
  "Vitamin Profile": [
    { id: "vit1", param: "Vitamin B12", unit: "pg/mL", min: 200, max: 900 },
    { id: "vit2", param: "Vitamin D (25-OH)", unit: "ng/mL", min: 30, max: 100 },
  ],
  "Coagulation Profile": [
    { id: "coag1", param: "Prothrombin Time (PT)", unit: "sec", min: 11, max: 13.5 },
    { id: "coag2", param: "INR", unit: "ratio", min: 0.8, max: 1.2 },
    { id: "coag3", param: "APTT", unit: "sec", min: 30, max: 40 },
  ],
  "Urine Routine": [
    { id: "uri1", param: "pH", unit: "-", min: 4.5, max: 8.0 },
    { id: "uri2", param: "Specific Gravity", unit: "-", min: 1.005, max: 1.030 },
    { id: "uri3", param: "Pus Cells", unit: "/hpf", min: 0, max: 5 },
    { id: "uri4", param: "Epithelial Cells", unit: "/hpf", min: 0, max: 5 },
  ]
};

export default function LabResultEntry() {
  /* -------------------- STATES -------------------- */
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
  const [verifiedBy, setVerifiedBy] = useState("");
  const [comments, setComments] = useState("");

  /* -------------------- HANDLERS -------------------- */
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
    if (num < min) return { label: "Low", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    if (num > max) return { label: "High", color: "bg-red-100 text-red-700 border-red-200" };
    return { label: "Normal", color: "bg-green-100 text-green-700 border-green-200" };
  };

  const currentParams = testTemplates[selectedTestType] || [];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-purple-700 shrink-0" size={24} />
            Lab Result Entry
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Manually enter patient details and test results.</p>
        </div>
        
        {/* Test Type Selector */}
        <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 w-full md:w-auto max-w-full">
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

      {/* --- SECTION 1: MANUAL PATIENT ENTRY --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <h2 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
          Patient Details
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Patient ID</label>
            <input 
              type="text" name="patientId" placeholder="e.g. P-1024"
              value={patientDetails.patientId} onChange={handlePatientChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Patient Name</label>
            <input 
              type="text" name="patientName" placeholder="Full Name"
              value={patientDetails.patientName} onChange={handlePatientChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-gray-700"
            />
          </div>

          <div className="flex gap-2">
             <div className="space-y-1 flex-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Age</label>
                <input 
                  type="text" name="age" placeholder="Age"
                  value={patientDetails.age} onChange={handlePatientChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700"
                />
             </div>
             <div className="space-y-1 flex-1">
                <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Gender</label>
                <select 
                  name="gender" value={patientDetails.gender} onChange={handlePatientChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700 bg-white"
                >
                   <option>Male</option><option>Female</option><option>Other</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Sample Date</label>
            <input 
              type="date" name="sampleDate" value={patientDetails.sampleDate} onChange={handlePatientChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Referring Dr.</label>
            <input 
              type="text" name="referringDr" placeholder="Dr. Name"
              value={patientDetails.referringDr} onChange={handlePatientChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase">Department</label>
            <input 
              type="text" name="dept" value={patientDetails.dept} onChange={handlePatientChange}
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
            <span className="text-[10px] text-gray-400 font-medium italic hidden sm:block">
               *Values flagged by ref. range
            </span>
        </div>

        {/* --- 1. DESKTOP VIEW (TABLE) --- */}
        <div className="hidden md:block overflow-x-auto">
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
                           {flag.label === "High" ? "High" : flag.label === "Low" ? "Low" : "Normal"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* --- 2. MOBILE VIEW (CARDS) --- */}
        <div className="md:hidden space-y-4">
           {currentParams.map((item) => {
             const currentVal = results[item.id] || "";
             const flag = getFlag(currentVal, item.min, item.max);
             return (
               <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                     <span className="font-bold text-sm text-gray-800">{item.param}</span>
                     <span className="text-[10px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">{item.min}-{item.max} {item.unit}</span>
                  </div>
                  
                  <div className="flex gap-2 items-center">
                     <input 
                       type="number" placeholder="Enter Value"
                       className={`flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono font-bold text-sm ${flag?.label === 'High' ? 'bg-red-50 border-red-200 text-red-700' : flag?.label === 'Low' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-white border-gray-300 text-gray-800'}`}
                       value={currentVal} onChange={(e) => handleResultChange(item.id, e.target.value)}
                     />
                     <div className="w-20 flex justify-center">
                       {flag ? (
                         <span className={`inline-flex items-center justify-center w-full px-2 py-2 rounded-lg text-[10px] font-bold border ${flag.color}`}>
                           {flag.label.toUpperCase()}
                         </span>
                       ) : (
                         <span className="text-[10px] text-gray-400 font-medium px-2">—</span>
                       )}
                     </div>
                  </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* --- SECTION 3: FOOTER ACTIONS --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Comments */}
            <div>
               <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2 block">Pathologist Comments</label>
               <textarea 
                 rows="3" 
                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                 placeholder="Clinical notes..."
                 value={comments} onChange={(e) => setComments(e.target.value)}
               ></textarea>
            </div>

            {/* Verification & Buttons */}
            <div className="flex flex-col justify-between">
               <div className="mb-4 lg:mb-0">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2 block">Verified By <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="cursor-pointer w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none font-medium text-gray-700 text-sm"
                      value={verifiedBy} onChange={(e) => setVerifiedBy(e.target.value)}
                    >
                      <option value="">-- Select Lab Technician --</option>
                      {technicians.map(tech => <option key={tech.id} value={tech.id}>{tech.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-4">
                  <button 
                    onClick={() => alert('Draft Saved!')}
                    className="col-span-1 py-2.5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"
                  >
                     <Save size={14} /> <span className="hidden sm:inline">Draft</span>
                  </button>
                  <button 
                    className="col-span-1 py-2.5 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"
                  >
                     <Printer size={14} /> <span className="hidden sm:inline">Print</span>
                  </button>
                  <button 
                    onClick={() => {
                        if(!verifiedBy) alert('Please select a verifier');
                        else alert('Results Submitted!');
                    }}
                    className="col-span-1 py-2.5 bg-purple-700 text-white hover:bg-purple-800 font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"
                  >
                     <CheckCircle size={14} /> <span className="hidden sm:inline">Submit</span>
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}