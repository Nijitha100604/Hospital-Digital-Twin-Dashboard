import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { equipment_records } from "../../data/equipment";
import CreateCalibrationSchedule from "./CreateCalibrationSchedule";
import AddMaintenance from "./addMaintenance"; 

import {
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaTools,
  FaBan,
  FaFilter,
} from "react-icons/fa";

const CalibrationScheduleList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); 
  
  // 2. State for Modals
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

  // Helper: Calculate days remaining
  const getDaysLeft = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: Determine Status based on days
  const getStatus = (dateString) => {
    if (!dateString) return "Unknown";
    const days = getDaysLeft(dateString);
    if (days < 0) return "Overdue";
    if (days <= 30) return "Due Soon";
    return "Upcoming";
  };

  /* ---------- Filter Logic ---------- */
  const filteredData = useMemo(() => {
    return equipment_records.filter((item) => {
      const matchesSearch = 
        item.equipmentName.toLowerCase().includes(search.toLowerCase()) ||
        item.equipmentId.toLowerCase().includes(search.toLowerCase());
      
      const status = getStatus(item.nextService);
      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  /* ---------- Summary Stats ---------- */
  const total = equipment_records.length;
  const overdue = equipment_records.filter((i) => getStatus(i.nextService) === "Overdue").length;
  const dueSoon = equipment_records.filter((i) => getStatus(i.nextService) === "Due Soon").length;
  const upcoming = equipment_records.filter((i) => getStatus(i.nextService) === "Upcoming").length;

  /* ---------- Handlers ---------- */
  const handleAddSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  // 3. Handler to open Maintenance Modal
  const handleMaintenanceClick = (equipment) => {
    setSelectedEquipmentId(equipment.equipmentId);
    setIsMaintenanceModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER + ACTIONS */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaCalendarAlt size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Calibration Schedule
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage equipment calibration and compliance checks
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
           <button
            onClick={handleAddSchedule}
            className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaPlus />
            Add Schedule
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          title="Total Equipment" 
          value={total} 
          icon={<FaCalendarAlt className="text-purple-600" />} 
          bg="bg-purple-100" border="border-purple-200" 
        />
        <SummaryCard 
          title="Upcoming" 
          value={upcoming} 
          icon={<FaClock className="text-blue-600" />} 
          bg="bg-blue-100" border="border-blue-200" 
        />
        <SummaryCard 
          title="Due Soon" 
          value={dueSoon} 
          icon={<FaExclamationTriangle className="text-yellow-600" />} 
          bg="bg-yellow-100" border="border-yellow-200" 
        />
        <SummaryCard 
          title="Overdue" 
          value={overdue} 
          icon={<FaBan className="text-red-600" />} 
          bg="bg-red-100" border="border-red-200" 
        />
      </div>

      {/* ALERTS */}
      {overdue > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-white rounded-full border border-red-100 shrink-0">
             <FaExclamationTriangle className="text-red-600" />
          </div>
          <div>
            <p className="font-bold text-red-800">{overdue} equipment is overdue for calibration!</p>
            <p className="text-sm text-red-600 mt-0.5">Please schedule calibration immediately.</p>
          </div>
        </div>
      )}

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative w-full flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by equipment name or ID..."
              className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Filter - Fixed Size */}
          <div className="relative w-50 flex-none">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Equipment Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Last Calibration</th>
                <th className="px-6 py-4">Next Due</th>
                <th className="px-6 py-4">Days Left</th>
                {/* Certificate Column Removed */}
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => {
                const status = getStatus(item.nextService);
                const daysLeft = getDaysLeft(item.nextService);
                
                return (
                  <tr key={item.equipmentId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                      <div className="p-2 bg-fuchsia-50 text-fuchsia-600 rounded-lg">
                        <FaCalendarAlt />
                      </div>
                      {item.equipmentName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{item.equipmentId}</td>
                    <td className="px-6 py-4 text-gray-600">{item.lastService}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{item.nextService}</td>
                    
                    {/* Days Left */}
                    <td className={`px-6 py-4 font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                        status === "Overdue" ? "bg-red-50 text-red-700 border-red-200" :
                        status === "Due Soon" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {status === "Overdue" && <FaExclamationTriangle />}
                        {status === "Due Soon" && <FaClock />}
                        {status === "Upcoming" && <FaCheckCircle />}
                        {status}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleMaintenanceClick(item)}
                        className="text-gray-400 cursor-pointer hover:text-fuchsia-700 hover:bg-fuchsia-50 p-2.5 rounded-full transition-all tooltip group relative"
                      >
                        <FaTools size={16} />
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Log Maintenance
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
           <div className="p-8 text-center text-gray-500">
             No calibration schedules found matching your search.
           </div>
        )}

        <div className="p-4 border-t border-gray-200 text-xs text-gray-400 text-center bg-gray-50/30">
          Showing {filteredData.length} of {equipment_records.length} schedules
        </div>
      </div>

      {/* 4. RENDER MODALS */}
      
      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <CreateCalibrationSchedule 
          onClose={() => setIsScheduleModalOpen(false)} 
        />
      )}

      {/* Maintenance Modal */}
      {isMaintenanceModalOpen && (
        <AddMaintenance 
          onClose={() => setIsMaintenanceModalOpen(false)} 
          equipmentIdProp={selectedEquipmentId}
        />
      )}

    </div>
  );
};

/* Component: Summary Card */
const SummaryCard = ({ title, value, icon, bg, border }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3.5 rounded-xl text-xl ${bg} ${border} border`}>
      {icon}
    </div>
  </div>
);

export default CalibrationScheduleList;