import React, { useContext, useRef, useState } from 'react'
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from './../../context/AppContext';
import { PatientContext } from '../../context/PatientContext';

function AddNewPatient() {

  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendUrl, token } = useContext(AppContext);
  const { fetchPatients } = useContext(PatientContext);

  // User Data

  const[name, setName] = useState('');
  const[age, setAge] = useState('');
  const[gender, setGender] = useState('');
  const[bloodGroup, setBloodGroup] = useState('');
  const[contact, setContact] = useState('');
  const[email, setEmail] = useState('');
  const[address, setAddress] = useState('');
  const[guardianName, setGuardianName] = useState('');
  const[guardianContact, setGuardianContact] = useState('');
  const[allergies, setAllergies] = useState([]);
  const[allergyInput, setAllergyInput] = useState("");
  const[medicalHistory, setMedicalHistory] = useState([]);
  const[historyInput, sethistoryInput] = useState("");
  const[idProof, setIdProof] = useState(null);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIdProof(file);
    }
  };

  const handleAllergyChange = (e) =>{
    const value = e.target.value;
    setAllergyInput(value);

    const allergyArray = value
      .split(",")
      .map(item => item.trim())
      .filter(item => item !== "");
    
    setAllergies(allergyArray);
  }

  const handleHistoryChange = (e) =>{
    const value = e.target.value;
    sethistoryInput(value);
    const historyArray = value
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");
    setMedicalHistory(historyArray);
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    setLoading(true);
    
    try{

      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("bloodGroup", bloodGroup);
      formData.append("contact", contact);
      formData.append("email", email);
      formData.append("address", address);

      formData.append("guardianName", guardianName);
      formData.append("guardianContact", guardianContact);

      formData.append("allergies", JSON.stringify(allergies));
      formData.append("medicalHistory", JSON.stringify(medicalHistory));

      if (idProof) {
        formData.append("idProof", idProof);
      }

      const {data} = await axios.post(`${backendUrl}/api/patient/add-patient`, 
          formData, 
          {
            headers: {
              token: token,
              "Content-Type": "multipart/form-data",
            },
          });
      if(data.success){
        toast.success(data.message, { autoClose: 2000 });
        await fetchPatients()
        setTimeout(() => {
          navigate("/patient-list");
        }, 1000);
      }
      else{
        toast.error(data.message);
        setLoading(false);
      }

    } catch(error){
      console.log(error);
      toast.error("Internal Server Error");
      setLoading(false);
    }
  }

  const handleCancel = () => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel? All entered data will be lost."
  );

  if (!confirmCancel) return;

  setName("");
  setAge("");
  setGender("");
  setBloodGroup("");
  setContact("");
  setEmail("");
  setAddress("");
  setGuardianName("");
  setGuardianContact("");
  setAllergies([]);
  setAllergyInput("");
  setMedicalHistory([]);
  sethistoryInput("");
  setIdProof(null);
  setFileName("");

  toast.info("All fields cleared !");
  };


  return (
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

      {loading && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-fuchsia-700 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Adding Patient...</p>
              <p className="text-xs text-gray-500 mt-1">Uploading data and ID proof</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Section */}
      <div className="flex flex-wrap justify-between items-center gap-2">

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

      <div 
        className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-800 text-white cursor-pointer shadow-sm shadow-fuchsia-600
        transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
        onClick={()=>navigate('/')}
      >
        <FaArrowLeft 
          size={18}
          className="text-white" 
        />
        <p className="text-sm font-medium">Back</p>
      </div>
      </div>

      {/* Input fields */}
      <form 
        className="bg-white px-4 py-2 mt-4 rounded-lg border border-gray-400"
        onSubmit = {handleSubmit}
      >
      
      {/* Personal Information */}

      <p className="text-gray-900 font-semibold text-md mb-3">Personal Information</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-3">

        {/* Full Name */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Full Name <span className="text-red-600">*</span></label>
          <input 
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            placeholder='Enter the Full Name'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Gender <span className="text-red-600">*</span></label>
          <select
            required
            value={gender}
            onChange={(e)=>setGender(e.target.value)}
            className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${gender === "" ? "text-gray-500" : "text-gray-900"} `}
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
            value={age}
            onChange={(e)=>setAge(e.target.value)}
            required
            placeholder='Enter the Age'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Blood Type */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Blood Group <span className="text-red-600">*</span></label>
          <select
            required
            value={bloodGroup}
            onChange={(e)=>setBloodGroup(e.target.value)}
            className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${bloodGroup === "" ? "text-gray-500" : "text-gray-900"}`}
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
            value={contact}
            onChange={(e)=>setContact(e.target.value)}
            placeholder='Enter the Contact Number'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Email <span className="text-red-600">*</span></label>
          <input 
            type="email"
            value={email}
            required
            onChange={(e)=>setEmail(e.target.value)}
            placeholder='Enter the Email Address'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      {/* Address */}
      <div className="mt-3 mb-3 px-3">
        <label className="text-sm text-gray-800 font-medium">Address <span className="text-red-600">*</span></label>
        <textarea 
          rows={2}
          required
          value={address}
          onChange={(e)=>setAddress(e.target.value)}
          placeholder='Enter the Full Address'
          className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
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
            value={guardianName}
            onChange={(e)=>setGuardianName(e.target.value)}
            placeholder='Enter the Guardian Name'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Guardian Contact Number */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Guardian Contact Number</label>
          <input 
            type="number"
            value={guardianContact}
            onChange={(e)=>setGuardianContact(e.target.value)}
            placeholder='Enter the Guardian Contact Number'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
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
            value={allergyInput}
            onChange={handleAllergyChange}
            placeholder='e.g., Pollen, Dust,..'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Medical History */}
         <div>
          <label className="text-sm text-gray-800 font-medium">Medical History</label>
          <textarea 
            rows={2}
            value={historyInput}
            onChange={handleHistoryChange}
            placeholder='e.g., Thyroid, Diabetes,..'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      {/* Upload ID proof */}

      <div className="mt-3">
        <label className="text-sm text-gray-800 font-semibold">Upload ID Proof</label>

        <div
        onClick={() => fileRef.current.click()}
        className="border-2 mt-2 mx-3 border-dashed bg-gray-50 border-gray-500 rounded-xl p-6 cursor-pointer
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
          Supported formats: PNG, JPG, JPEG
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
        />
      </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex gap-4 items-center justify-end mb-5">

        <button 
          type="button"
          disabled={loading}
          onClick={handleCancel}
          className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700
          transition-all duration-300 ease-in-out
          hover:scale-105
          active:scale-95"

        >
          <FaTimes /> Cancel
        </button>

        <button 
          type = "submit"
          disabled={loading}
          className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800
          transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <FaSave /> Save Patient
        </button>

      </div>

      </form>
    </div>
  )
}

export default AddNewPatient