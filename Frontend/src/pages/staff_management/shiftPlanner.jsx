import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, FaChevronLeft, FaChevronRight, 
  FaSearch, FaCheckCircle, FaPlus, FaTimes, 
  FaUserClock, FaTrash, FaPen, FaClock 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

function shiftPlanner() {
  const navigate = useNavigate(); 
  
  // --- STATES ---
  const [viewMode, setViewMode] = useState("Weekly"); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [daysToDisplay, setDaysToDisplay] = useState([]);

  // Modal State
  const [selectedCell, setSelectedCell] = useState(null); // Stores: { staff, date, currentShift }
  
  // Override State: Stores manual changes { "staffId_dateString": "NewShiftType" }
  const [manualOverrides, setManualOverrides] = useState({});

  // --- 1. DATE UTILITIES ---
  const formatDateDisplay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  useEffect(() => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (viewMode === "Weekly") {
      const dayOfWeek = currentDate.getDay(); 
      const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const monday = new Date(currentDate);
      monday.setDate(diff);

      for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        dates.push(nextDay);
      }
    } else {
      const date = new Date(year, month, 1);
      while (date.getMonth() === month) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
      }
    }
    setDaysToDisplay(dates);
  }, [currentDate, viewMode]);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Weekly") newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "Weekly") newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // --- 2. DATA & CONFIG ---
  const staffList = [
    { id: 1, name: "Dr. John Smith", role: "Doctor" },
    { id: 2, name: "Nurse Sarah Jones", role: "Nurse" },
    { id: 3, name: "Tech Mark Lee", role: "Technician" },
    { id: 4, name: "Joldir Elnath", role: "Admin" },
    { id: 5, name: "Patina Gruns", role: "Nurse" },
    { id: 6, name: "Ressasa John", role: "Support" },
    { id: 7, name: "Sarah Saralh", role: "Doctor" },
    { id: 8, name: "Mike Ross", role: "Legal" },
    { id: 9, name: "Rachel Green", role: "Nurse" },
    { id: 10, name: "Monica Geller", role: "Chef" },
  ];

  const shiftTypes = {
    Morning: { label: "Morning", time: "09:00 AM - 05:00 PM", style: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500" },
    Evening: { label: "Evening", time: "05:00 PM - 01:00 AM", style: "bg-orange-50 text-orange-600 border-orange-100", dot: "bg-orange-500" },
    Night: { label: "Night", time: "01:00 AM - 09:00 AM", style: "bg-purple-50 text-purple-600 border-purple-100", dot: "bg-purple-500" },
    Available: { label: "Available", style: "bg-green-50 text-green-700 border-green-100 flex items-center justify-center gap-2 font-semibold", dot: "bg-green-500" },
    Leave: { label: "Leave", style: "bg-gray-100 text-gray-500 border-gray-200 flex items-center justify-center font-medium", dot: "bg-gray-400" },
  };

  const shiftKeys = Object.keys(shiftTypes);

  // --- 3. LOGIC ---
  
  // Logic: Check Overrides -> Fallback to Math Logic
  const getShiftForDate = (staffId, dateObj) => {
    const dateKey = `${staffId}_${dateObj.toDateString()}`; // Unique Key
    
    // 1. Check if user manually changed this cell
    if (manualOverrides[dateKey]) {
      return manualOverrides[dateKey];
    }

    // 2. Default Deterministic Logic
    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const uniqueVal = staffId + day + month;
    const index = uniqueVal % shiftKeys.length;
    return shiftKeys[index];
  };

  // Open Modal
  const handleCellClick = (staff, dateObj, currentShift) => {
    setSelectedCell({
      staff,
      dateObj,
      currentShift, // The shift type string (e.g., "Morning")
      tempShift: currentShift // For the edit dropdown
    });
  };

  // Save Changes from Modal
  const handleSaveChanges = () => {
    if (!selectedCell) return;
    const dateKey = `${selectedCell.staff.id}_${selectedCell.dateObj.toDateString()}`;
    
    setManualOverrides(prev => ({
      ...prev,
      [dateKey]: selectedCell.tempShift
    }));
    
    setSelectedCell(null); // Close modal
  };

  // Remove Shift (Set to Available)
  const handleRemoveShift = () => {
    if (!selectedCell) return;
    const dateKey = `${selectedCell.staff.id}_${selectedCell.dateObj.toDateString()}`;
    
    setManualOverrides(prev => ({
      ...prev,
      [dateKey]: "Available"
    }));
    
    setSelectedCell(null);
  };

  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderShiftCell = (type, staff, dateObj) => {
    const config = shiftTypes[type];
    
    const commonClasses = "h-full w-full rounded-lg border min-h-[60px] transition-all hover:shadow-md cursor-pointer relative group";
    
    if (type === "Available") {
      return (
        <div onClick={() => handleCellClick(staff, dateObj, type)} className={`${commonClasses} ${config.style}`}>
           <div className="flex items-center gap-2"><FaCheckCircle size={14} /> Available</div>
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
        </div>
      );
    }
    if (type === "Leave") {
      return (
        <div onClick={() => handleCellClick(staff, dateObj, type)} className={`${commonClasses} ${config.style} opacity-75`}>
           Leave
           <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
        </div>
      );
    }
    return (
      <div onClick={() => handleCellClick(staff, dateObj, type)} className={`${commonClasses} ${config.style} p-1 flex flex-col justify-center items-center text-center`}>
        <span className="font-semibold text-xs block">{config.label}</span>
        <span className="text-[9px] opacity-80 block mt-0.5">{config.time}</span>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity" />
      </div>
    );
  };

  const getHeaderDateRange = () => {
    if (daysToDisplay.length === 0) return "";
    const start = daysToDisplay[0];
    const end = daysToDisplay[daysToDisplay.length - 1];
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    
    if (viewMode === 'Monthly') {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] p-4 bg-gray-50 font-sans relative">
      
      {/* --- 1. HEADER --- */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <FaCalendarAlt className="text-gray-700" size={20} />
          <h2 className="text-2xl font-bold text-gray-800">Shift Planner</h2>
        </div>
        <p className="text-gray-500 text-sm">Plan and manage staff shifts weekly or monthly.</p>

        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="bg-gray-100 p-1 rounded-lg flex shrink-0">
            <button onClick={() => setViewMode("Weekly")} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "Weekly" ? "bg-white text-purple-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-800"}`}>Weekly</button>
            <button onClick={() => setViewMode("Monthly")} className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${viewMode === "Monthly" ? "bg-white text-purple-700 shadow-sm font-bold" : "text-gray-500 hover:text-gray-800"}`}>Monthly</button>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 bg-white border border-gray-200 px-2 sm:px-4 py-2 rounded-lg shadow-sm w-full sm:w-auto justify-between sm:justify-center">
            <button onClick={handlePrev} className="text-gray-400 hover:text-purple-700 transition-colors p-2 hover:bg-purple-50 rounded-full"><FaChevronLeft /></button>
            <div className="flex items-center gap-2 font-semibold text-gray-700 min-w-[140px] sm:min-w-[200px] justify-center select-none text-sm sm:text-base">
              <FaCalendarAlt className="text-gray-500 hidden sm:block" />
              <span>{getHeaderDateRange()}</span>
            </div>
            <button onClick={handleNext} className="text-gray-400 hover:text-purple-700 transition-colors p-2 hover:bg-purple-50 rounded-full"><FaChevronRight /></button>
          </div>

          <button onClick={() => navigate('/assign-shift')} className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow transition-colors shrink-0 whitespace-nowrap">
            <FaPlus size={12} /> Assign Shift
          </button>
        </div>
      </div>

      {/* --- 2. GRID --- */}
      <div className="flex-1 bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative">
        <div className="absolute inset-0 overflow-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-40 bg-white shadow-sm">
              <tr>
                <th className="p-4 border-b border-r border-gray-200 min-w-[300px] bg-white sticky left-0 z-50">
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search Staff Name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-sm"/>
                  </div>
                </th>
                {daysToDisplay.map((dateObj, index) => {
                  const { day, date } = formatDateDisplay(dateObj);
                  const isToday = new Date().toDateString() === dateObj.toDateString();
                  return (
                    <th key={index} className={`p-3 border-b border-gray-200 min-w-[130px] ${isToday ? 'bg-purple-50' : 'bg-gray-50'}`}>
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-bold uppercase tracking-wide ${isToday ? 'text-purple-600' : 'text-gray-400'}`}>{day}</span>
                        <span className={`text-xl font-bold mt-1 ${isToday ? 'text-purple-800' : 'text-gray-700'}`}>{date}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => (
                  <tr key={staff.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b border-r border-gray-200 bg-white sticky left-0 z-30 group-hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-sm">{staff.name}</span>
                        <span className="text-xs text-gray-500 font-medium">{staff.role}</span>
                      </div>
                    </td>
                    {daysToDisplay.map((dateObj, idx) => {
                      const shiftType = getShiftForDate(staff.id, dateObj);
                      return (
                        <td key={idx} className="p-2 border-b border-gray-100 align-top min-w-[130px]">
                          {renderShiftCell(shiftType, staff, dateObj)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                 <tr><td colSpan={daysToDisplay.length + 1} className="p-12 text-center text-gray-500 bg-gray-50">No staff found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 3. SHIFT DETAILS MODAL --- */}
      {selectedCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 transition-all">
            
            {/* Modal Header (Color coded based on shift) */}
            <div className={`p-6 text-white relative ${selectedCell.currentShift === 'Available' ? 'bg-green-600' : selectedCell.currentShift === 'Leave' ? 'bg-gray-500' : 'bg-purple-700'}`}>
              <button 
                onClick={() => setSelectedCell(null)} 
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition"
              >
                <FaTimes size={18} />
              </button>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {selectedCell.dateObj.getDate()}
                <span className="text-lg font-normal opacity-90">{selectedCell.dateObj.toLocaleDateString('en-US', { month: 'long' })}</span>
              </h3>
              <p className="text-white/80 text-sm mt-1">{selectedCell.dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Staff Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                  <FaUserClock size={24} />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-lg leading-tight">{selectedCell.staff.name}</p>
                  <p className="text-purple-600 text-sm font-medium">{selectedCell.staff.role}</p>
                </div>
              </div>

              {/* Edit Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Change Shift Status</label>
                
                <div className="relative">
                  <select
                    value={selectedCell.tempShift}
                    onChange={(e) => setSelectedCell(prev => ({ ...prev, tempShift: e.target.value }))}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-purple-500 font-medium cursor-pointer"
                  >
                    {shiftKeys.map(key => (
                       <option key={key} value={key}>{shiftTypes[key].label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <FaPen size={12} />
                  </div>
                </div>

                {/* Show Time if applicable */}
                {shiftTypes[selectedCell.tempShift].time && (
                   <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                     <FaClock className="text-gray-400" />
                     <span>{shiftTypes[selectedCell.tempShift].time}</span>
                   </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex gap-3">
               <button 
                 onClick={handleRemoveShift}
                 className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-red-500 font-semibold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
               >
                 <FaTrash size={14} /> Remove
               </button>
               <button 
                 onClick={handleSaveChanges}
                 className="flex-[2] py-2.5 px-4 bg-purple-700 text-white font-bold rounded-xl hover:bg-purple-800 shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2"
               >
                 <FaCheckCircle size={14} /> Update Shift
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default shiftPlanner;