import React, { useState } from 'react'
import { 
  FaExclamationCircle,
  FaArrowLeft, 
  FaTimesCircle,
  FaSave
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function IssueReport() {

  const navigate = useNavigate();

  const [issueType, setIssueType] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("");
  const [block, setBlock] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) =>{

    e.preventDefault();

    const formattedData = {
      "Issue Type": issueType,
      "Priority Level": priorityLevel,
      "Location": location,
      "Block": block,
      "Description": description
    };
    console.log(formattedData);
    toast.success("Issue Reported !");
    setIssueType("");
    setPriorityLevel("");
    setBlock("");
    setLocation("");
    setDescription("");
    navigate('/issues-list');
  }

  const handleCancel = () =>{
    if (window.confirm("Are you sure you want to clear the form?")){
      setIssueType("");
      setPriorityLevel("");
      setBlock("");
      setLocation("");
      setDescription("");
    }
  }

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading and Back button */}
    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaExclamationCircle 
            size={18}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">Infrastructure Issue Reports</p>
        </div>
        <p className="text-gray-500 text-sm">Report and track infrastructure problems</p>
      </div>

      <div 
        className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-400 cursor-pointer
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        onClick={()=>navigate('/issues-list')}
      >
        <FaArrowLeft 
          size={18}
          className="text-gray-800" 
        />
        <p className="text-sm font-medium">Back</p>
      </div>

    </div>

    {/* Content */}
    <form onSubmit={handleSubmit}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 mt-3">

    {/* Issue Type */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Issue Type <span className="text-red-600">*</span></label>
      <select
        required
        value={issueType}
        onChange={(e)=>setIssueType(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Issue Type</option>
      <option value = "Electrical">Electrical</option>
      <option value = "Plumbing">Plumbing</option>
      <option value = "Air Conditioning">Air Conditioning</option>
      <option value = "Gas Supply">Gas Supply</option>
      <option value = "Fire Safety">Fire Safety</option>
      <option value = "Water Supply">Water Supply</option>
      </select>
    </div>

    {/* Priority Level */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Issue Type <span className="text-red-600">*</span></label>
      <select
        required
        value={priorityLevel}
        onChange={(e)=>setPriorityLevel(e.target.value)}
        className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
      >
      <option value = "">Select Priority Level</option>
      <option value = "High">High</option>
      <option value = "Low">Low</option>
      <option value = "Medium">Medium</option>
      <option value = "Critical">Critical</option>
      </select>
    </div>

    {/* Location */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Location <span className="text-red-600">*</span></label>
      <input 
        type="text"
        value={location}
        onChange={(e)=>setLocation(e.target.value)}
        required
        placeholder='Eg: ICU-Second Floor'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

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

    </div>

    <div className="w-full mb-5">

    {/* Short Description */}
    <div>
      <label className="text-sm text-gray-800 font-medium">Short Description <span className="text-red-600">*</span></label>
      <textarea
        value={description}
        rows={2}
        onChange={(e)=>setDescription(e.target.value)}
        required
        placeholder='Enter the description'
        className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
      />
    </div>

    </div>

    <div className="mt-10 flex gap-4 items-center justify-end">
              
      <button 
        type="button"
        className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        onClick={handleCancel}
      >
        <FaTimesCircle /> Cancel
      </button>
              
      <button 
        type = "submit"
        className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <FaSave /> Create Issue
      </button>
              
    </div>
    </form>

    </div>

    </>
  )
}

export default IssueReport