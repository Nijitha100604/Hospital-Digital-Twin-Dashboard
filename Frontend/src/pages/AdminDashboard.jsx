import React, { useEffect, useState } from 'react'
import {
  FaUserInjured,
  FaBed,
  FaExclamationTriangle,
  FaUsers,
  FaRupeeSign,
  FaChartLine, 
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
  FaBoxes,
  FaProcedures
} from "react-icons/fa"

import { dashboardStatus } from '../data/admin';

function AdminDashboard() {

    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    // Current date and time

    useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Date 
      const date = now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

      // Time
      const time = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      });

      setCurrentDate(date);
      setCurrentTime(time);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
    }, []);

    // refresh

    const handleRefresh = () => {
        window.location.reload(); 
    };

    // Percentage Calculation
    const calculatePercentage = (today, previous) => {
        if (previous === 0) return 100;
        return (((today - previous) / previous) * 100).toFixed(1);
    };

    // Values for dashboard status
const patientChange = calculatePercentage(
    dashboardStatus.patients.today,
    dashboardStatus.patients.previous
);

const bedOccupancyPercent = (
    (dashboardStatus.beds.todayOccupied / dashboardStatus.beds.totalBeds) * 100
).toFixed(1);

const bedChange = calculatePercentage(
    dashboardStatus.beds.todayOccupied,
    dashboardStatus.beds.previousOccupied
);

const emergencyChange = calculatePercentage(
    dashboardStatus.emergencyCases.today,
    dashboardStatus.emergencyCases.previous
);

const surgeryChange = calculatePercentage(
    dashboardStatus.surgeries.today,
    dashboardStatus.surgeries.previous
);

const staffAbsent = dashboardStatus.staff.total - dashboardStatus.staff.present;
const staffAbsentPercent = ((staffAbsent / dashboardStatus.staff.total) * 100).toFixed(1);

const revenueChange = calculatePercentage(
    dashboardStatus.revenue.today,
    dashboardStatus.revenue.previous
);


  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Header and refresh button */}
    <div className="flex flex-wrap justify-between items-center">

        <div className="flex flex-col gap-1">
            <p className="text-gray-800 font-bold text-lg" >Real-Time Dashboard</p>
            <p className="text-gray-500 text-sm">Live updates • {currentDate} • {currentTime}</p>
        </div>

        <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-800 transition cursor-pointer"
        >
            <FaSyncAlt className="text-sm" />
            Refresh
        </button>

    </div>


    {/* Overview */}
    <div className="mt-8">
        <div className="flex gap-2 items-center">
            <FaChartLine size={18} className="text-gray-600"/>
            <p className="font-medium text-gray-600">Clinical Operations Overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

        {/* TODAY PATIENTS */}
        <Card
          icon={<FaUserInjured />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title="Today Patients"
          value={dashboardStatus.patients.today}
          sub={`Total: ${dashboardStatus.patients.totalTillDate}`}
          trend={<Trend value={patientChange} />}
        />

        {/* BED OCCUPANCY */}
        <Card
          icon={<FaBed />}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          title="Bed Occupancy"
          value={`${bedOccupancyPercent}%`}
          sub={`${dashboardStatus.beds.todayOccupied}/${dashboardStatus.beds.totalBeds} Beds`}
          trend={<Trend value={bedChange} />}
        />

        {/* EMERGENCY CASES */}
        <Card
          icon={<FaExclamationTriangle />}
          iconBg="bg-red-100"
          iconColor="text-red-600"
          title="Emergency Cases"
          value={dashboardStatus.emergencyCases.today}
          sub="Today"
          trend={<Trend value={emergencyChange} />}
        />

        {/* SURGERIES */}
        <Card
          icon={<FaProcedures />}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
          title="Surgeries Scheduled"
          value={dashboardStatus.surgeries.today}
          sub="Today"
          trend={<Trend value={surgeryChange} />}
        />

        {/* LOW STOCK */}
        <Card
            icon={<FaBoxes />}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            title="Low Stock Items"
            value={dashboardStatus.inventory.lowStockItems}
            sub={`Urgent: ${dashboardStatus.inventory.urgent ? "Yes" : "No"}`}
        />

        {/* STAFF STATUS */}
        <Card
            icon={<FaUsers />}
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
            title="Staff Status"
            value={`Present: ${dashboardStatus.staff.present}`}
            sub={`Absent: ${staffAbsent} (${staffAbsentPercent}%)`}
        />

        {/* TODAY REVENUE */}
        <Card
          icon={<FaRupeeSign />}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          title="Today Revenue"
          value={`₹${dashboardStatus.revenue.today.toLocaleString("en-IN")}`}
          sub="Compared to yesterday"
          trend={<Trend value={revenueChange} />}
        />

      </div>
    </div>

    </div>
    
    </>
    
  )
}

export default AdminDashboard

const Card = ({ icon, iconBg, iconColor, title, value, sub, trend }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-xl font-semibold text-gray-800 mt-1">{value}</h3>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
            {trend && <div className="mt-2">{trend}</div>}
        </div>

        <div className={`p-3 rounded-lg ${iconBg}`}>
            <span className={`text-xl ${iconColor}`}>{icon}</span>
        </div>
        </div>
);

// Trend analysis
const Trend = ({ value }) => (
    <div className={`flex items-center gap-1 text-sm font-medium ${value >= 0 ? "text-green-600" : "text-red-600"}`}>
        {value >= 0 ? <FaArrowUp /> : <FaArrowDown />}
        {Math.abs(value)}%
    </div>
);