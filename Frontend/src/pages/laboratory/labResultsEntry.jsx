import React, { useState, useContext, useEffect } from "react";
// ... (imports same as before)
import { PatientContext } from "../../context/PatientContext"; 

// ... (testTemplates same as before)

export default function LabResultEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const { submitLabResults, loading } = useContext(LabContext);
  const { staffs } = useContext(StaffContext);
  const { patients } = useContext(PatientContext); // Import Context

  const reportData = location.state?.reportData;
  const technicians = staffs.filter(s => s.designation === "Lab Technician" || s.role === "Technician" || s.department === "Laboratory");
  const initialTestType = reportData?.testName || "Glucometry (Diabetes)";

  /* --- STATES --- */
  const [patientDetails, setPatientDetails] = useState({
    patientId: reportData?.patientId || "",
    patientName: reportData?.patientName || "",
    age: reportData?.age || "",
    gender: reportData?.gender || "Male",
    referringDr: reportData?.doctorName || "",
    sampleDate: reportData?.createdAt ? new Date(reportData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dept: reportData?.department || "Pathology"
  });

  const [selectedTestType, setSelectedTestType] = useState(initialTestType);
  const [results, setResults] = useState({});
  const [verifiedBy, setVerifiedBy] = useState("");
  const [comments, setComments] = useState("");

  /* --- HANDLERS --- */
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails(prev => ({ ...prev, [name]: value }));
  };

  // --- AUTO-FILL LOGIC ---
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

  // ... (Other handlers: handleResultChange, getFlag, handleSubmit same as before)

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 font-sans">
      
      {/* ... Header Code ... */}

      {/* PATIENT DETAILS SECTION */}
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
              onBlur={handleIdBlur} // <--- Added Logic
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-gray-700"
            />
          </div>
          
          {/* ... Rest of fields (Patient Name, Age, Gender, etc.) ... */}
          {/* Ensure these inputs use value={patientDetails.X} and onChange={handlePatientChange} */}
          
        </div>
      </div>

      {/* ... Result Table & Footer ... */}
    </div>
  );
}