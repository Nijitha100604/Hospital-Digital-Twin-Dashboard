import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  Plus, 
  X, 
  Clock, 
  Save, 
  Trash2 
} from "lucide-react";

// --- HELPER: Time Conversion ---
const to12Hour = (time24) => {
  if (!time24) return { time: "", period: "AM" };
  const [h, m] = time24.split(":");
  let hours = parseInt(h, 10);
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; 
  return { time: `${hours.toString().padStart(2, '0')}:${m}`, period };
};

const to24Hour = (time12, period) => {
  if (!time12) return "";
  const [h, m] = time12.split(":");
  let hours = parseInt(h, 10);
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${m}`;
};

function ShiftPlanner() {
  /* -------------------- STATES -------------------- */
  const [viewMode, setViewMode] = useState("Weekly"); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [daysToDisplay, setDaysToDisplay] = useState([]);
  
  // Modal & Data States
  const [selectedCell, setSelectedCell] = useState(null); 
  
  const [editData, setEditData] = useState({ 
    type: "", 
    startVal: "", startAmpm: "AM",
    endVal: "", endAmpm: "AM"
  });

  const [manualOverrides, setManualOverrides] = useState({});

  /* -------------------- CONFIG DATA -------------------- */
  const staffList = [
    { id: 1, name: "Dr. John Smith", role: "Doctor" },
    { id: 2, name: "Nurse Sarah Jones", role: "Nurse" },
    { id: 3, name: "Tech Mark Lee", role: "Technician" },
    { id: 4, name: "Joldir Elnath", role: "Admin" },
    { id: 5, name: "Patina Gruns", role: "Nurse" },
    { id: 6, name: "Ressasa John", role: "Support" },
    { id: 7, name: "Sarah Saralh", role: "Doctor" },
    { id: 8, name: "Dr. Emily White", role: "Doctor" },
    { id: 9, name: "Nurse Bob", role: "Nurse" },
    { id: 10, name: "Tech Mike", role: "Technician" },
  ];

  const shiftTypes = {
    Morning: { label: "Morning", defaultTime: "09:00 - 17:00", style: "bg-blue-50 text-blue-600 border-blue-100" },
    Evening: { label: "Evening", defaultTime: "17:00 - 01:00", style: "bg-orange-50 text-orange-600 border-orange-100" },
    Night: { label: "Night", defaultTime: "01:00 - 09:00", style: "bg-purple-50 text-purple-600 border-purple-100" },
    Available: { label: "Available", defaultTime: "", style: "bg-green-50 text-green-700 border-green-100" },
    Leave: { label: "Leave", defaultTime: "", style: "bg-gray-100 text-gray-500 border-gray-200" },
  };

  const shiftKeys = Object.keys(shiftTypes);

  /* -------------------- LOGIC -------------------- */
  const parseTimeRange = (timeString) => {
    if (!timeString || !timeString.includes("-")) return { start: "", end: "" };
    const parts = timeString.split("-").map(t => t.trim());
    return { start: parts[0] || "", end: parts[1] || "" };
  };

  const getShiftDetails = (staffId, date) => {
    const key = `${staffId}_${date.toDateString()}`;
    if (manualOverrides[key]) {
      const savedData = manualOverrides[key]; 
      const config = shiftTypes[savedData.type] || shiftTypes["Available"];
      return { key: savedData.type, label: config.label, time: savedData.time, style: config.style };
    }
    const algoKey = shiftKeys[(staffId + date.getDate() + date.getMonth()) % shiftKeys.length];
    const config = shiftTypes[algoKey];
    return { key: algoKey, label: config.label, time: config.defaultTime, style: config.style };
  };

  const handleCellClick = (staff, dateObj) => {
    const currentDetails = getShiftDetails(staff.id, dateObj);
    const { start, end } = parseTimeRange(currentDetails.time);
    const s = to12Hour(start);
    const e = to12Hour(end);

    setSelectedCell({ staff, dateObj });
    setEditData({ 
      type: currentDetails.key, 
      startVal: s.time, startAmpm: s.period,
      endVal: e.time, endAmpm: e.period
    });
  };

  const handleTypeChange = (newType) => {
    const defaultTime = shiftTypes[newType]?.defaultTime || "";
    const { start, end } = parseTimeRange(defaultTime);
    const s = to12Hour(start);
    const e = to12Hour(end);

    setEditData({ 
      ...editData,
      type: newType, 
      startVal: s.time, startAmpm: s.period,
      endVal: e.time, endAmpm: e.period
    });
  };

  const handleSaveShift = () => {
    if(!selectedCell) return;
    const key = `${selectedCell.staff.id}_${selectedCell.dateObj.toDateString()}`;
    
    let finalTime = "";
    if (editData.startVal && editData.endVal) {
      const start24 = to24Hour(editData.startVal, editData.startAmpm);
      const end24 = to24Hour(editData.endVal, editData.endAmpm);
      finalTime = `${start24} - ${end24}`;
    }

    setManualOverrides(prev => ({...prev, [key]: { type: editData.type, time: finalTime }}));
    setSelectedCell(null);
  };

  const handleRemoveShift = () => {
    if(!selectedCell) return;
    const key = `${selectedCell.staff.id}_${selectedCell.dateObj.toDateString()}`;
    setManualOverrides(prev => ({...prev, [key]: { type: "Available", time: "" }}));
    setSelectedCell(null);
  };

  /* -------------------- DATE ENGINE -------------------- */
  const formatDateDisplay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days[date.getDay()], date: date.getDate() };
  };

  useEffect(() => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (viewMode === "Weekly") {
      const day = currentDate.getDay();
      const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); 
      const monday = new Date(currentDate);
      monday.setDate(diff);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push(d);
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

  const filteredStaff = staffList.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  /* -------------------- RENDER -------------------- */
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">

      {/* --- HEADER (FIXED) --- */}
      {/* This section will NOT scroll. It stays pinned to the top. */}
      <div className="shrink-0 p-4 bg-gray-50 z-20">
        <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <Calendar className="text-purple-700" size={24}/> Shift Planner
            </h2>
        </div>
        
        {/* Controls Container: Fixed width constraint to prevent jumping in Monthly view */}
        <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 max-w-full">
            {/* LEFT: View Mode Toggle */}
            <div className="bg-gray-100 p-1 rounded-lg flex shrink-0">
                <button 
                  onClick={() => setViewMode("Weekly")} 
                  className={`cursor-pointer px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "Weekly" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setViewMode("Monthly")} 
                  className={`cursor-pointer px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === "Monthly" ? "bg-white shadow text-purple-700" : "text-gray-500 hover:text-gray-700"}`}
                >
                  Monthly
                </button>
            </div>
            
            {/* CENTER: Date Navigation */}
            <div className="flex items-center gap-2 px-3 shrink-0">
                <button 
                  onClick={() => { 
                    const d = new Date(currentDate); 
                    viewMode === "Weekly" ? d.setDate(d.getDate() - 7) : d.setMonth(d.getMonth() - 1); 
                    setCurrentDate(d); 
                  }} 
                  className="cursor-pointer p-2 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <ChevronLeft size={16}/>
                </button>
                <span className="text-sm font-semibold min-w-[140px] text-center select-none truncate">
                    {daysToDisplay.length > 0 ? viewMode === "Monthly" ? daysToDisplay[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : `${daysToDisplay[0].toLocaleDateString(undefined, {month:'short', day:'numeric'})} - ${daysToDisplay[daysToDisplay.length-1].toLocaleDateString(undefined, {month:'short', day:'numeric'})}` : 'Loading...'}
                </span>
                <button 
                  onClick={() => { 
                    const d = new Date(currentDate); 
                    viewMode === "Weekly" ? d.setDate(d.getDate() + 7) : d.setMonth(d.getMonth() + 1); 
                    setCurrentDate(d); 
                  }} 
                  className="cursor-pointer p-2 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <ChevronRight size={16}/>
                </button>
            </div>
            
            {/* RIGHT: Assign Button */}
            <button 
              onClick={() => alert('Navigate to assign shift page')} 
              className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm shrink-0"
            >
              <Plus size={14}/> Assign Shift
            </button>
        </div>
      </div>

      {/* --- TABLE AREA (SCROLLABLE) --- */}
      {/* overflow-auto here ensures only the table scrolls, independently of the header */}
      <div className="flex-1 px-4 pb-4 overflow-auto">
        <div className="inline-block min-w-full align-middle relative">
            <div className="bg-white rounded-xl shadow border border-gray-200">
                <table className="border-separate border-spacing-0 w-full">
                {/* HEADERS */}
                <thead className="bg-gray-50">
                    <tr>
                        {/* 1. SEARCH BOX (Fixed Corner) */}
                        {/* z-50 ensures it stays on top of everything when scrolling down AND right */}
                        <th className="sticky left-0 top-0 z-50 bg-white min-w-[200px] w-[250px] border-b border-r border-gray-100 p-3 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                <input 
                                  value={searchTerm} 
                                  onChange={(e) => setSearchTerm(e.target.value)} 
                                  placeholder="Search Staff..." 
                                  className="pl-9 w-full py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs focus:outline-none focus:border-purple-500"
                                />
                            </div>
                        </th>
                        
                        {/* 2. DATE HEADERS (Sticky Top) */}
                        {/* z-40 ensures they stay on top of body cells when scrolling down */}
                        {daysToDisplay.map((d, i) => {
                            const { day, date } = formatDateDisplay(d);
                            const isToday = new Date().toDateString() === d.toDateString();
                            return (
                            <th key={i} className={`sticky top-0 z-40 min-w-[120px] border-b border-gray-100 py-3 text-center ${isToday ? 'bg-purple-50' : 'bg-white'}`}>
                                <div className={`text-[10px] font-bold uppercase ${isToday ? 'text-purple-600' : 'text-gray-400'}`}>{day}</div>
                                <div className={`text-lg font-bold ${isToday ? 'text-purple-800' : 'text-gray-700'}`}>{date}</div>
                            </th>
                            );
                        })}
                    </tr>
                </thead>
                
                {/* BODY */}
                <tbody>
                    {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="group hover:bg-gray-50">
                        {/* 3. STAFF NAME (Sticky Left) */}
                        {/* z-30 ensures it stays on top of shift cells when scrolling right */}
                        <td className="sticky left-0 z-30 bg-white group-hover:bg-gray-50 border-b border-r border-gray-100 p-3 transition-colors shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                            <div className="font-bold text-sm text-gray-800">{staff.name}</div>
                            <div className="text-xs text-gray-500">{staff.role}</div>
                        </td>
                        
                        {/* 4. SHIFT CELLS (Scrollable) */}
                        {daysToDisplay.map((d, i) => {
                        const details = getShiftDetails(staff.id, d);
                        return (
                            <td key={i} className="p-1 border-b border-gray-100 h-[70px] min-w-[120px]">
                            <div 
                              className={`cursor-pointer h-full w-full rounded-lg flex flex-col items-center justify-center border transition-all hover:shadow-md ${details.style}`} 
                              onClick={() => handleCellClick(staff, d)}
                            >
                                {details.key === 'Available' ? (
                                    <div className="flex items-center gap-1"><CheckCircle size={12}/> <span className="text-xs font-bold">Available</span></div>
                                ) : (
                                    <>
                                        <div className="text-[11px] font-bold">{details.label}</div>
                                        {details.time && <div className="text-[9px] opacity-80">{details.time}</div>}
                                    </>
                                )}
                            </div>
                            </td>
                        );
                        })}
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {selectedCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className={`p-6 pb-8 relative ${editData.type === 'Available' ? 'bg-green-600' : editData.type === 'Leave' ? 'bg-gray-500' : 'bg-purple-700'}`}>
                <button 
                  onClick={() => setSelectedCell(null)} 
                  className="cursor-pointer absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-white/20 hover:bg-white/30 rounded-full p-2"
                >
                  <X size={16}/>
                </button>
                <div className="flex flex-col gap-1 text-white">
                    <span className="text-xs font-bold uppercase opacity-80 tracking-widest">Edit Schedule</span>
                    <h3 className="text-2xl font-bold">{selectedCell.staff.name}</h3>
                    <p className="text-sm font-medium opacity-90 flex items-center gap-2 mt-1">
                        <Calendar size={16} className="opacity-70"/> 
                        {selectedCell.dateObj.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})}
                    </p>
                </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 -mt-4 bg-white rounded-t-2xl relative">
                
                {/* 1. Shift Type Dropdown */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block tracking-wide">Select Shift Type</label>
                    <div className="relative">
                      <select 
                        className="cursor-pointer w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-base font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all appearance-none" 
                        value={editData.type} 
                        onChange={(e) => handleTypeChange(e.target.value)}
                      >
                          {shiftKeys.map(k => <option key={k} value={k}>{shiftTypes[k].label}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                </div>

                {/* 2. Shift Timing */}
                {editData.type !== 'Available' && editData.type !== 'Leave' && (
                  <div className="mb-8">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2 tracking-wide">
                      <Clock size={14} /> Shift Timing
                    </label>
                    
                    <div className="flex items-center justify-between gap-4">
                        {/* Start Time */}
                        <div className="flex-1">
                            <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                                <input 
                                  type="text" 
                                  value={editData.startVal} 
                                  onChange={(e) => setEditData({...editData, startVal: e.target.value})} 
                                  placeholder="09:00" 
                                  className="w-full p-3 text-center font-bold text-gray-700 outline-none"
                                />
                                <select 
                                  value={editData.startAmpm} 
                                  onChange={(e) => setEditData({...editData, startAmpm: e.target.value})}
                                  className="cursor-pointer bg-gray-100 border-l border-gray-300 px-2 text-sm font-semibold text-gray-600 outline-none hover:bg-gray-200"
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>

                        <span className="text-gray-400 font-bold">-</span>

                        {/* End Time */}
                        <div className="flex-1">
                             <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all">
                                <input 
                                  type="text" 
                                  value={editData.endVal} 
                                  onChange={(e) => setEditData({...editData, endVal: e.target.value})} 
                                  placeholder="05:00" 
                                  className="w-full p-3 text-center font-bold text-gray-700 outline-none"
                                />
                                <select 
                                  value={editData.endAmpm} 
                                  onChange={(e) => setEditData({...editData, endAmpm: e.target.value})}
                                  className="cursor-pointer bg-gray-100 border-l border-gray-300 px-2 text-sm font-semibold text-gray-600 outline-none hover:bg-gray-200"
                                >
                                  <option value="AM">AM</option>
                                  <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                  </div>
                )}

                {/* 3. Action Buttons */}
                <div className="flex gap-4">
                    <button 
                      onClick={handleRemoveShift} 
                      className="cursor-pointer flex-1 py-3.5 border border-red-100 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16}/> Clear
                    </button>
                    <button 
                      onClick={handleSaveShift} 
                      className="cursor-pointer flex-[2] py-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={16}/> Save Changes
                    </button>
                </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ShiftPlanner;