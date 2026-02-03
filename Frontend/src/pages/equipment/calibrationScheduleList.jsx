import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EquipmentContext } from "../../context/EquipmentContext";
import CreateCalibrationSchedule from "./CreateCalibrationSchedule";
import AddMaintenance from "./addMaintenance"; 
import Loading from "../Loading";

import {
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaPlus,
  FaTools,
  FaFilter,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaBan
} from "react-icons/fa";

const CalibrationScheduleList = () => {
  const navigate = useNavigate();
  
  // Consume Contexts
  const { equipments, fetchEquipments, loading, maintenanceLogs, fetchMaintenanceLogs } = useContext(EquipmentContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null); 

  useEffect(() => {
    fetchEquipments();
    fetchMaintenanceLogs();
  }, [fetchEquipments, fetchMaintenanceLogs]);

  /* ---------- Helper Logic ---------- */
  const getDaysLeft = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatus = (dateString) => {
    if (!dateString) return "Unknown";
    const days = getDaysLeft(dateString);
    if (days === null) return "Unknown";
    if (days < 0) return "Overdue";
    if (days <= 30) return "Due Soon";
    return "Upcoming";
  };

  const getMaintenanceState = (equipId) => {
    const logs = maintenanceLogs.filter(l => l.equipmentId === equipId);
    if (logs.length === 0) return null;
    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latest = logs[0];
    if (latest.status === "In Progress" || latest.status === "Pending Parts") {
        return latest.status;
    }
    return null;
  };

  /* ---------- Filtering ---------- */
  const filteredData = useMemo(() => {
    return equipments.filter((item) => {
      const name = item.basicInfo?.equipmentName?.toLowerCase() || "";
      const id = item.equipmentId?.toLowerCase() || "";
      const nextDate = item.serviceSchedule?.nextService;

      const matchesSearch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
      const status = getStatus(nextDate);
      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, equipments]);

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  /* ---------- Handlers ---------- */
  const handleAddSchedule = () => setIsScheduleModalOpen(true);

  const handleMaintenanceClick = (equipment) => {
    setSelectedEquipment(equipment);
    setIsMaintenanceModalOpen(true);
  };

  /* ---------- Summary Stats ---------- */
  const total = equipments.length;
  const overdue = equipments.filter((i) => getStatus(i.serviceSchedule?.nextService) === "Overdue").length;
  const dueSoon = equipments.filter((i) => getStatus(i.serviceSchedule?.nextService) === "Due Soon").length;
  const upcoming = equipments.filter((i) => getStatus(i.serviceSchedule?.nextService) === "Upcoming").length;

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaCalendarAlt size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">Calibration Schedule</p>
          </div>
          <p className="text-gray-500 text-sm mt-1">Manage equipment calibration and compliance checks</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
           <button onClick={handleAddSchedule} className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto">
            <FaPlus /> Add Schedule
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

      {/* FILTERS & SEARCH */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by equipment name or ID..."
                className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-48">
                    <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    <select
                    className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="All">All Status</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Due Soon">Due Soon</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-100 text-gray-500 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Equipment Name</th>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Last Calibration</th>
                <th className="px-6 py-4">Next Due</th>
                <th className="px-6 py-4">Days Left</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.length > 0 ? (
                  paginatedData.map((item) => {
                    const nextDate = item.serviceSchedule?.nextService;
                    const lastDate = item.serviceSchedule?.lastService;
                    const status = getStatus(nextDate);
                    const daysLeft = getDaysLeft(nextDate);
                    const activeStatus = getMaintenanceState(item.equipmentId);

                    return (
                    <tr key={item.equipmentId} className="hover:bg-blue-50 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-fuchsia-100 text-fuchsia-600 rounded-lg"><FaCalendarAlt /></div>
                        {item.basicInfo?.equipmentName}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono">{item.equipmentId}</td>
                        <td className="px-6 py-4 text-gray-600">{lastDate || "N/A"}</td>
                        <td className="px-6 py-4 font-bold text-gray-800">{nextDate || "N/A"}</td>
                        <td className={`px-6 py-4 font-medium ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {daysLeft === null ? "N/A" : daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days`}
                        </td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            status === "Overdue" ? "bg-red-50 text-red-700 border-red-200" :
                            status === "Due Soon" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                            status === "Upcoming" ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                            {status === "Overdue" && <FaExclamationTriangle />}
                            {status === "Due Soon" && <FaClock />}
                            {status === "Upcoming" && <FaCheckCircle />}
                            {status}
                        </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                        {activeStatus ? (
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                                activeStatus === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-orange-50 text-orange-700 border-orange-200"
                            }`}>
                                {activeStatus === "In Progress" && <FaSpinner className="animate-spin"/>}
                                {activeStatus}
                            </span>
                        ) : (
                            <button 
                            onClick={() => handleMaintenanceClick(item)}
                            className="text-gray-400 hover:text-fuchsia-800 hover:bg-fuchsia-50 p-2 rounded-full transition-all cursor-pointer tooltip group relative"
                            >
                            <FaTools size={16} />
                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Log Maintenance
                            </span>
                            </button>
                        )}
                        </td>
                    </tr>
                    );
                })
              ) : (
                <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <FaFilter className="text-gray-300 text-3xl" />
                            <p>No calibration schedules found matching your filters.</p>
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <p className="text-xs text-gray-500">
            Showing <span className="font-medium text-gray-800">{filteredData.length > 0 ? indexOfFirstItem + 1 : 0}</span> to <span className="font-medium text-gray-800">{Math.min(indexOfLastItem, filteredData.length)}</span> of <span className="font-medium text-gray-800">{filteredData.length}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === 1
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 cursor-pointer border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft size={12} /> Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-300 cursor-pointer hover:bg-gray-50"
              }`}
            >
              Next <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isScheduleModalOpen && <CreateCalibrationSchedule onClose={() => setIsScheduleModalOpen(false)} />}
      
      {isMaintenanceModalOpen && (
        <AddMaintenance 
          onClose={() => setIsMaintenanceModalOpen(false)} 
          selectedEquipment={selectedEquipment} 
        />
      )}

    </div>
  );
};

// SummaryCard component
const SummaryCard = ({ title, value, icon, bg, border }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex justify-between items-center hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className={`p-3.5 rounded-xl text-xl ${bg} ${border} border`}>{icon}</div>
  </div>
);

export default CalibrationScheduleList;