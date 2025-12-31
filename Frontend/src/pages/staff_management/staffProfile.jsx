import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUserTie, FaEdit, FaArrowLeft, FaSearch, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaSave, FaTimes 
} from "react-icons/fa";
import { staffList } from "../../data/staffList";

function StaffProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- STATES ---
  const [staff, setStaff] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Edit Mode States
  const [editSection, setEditSection] = useState({
    basic: false,       
    professional: false, 
    personal: false     
  });

  // --- 1. FETCH DATA ---
  useEffect(() => {
    if (id) {
      const foundStaff = staffList.find((item) => item.staffId === id);
      if (foundStaff) {
        setStaff(foundStaff);
        setFormData(foundStaff);
      }
    } else {
      setStaff(null);
    }
  }, [id]);

  // --- 2. SEARCH LOGIC ---
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const results = staffList.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.staffId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  // --- HELPER: CALCULATE EXPERIENCE ---
  const calculateYears = (dateString) => {
    if (!dateString) return "0";
    const joinDate = new Date(dateString);
    const today = new Date();
    
    let years = today.getFullYear() - joinDate.getFullYear();
    const m = today.getMonth() - joinDate.getMonth();
    
    // If we haven't reached the joining month yet, subtract a year
    if (m < 0 || (m === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
    return years < 0 ? "0" : years.toString(); 
  };

  // --- 3. HANDLE INPUT CHANGE (With Auto-Calc) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Create copy of current data
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate experience if joining date changes
    if (name === "joiningDate") {
      updatedData.experience = calculateYears(value);
    }

    setFormData(updatedData);
  };

  // --- 4. TOGGLE EDIT MODE ---
  const toggleEdit = (section) => {
    setEditSection((prev) => ({ ...prev, [section]: !prev[section] }));
    if (editSection[section]) {
      setFormData(staff); // Reset on cancel
    }
  };

  // --- 5. TOGGLE STATUS (Basic Info) ---
  const toggleStatus = () => {
    if (editSection.basic) {
      setFormData((prev) => ({
        ...prev,
        status: prev.status === "Active" ? "Inactive" : "Active"
      }));
    }
  };

  // --- 6. SAVE CHANGES ---
  const handleSave = (section) => {
    setStaff(formData);
    
    // Update local dataset (simulated DB update)
    const index = staffList.findIndex(s => s.staffId === formData.staffId);
    if (index !== -1) {
      staffList[index] = formData;
    }

    setEditSection((prev) => ({ ...prev, [section]: false }));
    // Optional: Add toast notification here
  };

  // --- HELPER: RENDER VALUE OR "NOT PROVIDED" ---
  const renderValue = (value) => {
    return value ? (
      <span className="text-gray-800 font-medium">{value}</span>
    ) : (
      <span className="text-red-400 italic text-sm">Not Provided</span>
    );
  };

  // --- VIEW: SEARCH (No ID) ---
  if (!id) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center min-h-[400px] flex flex-col justify-center items-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <FaUserTie className="text-purple-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Staff Member</h2>
          <div className="relative w-full max-w-md mt-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Enter Name or ID..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-10 text-left">
                {searchResults.map((item) => (
                  <div key={item.staffId} onClick={() => navigate(`/staff-profile/${item.staffId}`)} className="p-3 hover:bg-purple-50 cursor-pointer border-b flex justify-between">
                    <div><p className="font-semibold">{item.name}</p><p className="text-xs text-gray-500">{item.staffId}</p></div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">View</span>
                  </div>
                ))}
              </div>
            )}
            {searchTerm && searchResults.length === 0 && <div className="absolute top-full w-full bg-white p-4 shadow rounded mt-2 text-gray-500">No staff found.</div>}
          </div>
        </div>
      </div>
    );
  }

  if (!staff) return <div className="p-10 text-center">Staff not found. <button onClick={() => navigate('/staff-list')} className="text-purple-600 underline">Back</button></div>;

  return (
    <div className="p-2 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 mb-3 text-sm font-medium transition-colors">
            <FaArrowLeft size={12}/> Back to List
        </button>
        <div className="flex items-center gap-3">
          <FaUserTie className="text-gray-700" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Staff Profile</h2>
            <p className="text-sm text-gray-500">Details for <span className="font-semibold text-gray-800">{staff.name}</span></p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* --- LEFT CARD: BASIC INFO (EDITABLE) --- */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center h-full min-h-[500px] relative">
          
          <div className="absolute top-4 right-4 flex gap-2">
            {editSection.basic ? (
                <>
                    <button onClick={() => handleSave('basic')} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"><FaSave /></button>
                    <button onClick={() => toggleEdit('basic')} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"><FaTimes /></button>
                </>
            ) : (
                <FaEdit onClick={() => toggleEdit('basic')} className="text-gray-400 hover:text-purple-600 cursor-pointer transition" />
            )}
          </div>

          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-50 mb-4 shadow-sm">
            <img src="https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg" alt="Profile" className="w-full h-full object-cover"/>
          </div>

          {editSection.basic ? (
            <input name="name" value={formData.name} onChange={handleInputChange} className="text-xl font-bold text-center border-b-2 border-purple-300 bg-purple-50 outline-none mb-1 w-full"/>
          ) : (
            <h3 className="text-xl font-bold text-gray-900">{staff.name}</h3>
          )}

          <p className="text-gray-600 text-sm mt-1 mb-4 font-medium">{staff.designation}</p>

          <div className="text-gray-800 font-semibold text-lg mb-6 bg-gray-50 px-4 py-1 rounded-lg border border-gray-200">
            ID: <span className="text-gray-600">{staff.staffId}</span>
          </div>

          <div className="flex gap-3 mb-8 select-none">
            <span 
              onClick={toggleStatus}
              className={`px-5 py-1.5 rounded-full text-sm font-medium shadow-sm text-white transition-all
                ${formData.status === 'Active' ? 'bg-green-600' : 'bg-red-500'}
                ${editSection.basic ? 'cursor-pointer ring-2 ring-offset-2 ring-purple-400 scale-105' : ''}
              `}
              title={editSection.basic ? "Click to toggle" : ""}
            >
              {editSection.basic ? formData.status : staff.status}
            </span>
          </div>

          <div className="w-full text-left px-4 space-y-3 border-t pt-6">
            <div className="flex justify-between items-center text-gray-700 text-sm h-8">
              <span className="font-semibold flex items-center gap-2"><FaPhoneAlt size={12}/> Phone:</span>
              {editSection.basic ? (
                 <input name="contact" value={formData.contact} onChange={handleInputChange} className="text-right border-b border-purple-300 bg-purple-50 outline-none w-32"/>
              ) : (
                <span className="text-gray-600">{staff.contact}</span>
              )}
            </div>
            <div className="flex justify-between items-center text-gray-700 text-sm">
              <span className="font-semibold flex items-center gap-2"><FaEnvelope size={12}/> Email:</span>
              <span className="text-gray-400 italic">{staff.email || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT CARD --- */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            
            {/* 1. PROFESSIONAL DETAILS */}
            <div className="border-b border-gray-100">
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
                    <h4 className="font-bold text-gray-800">Professional Details</h4>
                    <div className="flex gap-2">
                        {editSection.professional ? (
                            <>
                                <button onClick={() => handleSave('professional')} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"><FaSave /></button>
                                <button onClick={() => toggleEdit('professional')} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"><FaTimes /></button>
                            </>
                        ) : (
                            <FaEdit onClick={() => toggleEdit('professional')} className="text-gray-500 hover:text-purple-600 cursor-pointer transition" />
                        )}
                    </div>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    {/* Department */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Department</p>
                        {editSection.professional ? (
                             <select name="department" value={formData.department} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none">
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Radiology">Radiology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Pathology">Pathology</option>
                                <option value="Administration">Administration</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Gynecology">Gynecology</option>
                                <option value="Housekeeping">Housekeeping</option>
                             </select>
                        ) : (
                            <p className="text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100">{staff.department}</p>
                        )}
                    </div>
                    {/* Designation */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Designation</p>
                        {editSection.professional ? (
                            <input name="designation" value={formData.designation} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                            <p className="text-gray-800 font-medium bg-gray-50 p-2 rounded border border-gray-100">{staff.designation}</p>
                        )}
                    </div>
                    {/* Joining Date */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Joining Date</p>
                        {editSection.professional ? (
                            <input type="date" name="joiningDate" value={formData.joiningDate || ""} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                            renderValue(staff.joiningDate)
                        )}
                    </div>
                    {/* Experience (Read Only) */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Experience (Auto)</p>
                        {editSection.professional ? (
                             <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    name="experience" 
                                    value={formData.experience || "0"} 
                                    readOnly 
                                    disabled
                                    className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-gray-600 cursor-not-allowed outline-none"
                                />
                                <span className="text-gray-500 text-sm">Years</span>
                            </div>
                        ) : (
                            <p className="text-gray-800 font-medium">{staff.experience ? `${staff.experience} Years` : <span className="text-red-400 italic text-sm">Not Provided</span>}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. PERSONAL INFORMATION */}
            <div>
                <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200 border-t">
                    <h4 className="font-bold text-gray-800">Personal Information</h4>
                    <div className="flex gap-2">
                        {editSection.personal ? (
                            <>
                                <button onClick={() => handleSave('personal')} className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"><FaSave /></button>
                                <button onClick={() => toggleEdit('personal')} className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"><FaTimes /></button>
                            </>
                        ) : (
                            <FaEdit onClick={() => toggleEdit('personal')} className="text-gray-500 hover:text-purple-600 cursor-pointer transition" />
                        )}
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                     
                     {/* Gender Field */}
                     <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Gender</p>
                        {editSection.personal ? (
                           <select name="gender" value={formData.gender || ""} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none">
                             <option value="">Select Gender</option>
                             <option value="Male">Male</option>
                             <option value="Female">Female</option>
                             <option value="Other">Other</option>
                           </select>
                        ) : (
                           renderValue(staff.gender)
                        )}
                    </div>

                    {/* Date of Birth Field */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Date of Birth</p>
                        {editSection.personal ? (
                           <input type="date" name="dob" value={formData.dob || ""} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                           renderValue(staff.dob)
                        )}
                    </div>

                    {/* Address Field */}
                    <div className="md:col-span-2">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Address</p>
                        {editSection.personal ? (
                           <textarea name="address" rows="2" value={formData.address || ""} onChange={handleInputChange} placeholder="Enter full address..." className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                           <div className="flex items-start gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 min-h-[50px]">
                              <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-gray-400" /> 
                              {renderValue(staff.address)}
                           </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default StaffProfile;