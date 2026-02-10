import React, { useState, useContext, useEffect } from "react";
import { 
  Calendar, Search, User, CheckCircle, 
  ChevronDown, Plus, X, Send, Loader2, Clock, Lock
} from "lucide-react";
import { StaffContext } from "../../context/StaffContext"; 
import { AppContext } from "../../context/AppContext"; 
import AccessDenied from "../../components/AccessDenied"; // Import AccessDenied

// Helper for today's date YYYY-MM-DD
const getToday = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("Attendance"); 
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [searchTerm, setSearchTerm] = useState("");

  // --- CONTEXT ---
  const { 
    staffs, leaves, attendance, 
    fetchLeaves, applyForLeave, updateLeaveStatus, 
    fetchAttendance, markAttendance,
    loading 
  } = useContext(StaffContext);

  const { userData } = useContext(AppContext); 

  // --- SECURITY CHECK: IS ADMIN? ---
  const isAdmin = userData?.designation === 'Admin';

  // --- FORM STATE ---
  const [applyForm, setApplyForm] = useState({
    staffId: "", name: "", leaveType: "Sick Leave", fromDate: "", toDate: "", reason: "", isEmergency: false
  });

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchLeaves();
    fetchAttendance(selectedDate);
  }, [selectedDate]); 

  // --- ATTENDANCE MERGE LOGIC ---
  const attendanceList = staffs.map(staff => {
    const record = attendance.find(a => a.staffId === staff.staffId);
    return {
        ...staff,
        status: record ? record.status : "Absent", 
        checkIn: record ? record.checkIn : "-",
        checkOut: record ? record.checkOut : "-"
    };
  }).filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Counts
  const presentCount = attendanceList.filter(a => a.status === 'Present').length;
  const absentCount = attendanceList.filter(a => a.status === 'Absent' || a.status === 'Leave').length;

  // --- HANDLERS ---
  const handleMarkStatus = (staffId, status) => {
    markAttendance({
        staffId,
        date: selectedDate,
        status,
        checkIn: status === 'Present' ? "09:00 AM" : "-",
        checkOut: status === 'Present' ? "05:00 PM" : "-"
    });
  };

  const handleStaffSelect = (e) => {
    const selectedId = e.target.value;
    const staff = staffs.find(s => s.staffId === selectedId);
    setApplyForm({ ...applyForm, staffId: selectedId, name: staff ? staff.fullName : "" });
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if(!applyForm.staffId || !applyForm.fromDate || !applyForm.toDate) return alert("Fill all fields");
    const success = await applyForLeave(applyForm);
    if(success) {
        setShowApplyModal(false);
        setApplyForm({ staffId: "", name: "", leaveType: "Sick Leave", fromDate: "", toDate: "", reason: "", isEmergency: false });
    }
  };

  // --- RENDER HELPERS ---
  const getStatusColor = (status) => {
    switch(status) {
        case "Present": return "bg-green-100 text-green-700 border-green-200";
        case "Absent": return "bg-red-100 text-red-700 border-red-200";
        case "Late": return "bg-yellow-100 text-yellow-700 border-yellow-200";
        default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLeaveBadge = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const leaveHistory = leaves.filter(l => l.status !== 'Pending');

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-purple-700" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Attendance & Leave</h1>
        </div>
        
        {/* --- APPLY LEAVE: ACCESSIBLE TO ALL --- */}
        <button onClick={() => setShowApplyModal(true)} className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2">
          <Plus size={18} /> Apply Leave
        </button>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6">
        {["Attendance", "Leave"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-bold text-sm relative ${activeTab === tab ? "text-purple-700" : "text-gray-500"}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-700 rounded-t-full"></div>}
            </button>
        ))}
      </div>

      {loading && <div className="flex justify-center p-10"><Loader2 className="animate-spin text-purple-600"/></div>}

      {/* ================= TAB 1: ATTENDANCE (VIEW ALL / EDIT ADMIN) ================= */}
      {activeTab === "Attendance" && (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm font-bold text-gray-600">Date:</span>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-sm font-medium outline-none text-gray-800 bg-transparent"/>
                        </div>
                    </div>
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input type="text" placeholder="Search Staff..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"/>
                    </div>
                </div>
                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 min-w-[140px] text-center">
                        <span className="text-gray-500 text-xs font-bold uppercase">Present</span>
                        <p className="text-3xl font-bold text-green-600 mt-1">{presentCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 min-w-[140px] text-center">
                        <span className="text-gray-500 text-xs font-bold uppercase">Absent</span>
                        <p className="text-3xl font-bold text-red-600 mt-1">{absentCount}</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Staff</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Dept</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Time</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendanceList.map((row) => (
                            <tr key={row.staffId} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-bold text-gray-800 text-sm">{row.fullName}</p>
                                    <p className="text-xs text-gray-500">{row.staffId}</p>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{row.department}</td>
                                <td className="p-4 text-sm text-gray-600 text-center font-mono">{row.checkIn} - {row.checkOut}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(row.status)}`}>{row.status}</span>
                                </td>
                                
                                {/* --- MARK ATTENDANCE: ADMIN ONLY --- */}
                                <td className="p-4 flex justify-center gap-2">
                                    {isAdmin ? (
                                        row.status === 'Absent' ? (
                                            <button onClick={() => handleMarkStatus(row.staffId, 'Present')} className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">Mark Present</button>
                                        ) : (
                                            <button onClick={() => handleMarkStatus(row.staffId, 'Absent')} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 transition">Mark Absent</button>
                                        )
                                    ) : (
                                        <span className="text-xs text-gray-400 italic bg-gray-100 px-2 py-1 rounded">Read Only</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {attendanceList.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-500">No staff found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* ================= TAB 2: LEAVE (ADMIN ONLY MANAGEMENT) ================= */}
      {activeTab === "Leave" && (
        <div className="space-y-8">
            
            {/* --- ADMIN CHECK: Show Dashboard OR Access Denied --- */}
            {isAdmin ? (
                <>
                    {/* Pending Requests */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Pending Requests</h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Staff</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Dates</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Reason</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {pendingLeaves.length > 0 ? pendingLeaves.map(req => (
                                        <tr key={req._id}>
                                            <td className="p-4 text-sm font-bold text-gray-800">{req.name}</td>
                                            <td className="p-4 text-sm text-gray-600">{req.leaveType} {req.isEmergency && <span className="text-red-500 font-bold">(Urgent)</span>}</td>
                                            <td className="p-4 text-sm text-gray-600 text-center">{new Date(req.fromDate).toLocaleDateString()} - {new Date(req.toDate).toLocaleDateString()}</td>
                                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{req.reason}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => updateLeaveStatus(req._id, 'Approved')} className="px-3 py-1 bg-green-600 text-white text-xs rounded font-bold">Approve</button>
                                                <button onClick={() => updateLeaveStatus(req._id, 'Rejected')} className="px-3 py-1 bg-red-600 text-white text-xs rounded font-bold">Reject</button>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan="5" className="p-6 text-center text-gray-500">No pending requests</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* History Table */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">History</h3>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase">Staff</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Type</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Dates</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaveHistory.map((hist) => (
                                        <tr key={hist._id} className="hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-700 font-medium">{hist.name}</td>
                                            <td className="p-4 text-sm text-gray-600 text-center">{hist.leaveType}</td>
                                            <td className="p-4 text-sm text-gray-600 text-center">{new Date(hist.fromDate).toLocaleDateString()} - {new Date(hist.toDate).toLocaleDateString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLeaveBadge(hist.status)}`}>{hist.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                // --- NON-ADMIN VIEW: ACCESS DENIED COMPONENT ---
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-lg">
                        <AccessDenied />
                        <p className="text-center text-sm text-gray-500 mt-4">
                            You can still apply for leave using the button in the top right corner.
                        </p>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* APPLY MODAL (Accessible to All) */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-purple-700 p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Apply Leave</h2>
                    <button onClick={() => setShowApplyModal(false)}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmitLeave} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Staff</label>
                        <select className="w-full p-2 border rounded" value={applyForm.staffId} onChange={handleStaffSelect}>
                            <option value="">-- Select Staff --</option>
                            {staffs.map(s => <option key={s.staffId} value={s.staffId}>{s.fullName} ({s.staffId})</option>)}
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">From</label>
                            <input type="date" className="w-full p-2 border rounded" value={applyForm.fromDate} onChange={e => setApplyForm({...applyForm, fromDate: e.target.value})}/>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">To</label>
                            <input type="date" className="w-full p-2 border rounded" value={applyForm.toDate} onChange={e => setApplyForm({...applyForm, toDate: e.target.value})}/>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Type</label>
                        <select className="w-full p-2 border rounded" value={applyForm.leaveType} onChange={e => setApplyForm({...applyForm, leaveType: e.target.value})}>
                            <option>Sick Leave</option>
                            <option>Casual Leave</option>
                            <option>Vacation</option>
                            <option>Emergency</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Reason</label>
                        <textarea className="w-full p-2 border rounded" rows="3" value={applyForm.reason} onChange={e => setApplyForm({...applyForm, reason: e.target.value})}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-purple-700 text-white font-bold py-3 rounded hover:bg-purple-800">Submit Request</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}