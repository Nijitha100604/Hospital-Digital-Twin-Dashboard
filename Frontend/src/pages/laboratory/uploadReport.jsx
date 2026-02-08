import React, { useState, useContext, useEffect } from "react";
import { Upload, FileText, X, CheckCircle, Calendar, User, FlaskConical, Hash, Keyboard, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LabContext } from "../../context/LabContext";
import { PatientContext } from "../../context/PatientContext";
import { StaffContext } from "../../context/StaffContext";

const TEST_TYPES = [
  "CBC (Hemogram)", "Lipid Profile", "Liver Function Test (LFT)", "Kidney Function Test (KFT)",
  "Thyroid Profile", "Glucometry (Diabetes)", "Electrolytes", "Iron Profile", "Vitamin Profile",
  "Coagulation Profile", "Urine Routine", "MRI Scan", "X-Ray", "Ultrasound", "CT Scan"
];

export default function UploadReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadLabReport, loading } = useContext(LabContext);
  const { patients } = useContext(PatientContext);
  const { staffs } = useContext(StaffContext);

  const reportData = location.state?.reportData;
const [correctionReason, setCorrectionReason] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize State
  const [patientData, setPatientData] = useState({
    patientId: reportData?.patientId || "",
    patientName: reportData?.patientName || "",
    ageGender: reportData ? `${reportData.age} / ${reportData.gender}` : "",
    testType: reportData?.testName || "",
    referringDr: reportData?.doctorName || "",
    sampleDate: reportData?.createdAt ? new Date(reportData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    dept: reportData?.department || "Pathology",
    techId: "",
    techName: ""
  });

  // --- AUTO-FILL LOGIC ---
  const handleIdBlur = () => {
    if (!patientData.patientId) return;
    const found = patients.find(p => p.patientId.toLowerCase() === patientData.patientId.toLowerCase());
    
    if (found) {
      setPatientData(prev => ({
        ...prev,
        patientName: found.personal.name,
        ageGender: `${found.personal.age} / ${found.personal.gender}`,
        // Only fill if empty to allow editing
        referringDr: prev.referringDr || "", 
        dept: prev.dept || "Pathology"
      }));
    }
  };

  const handleTechIdBlur = () => {
    if(!patientData.techId) return;
    const found = staffs.find(s => s.staffId.toLowerCase() === patientData.techId.toLowerCase());
    if(found) {
        setPatientData(prev => ({ ...prev, techName: found.fullName }));
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!patientData.patientId) return alert("Please enter Patient ID");
    if (!patientData.testType) return alert("Please select a Test Type");
    if (!file) return alert("Please upload a file.");
    
    // Pass reportId (if exists) OR null (for new), plus the patient data
    const success = await uploadLabReport(reportData?._id || null, file, patientData);
    if(success) navigate('/lab-reports-list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
           <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-purple-700 mb-2 text-sm font-bold"><ArrowLeft size={16} className="mr-1"/> Back</button>
           <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <Upload className="text-purple-600"/> Upload Lab Report
           </h1>
           <p className="text-sm text-gray-500 mt-1">
             {reportData ? `Fulfilling Request: ${reportData.labReportId}` : "Creating New Direct Upload"}
           </p>
        </div>

        <button 
            onClick={() => navigate('/lab-results-entry', { state: { reportData } })} 
            className="flex items-center gap-2 bg-white text-purple-700 border border-purple-200 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors shadow-sm"
        >
            <Keyboard size={16}/> Manual Entry Instead
        </button>
      </div>

      {/* FORM SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
            <User size={20} className="text-purple-600"/>
            <h2 className="text-lg font-bold text-gray-800">Patient & Test Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Patient ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Patient ID</label>
            <div className="relative">
                <input 
                  type="text" name="patientId" placeholder="e.g. P000123" 
                  value={patientData.patientId} onChange={handleInputChange} onBlur={handleIdBlur}
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500" 
                />
                <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            </div>
          </div>

          {/* Age/Gender */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Age / Gender</label>
            <input type="text" name="ageGender" placeholder="Auto-filled" value={patientData.ageGender} readOnly className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none" />
          </div>

          {/* Test Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
            <div className="relative">
                <select name="testType" value={patientData.testType} onChange={handleInputChange} className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer">
                    <option value="">Select Test Type</option>
                    {TEST_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <FlaskConical className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            </div>
          </div>

          {/* Patient Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Patient Name</label>
            <input type="text" name="patientName" placeholder="Enter Full Name" value={patientData.patientName} onChange={handleInputChange} className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Referring Dr (EDITABLE) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Referring Dr.</label>
            <input 
              type="text" name="referringDr" placeholder="Dr. Name" 
              value={patientData.referringDr} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* Department (EDITABLE) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
            <input 
              type="text" name="dept" placeholder="Department" 
              value={patientData.dept} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* Technician ID */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Technician ID</label>
            <input type="text" name="techId" placeholder="Tech ID" value={patientData.techId} onChange={handleInputChange} onBlur={handleTechIdBlur} className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          {/* Technician Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Technician Name</label>
            <input type="text" name="techName" placeholder="Auto-filled" value={patientData.techName} readOnly className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none" />
          </div>

        </div>
      </div>

      {/* UPLOAD AREA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Upload Report Document</h2>
        <div 
          className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl transition-all duration-200 ${dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleChange} accept=".png, .jpeg, .jpg, .doc, .docx, .pdf" />
          {!file ? (
            <div className="text-center z-0 pointer-events-none">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-gray-200">
                <Upload size={28} className="text-purple-600" strokeWidth={2} />
              </div>
              <p className="text-base font-bold text-gray-700">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">SVG, PNG, JPG or PDF (max. 10MB)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center z-20 animate-in fade-in zoom-in duration-300">
               <div className="bg-green-50 p-4 rounded-full shadow-sm mb-3 border border-green-100">
                  <FileText size={32} className="text-green-600" />
               </div>
               <p className="text-gray-800 font-bold text-lg">{file.name}</p>
               <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-4 text-red-500 flex items-center gap-1.5 text-sm font-bold bg-white border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg cursor-pointer pointer-events-auto transition-colors shadow-sm">
                 <X size={16} /> Remove File
               </button>
            </div>
          )}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="mt-6 flex justify-end pb-8">
        <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Uploading..." : <><CheckCircle size={20} /> Submit Report</>}
        </button>
      </div>
    </div>
  );
}