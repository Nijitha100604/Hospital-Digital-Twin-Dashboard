import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { 
  Calendar, ChevronLeft, ChevronRight, Search, CheckCircle, 
  Plus, X, Clock, Save, Trash2, Loader2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StaffContext } from "../../context/StaffContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

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

const getLocalYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function ShiftPlanner() {
  const navigate = useNavigate();
  // Using Combined StaffContext
  const { staffs, fetchStaffs, shifts, fetchShifts, leaves, fetchLeaves } = useContext(StaffContext);
  const { token, backendUrl, userData } = useContext(AppContext); // Added userData

  /* -------------------- STATES -------------------- */
  // Removed viewMode state since we only want Weekly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [daysToDisplay, setDaysToDisplay] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null); 
  const [editData, setEditData] = useState({ 
    type: "Morning", 
    startVal: "09:00", startAmpm: "AM",
    endVal: "05:00", endAmpm: "PM"
  });

  // --- CHECK ADMIN ROLE ---
  const isAdmin = userData?.designation === 'Admin';

  const shiftTypes = {
    Morning: { label: "Morning", defaultTime: "08:00 - 16:00", style: "bg-blue-50 text-blue-600 border-blue-100" },
    Evening: { label: "Evening", defaultTime: "16:00 - 00:00", style: "bg-orange-50 text-orange-600 border-orange-100" },
    Night: { label: "Night", defaultTime: "00:00 - 08:00", style: "bg-purple-50 text-purple-600 border-purple-100" },
    Available: { label: "Available", defaultTime: "", style: "bg-green-50 text-green-700 border-green-100" },
    Leave: { label: "On Leave", defaultTime: "", style: "bg-red-50 text-red-600 border-red-200 font-bold" }, 
  };

  const shiftKeys = Object.keys(shiftTypes);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (token) {
        if(staffs.length === 0) fetchStaffs();
        fetchShifts(); 
        fetchLeaves(); 
    }
  }, [token]);

  // --- SAVE / UPDATE SHIFT ---
  const handleSaveShift = async () => {
    if(!selectedCell) return;

    const start24 = to24Hour(editData.startVal, editData.startAmpm);
    const end24 = to24Hour(editData.endVal, editData.endAmpm);
    const dateString = getLocalYYYYMMDD(selectedCell.dateObj);

    const payload = {
        staffId: selectedCell.staff.staffId,
        date: dateString, 
        shiftType: editData.type,
        startTime: start24,
        endTime: end24,
        location: "General Ward",
        notes: "Updated via Planner",
        notified: true
    };

    setLoading(true);
    try {
        let response;
        if (selectedCell.existingShiftId) {
            response = await axios.put(`${backendUrl}/api/shift/update/${selectedCell.existingShiftId}`, payload, { headers: { token } });
        } else {
            response = await axios.post(`${backendUrl}/api/shift/add-shift`, { ...payload, isExtraDuty: false }, { headers: { token } });
        }
        
        if (response.data.success) {
            toast.success("Schedule Updated");
            await fetchShifts();
            setSelectedCell(null);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Error saving shift");
    } finally {
        setLoading(false);
    }
  };

  // --- REMOVE SHIFT ---
  const handleRemoveShift = async () => {
    if(!selectedCell || !selectedCell.existingShiftId) return;
    if(!window.confirm("Remove this shift?")) return;

    setLoading(true);
    try {
        const { data } = await axios.delete(`${backendUrl}/api/shift/delete/${selectedCell.existingShiftId}`, { headers: { token } });
        if(data.success) {
            toast.success("Shift removed");
            await fetchShifts();
            setSelectedCell(null);
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error("Error removing shift");
    } finally {
        setLoading(false);
    }
  };

  /* -------------------- LOGIC -------------------- */
  const getShiftDetails = (staffId, dateObj) => {
    const dateStr = getLocalYYYYMMDD(dateObj);
    
    // 1. Check for Approved Leave FIRST
    const approvedLeave = leaves.find(l => {
        if(l.staffId !== staffId || l.status !== 'Approved') return false;
        
        const from = new Date(l.fromDate).toISOString().split('T')[0];
        const to = new Date(l.toDate).toISOString().split('T')[0];
        return dateStr >= from && dateStr <= to;
    });

    if (approvedLeave) {
        return {
            id: null, 
            key: "Leave",
            label: "On Leave",
            time: approvedLeave.leaveType, 
            style: shiftTypes["Leave"].style,
            isLeave: true
        };
    }

    // 2. Check for Shift
    const foundShift = shifts.find(s => s.staffId === staffId && s.date === dateStr);

    if (foundShift) {
        const config = shiftTypes[foundShift.shiftType] || shiftTypes["Morning"];
        return { 
            id: foundShift._id, 
            key: foundShift.shiftType, 
            label: foundShift.shiftType, 
            time: `${foundShift.startTime} - ${foundShift.endTime}`, 
            style: config.style 
        };
    }
    return { id: null, key: 'Available', label: 'Available', time: '', style: shiftTypes['Available'].style };
  };

  const handleCellClick = (staff, dateObj) => {
    // --- ADMIN ACCESS CHECK ---
    if (!isAdmin) return;

    const details = getShiftDetails(staff.staffId, dateObj);
    
    // Optional: Prevent editing if it's an approved leave
    if(details.isLeave) {
        toast.info(`Staff is on ${details.time}`);
        return;
    }

    let sTime = { time: "09:00", period: "AM" };
    let eTime = { time: "05:00", period: "PM" };

    if (details.key !== 'Available' && details.time) {
        const [start, end] = details.time.split(' - ');
        if(start && end) {
            sTime = to12Hour(start);
            eTime = to12Hour(end);
        }
    }

    setSelectedCell({ staff, dateObj, existingShiftId: details.id });
    setEditData({ 
      type: details.key !== 'Available' ? details.key : "Morning", 
      startVal: sTime.time, startAmpm: sTime.period,
      endVal: eTime.time, endAmpm: eTime.period
    });
  };

  const formatDateDisplay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return { day: days[date.getDay()], date: date.getDate() };
  };

  // --- Date Calculation (Weekly Only) ---
  useEffect(() => {
    const dates = [];
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(currentDate);
    monday.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d);
    }
    setDaysToDisplay(dates);
  }, [currentDate]);

  const filteredStaff = staffs.filter((s) => s.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-dvh w-full bg-gray-50 overflow-hidden font-sans text-slate-900">
      {/* HEADER */}
      <div className="flex-none bg-gray-50 z-30">
        <div className="px-4 py-4 md:px-6">
            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-slate-800">
                <Calendar className="text-purple-600" size={24}/> Shift Planner
            </h2>
        </div>
        <div className="px-4 pb-4 md:px-6">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                  <div className="flex items-center gap-1 md:gap-2 bg-gray-50 rounded-lg px-1 py-0.5 border border-gray-100 shrink-0">
                      <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); }} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronLeft size={16}/></button>
                      <span className="text-sm font-bold text-gray-800 min-w-[120px] text-center select-none truncate px-2">
                          {daysToDisplay.length > 0 ? `${daysToDisplay[0].toLocaleDateString(undefined, {month:'short', day:'numeric'})} - ${daysToDisplay[daysToDisplay.length-1].toLocaleDateString(undefined, {month:'short', day:'numeric'})}` : 'Loading...'}
                      </span>
                      <button onClick={() => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); }} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><ChevronRight size={16}/></button>
                  </div>
              </div>
              
              {/* --- ASSIGN SHIFT: ADMIN ONLY --- */}
              {isAdmin && (
                  <div className="flex-none ml-auto">
                      <button onClick={() => navigate('/assign-shift')} className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shadow-md transition-all active:scale-95 whitespace-nowrap"><Plus size={14} strokeWidth={3}/> <span className="hidden sm:inline">Assign Shift</span></button>
                  </div>
              )}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-hidden px-4 pb-4">
        <div className="bg-white h-full w-full rounded-xl shadow-sm border border-gray-200 overflow-auto relative">
            {loading && <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={32} /></div>}
            <table className="border-separate border-spacing-0 min-w-full">
            <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm">
                <tr>
                    <th className="sticky left-0 top-0 z-30 bg-white min-w-[160px] w-[200px] border-b border-r border-gray-200 p-3 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={14}/>
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Staff..." className="pl-9 w-full py-2 border border-gray-200 rounded-lg bg-gray-50 text-xs font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-gray-400"/>
                        </div>
                    </th>
                    {daysToDisplay.map((d, i) => {
                        const { day, date } = formatDateDisplay(d);
                        const isToday = new Date().toDateString() === d.toDateString();
                        return <th key={i} className={`min-w-[100px] border-b border-gray-200 py-3 text-center ${isToday ? 'bg-purple-50/50' : 'bg-white'}`}><div className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? 'text-purple-600' : 'text-gray-400'}`}>{day}</div><div className={`text-lg font-bold ${isToday ? 'text-purple-800' : 'text-slate-700'}`}>{date}</div></th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {filteredStaff.map((staff) => (
                <tr key={staff.staffId} className="group hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50 border-b border-r border-gray-200 p-4 transition-colors shadow-[4px_0_8px_-2px_rgba(0,0,0,0.05)]">
                        <div className="font-bold text-sm text-slate-800 truncate max-w-[180px]">{staff.fullName}</div>
                        <div className="text-xs text-slate-500 font-medium">{staff.designation}</div>
                    </td>
                    {daysToDisplay.map((d, i) => {
                    const details = getShiftDetails(staff.staffId, d);
                    return (
                        <td key={i} className="p-1 border-b border-gray-100 h-[70px] min-w-[100px]">
                        <div className={`cursor-pointer h-full w-full rounded-lg flex flex-col items-center justify-center border transition-all hover:shadow-md hover:scale-[0.98] ${details.style}`} onClick={() => handleCellClick(staff, d)}>
                            {details.key === 'Available' ? <div className="flex items-center gap-1 opacity-70"><CheckCircle size={12}/> <span className="text-[10px] font-bold">Available</span></div> : <><div className="text-[10px] font-bold">{details.label}</div>{details.time && <div className="text-[9px] opacity-80 font-mono mt-0.5">{details.time}</div>}</>}
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

      {/* EDIT MODAL - Only renders if admin clicks and sets selectedCell */}
      {selectedCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            <div className={`p-5 pb-8 relative ${editData.type === 'Available' ? 'bg-emerald-600' : editData.type === 'Leave' ? 'bg-slate-500' : 'bg-purple-700'}`}>
                <button onClick={() => setSelectedCell(null)} className="cursor-pointer absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-white/20 hover:bg-white/30 rounded-full p-1.5"><X size={18}/></button>
                <div className="flex flex-col gap-1 text-white">
                    <span className="text-[10px] font-bold uppercase opacity-80 tracking-widest">Edit Schedule</span>
                    <h3 className="text-xl font-bold truncate">{selectedCell.staff.fullName}</h3>
                    <p className="text-sm font-medium opacity-90 flex items-center gap-2 mt-0.5"><Calendar size={14} className="opacity-70"/> {selectedCell.dateObj.toLocaleDateString(undefined, {weekday:'short', month:'short', day:'numeric'})}</p>
                </div>
            </div>
            <div className="p-5 -mt-4 bg-white rounded-t-2xl relative">
                <div className="mb-5">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wide">Select Shift Type</label>
                    <div className="relative">
                      <select className="cursor-pointer w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all appearance-none" value={editData.type} onChange={(e) => setEditData(prev => ({...prev, type: e.target.value}))}>
                          {shiftKeys.map(k => <option key={k} value={k}>{shiftTypes[k].label}</option>)}
                      </select>
                    </div>
                </div>
                {editData.type !== 'Available' && editData.type !== 'Leave' && (
                  <div className="mb-6">
                    <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-2 tracking-wide"><Clock size={12} /> Shift Timing</label>
                    <div className="flex items-center gap-2">
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all flex-1">
                            <input type="text" value={editData.startVal} onChange={(e) => setEditData({...editData, startVal: e.target.value})} className="w-full p-2.5 text-center font-bold text-slate-700 outline-none text-sm"/>
                            <select value={editData.startAmpm} onChange={(e) => setEditData({...editData, startAmpm: e.target.value})} className="cursor-pointer bg-gray-50 border-l border-gray-200 px-2 text-xs font-bold text-slate-500 outline-none hover:bg-gray-100"><option value="AM">AM</option><option value="PM">PM</option></select>
                        </div>
                        <span className="text-slate-300 font-bold">-</span>
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all flex-1">
                            <input type="text" value={editData.endVal} onChange={(e) => setEditData({...editData, endVal: e.target.value})} className="w-full p-2.5 text-center font-bold text-slate-700 outline-none text-sm"/>
                            <select value={editData.endAmpm} onChange={(e) => setEditData({...editData, endAmpm: e.target.value})} className="cursor-pointer bg-gray-50 border-l border-gray-200 px-2 text-xs font-bold text-slate-500 outline-none hover:bg-gray-100"><option value="AM">AM</option><option value="PM">PM</option></select>
                        </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                    {selectedCell.existingShiftId && (
                        <button onClick={handleRemoveShift} className="cursor-pointer flex-1 py-3 border border-red-100 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"><Trash2 size={14}/> Remove</button>
                    )}
                    <button onClick={handleSaveShift} className="cursor-pointer flex-[2] py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-100 transition-all flex items-center justify-center gap-2"><Save size={14}/> Save Changes</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiftPlanner;