import React, { useRef, useState, useContext } from "react";
import { FaUserPlus, FaUpload, FaRedo, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext"; // Import AppContext
import AccessDenied from "../../components/AccessDenied"; // Import AccessDenied Component
import { toast } from "react-toastify";

function AddStaff() {
  const navigate = useNavigate();
  const { addStaff } = useContext(StaffContext);
  const { userData } = useContext(AppContext); // Get User Role

  // --- SECURITY CHECK: ADMIN ONLY ---
  if (userData && userData.designation !== 'Admin') {
    return <AccessDenied />;
  }
  
  // Refs for file uploads
  const idProofRef = useRef(null);
  const profilePhotoRef = useRef(null);

  // Form State
  const [files, setFiles] = useState({ profilePhoto: null, idProofDoc: null });
  const [data, setData] = useState({
    fullName: "",
    gender: "",
    email: "",
    password: "", 
    contactNumber: "",
    dateOfBirth: "",
    address: "",
    designation: "",
    department: "",
    qualification: "",
    specialization: "",
    experience: "",
    licenseNumber: "",
    employmentType: "",
    joiningDate: "",
    status: "Active"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files.length > 0) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (files.profilePhoto) formData.append("profilePhoto", files.profilePhoto);
    if (files.idProofDoc) formData.append("idProofDoc", files.idProofDoc);

    const success = await addStaff(formData);
    if (success) {
      navigate('/staff-list');
    }
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaUserPlus size={20} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Add Staff</h2>
          </div>
          <p className="text-sm text-gray-500">Create a new staff profile.</p>
        </div>
        <button onClick={() => navigate('/staff-list')} className="bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-900 shadow-md">
          <FaList className="inline mr-2"/> View Staff List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-2 rounded-lg">
        
        {/* --- SECTION 1: STAFF DETAILS --- */}
        <div className="border border-gray-300 rounded-xl p-6 mb-6">
          <h3 className="text-gray-800 font-bold text-lg mb-4">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            <input name="fullName" value={data.fullName} onChange={handleChange} required placeholder="Full Name *" className="input-field" />
            
            <select name="gender" value={data.gender} onChange={handleChange} required className="input-field text-gray-500">
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input name="email" type="email" value={data.email} onChange={handleChange} required placeholder="Email *" className="input-field" />
            
            <input name="password" type="password" value={data.password} onChange={handleChange} required placeholder="Password *" className="input-field" />

            <input name="contactNumber" type="number" value={data.contactNumber} onChange={handleChange} required placeholder="Contact Number *" className="input-field" />
            
            <input name="dateOfBirth" type="text" onFocus={(e)=>e.target.type='date'} onBlur={(e)=>e.target.type='text'} value={data.dateOfBirth} onChange={handleChange} required placeholder="Date of Birth *" className="input-field" />

            {/* Profile Photo Upload */}
            <div className="flex items-center gap-3">
                <button type="button" onClick={() => profilePhotoRef.current.click()} className="bg-white border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50">
                  Choose Photo
                </button>
                <span className="text-xs text-gray-500 truncate max-w-[150px]">{files.profilePhoto ? files.profilePhoto.name : "No file chosen"}</span>
                <input type="file" ref={profilePhotoRef} onChange={(e) => handleFileChange(e, 'profilePhoto')} accept="image/*" className="hidden" />
            </div>

            <textarea name="address" rows={2} value={data.address} onChange={handleChange} required placeholder="Address *" className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm md:col-span-2 outline-none focus:ring-2 focus:ring-purple-600" />
          </div>
        </div>

        {/* --- SECTION 2: PROFESSIONAL DETAILS --- */}
        <div className="border border-gray-300 rounded-xl p-6 mb-6">
          <h3 className="text-gray-800 font-bold text-lg mb-4">Professional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            <select name="designation" value={data.designation} onChange={handleChange} required className="input-field text-gray-500">
                <option value="">Select Designation *</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin</option>
                <option value="Support">Support</option>
                <option value="Technician">Technician</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Receptionist">Receptionist</option>
            </select>

            <select name="department" value={data.department} onChange={handleChange} required className="input-field text-gray-500">
                <option value="">Select Department *</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Administration">Administration</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Orthopedics">Orthopedics</option>
                {/* Add others as needed */}
            </select>

            <input name="qualification" value={data.qualification} onChange={handleChange} required placeholder="Qualification *" className="input-field" />
            <input name="specialization" value={data.specialization} onChange={handleChange} placeholder="Specialization (Optional)" className="input-field" />
            <input name="experience" type="number" value={data.experience} onChange={handleChange} required placeholder="Experience (Years) *" className="input-field" />
            <input name="licenseNumber" value={data.licenseNumber} onChange={handleChange} required placeholder="License Number *" className="input-field" />

            <select name="employmentType" value={data.employmentType} onChange={handleChange} required className="input-field text-gray-500">
                <option value="">Employment Type *</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Visiting">Visiting</option>
                <option value="Intern">Intern</option>
            </select>

            <input name="joiningDate" type="text" onFocus={(e)=>e.target.type='date'} onBlur={(e)=>e.target.type='text'} value={data.joiningDate} onChange={handleChange} required placeholder="Joining Date *" className="input-field" />
          </div>
        </div>

        {/* --- SECTION 3: ID PROOF --- */}
        <div className="mb-6">
            <h3 className="text-gray-800 font-bold text-lg mb-2">Upload ID Proof</h3>
            <div onClick={() => idProofRef.current.click()} className="border-2 border-dashed bg-gray-50 border-gray-300 rounded-xl p-6 cursor-pointer hover:border-purple-600 flex flex-col items-center">
                <FaUpload className="text-2xl text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">{files.idProofDoc ? files.idProofDoc.name : "Click to upload ID Proof"}</p>
                <input type="file" ref={idProofRef} onChange={(e) => handleFileChange(e, 'idProofDoc')} className="hidden" />
            </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex justify-center gap-4">
            <button type="reset" onClick={() => { setData({}); setFiles({}); }} className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-400">
                <FaRedo /> Reset
            </button>
            <button type="submit" className="px-6 py-2.5 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700">
                Submit Staff
            </button>
        </div>
      </form>
      
      {/* Internal CSS for cleaner JSX */}
      <style>{`
        .input-field {
            width: 100%;
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            padding: 0.625rem 1rem;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            ring: 2px;
            ring-color: #9333ea;
            background-color: white;
        }
      `}</style>
    </>
  );
}

export default AddStaff;