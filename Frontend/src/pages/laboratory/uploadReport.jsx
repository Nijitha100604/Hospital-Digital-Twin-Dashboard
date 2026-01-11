import React, { useState } from "react";
import { Upload, FileText, X, CheckCircle, Calendar, User, FlaskConical, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import Patient Data
import { patient_records } from "../../data/patient"; 

// --- EXPANDED TEST LIST ---
const TEST_TYPES = [
  "CBC (Hemogram)",
  "Lipid Profile",
  "Liver Function Test (LFT)",
  "Kidney Function Test (KFT)",
  "Thyroid Profile",
  "Glucometry (Diabetes)",
  "Electrolytes",
  "Iron Profile",
  "Vitamin Profile",
  "Coagulation Profile",
  "Urine Routine",
  "MRI Scan",
  "X-Ray",
  "Ultrasound",
  "CT Scan"
];

export default function UploadReport() {
  const navigate = useNavigate();

  /* -------------------- STATE -------------------- */
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [patientData, setPatientData] = useState({
    patientId: "",
    ageGender: "",
    testType: "", // Manual Selection
    patientName: "",
    referringDr: "",
    sampleDate: new Date().toISOString().split('T')[0],
    techName: "",
    techId: "",
    dept: "",
    phone: "" 
  });

  /* -------------------- AUTO-FILL LOGIC -------------------- */
  
  // Handle ID Blur -> Auto-fill Name & Details
  const handleIdBlur = () => {
    if (!patientData.patientId) return;
    
    const foundPatient = patient_records.find(p => 
      p.patientId.toLowerCase() === patientData.patientId.toLowerCase()
    );

    if (foundPatient) {
      setPatientData(prev => ({
        ...prev,
        patientName: foundPatient.patientName,
        ageGender: `${foundPatient.age} / ${foundPatient.gender}`,
        phone: foundPatient.mobileNumber
      }));
    }
  };

  // Handle Name Blur -> Auto-fill ID & Details
  const handleNameBlur = () => {
    if (!patientData.patientName) return;

    const foundPatient = patient_records.find(p => 
      p.patientName.toLowerCase() === patientData.patientName.toLowerCase()
    );

    if (foundPatient) {
      setPatientData(prev => ({
        ...prev,
        patientId: foundPatient.patientId,
        ageGender: `${foundPatient.age} / ${foundPatient.gender}`,
        phone: foundPatient.mobileNumber
      }));
    }
  };

  /* -------------------- HANDLERS -------------------- */
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

  // --- SUBMIT HANDLER ---
  const handleSubmit = () => {
    if (!patientData.patientName || !patientData.patientId) {
      alert("Please fill in Patient Name and ID.");
      return;
    }
    if (!patientData.testType) {
      alert("Please select a Test Type.");
      return;
    }
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    // 1. Create New Report Object
    const newReport = {
      reportId: "LR" + Math.floor(10000 + Math.random() * 90000),
      patientId: patientData.patientId,
      patientName: patientData.patientName,
      testType: patientData.testType,
      date: patientData.sampleDate,
      status: "Completed",
      age: patientData.ageGender.split('/')[0]?.trim() || "Unknown",
      gender: patientData.ageGender.split('/')[1]?.trim() || "Unknown",
      phone: patientData.phone || "+1 555 000 0000",
      bloodGroup: "Unknown" 
    };

    // 2. Local Storage Logic
    const existingData = localStorage.getItem("labReportsDB");
    let reportsArray = existingData ? JSON.parse(existingData) : [];
    reportsArray.unshift(newReport);
    localStorage.setItem("labReportsDB", JSON.stringify(reportsArray));

    // 3. Success
    alert(`Report for ${patientData.patientName} uploaded successfully!`);
    navigate('/lab-reports-list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      
      {/* --- FORM SECTION --- */}
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
            <input 
              type="text" name="ageGender" placeholder="Auto-filled" 
              value={patientData.ageGender} onChange={handleInputChange} 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* Test Type (UPDATED LIST) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
            <div className="relative">
                <select 
                  name="testType" 
                  value={patientData.testType} 
                  onChange={handleInputChange} 
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                >
                    <option value="">Select Test Type</option>
                    {TEST_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <FlaskConical className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            </div>
          </div>

          {/* Patient Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Patient Name</label>
            <input 
              type="text" name="patientName" placeholder="Enter Full Name" 
              value={patientData.patientName} onChange={handleInputChange} onBlur={handleNameBlur} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          {/* Other Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Referring Dr.</label>
            <input 
              type="text" name="referringDr" placeholder="Dr. Name" 
              value={patientData.referringDr} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Sample Date</label>
            <div className="relative">
                <input 
                  type="date" name="sampleDate" 
                  value={patientData.sampleDate} onChange={handleInputChange} 
                  className="w-full p-2.5 pl-9 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer" 
                />
                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Technician Name</label>
            <input 
              type="text" name="techName" placeholder="Tech Name" 
              value={patientData.techName} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Technician ID</label>
            <input 
              type="text" name="techId" placeholder="Tech ID" 
              value={patientData.techId} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
            <input 
              type="text" name="dept" placeholder="Department" 
              value={patientData.dept} onChange={handleInputChange} 
              className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500" 
            />
          </div>

        </div>
      </div>

      {/* --- UPLOAD AREA --- */}
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

      {/* --- SUBMIT BUTTON --- */}
      <div className="mt-6 flex justify-end">
        <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
          <CheckCircle size={20} /> Submit Report
        </button>
      </div>
    </div>
  );
}

