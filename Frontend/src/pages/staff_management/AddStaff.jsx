import React, { useRef, useState } from "react";
import { FaUserPlus, FaUpload, FaRedo, FaSave, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AddStaff() {
  const navigate = useNavigate();
  
  // Refs for file uploads
  const idProofRef = useRef(null);
  const profilePhotoRef = useRef(null);

  // State for filenames
  const [idProofName, setIdProofName] = useState("");
  const [profilePhotoName, setProfilePhotoName] = useState("");

  const handleIdProofChange = (e) => {
    if (e.target.files.length > 0) {
      setIdProofName(e.target.files[0].name);
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files.length > 0) {
      setProfilePhotoName(e.target.files[0].name);
    }
  };

  return (
    <>
      {/* Top Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaUserPlus size={20} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Staff List</h2>
          </div>
          <p className="text-sm text-gray-500">
            Add and manage new staff member details efficiently.
          </p>
        </div>

        <button 
          onClick={() => navigate('/staff-list')} // Adjust route as needed
          className="bg-purple-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-900 shadow-md transition-colors"
        >
          View Staff List
        </button>
      </div>

      {/* Main Form Area */}
      <form className="bg-white p-2 rounded-lg">
        
        {/* --- SECTION 1: STAFF DETAILS --- */}
        <div className="border border-gray-300 rounded-xl p-6 mb-6">
          <h3 className="text-gray-800 font-bold text-lg mb-4">Staff Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter full name"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors text-gray-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="Enter contact number"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                required
                placeholder="Enter Date of Birth"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => profilePhotoRef.current.click()}
                  className="bg-white border border-gray-400 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50"
                >
                  Choose file
                </button>
                <span className="text-xs text-gray-500">
                  {profilePhotoName ? profilePhotoName : "Upload less than 1 MB"}
                </span>
                <input
                    type="file"
                    ref={profilePhotoRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/*"
                    className="hidden"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Enter full address"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: QUALIFICATION DETAILS --- */}
        <div className="border border-gray-300 rounded-xl p-6 mb-6">
          <h3 className="text-gray-800 font-bold text-lg mb-4">Qualification Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Designation */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors text-gray-500"
              >
                <option value="">Select Designation</option>
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin</option>
                <option value="Support">Support Staff</option>
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors text-gray-500"
              >
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            {/* Qualification */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter the Qualification"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Specialization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter the specialization"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter the years of experience"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* License Number */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                License / Registration Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter the license number"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Employment Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors text-gray-500"
              >
                <option value="">Select the employment type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Visiting">Visiting</option>
              </select>
            </div>

             {/* Joining Date */}
             <div>
              <label className="text-sm text-gray-700 font-semibold mb-1 block">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
                required
                placeholder="Enter the joining date"
                className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition-colors"
              />
            </div>

          </div>
        </div>

        {/* --- SECTION 3: UPLOAD ID PROOF --- */}
        <div>
          <h3 className="text-gray-800 font-bold text-lg mb-2">Upload ID Proof</h3>
          <div
            onClick={() => idProofRef.current.click()}
            className="border-2 border-dashed bg-gray-100 border-gray-300 rounded-xl p-8 cursor-pointer hover:bg-gray-200 hover:border-purple-600 transition-colors flex flex-col items-center gap-2"
          >
            <FaUpload className="text-2xl text-gray-500" />
            <p className="text-sm text-gray-500 mt-2">
              Drag and drop files here, or <span className="underline">click to browse</span>
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: JPG, PNG (max 10MB)
            </p>

            {idProofName && (
              <p className="text-sm text-green-600 font-medium mt-2">
                Selected: {idProofName}
              </p>
            )}

            <input
              type="file"
              ref={idProofRef}
              onChange={handleIdProofChange}
              accept=".png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />
          </div>
        </div>

        {/* --- BOTTOM ACTIONS --- */}
        <div className="mt-8 flex gap-4 items-center justify-center">
          <button 
            type="reset"
            onClick={() => {
                setIdProofName("");
                setProfilePhotoName("");
            }}
            className="px-6 py-2.5 bg-gray-300 text-gray-700 font-semibold rounded-lg flex items-center gap-2 hover:bg-gray-400 transition-colors"
          >
            <FaRedo size={14} /> Reset Form
          </button>

          <button className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm">
            Add Staff Member
          </button>
        </div>
      </form>
    </>
  );
}

export default AddStaff;