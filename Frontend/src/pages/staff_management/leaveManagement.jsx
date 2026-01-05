import React, { useState } from "react";
import { 
  Calendar, Search, User, CheckCircle, 
  ChevronDown, Plus, X, Send
} from "lucide-react";

/* -------------------- MOCK DATA -------------------- */
const staffDatabase = [
  { id: "S0001234", name: "Dr. John Smith", dept: "Cardiology", role: "Chief Doctor", email: "john@hospital.com" },
  { id: "S0001235", name: "Nurse Sarah Jones", dept: "Emergency", role: "Head Nurse", email: "sarah@hospital.com" },
  { id: "S0001236", name: "Mary Thomas", dept: "Neurology", role: "Nurse", email: "mary@hospital.com" },
  { id: "S0001237", name: "George", dept: "Radiology", role: "Technician", email: "george@hospital.com" },
  { id: "S0001238", name: "Mohan", dept: "Cardiology", role: "Intern", email: "mohan@hospital.com" },
  { id: "S0001239", name: "Tech Mark Lee", dept: "Laboratory", role: "Technician", email: "mark@hospital.com" },
];

const attendanceData = [
  { id: "S0001234", name: "Dr. John Smith", dept: "Cardiology", in: "08:55 AM", out: "05:00 PM", status: "Present" },
  { id: "S0001235", name: "Nurse Sarah Jones", dept: "Emergency", in: "09:10 AM", out: "-", status: "Late" },
  { id: "S0001236", name: "Mary Thomas", dept: "Neurology", in: "-", out: "-", status: "Leave" },
  { id: "S0001237", name: "George", dept: "Radiology", in: "09:10 AM", out: "-", status: "Late" },
  { id: "S0001238", name: "Mohan", dept: "Cardiology", in: "08:55 AM", out: "05:00 PM", status: "Present" },
  { id: "S0001238", name: "Venkat", dept: "Emergency", in: "09:00 AM", out: "-", status: "Present" },
  { id: "S0001238", name: "Smith", dept: "Cardiology", in: "08:55 AM", out: "05:00 PM", status: "Present" },
];

const leaveRequests = [
  { id: 1, name: "Tech Mark Lee", type: "Sick Leave", from: "Oct 21, 2025", to: "Oct 22, 2025", reason: "Flu", status: "Pending" },
  { id: 2, name: "Nurse Sarah Jones", type: "Casual Leave", from: "Oct 25, 2025", to: "Oct 26, 2025", reason: "Family Event", status: "Pending" },
];

const leaveHistory = [
  { id: 101, name: "Mary Thomas", type: "Vacation", from: "Oct 20, 2025", to: "Oct 24, 2025", status: "Approved" },
  { id: 102, name: "Mary Thomas", type: "Sick Leave", from: "Sep 10, 2025", to: "Sep 11, 2025", status: "Approved" },
];

/* -------------------- COMPONENT -------------------- */
export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("Attendance"); 
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStaffDetail, setSelectedStaffDetail] = useState(null);

  // Form State
  const [applyForm, setApplyForm] = useState({
    staffId: "",
    name: "",
    leaveType: "Sick Leave",
    fromDate: "",
    toDate: "",
    reason: "",
    isEmergency: false
  });

  // --- HANDLERS ---
  const handleViewDetails = (staff) => {
    const stats = {
      ...staff,
      presentDays: Math.floor(Math.random() * 25) + 5,
      absentDays: Math.floor(Math.random() * 5),
      lateDays: Math.floor(Math.random() * 3)
    };
    setSelectedStaffDetail(stats);
    setShowDetailModal(true);
  };

  const handleStaffSelect = (e) => {
    const selectedId = e.target.value;
    const staff = staffDatabase.find(s => s.id === selectedId);
    setApplyForm({
      ...applyForm,
      staffId: selectedId,
      name: staff ? staff.name : ""
    });
  };

  const handleSubmitLeave = (e) => {
    e.preventDefault();
    if(!applyForm.staffId || !applyForm.fromDate || !applyForm.toDate) {
      alert("Please fill in all required fields.");
      return;
    }

    let msg = `Leave Applied Successfully for ${applyForm.name}!`;
    if (applyForm.isEmergency) {
      msg += `\n\n🚨 URGENT: Notification sent to HR & Chief Doctor regarding emergency leave.`;
    }

    alert(msg);
    setShowApplyModal(false);
    setApplyForm({ staffId: "", name: "", leaveType: "Sick Leave", fromDate: "", toDate: "", reason: "", isEmergency: false });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Present": case "Approved": return "bg-green-100 text-green-700 border-green-200";
      case "Late": case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Leave": case "Reject": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="text-gray-800" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Attendance & Leave Management</h1>
        </div>
        
        {/* FIX APPLIED HERE: Added 'w-fit' and 'self-start md:self-auto' */}
        <button 
          onClick={() => setShowApplyModal(true)}
          className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all flex items-center gap-2 w-fit self-start md:self-auto"
        >
          <Plus size={18} /> Apply Leave
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("Attendance")}
          className={`cursor-pointer px-6 py-3 font-bold text-sm transition-all relative whitespace-nowrap ${activeTab === "Attendance" ? "text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
        >
          Attendance
          {activeTab === "Attendance" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("Leave")}
          className={`cursor-pointer px-6 py-3 font-bold text-sm transition-all relative whitespace-nowrap ${activeTab === "Leave" ? "text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
        >
          Leave Management
          {activeTab === "Leave" && <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800 rounded-t-full"></div>}
        </button>
      </div>

      {/* ==================== TAB 1: ATTENDANCE ==================== */}
      {activeTab === "Attendance" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <div className="flex flex-col xl:flex-row gap-6 mb-6">
            <div className="flex-1 flex flex-col gap-4">
               <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                    <span className="text-sm font-bold text-gray-600">Date:</span>
                    <input type="date" defaultValue="2025-10-20" className="cursor-pointer text-sm font-medium outline-none text-gray-800 bg-transparent"/>
                 </div>
                 <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm min-w-[200px]">
                    <span className="text-sm font-bold text-gray-600">Department:</span>
                    <select className="cursor-pointer text-sm font-medium outline-none text-gray-800 bg-transparent w-full">
                      <option>All Departments</option>
                      <option>Cardiology</option>
                      <option>Emergency</option>
                    </select>
                 </div>
               </div>
               
               <div className="relative w-full max-w-lg">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                  <input type="text" placeholder="Search Staff by Name or ID" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"/>
               </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex flex-col items-center justify-center min-w-[140px]">
                 <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Present</span>
                 <span className="text-4xl font-bold text-green-600 mt-1">07</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex flex-col items-center justify-center min-w-[140px] bg-red-50/50">
                 <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Absent</span>
                 <span className="text-4xl font-bold text-red-600 mt-1">01</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-gray-100/50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Staff ID</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Department</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Check-In</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Check-Out</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendanceData.map((row, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 font-mono">{row.id}</td>
                      <td className="p-4 text-sm font-bold text-gray-800">{row.name}</td>
                      <td className="p-4 text-sm text-gray-600">{row.dept}</td>
                      <td className="p-4 text-sm text-gray-600 text-center font-medium">{row.in}</td>
                      <td className="p-4 text-sm text-gray-600 text-center font-medium">{row.out}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleViewDetails(row)}
                          className="cursor-pointer text-gray-500 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded border border-gray-200 hover:border-purple-200 text-xs font-bold transition-all"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: LEAVE MANAGEMENT ==================== */}
      {activeTab === "Leave" && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                   <span className="text-sm font-bold text-gray-600">Date:</span>
                   <input type="date" defaultValue="2025-10-20" className="cursor-pointer text-sm font-medium outline-none text-gray-800 bg-transparent"/>
                </div>
                <div className="relative min-w-[200px]">
                   <select className="cursor-pointer w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none text-sm font-medium bg-white outline-none">
                     <option>All Departments</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14}/>
                </div>
             </div>
             <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input type="text" placeholder="Search Staff by Name or ID" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"/>
             </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3">Leave Requests</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-100/50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase">Staff Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase">Leave Type</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">From Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">To Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase">Reason</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaveRequests.map((req) => (
                      <tr key={req.id}>
                        <td className="p-4 text-sm text-gray-700 font-medium">{req.name}</td>
                        <td className="p-4 text-sm text-gray-600">{req.type}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{req.from}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{req.to}</td>
                        <td className="p-4 text-sm text-gray-600">{req.reason}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(req.status)}`}>{req.status}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button className="cursor-pointer px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition">Approve</button>
                            <button className="cursor-pointer px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition">Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
               <h3 className="text-lg font-bold text-gray-800">Leave History</h3>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                  <input type="text" placeholder="Search Staff Name" className="pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-md outline-none focus:border-purple-500 w-48"/>
               </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-gray-100/50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase">Staff Name</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Leave Type</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">From Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">To Date</th>
                      <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {leaveHistory.map((hist) => (
                      <tr key={hist.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700 font-medium">{hist.name}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{hist.type}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{hist.from}</td>
                        <td className="p-4 text-sm text-gray-600 text-center">{hist.to}</td>
                        <td className="p-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(hist.status)}`}>{hist.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: APPLY LEAVE (RESPONSIVE FIX) ==================== */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header (Fixed) */}
            <div className="bg-purple-700 p-6 flex justify-between items-center text-white shrink-0">
              <h2 className="text-xl font-bold">Apply Leave</h2>
              <button onClick={() => setShowApplyModal(false)} className="cursor-pointer hover:bg-white/20 p-2 rounded-full transition"><X size={20}/></button>
            </div>
            
            {/* Form Body (Scrollable) */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
               <form onSubmit={handleSubmitLeave} className="space-y-5">
                  {/* Staff Selection */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Staff</label>
                    <select 
                      className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                      value={applyForm.staffId}
                      onChange={handleStaffSelect}
                    >
                      <option value="">-- Choose Staff Member --</option>
                      {staffDatabase.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                    {applyForm.name && (
                       <p className="mt-1 text-sm text-purple-600 font-medium flex items-center gap-1"><User size={12}/> Selected: {applyForm.name}</p>
                    )}
                  </div>

                  {/* Dates Row */}
                  <div className="flex flex-col sm:flex-row gap-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">From Date</label>
                        <input 
                          type="date" 
                          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          value={applyForm.fromDate}
                          onChange={e => setApplyForm({...applyForm, fromDate: e.target.value})}
                        />
                     </div>
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">To Date</label>
                        <input 
                          type="date" 
                          className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                          value={applyForm.toDate}
                          onChange={e => setApplyForm({...applyForm, toDate: e.target.value})}
                        />
                     </div>
                  </div>

                  {/* Leave Type & Reason */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Leave Type</label>
                    <select 
                      className="cursor-pointer w-full p-3 border border-gray-300 rounded-lg bg-white outline-none"
                      value={applyForm.leaveType}
                      onChange={e => setApplyForm({...applyForm, leaveType: e.target.value})}
                    >
                      <option>Sick Leave</option>
                      <option>Casual Leave</option>
                      <option>Vacation</option>
                      <option>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reason</label>
                    <textarea 
                      rows="3" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                      placeholder="Reason for leave..."
                      value={applyForm.reason}
                      onChange={e => setApplyForm({...applyForm, reason: e.target.value})}
                    ></textarea>
                  </div>

                  {/* Emergency Toggle */}
                  <div className={`p-4 rounded-lg border flex items-start gap-3 transition-colors ${applyForm.isEmergency ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                    <input 
                      type="checkbox" 
                      id="emergency" 
                      checked={applyForm.isEmergency}
                      onChange={e => setApplyForm({...applyForm, isEmergency: e.target.checked})}
                      className="cursor-pointer mt-1 w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <div>
                       <label htmlFor="emergency" className={`font-bold block cursor-pointer ${applyForm.isEmergency ? 'text-red-700' : 'text-gray-700'}`}>Emergency Leave</label>
                       <p className="text-xs text-gray-500 mt-1">
                         Checking this will immediately notify the <span className="font-bold">HR</span> and <span className="font-bold">Chief Doctor</span> via SMS/Email.
                       </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-2">
                     <button type="button" onClick={() => setShowApplyModal(false)} className="cursor-pointer flex-1 py-3 text-red-600 font-bold bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition">Cancel</button>
                     <button type="submit" className="cursor-pointer flex-[2] py-3 text-white font-bold bg-purple-700 hover:bg-purple-800 rounded-lg shadow-lg shadow-purple-200 transition flex justify-center items-center gap-2">
                        <Send size={18} /> Submit Application
                     </button>
                  </div>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VIEW DETAILS ==================== */}
      {showDetailModal && selectedStaffDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center">
              <div className="bg-gray-50 p-6 border-b border-gray-200">
                 <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border-4 border-white shadow-sm">
                    {selectedStaffDetail.name.charAt(0)}
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">{selectedStaffDetail.name}</h2>
                 <p className="text-sm text-gray-500">{selectedStaffDetail.dept} • {selectedStaffDetail.id}</p>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <p className="text-3xl font-bold text-green-600">{selectedStaffDetail.presentDays}</p>
                    <p className="text-xs font-bold text-green-800 uppercase mt-1">Days Present</p>
                 </div>
                 <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <p className="text-3xl font-bold text-red-600">{selectedStaffDetail.absentDays}</p>
                    <p className="text-xs font-bold text-red-800 uppercase mt-1">Days Absent</p>
                 </div>
                 <div className="col-span-2 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-600">
                    Late Arrivals this month: <span className="font-bold text-gray-800">{selectedStaffDetail.lateDays}</span>
                 </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                 <button onClick={() => setShowDetailModal(false)} className="cursor-pointer w-full py-2.5 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900 transition">Close Details</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}