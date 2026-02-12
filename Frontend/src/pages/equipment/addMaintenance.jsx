import React, { useState, useEffect, useContext } from "react";
import { FaTimes, FaTools, FaSave, FaExclamationCircle, FaUserMd } from "react-icons/fa";
import { StaffContext } from "../../context/StaffContext";
import { EquipmentContext } from "../../context/EquipmentContext";
import { toast } from "react-toastify";

const AddMaintenance = ({ onClose, onSave, initialData, selectedEquipment }) => {
  
  const { staffs } = useContext(StaffContext);
  const { equipments, fetchEquipments, addMaintenanceLog } = useContext(EquipmentContext);

  /* Form State */
  const [equipmentInput, setEquipmentInput] = useState("");
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  
  const [maintenanceDate, setMaintenanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState("");
  const [cost, setCost] = useState("");
  
  const [status, setStatus] = useState("In Progress"); 
  
  const [nextScheduledService, setNextScheduledService] = useState("");
  
  const [technicianInput, setTechnicianInput] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [isSubstitute, setIsSubstitute] = useState(false);
  const [substituteName, setSubstituteName] = useState("");
  const [substituteContact, setSubstituteContact] = useState("");

  const [issueReported, setIssueReported] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");

  // Safety check for staffs array
  const technicians = (staffs || []).filter(s => s.designation === "Technician");

  useEffect(() => {
    
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEquipmentInput(`${initialData.equipmentName} (${initialData.equipmentId})`);
      setEquipmentId(initialData.equipmentId);
      setEquipmentName(initialData.equipmentName);
      setMaintenanceDate(initialData.maintenanceDate);
      setDuration(initialData.duration);
      setCost(initialData.cost);
      
      // Keep the status of the log being edited
      setStatus(initialData.status); 
      
      setNextScheduledService(initialData.nextScheduled);
      setIssueReported(initialData.issueReported);
      setActionsTaken(initialData.actionsTaken);
      
      setTechnicianInput(initialData.technicianName);
      const staff = staffs.find(s => s.fullName === initialData.technicianName);
      if (staff) {
        setSelectedStaffId(staff.staffId);
        setIsSubstitute(false);
      } else {
        setIsSubstitute(true);
        setSubstituteName(initialData.technicianName);
      }
    } 
    else if (selectedEquipment) {
      setEquipmentInput(`${selectedEquipment.basicInfo.equipmentName} (${selectedEquipment.equipmentId})`);
      setEquipmentId(selectedEquipment.equipmentId);
      setEquipmentName(selectedEquipment.basicInfo.equipmentName);
      
      // Auto-fill next service date if available
      if(selectedEquipment.serviceSchedule?.nextService) {
         setNextScheduledService(selectedEquipment.serviceSchedule.nextService);
      }
      
      // Ensure status is In Progress for new entries
      setStatus("In Progress");
    }
  }, [initialData, selectedEquipment, staffs]);

  const handleEquipmentChange = (e) => {
    const val = e.target.value;
    setEquipmentInput(val);

    const found = equipments.find(
      (eq) => 
        eq.equipmentId === val || 
        eq.basicInfo.equipmentName === val ||
        `${eq.basicInfo.equipmentName} (${eq.equipmentId})` === val
    );

    if (found) {
      setEquipmentId(found.equipmentId);
      setEquipmentName(found.basicInfo.equipmentName);
    } else {
      setEquipmentId(""); 
      setEquipmentName("");
    }
  };

  const handleTechnicianChange = (e) => {
    const val = e.target.value;
    setTechnicianInput(val);

    if (val === "Other / Substitute") {
      setIsSubstitute(true);
      setSelectedStaffId("");
      return;
    }

    const staff = technicians.find(s => 
      s.staffId === val || `${s.fullName} (${s.staffId})` === val
    );

    if (staff) {
      setIsSubstitute(false);
      setSelectedStaffId(staff.staffId);
    } else {
      setIsSubstitute(true);
      setSelectedStaffId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!equipmentId || !maintenanceDate || !nextScheduledService) {
      toast.error("Please fill all required fields (*)");
      return;
    }

    // Determine Final Technician Name
    let finalTechnicianName = technicianInput;
    if (!isSubstitute && selectedStaffId) {
        const staff = staffs.find(s => s.staffId === selectedStaffId);
        if(staff) finalTechnicianName = staff.fullName;
    } else if (isSubstitute) {
        finalTechnicianName = substituteName || technicianInput;
    }

    const formData = {
        equipmentId,
        equipmentName,
        maintenanceDate,
        technicianName: finalTechnicianName,
        duration,
        cost,
        status, 
        nextScheduled: nextScheduledService,
        issueReported,
        actionsTaken,
        ...(initialData && { logId: initialData.logId }) 
    };

    if (onSave) {
        onSave(formData);
    } else {
        const success = await addMaintenanceLog(formData);
        if (success) {
            await fetchEquipments(); 
            onClose();
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-fuchsia-900 p-5 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaTools /> {initialData ? "Update Maintenance Entry" : "Add Maintenance Entry"}
            </h2>
            <p className="text-fuchsia-200 text-sm mt-1">
                {initialData ? `Editing Log ID: ${initialData.logId}` : "Record activity & update schedule"}
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 cursor-pointer hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
          <form id="maintenance-form" onSubmit={handleSubmit}>
            
            {/*Equipment Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                <FaTools className="text-blue-600" /> Equipment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Select Equipment <span className="text-red-500">*</span></label>
                  <input 
                    list="equip-list" 
                    value={equipmentInput} 
                    onChange={handleEquipmentChange}
                    disabled={!!initialData || !!selectedEquipment} 
                    placeholder="Search by ID or Name"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 outline-none text-sm bg-white"
                  />
                  <datalist id="equip-list">
                    {equipments.map(e => (
                      <option key={e.equipmentId} value={`${e.basicInfo.equipmentName} (${e.equipmentId})`} />
                    ))}
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

            {/*Technician Info */}
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
                    {technicians.map(s => (
                      <option key={s.staffId} value={`${s.fullName} (${s.staffId})`}>
                        {s.department}
                      </option>
                    ))}
                  </datalist>
                </div>

                {isSubstitute && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in bg-white p-4 rounded-lg border border-purple-200">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Substitute Name</label>
                      <input type="text" value={substituteName} onChange={(e) => setSubstituteName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">Contact Number</label>
                      <input type="tel" value={substituteContact} onChange={(e) => setSubstituteContact(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/*Maintenance Details */}
            <div className="bg-fuchsia-50 border border-fuchsia-100 rounded-xl p-5 mt-6">
              <h3 className="text-fuchsia-800 font-bold mb-4 flex items-center gap-2">
                <FaSave className="text-fuchsia-600" /> Work Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Maintenance Date <span className="text-red-500">*</span></label>
                  <input type="date" value={maintenanceDate} onChange={(e) => setMaintenanceDate(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm bg-white">
                    <option>In Progress</option>
                    <option>Pending Parts</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Duration (Hrs)</label>
                  <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Cost (₹)</label>
                  <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Next Scheduled Service <span className="text-red-500">*</span></label>
                  <input type="date" value={nextScheduledService} onChange={(e) => setNextScheduledService(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
              </div>
            </div>

            {/*Issues */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 mt-6">
              <h3 className="text-orange-800 font-bold mb-4 flex items-center gap-2">
                <FaExclamationCircle className="text-orange-600" /> Issue & Actions
              </h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Issue Reported</label>
                  <textarea rows="2" value={issueReported} onChange={(e) => setIssueReported(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Actions Taken</label>
                  <textarea rows="2" value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm" />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 cursor-pointer rounded-lg border border-gray-300 text-gray-700 hover:bg-white">Cancel</button>
          <button type="submit" form="maintenance-form" className="px-6 py-2.5 cursor-pointer rounded-lg bg-fuchsia-900 text-white hover:bg-fuchsia-800 shadow-md flex items-center gap-2">
            <FaSave /> {initialData ? "Update Entry" : "Save Entry"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddMaintenance;