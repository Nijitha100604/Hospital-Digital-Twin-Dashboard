import React, { useRef, useState } from 'react'
import { FaUserPlus } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaSave } from "react-icons/fa";

function AddNewPatient() {

  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <>

      {/* Top Section */}

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaUserPlus 
            size={20} 
            className="text-gray-500"
          />
          <p className="text-gray-800 font-bold text-lg">Add New Patient</p>
        </div>
        <p className="text-gray-500 text-sm">Create a New Patient Record</p>
      </div>

      {/* Input fields */}
      <form className="bg-white px-4 py-2 mt-4 rounded-lg">
      
      {/* Personal Information */}

      <p className="text-gray-900 font-semibold text-md mb-3">Personal Information</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3">

        {/* Full Name */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Full Name <span className="text-red-600">*</span></label>
          <input 
            type="text"
            required
            placeholder='Enter the Full Name'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Gender <span className="text-red-600">*</span></label>
          <select
            required
            className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          >
            <option value = "">Select Gender</option>
            <option value = "Male">Male</option>
            <option value = "Female">Female</option>
            <option value = "Others">Others</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Age <span className="text-red-600">*</span></label>
          <input 
            type="number"
            required
            placeholder='Enter the Age'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Blood Type */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Blood Group <span className="text-red-600">*</span></label>
          <select
            required
            className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          >
            <option value = "">Select Blood Group</option>
            <option value = "A+ve">A+ve</option>
            <option value = "B+ve">B+ve</option>
            <option value = "A-ve">A-ve</option>
            <option value = "B-ve">B-ve</option>
            <option value = "AB+ve">AB+ve</option>
            <option value = "AB-ve">AB-ve</option>
            <option value = "O+ve">O+ve</option>
            <option value = "O-ve">O-ve</option>
          </select>
        </div>

        {/* Contact Number */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Contact Number <span className="text-red-600">*</span></label>
          <input 
            type="number"
            required
            placeholder='Enter the Contact Number'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Email</label>
          <input 
            type="email"
            placeholder='Enter the Email Address'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      {/* Address */}
      <div className="mt-3 mb-3 px-3">
        <label className="text-sm text-gray-800 font-medium">Address <span className="text-red-600">*</span></label>
        <textarea 
          rows={2}
          required
          placeholder='Enter the Full Address'
          className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        />
      </div>

      {/* Guardian Information */}

      <p className="text-gray-900 font-semibold text-md mb-3">Guardian Information</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3">

        {/* Guardian Name */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Guardian Name</label>
          <input 
            type="text"
            placeholder='Enter the Guardian Name'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Guardian Contact Number */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Guardian Contact Number</label>
          <input 
            type="number"
            placeholder='Enter the Guardian Contact Number'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      {/* Medical Information */}

      <p className="text-gray-900 font-semibold text-md mb-3 mt-4">Medical Information</p>

      <div className="flex flex-col gap-3 px-3">
        
        {/* Allergies */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Allergies</label>
          <textarea 
            rows={2}
            placeholder='List any known allergies'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Medical History */}
         <div>
          <label className="text-sm text-gray-800 font-medium">Medical History</label>
          <textarea 
            rows={2}
            placeholder='Enter relevant medical history'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      {/* Upload ID proof */}

      <div className="mt-3">
        <label className="text-sm text-gray-800 font-semibold">Upload ID Proof</label>

        <div
        onClick={() => fileRef.current.click()}
        className="border-2 mt-2 mx-3 border-dashed bg-gray-300 border-gray-500 rounded-xl p-6 cursor-pointer
                   hover:border-fuchsia-700 transition flex flex-col items-center gap-2"
      >
        <FaUpload className="text-2xl text-gray-700" />

        <p className="text-sm text-gray-600">
          Drag & drop your file or{" "}
          <span className="text-gray-900 font-semibold underline">
            click here to browse
          </span>
        </p>

        <p className="text-xs text-gray-500">
          Supported formats: PNG, JPG, JPEG, DOC, DOCX
        </p>

        {fileName && (
          <p className="text-sm text-green-700 font-medium mt-1">
            Selected: {fileName}
          </p>
        )}

        <input
          type="file"
          ref={fileRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.doc,.docx"
          className="hidden"
          required
        />
      </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex gap-4 items-center justify-end">

        <button className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700">
          <FaTimes /> Cancel
        </button>

        <button className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800">
          <FaSave /> Save Patient
        </button>

      </div>

      </form>
    </>
  )
}

export default AddNewPatient