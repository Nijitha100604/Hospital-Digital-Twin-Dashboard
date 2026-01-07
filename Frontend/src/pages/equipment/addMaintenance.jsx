import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaTools, FaSave, FaExclamationCircle, FaUserMd } from "react-icons/fa";
import { equipment_records } from "../../data/equipment";
import { staffList } from "../../data/staffList"; // Make sure to import staffList
import { toast } from "react-toastify";

const AddMaintenance = ({ onClose, equipmentIdProp }) => {
  const navigate = useNavigate();

  /* Form State */
  const [equipmentId, setEquipmentId] = useState(equipmentIdProp || "");
  const [equipmentName, setEquipmentName] = useState("");
  
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  const [status, setStatus] = useState("Completed");
  const [nextScheduledService, setNextScheduledService] = useState("");
  
  /* Technician State */
  const [technicianInput, setTechnicianInput] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isSubstitute, setIsSubstitute] = useState(false);
  const [substituteName, setSubstituteName] = useState("");
  const [substituteContact, setSubstituteContact] = useState("");

  const [issueReported, setIssueReported] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");

  /* Auto-fill Equipment Name */
  useEffect(() => {
    if (equipmentId) {
      const equip = equipment_records.find(e => e.equipmentId === equipmentId);
      if (equip) setEquipmentName(equip.equipmentName);
      else setEquipmentName("");
    }
  }, [equipmentId]);

  /* Handle Technician Selection */
  const handleTechnicianChange = (e) => {
    const val = e.target.value;
    setTechnicianInput(val);

    // Check if "Other" or manual entry
    if (val === "Other / Substitute") {
      setIsSubstitute(true);
      setSelectedStaffId("");
      return;
    }

    // Try to find staff by ID or Name format "Name (ID)"
    const staff = staffList.find(s => 
      s.staffId === val || `${s.name} (${s.staffId})` === val
    );

    if (staff) {
      setIsSubstitute(false);
      setSelectedStaffId(staff.staffId);
      // You could store staff contact here if needed
    } else {
      // If typing a name not in list, assume substitute/external
      setIsSubstitute(true);
      setSelectedStaffId("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!equipmentId || !maintenanceDate || !nextScheduledService) {
      toast.error("Please fill all required fields (*)");
      return;
    }

    if (isSubstitute && (!substituteName || !substituteContact)) {
      toast.error("Please provide Substitute Technician Name and Contact");
      return;
    }

    if (!isSubstitute && !selectedStaffId) {
       // Allow manual text if it's not strictly requiring ID, 
       // but here we enforce either a valid ID selection OR filling substitute fields
       if(!technicianInput) {
         toast.error("Please select a technician");
         return;
       }
    }

    // --- LOGIC TO UPDATE DB (Mock) ---
    // In a real app: 
    // 1. POST to /api/maintenance-log
    // 2. PUT to /api/equipment/:id (to update last/next service dates)
    
    toast.success("Maintenance logged successfully!");
    
    // Close Modal first
    if(onClose) onClose();

    // Navigate to Maintenance Log Page
    navigate("/maintenance-log"); 
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-fuchsia-900 p-5 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaTools /> Add Maintenance Entry
            </h2>
            <p className="text-fuchsia-200 text-sm mt-1">Record activity & update schedule</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          <form id="maintenance-form" onSubmit={handleSubmit}>
            
            {/* 1. Equipment Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                <FaTools className="text-blue-600" /> Equipment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Equipment ID <span className="text-red-500">*</span></label>
                  <input 
                    list="equip-ids" 
                    value={equipmentId} 
                    onChange={(e) => setEquipmentId(e.target.value)}
                    placeholder="Select or Type ID"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm bg-white"
                  />
                  <datalist id="equip-ids">
                    {equipment_records.map(e => <option key={e.equipmentId} value={e.equipmentId} />)}
                  </datalist>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Equipment Name</label>
                  <input 
                    type="text" 
                    value={equipmentName} 
                    disabled 
                    placeholder="Auto-filled"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Technician Info */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mt-6">
              <h3 className="text-purple-800 font-bold mb-4 flex items-center gap-2">
                <FaUserMd className="text-purple-600" /> Technician Information
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Assign Technician <span className="text-red-500">*</span></label>
                  <input 
                    list="staff-list" 
                    value={technicianInput}
                    onChange={handleTechnicianChange}
                    placeholder="Search by Name or ID..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                  />
                  <datalist id="staff-list">
                    <option value="Other / Substitute">External / Substitute Technician</option>
                    {staffList.map(s => (
                      <option key={s.staffId} value={`${s.name} (${s.staffId})`}>
                        {s.designation} - {s.department}
                      </option>
                    ))}
                  </datalist>
                </div>

                {/* Conditional Fields for Substitute */}
                {isSubstitute && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in bg-white p-4 rounded-lg border border-purple-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Substitute Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={substituteName}
                        onChange={(e) => setSubstituteName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Contact Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        value={substituteContact}
                        onChange={(e) => setSubstituteContact(e.target.value)}
                        placeholder="Enter mobile number"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Maintenance Details */}
            <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5 mt-6">
              <h3 className="text-fuchsia-800 font-bold mb-4 flex items-center gap-2">
                <FaSave className="text-fuchsia-600" /> Work Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Maintenance Date <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm bg-white"
                  >
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>Pending Parts</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Duration (Hours)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 2.5"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Cost (₹)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Next Scheduled Service <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={nextScheduledService}
                    onChange={(e) => setNextScheduledService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm"
                  />
                  <p className="text-[10px] text-gray-400">This date will update the Equipment Registry automatically.</p>
                </div>

              </div>
            </div>

            {/* 4. Issues & Actions */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mt-6">
              <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                <FaExclamationCircle className="text-orange-600" /> Issue & Actions
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Issue / Problem Reported</label>
                  <textarea 
                    rows="2"
                    placeholder="Describe the issue or reason for maintenance..."
                    value={issueReported}
                    onChange={(e) => setIssueReported(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Actions Taken</label>
                  <textarea 
                    rows="2"
                    placeholder="Describe the actions taken to resolve the issue..."
                    value={actionsTaken}
                    onChange={(e) => setActionsTaken(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="maintenance-form"
            className="px-6 py-2.5 rounded-lg bg-fuchsia-900 text-white font-medium hover:bg-fuchsia-800 transition-colors shadow-md flex items-center gap-2"
          >
            <FaSave /> Save Entry
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMaintenance;