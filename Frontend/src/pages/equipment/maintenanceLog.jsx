import React, { useState, useMemo, useRef } from "react";
import { maintenance_log } from "../../data/maintenanceLog";
import { equipment_records } from "../../data/equipment";
import { staffList } from "../../data/staffList";
import { assets } from "../../assets/assets";
import AddMaintenance from "./AddMaintenance";
import { toPng } from "html-to-image"; 
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";

import {
  FaSearch,
  FaTools,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserCog,
  FaPlus,
  FaExclamationCircle,
  FaWrench,
  FaClock,
  FaCalendarCheck,
  FaHistory,
  FaFilter,
  FaFileAlt,
  FaTimes,
  FaPhone,
  FaEnvelope,
  FaDownload,
  FaEdit // Added Edit Icon
} from "react-icons/fa";

const MaintenanceLog = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // STATE MANAGEMENT FOR LOGS (To allow updates)
  const [logs, setLogs] = useState(maintenance_log); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null); // Track log being edited
  const [viewReportLog, setViewReportLog] = useState(null); 
  
  // --- Filtering Logic ---
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
        log.logId.toLowerCase().includes(search.toLowerCase()) ||
        log.technicianName.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, logs]);

  // --- Summary Statistics Logic ---
  const totalEntries = logs.length;
  const currentMonthEntries = logs.filter(log => {
    const logDate = new Date(log.maintenanceDate);
    const now = new Date();
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
  }).length;
  const totalCost = logs.reduce((acc, curr) => acc + Number(curr.cost), 0);
  const uniqueTechnicians = [...new Set(logs.map(log => log.technicianName))].length;

  // --- Handlers ---
  const handleAddClick = () => {
    setEditingLog(null); // Ensure we are in "Add" mode
    setIsModalOpen(true);
  };

  const handleEditClick = (log) => {
    setEditingLog(log); // Set the log to be edited
    setIsModalOpen(true);
  };

  const handleSaveLog = (formData) => {
    if (editingLog) {
      // UPDATE EXISTING
      setLogs(prevLogs => 
        prevLogs.map(log => log.logId === formData.logId ? formData : log)
      );
      toast.success("Log updated successfully");
    } else {
      // ADD NEW
      setLogs(prevLogs => [...prevLogs, formData]);
      toast.success("New log added successfully");
    }
    setIsModalOpen(false);
    setEditingLog(null);
  };

  // --- Helper for Status Colors ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending Parts": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // --- Helper to get Staff ID ---
  const getTechnicianDisplay = (name) => {
    const staff = staffList.find(s => s.name === name);
    return staff ? `${name} (${staff.staffId})` : name;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaHistory size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Maintenance Log
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Record of all equipment maintenance activities
          </p>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={handleAddClick}
            className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaPlus />
            Add Entry
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard 
          title="Total Entries" 
          value={totalEntries} 
          icon={<FaTools className="text-purple-600" />} 
          bg="bg-purple-50" border="border-purple-100"
        />
        <SummaryCard 
          title="This Month" 
          value={currentMonthEntries} 
          icon={<FaCalendarAlt className="text-green-600" />} 
          bg="bg-green-50" border="border-green-100"
        />
        <SummaryCard 
          title="Total Cost" 
          value={`₹${totalCost.toLocaleString()}`} 
          icon={<FaMoneyBillWave className="text-orange-600" />} 
          bg="bg-orange-50" border="border-orange-100"
        />
        <SummaryCard 
          title="Technicians" 
          value={uniqueTechnicians} 
          icon={<FaUserCog className="text-blue-600" />} 
          bg="bg-blue-50" border="border-blue-100"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by equipment, ID, or technician..."
              className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-48">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending Parts">Pending Parts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log List */}
      <div className="space-y-4">
        {filteredLogs.map((log) => (
          <div key={log.logId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            
            {/* Row 1: Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-800 text-lg">{log.equipmentName}</h3>
                <span className="px-2 py-0.5 bg-fuchsia-100 text-fuchsia-700 text-xs font-bold rounded uppercase tracking-wide">
                  {log.logId}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
                
                {/* Update Button */}
                <button 
                  onClick={() => handleEditClick(log)}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200"
                >
                  <FaEdit /> Update
                </button>

                {/* View Report Button */}
                <button 
                  onClick={() => setViewReportLog(log)}
                  className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors border border-gray-200"
                >
                  <FaFileAlt /> Report
                </button>
              </div>
            </div>

            {/* Row 2: ID & Date */}
            <div className="text-xs text-gray-500 font-medium mb-6 flex gap-4">
              <span>ID: {log.equipmentId}</span>
              <span>•</span>
              <span>{log.maintenanceDate}</span>
            </div>

            {/* Row 3: Details (Issue & Action) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <FaExclamationCircle className="text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Issue Reported</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{log.issueReported}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <FaWrench className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Actions Taken</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{log.actionsTaken}</p>
                </div>
              </div>
            </div>

            {/* Row 4: Footer Stats */}
            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <FooterStat 
                icon={<FaUserCog />} 
                label="Technician" 
                value={getTechnicianDisplay(log.technicianName)} 
              />
              <FooterStat 
                icon={<FaClock />} 
                label="Duration" 
                value={`${log.duration} hours`} 
              />
              <FooterStat 
                icon={<FaMoneyBillWave />} 
                label="Cost" 
                value={`₹${Number(log.cost).toLocaleString()}`} 
              />
              <FooterStat 
                icon={<FaCalendarCheck />} 
                label="Next Scheduled" 
                value={log.nextScheduled} 
              />
            </div>

          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
            No maintenance records found matching your search.
          </div>
        )}
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <AddMaintenance 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveLog}
          initialData={editingLog} // Pass data if editing
        />
      )}

      {viewReportLog && (
        <ReportModal 
          log={viewReportLog} 
          onClose={() => setViewReportLog(null)} 
        />
      )}

    </div>
  );
};

/* --- Reusable Components --- */

const SummaryCard = ({ title, value, icon, bg, border }) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex justify-between items-center">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
    <div className={`p-4 rounded-xl text-xl ${bg} ${border} border`}>
      {icon}
    </div>
  </div>
);

const FooterStat = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400 text-sm">{icon}</div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  </div>
);

/* --- Report Modal Component --- */
const ReportModal = ({ log, onClose }) => {
  const reportRef = useRef(null); 

  const equipment = equipment_records.find(e => e.equipmentId === log.equipmentId);
  const technician = staffList.find(s => s.name === log.technicianName);

  const handleDownloadPdf = async () => {
    if (reportRef.current === null) return;

    try {
      const dataUrl = await toPng(reportRef.current, { 
        cacheBust: true, 
        backgroundColor: '#ffffff' 
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Maintenance_Report_${log.logId}.pdf`);

    } catch (err) {
      console.error("PDF Export Error:", err);
      alert("Could not generate PDF. Please ensure all images are valid.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Maintenance Report</h2>
            <p className="text-sm text-gray-500">Report ID: #{log.logId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar bg-white">
          <div ref={reportRef} className="p-8 bg-white text-gray-800">
            <div className="flex justify-between items-start mb-8 border-b-2 border-fuchsia-800 pb-4">
              <div>
                <h1 className="text-3xl font-bold text-fuchsia-900">City Care Hospital</h1>
                <p className="text-sm text-gray-500">Equipment Maintenance Record</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-600">Date: {log.maintenanceDate}</p>
                <p className="text-sm text-gray-500">Log ID: {log.logId}</p>
              </div>
            </div>

            <div className="flex gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="w-1/3 bg-gray-50 rounded-lg p-4 flex items-center justify-center border border-gray-100">
                {equipment ? (
                  <img 
                    src={assets[equipment.equipmentImage]} 
                    alt={equipment.equipmentName} 
                    className="max-h-40 object-contain mix-blend-multiply"
                  />
                ) : (
                  <span className="text-gray-400 italic">Image not available</span>
                )}
              </div>
              <div className="w-2/3">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTools className="text-fuchsia-700"/> Equipment Details
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Equipment Name</p>
                    <p className="font-semibold text-gray-800">{log.equipmentName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Equipment ID</p>
                    <p className="font-mono text-gray-800">{log.equipmentId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Location</p>
                    <p className="text-gray-800">{equipment?.location || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-bold">Department</p>
                    <p className="text-gray-800">{equipment?.department || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaFileAlt className="text-fuchsia-700"/> Work Summary
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="font-bold text-gray-700 mb-2">Issue Reported</p>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">{log.issueReported}</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-700 mb-2">Actions Taken</p>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">{log.actionsTaken}</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm border-t border-gray-200 pt-4">
                  <div>
                    <span className="text-gray-500 block text-xs">Status</span>
                    <span className="font-bold text-gray-800">{log.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Cost</span>
                    <span className="font-bold text-gray-800">₹{Number(log.cost).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Duration</span>
                    <span className="font-bold text-gray-800">{log.duration} hrs</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">Next Due</span>
                    <span className="font-bold text-gray-800">{log.nextScheduled}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserCog className="text-fuchsia-700"/> Technician Information
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm bg-white border border-gray-200 p-4 rounded-lg">
                <div>
                   <p className="text-gray-500 text-xs uppercase font-bold">Name</p>
                   <p className="font-semibold text-gray-800">{log.technicianName}</p>
                </div>
                <div>
                   <p className="text-gray-500 text-xs uppercase font-bold">Designation</p>
                   <p className="text-gray-800">{technician?.designation || "External/Substitute"}</p>
                </div>
                <div>
                   <p className="text-gray-500 text-xs uppercase font-bold">Contact</p>
                   <p className="text-gray-800">{technician?.contact || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between">
               <div className="text-center">
                 <p className="w-40 border-b border-gray-400 mb-2"></p>
                 <p className="text-xs text-gray-500 uppercase font-bold">Technician Signature</p>
               </div>
               <div className="text-center">
                 <p className="w-40 border-b border-gray-400 mb-2"></p>
                 <p className="text-xs text-gray-500 uppercase font-bold">Supervisor Signature</p>
               </div>
            </div>

          </div>
        </div>

        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 cursor-pointer rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white transition-colors"
          >
            Close
          </button>
          <button 
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 cursor-pointer rounded-lg bg-fuchsia-900 text-white font-medium hover:bg-fuchsia-800 transition-colors flex items-center gap-2 shadow-md"
          >
            <FaDownload /> Download PDF
          </button>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceLog;