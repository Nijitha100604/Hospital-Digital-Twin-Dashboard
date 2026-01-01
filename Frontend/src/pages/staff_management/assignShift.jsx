import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, FaSearch, FaExclamationTriangle, FaUserCircle, 
  FaEnvelope, FaPhone, FaArrowLeft, FaCheckCircle, FaEdit, FaPlusCircle 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { staffList } from "../../data/staffList";
import { shiftData } from "../../data/shiftData"; 

function assignShift() {
  const navigate = useNavigate();

  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  const [formData, setFormData] = useState({
    date: "",
    shiftType: "",
    startTime: "",
    endTime: "",
    department: "",
    location: "",
    notes: ""
  });

  const [notify, setNotify] = useState(false);
  const [conflict, setConflict] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DEFAULT TIME CONFIGURATION ---
  const shiftDefaults = {
    Morning: { start: "09:00", end: "17:00" }, // 09:00 AM - 05:00 PM
    Evening: { start: "17:00", end: "01:00" }, // 05:00 PM - 01:00 AM
    Night:   { start: "01:00", end: "09:00" }  // 01:00 AM - 09:00 AM
  };

  // --- 1. SEARCH LOGIC ---
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const results = staffList.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.staffId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm]);

  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
    setSearchTerm("");
    setSearchResults([]);
    if(formData.date) {
        checkConflict(staff.staffId, formData.date);
    }
  };

  // --- 2. CONFLICT CHECK LOGIC ---
  const checkConflict = (staffId, date) => {
    if (!staffId || !date) {
      setConflict(null);
      return;
    }

    const foundShift = shiftData.find(
      (shift) => shift.staffId === staffId && shift.date === date
    );

    if (foundShift) {
      if (foundShift.type === "Leave") {
        setConflict({
            type: 'LEAVE',
            data: foundShift,
            message: `${selectedStaff?.name} is currently marked on LEAVE.`
        });
      } else {
        setConflict({
            type: 'SHIFT',
            data: foundShift,
            message: `${selectedStaff?.name} already has a ${foundShift.type.toUpperCase()} shift (${foundShift.location}).`
        });
      }
    } else {
      setConflict(null);
    }
  };

  // --- 3. HANDLE CHANGE (With Auto-Time Logic) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Create a copy of existing form data
    let updatedData = { ...formData, [name]: value };

    // AUTO-FILL TIME LOGIC
    // If the user changes the Shift Type, automatically set the Start/End times
    if (name === "shiftType" && shiftDefaults[value]) {
        updatedData.startTime = shiftDefaults[value].start;
        updatedData.endTime = shiftDefaults[value].end;
    }

    setFormData(updatedData);

    // Conflict check trigger
    if (name === "date" && selectedStaff) {
      checkConflict(selectedStaff.staffId, value);
    }
  };

  // --- 4. SUBMIT LOGIC ---
  const handleAssign = (resolutionType = 'NORMAL') => {
    if (!selectedStaff || !formData.date || !formData.shiftType) {
      alert("Please fill in all required fields (Staff, Date, Shift Type).");
      return;
    }

    let confirmMsg = `Assign ${formData.shiftType} shift to ${selectedStaff.name}?`;
    
    if (resolutionType === 'OVERWRITE') {
        confirmMsg = `⚠️ CONFIRM REPLACEMENT\n\nThis will remove the existing ${conflict.data.type} shift and assign this new ${formData.shiftType} shift instead.\n\nProceed?`;
    } else if (resolutionType === 'EXTRA') {
        confirmMsg = `⚠️ CONFIRM EXTRA DUTY\n\n${selectedStaff.name} will have TWO shifts on this date (Double Duty).\n\nProceed?`;
    }

    if (!window.confirm(confirmMsg)) return;

    setIsSubmitting(true);

    setTimeout(() => {
      let actionLog = "";
      if (resolutionType === 'OVERWRITE') actionLog = "Previous shift removed. New shift assigned.";
      else if (resolutionType === 'EXTRA') actionLog = "Added as Extra Duty (Hospital Welfare).";
      else actionLog = "Shift assigned successfully.";

      let notifyMsg = notify ? `\n\n🔔 Notification sent to:\n📧 ${selectedStaff.email}\n📱 ${selectedStaff.contact}` : "";

      alert(`✅ Success!\n${actionLog}${notifyMsg}`);
      
      setIsSubmitting(false);
      navigate('/shift-planner');
    }, 1500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
         <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-purple-700 mb-3 transition-colors text-sm font-medium">
            <FaArrowLeft size={12}/> Back to Planner
        </button>
        <div className="flex items-center gap-2 mb-1">
          <FaCalendarAlt className="text-gray-700" size={20} />
          <h2 className="text-2xl font-bold text-gray-800">Assign Shifts</h2>
        </div>
        <p className="text-gray-500 text-sm">Allocate shifts to staff members.</p>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        
        {/* 1. SELECT STAFF */}
        <div className="mb-8 relative">
          <label className="block text-gray-700 font-bold mb-2">Select Staff</label>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Staff by Name or ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={selectedStaff !== null}
            />
            {selectedStaff && (
              <button 
                onClick={() => { setSelectedStaff(null); setConflict(null); setSearchTerm(""); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-3 py-1 rounded transition"
              >
                Change User
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {searchResults.map((staff) => (
                <div key={staff.staffId} onClick={() => handleSelectStaff(staff)} className="p-3 hover:bg-purple-50 cursor-pointer border-b flex justify-between items-center transition-colors">
                  <div>
                    <p className="font-semibold text-gray-800">{staff.name}</p>
                    <p className="text-xs text-gray-500">{staff.staffId} • {staff.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedStaff && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-purple-50 p-4 rounded-lg border border-purple-100 animate-in slide-in-from-top-2">
              <div className="bg-purple-200 p-3 rounded-full text-purple-700 w-fit">
                <FaUserCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">{selectedStaff.name}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1 bg-purple-100 px-2 py-0.5 rounded text-purple-800 text-xs font-semibold">ID: {selectedStaff.staffId}</span>
                  <span className="flex items-center gap-1"><FaEnvelope size={12}/> {selectedStaff.email}</span>
                  <span className="flex items-center gap-1"><FaPhone size={12}/> {selectedStaff.contact}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. CONFLICT ALERT */}
        {conflict && (
          <div className={`mb-8 border px-6 py-5 rounded-xl flex flex-col md:flex-row md:items-start gap-4 animate-in shake ${
              conflict.type === 'LEAVE' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-start gap-3 flex-1">
                <FaExclamationTriangle className={`mt-1 shrink-0 text-2xl ${conflict.type === 'LEAVE' ? 'text-red-600' : 'text-orange-600'}`} />
                <div>
                    <p className={`font-bold text-lg ${conflict.type === 'LEAVE' ? 'text-red-800' : 'text-orange-800'}`}>
                        {conflict.type === 'LEAVE' ? 'Staff on Leave' : 'Overlap Detected'}
                    </p>
                    <p className={`text-sm font-medium opacity-90 mb-2 ${conflict.type === 'LEAVE' ? 'text-red-700' : 'text-orange-800'}`}>
                        {conflict.message}
                    </p>
                    <p className="text-xs text-gray-500">Select an option below to proceed.</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button onClick={() => handleAssign('OVERWRITE')} className="flex-1 whitespace-nowrap px-4 py-2 bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 rounded-lg shadow-sm text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <FaEdit /> Edit / Replace Previous
                </button>
                <button onClick={() => handleAssign('EXTRA')} className="flex-1 whitespace-nowrap px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <FaPlusCircle /> Add as Extra Duty
                </button>
            </div>
          </div>
        )}

        {/* 3. FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6 mb-8">
          
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Shift Date</label>
              <input 
                type="date" name="date" value={formData.date} onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 shadow-sm ${conflict ? 'border-orange-300 ring-2 ring-orange-100' : 'border-gray-300 focus:ring-purple-600'}`}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-sm">
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Emergency">Emergency</option>
                <option value="Radiology">Radiology</option>
                <option value="Pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Shift Type</label>
              {/* UPDATED: Options are now simple labels */}
              <select name="shiftType" value={formData.shiftType} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-sm">
                <option value="">Select Shift Type</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2 text-sm">Start Time</label>
                {/* Standard Time Input - Auto-filled but Editable */}
                <input 
                  type="time" 
                  name="startTime" 
                  value={formData.startTime} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700 font-bold mb-2 text-sm">End Time</label>
                {/* Standard Time Input - Auto-filled but Editable */}
                <input 
                  type="time" 
                  name="endTime" 
                  value={formData.endTime} 
                  onChange={handleChange} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                />
              </div>
            </div>

            <div>
               <label className="block text-gray-700 font-bold mb-2 text-sm">Location / Unit</label>
               <input type="text" name="location" placeholder="e.g., ICU, Ward 3B" value={formData.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"/>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
           <label className="block text-gray-700 font-bold mb-2">Notes (Optional)</label>
           <textarea name="notes" rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm resize-none" value={formData.notes} onChange={handleChange}/>
        </div>

        {/* Notify */}
        <div className="mb-8 flex items-center gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <input type="checkbox" id="notify" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"/>
          <div className="flex flex-col">
              <label htmlFor="notify" className="text-gray-800 font-bold cursor-pointer select-none">Notify Staff via Email/SMS</label>
              <p className="text-xs text-gray-500 mt-1">Alert will be sent to <b>{selectedStaff?.email || "their email"}</b> and <b>{selectedStaff?.contact || "phone"}</b>.</p>
          </div>
        </div>

        {/* Footer Actions */}
        {!conflict && (
            <div className="flex justify-end gap-4 border-t pt-6">
            <button onClick={() => navigate('/shift-planner')} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
            <button onClick={() => handleAssign('NORMAL')} disabled={isSubmitting} className={`px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {isSubmitting ? 'Processing...' : 'Assign Shift'}
                {!isSubmitting && <FaCheckCircle size={16} />}
            </button>
            </div>
        )}
      </div>
    </div>
  );
}

export default assignShift;