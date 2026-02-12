import React, { useState, useContext, useEffect, useRef } from "react";
import { 
  Save, Printer, CheckCircle, Activity, 
  ChevronDown, FlaskConical, AlertCircle, FileUp, ArrowLeft, Search, Loader2, AlertTriangle, User, Calendar
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom"; 
import { LabContext } from "../../context/LabContext"; 
import { StaffContext } from "../../context/StaffContext"; 
import { AppContext } from "../../context/AppContext"; 
import AccessDenied from "../../components/AccessDenied"; 

// --- 1. CONFIGURATION: PARAMETER DEFINITIONS ---
const testTemplates = {
  "CBC (Hemogram)": [
    { id: "cbc1", param: "Hemoglobin", unit: "g/dL", min: 13.0, max: 17.0 },
    { id: "cbc2", param: "RBC Count", unit: "mill/mm³", min: 4.5, max: 5.5 },
    { id: "cbc3", param: "WBC Count", unit: "cells/mcL", min: 4000, max: 11000 },
    { id: "cbc4", param: "Platelet Count", unit: "lakh/mm³", min: 1.5, max: 4.5 },
    { id: "cbc5", param: "PCV", unit: "%", min: 40, max: 50 },
    { id: "cbc6", param: "MCV", unit: "fL", min: 80, max: 100 },
    { id: "cbc7", param: "MCH", unit: "pg", min: 27, max: 32 },
    { id: "cbc8", param: "MCHC", unit: "g/dL", min: 32, max: 36 },
    { id: "cbc9", param: "Neutrophils", unit: "%", min: 40, max: 70 },
    { id: "cbc10", param: "Lymphocytes", unit: "%", min: 20, max: 40 },
  ],
  "Lipid Profile": [
    { id: "lp1", param: "Total Cholesterol", unit: "mg/dL", min: 0, max: 200 },
    { id: "lp2", param: "HDL Cholesterol", unit: "mg/dL", min: 40, max: 60 },
    { id: "lp3", param: "LDL Cholesterol", unit: "mg/dL", min: 0, max: 100 },
    { id: "lp4", param: "Triglycerides", unit: "mg/dL", min: 0, max: 150 },
    { id: "lp5", param: "VLDL Cholesterol", unit: "mg/dL", min: 2, max: 30 },
    { id: "lp6", param: "TC/HDL Ratio", unit: "ratio", min: 3, max: 5 },
  ],
  "Glucometry (Diabetes)": [
    { id: "glu1", param: "Fasting Blood Sugar", unit: "mg/dL", min: 70, max: 100 },
    { id: "glu2", param: "Post Prandial (PP)", unit: "mg/dL", min: 70, max: 140 },
    { id: "glu3", param: "HbA1c", unit: "%", min: 4.0, max: 5.6 },
    { id: "glu4", param: "Random Blood Sugar", unit: "mg/dL", min: 70, max: 140 },
    { id: "glu5", param: "Mean Blood Glucose", unit: "mg/dL", min: 80, max: 120 },
  ],
  "Liver Function Test (LFT)": [
    { id: "lft1", param: "Bilirubin Total", unit: "mg/dL", min: 0.1, max: 1.2 },
    { id: "lft2", param: "Bilirubin Direct", unit: "mg/dL", min: 0, max: 0.3 },
    { id: "lft3", param: "Bilirubin Indirect", unit: "mg/dL", min: 0.2, max: 0.8 },
    { id: "lft4", param: "SGOT (AST)", unit: "U/L", min: 5, max: 40 },
    { id: "lft5", param: "SGPT (ALT)", unit: "U/L", min: 7, max: 56 },
    { id: "lft6", param: "Alkaline Phosphatase", unit: "U/L", min: 44, max: 147 },
    { id: "lft7", param: "Total Protein", unit: "g/dL", min: 6.0, max: 8.3 },
    { id: "lft8", param: "Albumin", unit: "g/dL", min: 3.5, max: 5.5 },
    { id: "lft9", param: "Globulin", unit: "g/dL", min: 2.0, max: 3.5 },
    { id: "lft10", param: "A/G Ratio", unit: "ratio", min: 1.2, max: 2.2 },
  ],
  "Kidney Function Test (KFT)": [
    { id: "kft1", param: "Blood Urea", unit: "mg/dL", min: 15, max: 40 },
    { id: "kft2", param: "Serum Creatinine", unit: "mg/dL", min: 0.6, max: 1.2 },
    { id: "kft3", param: "Uric Acid", unit: "mg/dL", min: 3.5, max: 7.2 },
    { id: "kft4", param: "Blood Urea Nitrogen", unit: "mg/dL", min: 7, max: 20 },
    { id: "kft5", param: "Calcium (Total)", unit: "mg/dL", min: 8.5, max: 10.2 },
    { id: "kft6", param: "Phosphorus", unit: "mg/dL", min: 2.5, max: 4.5 },
  ],
  "Thyroid Profile": [
    { id: "th1", param: "Triiodothyronine (T3)", unit: "ng/dL", min: 80, max: 200 },
    { id: "th2", param: "Thyroxine (T4)", unit: "µg/dL", min: 5.0, max: 12.0 },
    { id: "th3", param: "TSH (Thyroid Stimulating Hormone)", unit: "µIU/mL", min: 0.4, max: 4.0 },
    { id: "th4", param: "Free T3", unit: "pg/mL", min: 2.3, max: 4.2 },
    { id: "th5", param: "Free T4", unit: "ng/dL", min: 0.8, max: 1.8 },
  ],
  "Electrolytes": [
    { id: "ele1", param: "Sodium (Na+)", unit: "mEq/L", min: 135, max: 145 },
    { id: "ele2", param: "Potassium (K+)", unit: "mEq/L", min: 3.5, max: 5.1 },
    { id: "ele3", param: "Chloride (Cl-)", unit: "mEq/L", min: 96, max: 106 },
    { id: "ele4", param: "Bicarbonate", unit: "mEq/L", min: 22, max: 29 },
  ],
  "Urine Routine": [
    { id: "uri1", param: "Colour", unit: "-", min: 0, max: 0, textType: true },
    { id: "uri2", param: "Appearance", unit: "-", min: 0, max: 0, textType: true },
    { id: "uri3", param: "pH", unit: "-", min: 4.5, max: 8.0 },
    { id: "uri4", param: "Specific Gravity", unit: "-", min: 1.005, max: 1.030 },
    { id: "uri5", param: "Protein", unit: "-", min: 0, max: 0, textType: true },
    { id: "uri6", param: "Sugar", unit: "-", min: 0, max: 0, textType: true },
    { id: "uri7", param: "Pus Cells", unit: "/hpf", min: 0, max: 5 },
    { id: "uri8", param: "Epithelial Cells", unit: "/hpf", min: 0, max: 5 },
    { id: "uri9", param: "RBCs", unit: "/hpf", min: 0, max: 2 },
  ],
  "Iron Profile": [
    { id: "irp1", param: "Serum Iron", unit: "mcg/dL", min: 60, max: 170 },
    { id: "irp2", param: "TIBC", unit: "mcg/dL", min: 240, max: 450 },
    { id: "irp3", param: "Transferrin Saturation", unit: "%", min: 20, max: 50 },
    { id: "irp4", param: "Ferritin", unit: "ng/mL", min: 12, max: 150 },
  ],
  "Coagulation Profile": [
    { id: "coag1", param: "Prothrombin Time (PT)", unit: "sec", min: 11, max: 13.5 },
    { id: "coag2", param: "INR", unit: "ratio", min: 0.8, max: 1.2 },
    { id: "coag3", param: "APTT", unit: "sec", min: 30, max: 40 },
  ],
  "Vitamin Profile": [
    { id: "vit1", param: "Vitamin B12", unit: "pg/mL", min: 200, max: 900 },
    { id: "vit2", param: "Vitamin D (25-OH)", unit: "ng/mL", min: 30, max: 100 },
  ]
};

// --- 2. ALIAS MAPPING ---
const testAliases = {
  "CBC (Hemogram)": ["CBC", "Hemogram", "Complete Blood Count", "C.B.C"],
  "Liver Function Test (LFT)": ["LFT", "Liver Profile", "Liver Panel"],
  "Kidney Function Test (KFT)": ["KFT", "RFT", "Renal Function Test", "Kidney Profile"],
  "Thyroid Profile": ["TFT", "Thyroid Function Test", "Thyroid Panel"],
  "Lipid Profile": ["Lipid Panel", "Cholesterol Test"],
  "Glucometry (Diabetes)": ["Fasting Blood Sugar", "RBS", "FBS", "PPBS", "Glucose", "Sugar Test"],
  "Urine Routine": ["Urine R/M", "Urine Analysis", "CUE"],
  "Iron Profile": ["Iron Studies", "Anemia Profile"],
  "Coagulation Profile": ["Coag Profile", "PT/INR"],
};

// --- 3. HELPER: Get Canonical Name ---
const getCanonicalTestName = (inputName) => {
  if (!inputName) return "";
  if (testTemplates[inputName]) return inputName;
  const lowerInput = inputName.trim().toLowerCase();
  for (const [canonicalName, aliases] of Object.entries(testAliases)) {
    if (aliases.some(alias => alias.toLowerCase() === lowerInput)) {
      return canonicalName; 
    }
  }
  return inputName;
};

export default function LabResultEntry() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const dropdownRef = useRef(null);
  
  const { submitLabResults, fetchReportById, loading } = useContext(LabContext);
  const { staffs } = useContext(StaffContext);
  const { userData } = useContext(AppContext);

  // --- SECURITY & LOADING CHECKS ---
  
  // 1. Wait for User Data to Load
  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>;
  }

  // 2. Check Role (After userData is guaranteed to exist)
  if (userData.designation !== 'Technician') {
    return <AccessDenied />;
  }

  const preloadedData = location.state?.reportData;
  const [reportData, setReportData] = useState(preloadedData || null);
  
  const [patientDetails, setPatientDetails] = useState({
    patientId: preloadedData?.patientId || "",
    patientName: preloadedData?.patientName || "",
    age: preloadedData?.age || "",
    gender: preloadedData?.gender || "Male",
    referringDr: preloadedData?.doctorName || "", 
    doctorId: preloadedData?.doctorId || "", 
    sampleDate: preloadedData?.createdAt ? new Date(preloadedData.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    dept: preloadedData?.department || "Pathology"
  });

  const [selectedTestType, setSelectedTestType] = useState(
    getCanonicalTestName(preloadedData?.testName || preloadedData?.testType || "")
  );

  const [results, setResults] = useState({});
  const [comments, setComments] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  // --- LOAD DATA ---
  useEffect(() => {
    const loadData = async () => {
      if (!preloadedData && id) {
        const data = await fetchReportById(id);
        if (data) initializeForm(data);
      } else if (preloadedData) {
          if(preloadedData.testResults?.length > 0) {
             const prefill = {};
             const testName = preloadedData.testName || preloadedData.testType || "";
             const normalizedName = getCanonicalTestName(testName);
             const templateParams = testTemplates[normalizedName] || [];
             
             preloadedData.testResults.forEach((r) => {
                 const foundParam = templateParams.find(p => p.param === r.parameter);
                 if(foundParam) prefill[foundParam.id] = r.value;
             });
             setResults(prefill);
             setComments(preloadedData.comments || "");
          }
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fetchReportById]);

  // --- DYNAMIC DEPARTMENT LOOKUP ---
  useEffect(() => {
    if (staffs.length > 0 && patientDetails.doctorId) {
        const doctor = staffs.find(s => s.staffId === patientDetails.doctorId);
        if (doctor && doctor.department) {
            setPatientDetails(prev => ({ ...prev, dept: doctor.department }));
        }
    }
  }, [staffs, patientDetails.doctorId]);

  const initializeForm = (data) => {
    setReportData(data);
    setPatientDetails({
      patientId: data.patientId || "",
      patientName: data.patientName || "",
      age: data.age || "",
      gender: data.gender || "Male",
      referringDr: data.doctorName || "", 
      doctorId: data.doctorId || "", 
      sampleDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      dept: data.department || "Pathology"
    });
    
    const tName = data.testName || data.testType || "";
    setSelectedTestType(getCanonicalTestName(tName));

    if (data.testResults && data.testResults.length > 0) {
        const prefill = {};
        const normalizedName = getCanonicalTestName(tName);
        const templateParams = testTemplates[normalizedName] || [];
        
        data.testResults.forEach(r => {
            const foundParam = templateParams.find(p => p.param === r.parameter);
            if(foundParam) prefill[foundParam.id] = r.value;
        });
        setResults(prefill);
        setComments(data.comments || "");
    }
  };

  const handleResultChange = (paramId, value) => {
    setResults(prev => ({ ...prev, [paramId]: value }));
  };

  const getFlag = (val, min, max, textType) => {
    if (textType) return null;
    if (val === "" || isNaN(val)) return null;
    const num = parseFloat(val);
    if (num < min) return { label: "Low", color: "bg-yellow-100 text-yellow-700 border-yellow-200", status: "Low" };
    if (num > max) return { label: "High", color: "bg-red-100 text-red-700 border-red-200", status: "High" };
    return { label: "Normal", color: "bg-green-100 text-green-700 border-green-200", status: "Normal" };
  };

  const handleSubmit = async () => {
      if(!patientDetails.patientId) return alert("Patient ID is required");
      
      // Validate Test Type
      if (!selectedTestType || !testTemplates[selectedTestType]) {
          alert("Please select a valid Test Type from the dropdown.");
          return;
      }

      if (reportData?.status === "Completed" && !correctionReason.trim()) {
          alert("⚠️ MANDATORY: You are amending a completed report. Please provide a 'Reason for Amendment'.");
          return;
      }

      const currentParams = testTemplates[selectedTestType] || [];
      const formattedResults = currentParams.map(param => {
          const val = results[param.id] || "";
          const flag = getFlag(val, param.min, param.max, param.textType);
          return {
              parameter: param.param,
              value: val,
              unit: param.unit,
              referenceRange: param.textType ? "-" : `${param.min} - ${param.max}`,
              status: flag ? flag.status : "Pending"
          };
      });

      const finalReportId = reportData?._id || id;
      if (!finalReportId) {
          alert("Error: Report ID missing.");
          return;
      }

      // AUTO-DETECT VERIFIER FROM CONTEXT
      const payload = {
          testResults: formattedResults,
          comments,
          // Using Context Data automatically
          technicianId: userData.staffId || userData._id,
          technicianName: userData.fullName,
          correctionReason: correctionReason,
          testName: selectedTestType 
      };

      const success = await submitLabResults(finalReportId, payload);
      if(success) navigate('/lab-reports-list');
  };

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
            
            {/* TEST TYPE DROPDOWN */}
            <div className="bg-white p-2 rounded-lg border border-gray-300 shadow-sm flex items-center gap-2 w-full md:w-auto">
                <FlaskConical size={18} className="text-purple-600 shrink-0"/>
                <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap hidden sm:inline">Test Type:</span>
                <div className="relative flex-1 min-w-0">
                <select 
                    value={selectedTestType}
                    onChange={(e) => { setSelectedTestType(e.target.value); setResults({}); }}
                    className="font-bold text-gray-800 outline-none bg-transparent cursor-pointer text-sm w-full py-1 pr-4 truncate"
                >
                    <option value="">Select Test Type</option>
                    {Object.keys(testTemplates).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14}/>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
            <User size={20} className="text-purple-600"/>
            <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Patient</label>
            <p className="text-sm font-bold text-gray-800">{patientDetails.patientName} ({patientDetails.patientId})</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Age / Gender</label>
            <p className="text-sm font-bold text-gray-800">{patientDetails.age} Yrs / {patientDetails.gender}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
            <p className="text-sm font-bold text-purple-700">{selectedTestType || "Not Selected"}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Referring Dr</label>
            <p className="text-sm font-bold text-gray-800">{patientDetails.referringDr}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
            <p className="text-sm font-bold text-gray-800">{patientDetails.dept}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Request Date</label>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
               <Calendar size={14} className="text-gray-400"/> {patientDetails.sampleDate}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 border-b border-gray-100 pb-2 gap-2">
            <h2 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">
               Enter Results
            </h2>
            <span className="text-[10px] text-gray-400 font-medium italic hidden sm:block">*Values flagged by ref. range</span>
        </div>

        {currentParams.length > 0 ? (
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
                    const flag = getFlag(currentVal, item.min, item.max, item.textType);
                    return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-bold text-gray-700">{item.param}</td>
                        <td className="p-4">
                            <input 
                            type={item.textType ? "text" : "number"} 
                            placeholder={item.textType ? "Text" : "0.00"}
                            className={`w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono font-bold text-sm ${flag?.label === 'High' ? 'bg-red-50 border-red-200 text-red-700' : flag?.label === 'Low' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-white border-gray-300 text-gray-800'}`}
                            value={currentVal} onChange={(e) => handleResultChange(item.id, e.target.value)}
                            />
                        </td>
                        <td className="p-4 text-sm text-gray-500 font-medium">{item.unit}</td>
                        <td className="p-4 text-sm text-gray-500 font-medium whitespace-nowrap">{item.textType ? "-" : `${item.min} - ${item.max}`}</td>
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
        ) : (
            <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                <FlaskConical size={48} className="text-gray-300 mb-3"/>
                <p className="font-bold text-gray-600">No Test Template Selected</p>
                <p className="text-xs mt-1 max-w-sm">
                    {selectedTestType 
                        ? `No manual parameters found for "${selectedTestType}".` 
                        : "The previous record did not have a test type specified."}
                </p>
                <div className="mt-4 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm border border-purple-200 animate-pulse">
                    Please select a <strong>Test Type</strong> from the dropdown in the top-right corner to load the form.
                </div>
            </div>
        )}
      </div>

      {reportData?.status === "Completed" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 animate-in fade-in">
            <div className="flex items-start gap-3">
                <AlertTriangle className="text-orange-600 shrink-0 mt-1" size={20}/>
                <div className="flex-1">
                    <h3 className="text-orange-800 font-bold text-sm mb-1">Amendment Required</h3>
                    <p className="text-orange-700 text-xs mb-3">
                        This report was previously finalized. To make changes, you must provide a reason for the audit trail.
                    </p>
                    <label className="text-[10px] font-bold text-orange-800 uppercase block mb-1">Reason for Change <span className="text-red-500">*</span></label>
                    <textarea 
                        className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        rows="2"
                        placeholder="e.g. Typo in result, Wrong patient ID..."
                        value={correctionReason}
                        onChange={(e) => setCorrectionReason(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
      )}

      {/* FOOTER COMMENTS & VERIFY */}
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
               {/* --- AUTOMATIC VERIFIER DISPLAY --- */}
               <div className="mb-4 lg:mb-0">
                  <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase mb-2 block">Verified By</label>
                  <div className="w-full p-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold border border-purple-200">
                          {userData?.fullName ? userData.fullName.charAt(0) : "T"}
                      </div>
                      <span>{userData?.fullName || "Technician"}</span>
                      <span className="text-gray-400 font-normal text-xs ml-auto">(You)</span>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-2 mt-4">
                  <button className="col-span-1 py-2.5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"><Save size={14} /> Draft</button>
                  <button className="col-span-1 py-2.5 bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm"><Printer size={14} /> Print</button>
                  
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading} 
                    className={`col-span-1 py-2.5 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1 cursor-pointer text-xs md:text-sm disabled:opacity-50 transition-all ${
                        reportData?.status === "Completed" 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "bg-purple-700 hover:bg-purple-800"
                    }`}
                  >
                      {loading ? '...' : (
                          reportData?.status === "Completed" 
                          ? <><AlertCircle size={14} /> Amend</> 
                          : <><CheckCircle size={14} /> Submit</>
                      )}
                  </button>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}