import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { maintenance_log } from "../../data/maintenanceLog";
import AddMaintenance from "./addMaintenance"; // Reusing your existing popup component

import {
  FaSearch,
  FaTools,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserCog,
  FaPlus,
  FaCheckCircle,
  FaExclamationCircle,
  FaWrench,
  FaClock,
  FaCalendarCheck,
  FaHistory
} from "react-icons/fa";

const MaintenanceLog = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // --- Filtering Logic ---
  const filteredLogs = useMemo(() => {
    return maintenance_log.filter(log => 
      log.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
      log.logId.toLowerCase().includes(search.toLowerCase()) ||
      log.technicianName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // --- Summary Statistics Logic ---
  const totalEntries = maintenance_log.length;
  
  const currentMonthEntries = maintenance_log.filter(log => {
    const logDate = new Date(log.maintenanceDate);
    const now = new Date();
    return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
  }).length;

  const totalCost = maintenance_log.reduce((acc, curr) => acc + Number(curr.cost), 0);
  
  const uniqueTechnicians = [...new Set(maintenance_log.map(log => log.technicianName))].length;

  // --- Helper for Status Colors ---
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending Parts": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
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

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative w-full">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by equipment name, ID, or technician..."
            className="w-full pl-11 pr-4 py-3 rounded-lg outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:bg-gray-50 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
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
                value={log.technicianName} 
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

      {/* Add Maintenance Modal (Opened via state) */}
      {isModalOpen && (
        <AddMaintenance onClose={() => setIsModalOpen(false)} />
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

export default MaintenanceLog;