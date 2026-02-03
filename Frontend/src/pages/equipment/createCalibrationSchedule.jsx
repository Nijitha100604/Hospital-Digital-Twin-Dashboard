import React, { useState, useContext } from "react";
import { FaTimes, FaCalendarAlt, FaSave } from "react-icons/fa";
import { EquipmentContext } from "../../context/EquipmentContext"; 
import { toast } from "react-toastify";

const CreateCalibrationSchedule = ({ onClose }) => {
  const { equipments, updateEquipment } = useContext(EquipmentContext);

  /* Form State */
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [lastCalibration, setLastCalibration] = useState("");
  const [nextCalibration, setNextCalibration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEquipmentChange = (e) => {
    const inputValue = e.target.value;
    setEquipmentId(inputValue);
    
    const equip = equipments.find(item => item.equipmentId === inputValue);
    
    if(equip) {
      setEquipmentName(equip.basicInfo.equipmentName);
    } else {
      setEquipmentName(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!equipmentId || !lastCalibration || !nextCalibration) {
        toast.error("Please fill all required fields");
        return;
    }

    const isValidEquipment = equipments.some(e => e.equipmentId === equipmentId);
    if(!isValidEquipment) {
        toast.error("Invalid Equipment ID selected");
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("lastService", lastCalibration);
    formData.append("nextService", nextCalibration);

    // 4. Call API
    const success = await updateEquipment(equipmentId, formData);

    if (success) {
      toast.success(`Calibration schedule updated for ${equipmentId}`);
      onClose();
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-fuchsia-900 p-4 md:p-6 flex justify-between items-center text-white shrink-0 sticky top-0 z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Update Calibration Schedule</h2>
            <p className="text-fuchsia-200 text-xs md:text-sm mt-1">Set new service dates for equipment</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 cursor-pointer hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6">
          
          {/* Section: Equipment Info */}
          <div className="p-4 md:p-6 bg-blue-50 border border-blue-100 rounded-xl relative">
            
            <div className="flex items-center gap-3 mb-6 text-blue-800 font-bold text-base md:text-lg border-b border-blue-200 pb-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                <FaCalendarAlt />
              </div>
              <h3>Equipment & Schedule Information</h3>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Equipment ID Input (Searchable) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Equipment ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    list="equipment-options"
                    value={equipmentId}
                    onChange={handleEquipmentChange}
                    placeholder="Type or Select ID..."
                    className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-sm bg-white shadow-sm placeholder-gray-400"
                  />
                  {/* Datalist populated from Context */}
                  <datalist id="equipment-options">
                    {equipments.map(e => (
                      <option key={e.equipmentId} value={e.equipmentId}>
                        {e.basicInfo?.equipmentName}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Equipment Name (Read Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Equipment Name
                </label>
                <input 
                  type="text" 
                  value={equipmentName} 
                  disabled 
                  placeholder="Auto-filled based on ID"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 outline-none text-sm cursor-not-allowed" 
                />
              </div>

              {/* Last Calibration */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Last Calibration Date <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={lastCalibration}
                  onChange={(e) => setLastCalibration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-sm text-gray-700 shadow-sm" 
                />
              </div>

              {/* Next Due */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Next Calibration Due <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  value={nextCalibration}
                  onChange={(e) => setNextCalibration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 outline-none text-sm text-gray-700 shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full cursor-pointer sm:w-auto px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full cursor-pointer sm:w-auto px-6 py-2.5 rounded-lg bg-fuchsia-900 text-white font-medium hover:bg-fuchsia-800 transition-colors flex items-center justify-center gap-2 shadow-md focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-1 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Update Schedule"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateCalibrationSchedule;