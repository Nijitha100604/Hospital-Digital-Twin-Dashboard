import React, { useState, useContext, useEffect } from "react";
import { Upload, FileText, X, CheckCircle, Calendar, User, FlaskConical, Hash, Keyboard, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LabContext } from "../../context/LabContext";
import { PatientContext } from "../../context/PatientContext";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext"; // Import AppContext
import AccessDenied from "../../components/AccessDenied"; // Import AccessDenied

export default function UploadReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uploadLabReport, loading } = useContext(LabContext);
  const { userData } = useContext(AppContext); // Get User Data

  // --- SECURITY CHECK: TECHNICIAN ONLY ---
  if (userData && userData.designation !== 'Technician') {
    return <AccessDenied />;
  }

  // Get data passed from the list
  const reportData = location.state?.reportData;
  
  const [correctionReason, setCorrectionReason] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize Read-Only Patient Data
  const [patientData] = useState({
    patientId: reportData?.patientId || "",
    patientName: reportData?.patientName || "",
    ageGender: reportData ? `${reportData.age} Yrs / ${reportData.gender}` : "",
    testType: reportData?.testName || "",
    referringDr: reportData?.doctorName || "",
    sampleDate: reportData?.createdAt ? new Date(reportData.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
    dept: reportData?.department || "Pathology",
  });

  // --- FILE HANDLERS ---
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
    if (!file) return alert("Please upload a file.");
    
    // STRICT CHECK: We must have an existing Report ID from the list
    if (!reportData?._id) {
        alert("Invalid Workflow: You must select a pending request from the 'Lab Report List' to upload a result.");
        return;
    }

    // Security Check for Amendment
    if (reportData?.status === "Completed" && !correctionReason.trim()) {
        alert("⚠️ MANDATORY: You are overwriting a completed report. Please enter a 'Reason for Amendment'.");
        return;
    }

    const payload = {
        correctionReason: correctionReason 
    };

    // pass reportData._id explicitly
    const success = await uploadLabReport(reportData._id, file, payload);
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

      {/* READ-ONLY INFO CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
            <User size={20} className="text-purple-600"/>
            <h2 className="text-lg font-bold text-gray-800">Request Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Patient</label>
            <p className="text-sm font-bold text-gray-800">{patientData.patientName} ({patientData.patientId})</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Age / Gender</label>
            <p className="text-sm font-bold text-gray-800">{patientData.ageGender}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Test Type</label>
            <p className="text-sm font-bold text-purple-700">{patientData.testType}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Referring Dr</label>
            <p className="text-sm font-bold text-gray-800">{patientData.referringDr}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Department</label>
            <p className="text-sm font-bold text-gray-800">{patientData.dept}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Request Date</label>
            <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
               <Calendar size={14} className="text-gray-400"/> {patientData.sampleDate}
            </div>
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

      {/* --- AMENDMENT REASON (Only if Completed) --- */}
      {reportData?.status === "Completed" && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-6 animate-in fade-in">
            <h3 className="text-orange-800 font-bold text-sm mb-2 flex items-center gap-2">
                <AlertCircle size={16}/> Reason for Re-upload (Mandatory)
            </h3>
            <textarea 
                className="w-full p-2 border border-orange-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                placeholder="e.g. Previous scan was blurry, Wrong file attached..."
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
            ></textarea>
        </div>
      )}

      {/* SUBMIT BUTTON */}
      <div className="mt-6 flex justify-end pb-8">
        <button 
            onClick={handleSubmit} 
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-bold shadow-lg text-white transition-all flex items-center gap-2 ${
                reportData?.status === "Completed" ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Processing..." : (
              reportData?.status === "Completed" 
              ? <><AlertCircle size={20} /> Amend Report</> 
              : <><CheckCircle size={20} /> Submit Report</>
          )}
        </button>
      </div>
    </div>
  );
}