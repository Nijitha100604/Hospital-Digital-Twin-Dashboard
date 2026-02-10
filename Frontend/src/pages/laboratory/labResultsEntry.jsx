import React, { useState, useContext, useEffect, useRef } from "react";
import { 
  Save, Printer, CheckCircle, Activity, 
  ChevronDown, FlaskConical, AlertCircle, FileUp, ArrowLeft, Search, Loader2, AlertTriangle, User, Calendar
} from "lucide-react";
import { useNavigate, useLocation, useParams } from "react-router-dom"; 
import { LabContext } from "../../context/LabContext"; 
import { StaffContext } from "../../context/StaffContext"; 
import { PatientContext } from "../../context/PatientContext"; 

// --- TEST TEMPLATES (Configuration) ---
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

export default function LabResultEntry() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  // --- CONTEXT ---
  const { submitLabResults, fetchReportById, loading } = useContext(LabContext);
  const { staffs } = useContext(StaffContext);

  // --- STATE ---
  const preloadedData = location.state?.reportData;
  const [reportData, setReportData] = useState(preloadedData || null);
  
  // Initialize patient details
  const [patientDetails, setPatientDetails] = useState({
    patientId: preloadedData?.patientId || "",
    patientName: preloadedData?.patientName || "",
    age: preloadedData?.age || "",
    gender: preloadedData?.gender || "Male",
    referringDr: preloadedData?.doctorName || "", 
    doctorId: preloadedData?.doctorId || "", // Store doctor ID for lookup
    sampleDate: preloadedData?.createdAt ? new Date(preloadedData.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    dept: preloadedData?.department || "Pathology" // Default from DB
  });

  const [selectedTestType, setSelectedTestType] = useState(preloadedData?.testName || "");
  const [results, setResults] = useState({});
  const [comments, setComments] = useState("");
  const [correctionReason, setCorrectionReason] = useState("");

  const [verifierName, setVerifierName] = useState(""); 
  const [verifiedBy, setVerifiedBy] = useState("");     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- 1. LOAD DATA ON MOUNT ---
  useEffect(() => {
    const loadData = async () => {
      if (!preloadedData && id) {
        const data = await fetchReportById(id);
        if (data) {
          initializeForm(data);
        }
      } else if (preloadedData) {
          if(preloadedData.testResults && preloadedData.testResults.length > 0) {
             const prefill = {};
             const templateParams = testTemplates[preloadedData.testName] || [];
             preloadedData.testResults.forEach((r) => {
                 const foundParam = templateParams.find(p => p.param === r.parameter);
                 if(foundParam) prefill[foundParam.id] = r.value;
             });
             setResults(prefill);
             setComments(preloadedData.comments || "");
             setVerifierName(preloadedData.technicianName || "");
             setVerifiedBy(preloadedData.technicianId || "");
          }
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fetchReportById]);

  // --- 2. DYNAMIC DEPARTMENT LOOKUP ---
  // This hook runs whenever 'staffs' (from Context) or the current doctorId changes.
  // It finds the doctor in the staff list and updates the displayed department.
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
      doctorId: data.doctorId || "", // Capture Doctor ID
      sampleDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      dept: data.department || "Pathology"
    });
    
    setSelectedTestType(data.testName || "");

    if (data.testResults && data.testResults.length > 0) {
        const prefill = {};
        const templateParams = testTemplates[data.testName] || [];
        data.testResults.forEach(r => {
            const foundParam = templateParams.find(p => p.param === r.parameter);
            if(foundParam) prefill[foundParam.id] = r.value;
        });
        setResults(prefill);
        setComments(data.comments || "");
        setVerifierName(data.technicianName || "");
        setVerifiedBy(data.technicianId || "");
    }
  };

  // --- FILTER TECHNICIANS ---
  const technicians = (staffs || []).filter(s => 
    (s.department === "Laboratory") || 
    (s.designation && s.designation.toLowerCase().includes("technician")) ||
    (s.role && s.role.toLowerCase().includes("technician"))
  );
  const filteredStaff = technicians.filter(staff => 
    staff.fullName.toLowerCase().includes(verifierName.toLowerCase())
  );

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
      if(!verifiedBy) return alert("Please select a verifier");

      if (reportData?.status === "Completed" && !correctionReason.trim()) {
          alert("⚠️ MANDATORY: You are amending a completed report. Please provide a 'Reason for Amendment' at the bottom of the page.");
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
          alert("Error: Report ID missing. Please go back to the list and try again.");
          return;
      }

      const payload = {
          testResults: formattedResults,
          comments,
          technicianId: verifiedBy,
          technicianName: verifierName,
          correctionReason: correctionReason 
      };

      const success = await submitLabResults(finalReportId, payload);
      if(success) navigate('/lab-reports-list');
  };

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
        </div>
      </div>

      {/* --- READ-ONLY PATIENT DETAILS --- */}
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
            <p className="text-sm font-bold text-purple-700">{selectedTestType}</p>
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

      {/* --- SECTION 2: RESULT ENTRY TABLE --- */}
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
            <div className="py-8 text-center text-gray-400">
                <p>No manual entry parameters defined for <strong>{selectedTestType}</strong>.</p>
                <p className="text-xs mt-1">Please use the "Upload Report" button above for this test type.</p>
            </div>
        )}
      </div>

      {/* --- SECTION 3: FOOTER ACTIONS --- */}
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