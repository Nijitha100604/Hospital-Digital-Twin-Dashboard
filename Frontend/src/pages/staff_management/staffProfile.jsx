import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUserTie, FaEdit, FaArrowLeft, FaPhoneAlt, FaEnvelope, 
  FaMapMarkerAlt, FaSave, FaTimes, FaSpinner 
} from "react-icons/fa";
import { StaffContext } from "../../context/StaffContext";

function StaffProfile() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { getStaffById, updateStaff } = useContext(StaffContext);
  
  const [staff, setStaff] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Edit Mode States
  const [editSection, setEditSection] = useState({ basic: false, professional: false, personal: false });

  // 1. Fetch Data
  useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const data = await getStaffById(id); // Use real ID from params
        if (data) {
            setStaff(data);
            setFormData(data);
        }
        setLoading(false);
    };
    loadData();
  }, [id, getStaffById]);

  // 2. Handle Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Save Changes
  const handleSave = async (section) => {
    // Construct FormData for update
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        // Only append valid keys to avoid sending full object junk
        if(key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v') {
            submissionData.append(key, formData[key]);
        }
    });

    const success = await updateStaff(staff.staffId, submissionData);
    if(success) {
        setStaff(formData); // Update local view
        setEditSection(prev => ({ ...prev, [section]: false }));
    }
  };

  const toggleEdit = (section) => {
    setEditSection(prev => ({ ...prev, [section]: !prev[section] }));
    if (editSection[section]) setFormData(staff); // Reset on cancel
  };

  if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-2xl text-purple-600"/></div>;
  if (!staff) return <div className="p-10 text-center">Staff not found.</div>;

  return (
    <div className="p-2 animate-in fade-in duration-300">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 mb-3 text-sm font-medium">
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
        {/* --- LEFT CARD: BASIC --- */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center text-center relative">
          <div className="absolute top-4 right-4 flex gap-2">
            {editSection.basic ? (
                <>
                    <button onClick={() => handleSave('basic')} className="text-green-600 hover:bg-green-100 p-2 rounded-full"><FaSave /></button>
                    <button onClick={() => toggleEdit('basic')} className="text-red-500 hover:bg-red-100 p-2 rounded-full"><FaTimes /></button>
                </>
            ) : (
                <FaEdit onClick={() => toggleEdit('basic')} className="text-gray-400 hover:text-purple-600 cursor-pointer" />
            )}
          </div>

          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-50 mb-4 shadow-sm">
            <img src={staff.profilePhoto || "https://via.placeholder.com/150"} alt="Profile" className="w-full h-full object-cover"/>
          </div>

          {editSection.basic ? (
            <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="text-xl font-bold text-center border-b border-purple-300 outline-none mb-1 w-full"/>
          ) : (
            <h3 className="text-xl font-bold text-gray-900">{staff.fullName}</h3>
          )}
          <p className="text-gray-600 text-sm mt-1 mb-4">{staff.designation}</p>

          <div className="w-full text-left px-4 space-y-3 border-t pt-6">
            <div className="flex justify-between items-center text-gray-700 text-sm">
              <span className="font-semibold flex items-center gap-2"><FaPhoneAlt size={12}/> Phone:</span>
              {editSection.basic ? <input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} className="border-b w-32 outline-none text-right"/> : <span>{staff.contactNumber}</span>}
            </div>
            <div className="flex justify-between items-center text-gray-700 text-sm">
              <span className="font-semibold flex items-center gap-2"><FaEnvelope size={12}/> Email:</span>
              <span>{staff.email}</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT CARD: DETAILS --- */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
                <h4 className="font-bold text-gray-800">Professional Details</h4>
                <div className="flex gap-2">
                    {editSection.professional ? (
                        <>
                            <button onClick={() => handleSave('professional')} className="text-green-600"><FaSave /></button>
                            <button onClick={() => toggleEdit('professional')} className="text-red-500"><FaTimes /></button>
                        </>
                    ) : (
                        <FaEdit onClick={() => toggleEdit('professional')} className="text-gray-500 cursor-pointer hover:text-purple-600" />
                    )}
                </div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Department</p>
                    {editSection.professional ? (
                        <input name="department" value={formData.department} onChange={handleInputChange} className="w-full border-b border-purple-300 outline-none"/>
                    ) : <p className="font-medium">{staff.department}</p>}
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Experience</p>
                    <p className="font-medium">{staff.experience} Years</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Joining Date</p>
                    <p className="font-medium">{new Date(staff.joiningDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default StaffProfile;