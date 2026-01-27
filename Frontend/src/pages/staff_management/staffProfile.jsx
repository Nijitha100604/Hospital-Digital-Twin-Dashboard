import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUserTie, FaEdit, FaArrowLeft, FaSearch, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaSave, FaTimes, FaSpinner 
} from "react-icons/fa";
import { StaffContext } from "../../context/StaffContext"; // Import Context

function StaffProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  // --- CONTEXT ---
  const { getStaffById, updateStaff, staffs, fetchStaffs } = useContext(StaffContext);

  // --- STATES ---
  const [staff, setStaff] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Search States (For when no ID is present)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Edit Mode States
  const [editSection, setEditSection] = useState({
    basic: false,       
    professional: false, 
    personal: false     
  });

  // --- 1. INITIAL DATA LOADING ---
  useEffect(() => {
    // If accessing the Search View (no ID), make sure we have the list
    if (!id && staffs.length === 0) {
      fetchStaffs();
    }

    // If accessing a specific profile (ID exists)
    if (id) {
      const loadData = async () => {
        setLoading(true);
        // Try finding in existing context first to be fast
        let foundStaff = staffs.find((item) => item.staffId === id);
        
        // If not found (e.g., direct link refresh), fetch from API
        if (!foundStaff) {
            foundStaff = await getStaffById(id);
        }

        if (foundStaff) {
          setStaff(foundStaff);
          setFormData(foundStaff);
        }
        setLoading(false);
      };
      loadData();
    } else {
      setStaff(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, getStaffById]);

  // --- 2. SEARCH LOGIC (Using Backend Data) ---
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const results = staffs.filter(
        (item) =>
          item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.staffId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm, staffs]);

  // --- HELPER: CALCULATE EXPERIENCE ---
  const calculateYears = (dateString) => {
    if (!dateString) return "0";
    const joinDate = new Date(dateString);
    const today = new Date();
    
    let years = today.getFullYear() - joinDate.getFullYear();
    const m = today.getMonth() - joinDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < joinDate.getDate())) {
      years--;
    }
    return years < 0 ? "0" : years.toString(); 
  };

  // --- 3. HANDLE INPUT CHANGE ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate experience if joining date changes
    if (name === "joiningDate") {
      updatedData.experience = calculateYears(value);
    }

    setFormData(updatedData);
  };

  // --- 4. TOGGLE STATUS ---
  const toggleStatus = () => {
    if (editSection.basic) {
      setFormData((prev) => ({
        ...prev,
        status: prev.status === "Active" ? "Inactive" : "Active"
      }));
    }
  };

  // --- 5. SAVE CHANGES (Connect to Backend) ---
  const handleSave = async (section) => {
    
    // Create FormData object
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        // Exclude internal MongoDB fields
        if(key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
            submissionData.append(key, formData[key]);
        }
    });

    // Call API
    const success = await updateStaff(staff.staffId, submissionData);
    
    if (success) {
        setStaff(formData); // Update local view
        setEditSection((prev) => ({ ...prev, [section]: false }));
    }
  };

  const toggleEdit = (section) => {
    setEditSection((prev) => ({ ...prev, [section]: !prev[section] }));
    if (editSection[section]) {
      setFormData(staff); // Reset on cancel
    }
  };

  // --- HELPER: RENDER VALUE ---
  const renderValue = (value) => {
    return value ? (
      <span className="text-gray-800 font-medium">{value}</span>
    ) : (
      <span className="text-red-400 italic text-sm">Not Provided</span>
    );
  };

  // ==========================================
  // VIEW 1: SEARCH SCREEN (No ID provided)
  // ==========================================
  if (!id) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-in fade-in duration-300">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center min-h-[400px] flex flex-col justify-center items-center border border-gray-200">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <FaUserTie className="text-purple-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Staff Member</h2>
          <p className="text-gray-500 mb-6">Search from {staffs.length} registered staff members</p>
          
          <div className="relative w-full max-w-md mt-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Enter Name or ID (e.g., STF001)..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-10 text-left max-h-60 overflow-y-auto">
                {searchResults.map((item) => (
                  <div 
                    key={item.staffId} 
                    onClick={() => navigate(`/staff-profile/${item.staffId}`)} 
                    className="p-3 hover:bg-purple-50 cursor-pointer border-b last:border-0 flex justify-between items-center transition-colors"
                  >
                    <div>
                        <p className="font-semibold text-gray-800">{item.fullName}</p>
                        <p className="text-xs text-gray-500">{item.staffId} • {item.designation}</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">View</span>
                  </div>
                ))}
              </div>
            )}
            
            {searchTerm && searchResults.length === 0 && (
                <div className="absolute top-full w-full bg-white p-4 shadow-lg rounded-xl mt-2 text-gray-500 border border-gray-100">
                    No staff found matching "{searchTerm}"
                </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PROFILE SCREEN (ID provided)
  // ==========================================

  if (loading) return <div className="flex justify-center p-20"><FaSpinner className="animate-spin text-3xl text-purple-600"/></div>;
  
  if (!staff) return (
    <div className="p-10 text-center text-gray-500">
        Staff not found. 
        <br/>
        <button onClick={() => navigate('/staff-list')} className="text-purple-600 underline mt-2">Go to List</button>
    </div>
  );

  return (
    <div className="p-2 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 mb-3 text-sm font-medium transition-colors">
            <FaArrowLeft size={12}/> Back
        </button>
        <div className="flex items-center gap-3">
          <FaUserTie className="text-gray-700" size={24} />
          <div>
            <h2 className="text-xl font-bold text-gray-900">Staff Profile</h2>
            <p className="text-sm text-gray-500">Details for <span className="font-semibold text-gray-800">{staff.fullName}</span></p>
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
            <img src={staff.profilePhoto || "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"} alt="Profile" className="w-full h-full object-cover"/>
          </div>

          {editSection.basic ? (
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="text-xl font-bold text-center border-b-2 border-purple-300 bg-purple-50 outline-none mb-1 w-full"/>
          ) : (
            <h3 className="text-xl font-bold text-gray-900">{staff.fullName}</h3>
          )}

          <p className="text-gray-600 text-sm mt-1 mb-4 font-medium">{staff.designation}</p>

          <div className="text-gray-800 font-semibold text-lg mb-6 bg-gray-50 px-4 py-1 rounded-lg border border-gray-200">
            ID: <span className="text-gray-600">{staff.staffId}</span>
          </div>

          <div className="flex gap-3 mb-8 select-none">
            <span 
              onClick={toggleStatus}
              className={`px-5 py-1.5 rounded-full text-sm font-medium shadow-sm text-white transition-all
                ${(editSection.basic ? formData.status : staff.status) === 'Active' ? 'bg-green-600' : 'bg-red-500'}
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
                 <input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="text-right border-b border-purple-300 bg-purple-50 outline-none w-32"/>
              ) : (
                <span className="text-gray-600">{staff.contactNumber}</span>
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
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Administration">Administration</option>
                                <option value="Gynecology">Gynecology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Pharmacy">Pharmacy</option>
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
                            <input type="date" name="joiningDate" value={formData.joiningDate ? new Date(formData.joiningDate).toISOString().split('T')[0] : ""} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                            renderValue(new Date(staff.joiningDate).toLocaleDateString())
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
                           <input type="date" name="dateOfBirth" value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ""} onChange={handleInputChange} className="w-full p-2 border border-purple-300 rounded bg-purple-50 outline-none"/>
                        ) : (
                           renderValue(new Date(staff.dateOfBirth).toLocaleDateString())
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