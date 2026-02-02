import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EquipmentContext } from "../../context/EquipmentContext";
import Loading from "../Loading";

import {
  FaSearch,
  FaStethoscope,
  FaTools,
  FaBan,
  FaCheckCircle,
  FaEye,
  FaPlus,
  FaFilter,
  FaHeartbeat,
  FaBell,
} from "react-icons/fa";

const EquipmentList = () => {
  const { equipments, fetchEquipments, loading } = useContext(EquipmentContext);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEquipments();
  }, [fetchEquipments]);

  /* ---------- Alert Logic ---------- */
  const getDaysLeft = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    const due = new Date(dateString);
    const diffTime = due - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calibrationAlertCount = equipments.filter((e) => {
    const days = getDaysLeft(e.serviceSchedule?.nextService); // Access nested prop
    return days <= 30;
  }).length;

  /* ---------- Filters ---------- */
  const filteredEquipment = useMemo(() => {
    return equipments.filter((e) => {
      const name = e.basicInfo?.equipmentName?.toLowerCase() || "";
      const id = e.equipmentId?.toLowerCase() || "";
      const serial = e.basicInfo?.serialNumber?.toLowerCase() || "";
      const dept = e.basicInfo?.department || "";
      const status = e.basicInfo?.equipmentStatus || "";

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        id.includes(search.toLowerCase()) ||
        serial.includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || dept === departmentFilter;

      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, departmentFilter, statusFilter, equipments]);

  /* ---------- Reset count on filter change ---------- */
  useEffect(() => {
    setVisibleCount(8);
  }, [search, departmentFilter, statusFilter]);

  /* ---------- Summary Stats ---------- */
  const totalItems = equipments.length;
  const workingCount = equipments.filter(
    (e) => e.basicInfo?.equipmentStatus === "Working",
  ).length;
  const maintenanceCount = equipments.filter(
    (e) => e.basicInfo?.equipmentStatus === "Under Maintenance",
  ).length;
  const offlineCount = equipments.filter(
    (e) => e.basicInfo?.equipmentStatus === "Offline",
  ).length;

  const departments = [
    "All",
    ...new Set(equipments.map((e) => e.basicInfo?.department).filter(Boolean)),
  ];

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-blue-50 min-h-screen">
      {/* Header + Actions */}
      <div className="bg-white p-6 rounded-xl mb-6 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaHeartbeat size={24} className="text-gray-500" />
            <p className="text-gray-800 font-bold text-lg">
              Equipment Registry
            </p>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Manage hospital assets, maintenance, and status
          </p>
        </div>

        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* Calibration Alerts Button */}
          <button
            onClick={() => navigate("/calibration-schedule-list")}
            className="relative flex cursor-pointer items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaBell className="text-gray-500" />
            Calibration Alerts
            {calibrationAlertCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full border-2 border-white">
                {calibrationAlertCount}
              </span>
            )}
          </button>

          {/* Add Equipment Button */}
          <button
            onClick={() => navigate("/add-equipment")}
            className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2.5 bg-fuchsia-800 hover:bg-fuchsia-900 text-white rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
          >
            <FaPlus />
            Add New Equipment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Assets"
          value={totalItems}
          icon={<FaStethoscope className="text-purple-600" />}
          bg="bg-purple-100"
          border="border-purple-200"
        />
        <SummaryCard
          title="Operational"
          value={workingCount}
          icon={<FaCheckCircle className="text-green-600" />}
          bg="bg-green-100"
          border="border-green-200"
        />
        <SummaryCard
          title="In Maintenance"
          value={maintenanceCount}
          icon={<FaTools className="text-yellow-600" />}
          bg="bg-yellow-100"
          border="border-yellow-200"
        />
        <SummaryCard
          title="Offline"
          value={offlineCount}
          icon={<FaBan className="text-red-600" />}
          bg="bg-red-100"
          border="border-red-200"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative w-full flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or serial number"
              className="pl-10 pr-3 py-2.5 rounded-lg w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-48">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-48">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <select
                className="w-full pl-9 h-10 pr-8 rounded-lg outline-none border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-fuchsia-500 cursor-pointer appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Working">Working</option>
                <option value="Under Maintenance">Maintenance</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredEquipment.length > 0 ? (
          filteredEquipment
            .slice(0, visibleCount)
            .map((e) => (
              <EquipmentCard
                key={e.equipmentId}
                equipment={e}
                navigate={navigate}
              />
            ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
            No equipment found matching your criteria.
          </div>
        )}
      </div>

      {/* Show More */}
      {visibleCount < filteredEquipment.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="px-6 py-2.5 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 hover:text-fuchsia-800 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            Show More Equipment
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-center">
        Showing {Math.min(visibleCount, filteredEquipment.length)} of{" "}
        {filteredEquipment.length} records
      </p>
    </div>
  );
};

export default EquipmentList;

/* ---------- Components ---------- */

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

const EquipmentCard = ({ equipment, navigate }) => {
  const {
    equipmentName,
    modelName,
    department,
    location,
    equipmentStatus,
    manufacturer,
  } = equipment.basicInfo || {};
  const { nextService } = equipment.serviceSchedule || {};
  const image = equipment.equipmentImage;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Working":
        return "bg-green-600/90 px-3 rounded-sm text-[11px] backdrop-blur";
      case "Under Maintenance":
        return "bg-yellow-600/90 px-3 rounded-sm text-[11px] backdrop-blur";
      case "Offline":
        return "bg-red-600/90 px-3 rounded-sm text-[11px] backdrop-blur";
      default:
        return " px-3 rounded-sm text-[11px] bg-gray-500/90";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100">
        <img
          src={image || "https://via.placeholder.com/300?text=No+Image"}
          alt={equipmentName}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          className="object-contain h-full w-full group-hover:scale-105 transition-transform"
        />

        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm ${getStatusStyle(
              equipmentStatus,
            )}`}
          >
            {equipmentStatus}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
            {equipmentName}
          </h3>
        </div>
        <p className="text-xs text-gray-400 mb-3">{modelName}</p>

        <div className="mb-4">
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
            {department}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-5 flex-1">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              ID
            </span>
            <span className="font-mono text-xs">{equipment.equipmentId}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Location
            </span>
            <span className="font-semibold text-gray-700 text-xs truncate">
              {location}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Service Due
            </span>
            <span className="text-xs truncate">{nextService || "N/A"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
              Maker
            </span>
            <span className="text-xs truncate">{manufacturer}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/view-equipment/${equipment.equipmentId}`)}
          className="w-full mt-auto cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-800 active:bg-fuchsia-950 text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FaEye />
          View Details
        </button>
      </div>
    </div>
  );
};
