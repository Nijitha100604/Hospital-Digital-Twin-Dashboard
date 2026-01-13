import React, { useState } from 'react'
import { 
  FaPlusSquare,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaUserTie,
  FaHospitalAlt,
  FaTools,
  FaTimesCircle,
  FaSave,
  FaArrowLeft
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function AddDepartment() {

  const navigate = useNavigate();

  const [deptName, setDeptName] = useState("");
  const [deptType, setDeptType] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [deptStatus, setDeptStatus] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [deptHead, setDeptHead] = useState("");
  const [headContact, setHeadContact] = useState("");
  const [totalRoom, setTotalRoom] = useState("");
  const [generalBed, setGeneralBed] = useState("");
  const [otBed, setOtBed] = useState("");
  const [icuBed, setIcuBed] = useState("");
  const [equipments, setEquipments] = useState("");
  const [powerBackup, setPowerBackup] = useState(false);
  const [oxygenSupply, setOxygenSupply] = useState(false);
  const [fireExtinguisher, setFireExtinguisher] = useState(false);

  const handleSubmit = (e) =>{
    e.preventDefault();
    const equipmentArray = equipments
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const formattedData = {
    "Department Name" : deptName,
    "Department Type" : deptType,
    "Speciality": speciality,
    "Department Status": deptStatus,
    "Block": block,
    "Floor": floor,
    "Head of Department": deptHead,
    "Contact Number": headContact,
    "Total Rooms": totalRoom,
    "Total General Beds": generalBed,
    "Total OT Beds": otBed,
    "Total ICU Beds": icuBed,
    "Power Backup": powerBackup,
    "Fire Extinguisher": fireExtinguisher,
    "Oxygen Supply": oxygenSupply,
    "Equipment": equipmentArray
  }

    console.log(formattedData);
    toast.success("Department Added");
    navigate('/departments-list')
  }

  const handleCancel = () =>{
    if (window.confirm("Are you sure you want to clear the form?")){
      setDeptName("");
      setDeptStatus("");
      setDeptType("");
      setHeadContact("");
      setSpeciality("");
      setBlock("");
      setDeptHead("");
      setEquipments("");
      setFloor("");
      setFireExtinguisher(false);
      setIcuBed("");
      setGeneralBed("");
      setOtBed("");
      setTotalRoom("");
      setOxygenSupply(false);
      setPowerBackup(false);
    }
  }

  return (
    <>
    
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex justify-between items-center gap-3">
    <div className="flex flex-col gap-1">
      <div className="flex gap-3 items-center">
        <FaPlusSquare
          size={18}
          className="text-gray-500" 
        />
        <p className="text-gray-800 font-bold text-lg">Add New Department</p>
      </div>
      <p className="text-gray-500 text-sm">Enter the details to create a new hospital department</p>
    </div>

    <div 
      className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-400 cursor-pointer
      transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      onClick={()=>navigate('/departments-list')}
    >
      <FaArrowLeft 
        size={18}
        className="text-gray-800" 
      />
      <p className="text-sm font-medium">Back</p>
    </div>
    </div>

    {/* Form */}
    <form
      className="mt-5 bg-white px-3 py-4 rounded-lg border border-gray-400"
      onSubmit = {handleSubmit}
    >

    {/* Department Information */}

    <div className="mb-5 flex gap-2 items-center">
      <FaInfoCircle 
        size={18}
        className="text-gray-800"
      />
      <p className="text-md text-gray-800 font-medium">Department Information</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

    {/* Department Name */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Department Name <span className="text-red-600">*</span></label>
      <input 
        type="text"
        value={deptName}
        onChange={(e)=>setDeptName(e.target.value)}
        required
        placeholder='Enter Patient Name'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    {/* Department Type */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Department Type <span className="text-red-600">*</span></label>
      <select
        required
        value={deptType}
        onChange={(e)=>setDeptType(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Department Type</option>
      <option value = "Critical Care">Critical Care</option>
      <option value = "General">General</option>
      <option value = "Emergency">Emergency</option>
      <option value = "Laboratory">Laboratory</option>
      </select>
    </div>

    {/* Speciality level */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Speciality Level<span className="text-red-600">*</span></label>
      <select
        required
        value={speciality}
        onChange={(e)=>setSpeciality(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Speciality Level</option>
      <option value = "Primary Care">Primary Care</option>
      <option value = "Secondary Care">Secondary Care</option>
      <option value = "Tertiary Care">Tertiary Care</option>
      <option value = "Super Speciality">Super Speciality</option>
      </select>
    </div>

    {/* Department Status */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Department Status<span className="text-red-600">*</span></label>
      <select
        required
        value={deptStatus}
        onChange={(e)=>setDeptStatus(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Department Status</option>
      <option value = "Active">Active</option>
      <option value = "Inactive">Inactive</option>
      </select>
    </div>

    </div>

    {/* Location details */}
    <div className="mb-5 flex gap-2 items-center">
      <FaMapMarkerAlt
        size={18}
        className="text-gray-800"
      />
      <p className="text-md text-gray-800 font-medium">Location Details</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

    {/* Block */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Block<span className="text-red-600">*</span></label>
      <select
        required
        value={block}
        onChange={(e)=>setBlock(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Block</option>
      <option value = "Block A">Block A</option>
      <option value = "Block B">Block B</option>
      <option value = "Block C">Block C</option>
      </select>
    </div>

    {/* Floor */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Floor<span className="text-red-600">*</span></label>
      <select
        required
        value={floor}
        onChange={(e)=>setFloor(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Floor</option>
      <option value = "Ground Floor">Ground Floor</option>
      <option value = "First Floor">First Floor</option>
      <option value = "Second Floor">Second Floor</option>
      </select>
    </div>

    </div>


    {/* Department Head and Contact */}
    <div className="mb-5 flex gap-2 items-center">
      <FaUserTie
        size={18}
        className="text-gray-800"
      />
      <p className="text-md text-gray-800 font-medium">Department Head & Contact</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

    {/* Department Head */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Head of Department <span className="text-red-600">*</span></label>
      <input 
        type="text"
        value={deptHead}
        onChange={(e)=>setDeptHead(e.target.value)}
        required
        placeholder='Enter Department Head'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    {/* Department head contact */}

    <div>
      <label className="text-sm text-gray-800 font-medium">Contact Number <span className="text-red-600">*</span></label>
      <input 
        type="number"
        value={headContact}
        onChange={(e)=>setHeadContact(e.target.value)}
        required
        placeholder='Enter Contact Number'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>


    </div>

    <div className="mb-5 flex gap-2 items-center">
      <FaHospitalAlt
        size={18}
        className="text-gray-800"
      />
      <p className="text-md text-gray-800 font-medium">Capacities & Facilities</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

    {/* Total Rooms */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Total Rooms<span className="text-red-600">*</span></label>
      <input 
        type="number"
        value={totalRoom}
        onChange={(e)=>setTotalRoom(e.target.value)}
        required
        placeholder='Enter Total Rooms'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    {/* General beds */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Total General Beds<span className="text-red-600">*</span></label>
      <input 
        type="number"
        value={generalBed}
        onChange={(e)=>setGeneralBed(e.target.value)}
        required
        placeholder='Enter total general beds'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    {/* ICU beds */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Total ICU Beds<span className="text-red-600">*</span></label>
      <input 
        type="number"
        value={icuBed}
        onChange={(e)=>setIcuBed(e.target.value)}
        required
        placeholder='Enter total ICU beds'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    {/* OT beds */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Total OT Beds<span className="text-red-600">*</span></label>
      <input 
        type="number"
        value={otBed}
        onChange={(e)=>setOtBed(e.target.value)}
        required
        placeholder='Enter total OT beds'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    </div>

    <div className="mb-5 flex gap-2 items-center">
      <FaTools
        size={18}
        className="text-gray-800"
      />
      <p className="text-md text-gray-800 font-medium">Equipments & Utilities</p>
    </div>

    <div className="mb-3">
      <label className="text-sm text-gray-800 font-medium">Equipments</label>
      <textarea 
        placeholder = "Eg: ECG, X-Ray"
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        rows={2}
        value = {equipments}
        onChange={(e)=>setEquipments(e.target.value)}
      />
    </div>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">
      
      {/* Power backup */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-800 font-medium">Power Backup</label>
        <div className="flex gap-2">
          <p
            onClick={() => setPowerBackup(true)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${powerBackup ? "bg-green-500 text-white" : "bg-white"}`}
          >
            Yes
          </p>
          <p
            onClick={() => setPowerBackup(false)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${!powerBackup ? "bg-red-500 text-white" : "bg-white"}`}
          >
            No
          </p>
        </div>
      </div>

      {/* Fire Extinguisher */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-800 font-medium">Fire Extinguisher</label>
        <div className="flex gap-2">
          <p
            onClick={() => setFireExtinguisher(true)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${fireExtinguisher ? "bg-green-500 text-white" : "bg-white"}`}
          >
            Yes
          </p>
          <p
            onClick={() => setFireExtinguisher(false)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${!fireExtinguisher ? "bg-red-500 text-white" : "bg-white"}`}
          >
            No
          </p>
        </div>
      </div>

      {/* Oxygen Supply */}
      <div className="flex flex-col gap-3">
        <label className="text-sm text-gray-800 font-medium">Oxygen Supply</label>
        <div className="flex gap-2">
          <p
            onClick={() => setOxygenSupply(true)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${oxygenSupply ? "bg-green-500 text-white" : "bg-white"}`}
          >
            Yes
          </p>
          <p
            onClick={() => setOxygenSupply(false)}
            className={`px-4 py-1 rounded-md border text-sm cursor-pointer
            ${!oxygenSupply ? "bg-red-500 text-white" : "bg-white"}`}
          >
            No
          </p>
        </div>
      </div>

    </div>

    <div className="mt-10 flex gap-4 items-center justify-end">
          
      <button 
        type="button"
        className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700
        transition-all duration-300 ease-in-out
        hover:scale-105
        active:scale-95"
        onClick={handleCancel}
      >
        <FaTimesCircle /> Cancel
      </button>
          
      <button 
        type = "submit"
        className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <FaSave /> Save Department
      </button>
          
    </div>

    </form>

    </div>

    </>
  )
}

export default AddDepartment