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
  FaProcedures,
  FaInfoCircle,
  FaBuilding,
  FaClock,
  FaUserPlus,
  FaHeartbeat,
  FaFlask
} from "react-icons/fa";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";

import { criticalAlerts, dashboardStatus, patientFlowTrends, departmentDistribution, revenueVsExpenses, departmentBedOccupancy } from '../data/admin';
import { useNavigate } from "react-router-dom";

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

    const warningsLength = criticalAlerts.length;

    const COLORS = [
        "#6366F1",
        "#8B5CF6",
        "#EC4899",
        "#F59E0B",
        "#10B981",
        "#94A3B8"
    ];

    const navigate = useNavigate();

    const actions = [
    {
      label: "Add Patient",
      icon: <FaUserPlus />,
      path: "/add-new-patient"
    },
    {
      label: "Bed Status",
      icon: <FaBed />,
      path: "/bed-availability"
    },
    {
      label: "Equipment",
      icon: <FaHeartbeat />,
      path: "/equipment-list"
    },
    {
      label: "Inventory",
      icon: <FaBoxes />,
      path: "/medicine-stocks"
    },
    {
      label: "Staff",
      icon: <FaUsers />,
      path: "/staff-list"
    },
    {
      label: "Lab Reports",
      icon: <FaFlask />,
      path: "/lab-reports-list"
    }
  ];


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

    <div className="mt-5 w-full border border-red-400 p-3 rounded-lg">

        <div className="flex flex-wrap justify-between gap-3 items-center mb-4">

            <div className="flex gap-2 items-center">
                <FaInfoCircle size={18} className="text-red-500"/>
                <p className="text-md text-gray-800 font-semibold">Critical Warnings & Alerts</p>
            </div>

            {/* Warnings length */}
            <p className={`px-3 py-1 text-sm rounded-lg font-semibold ${warningsLength > 0 ? "bg-red-300" : "bg-gray-300"}`}>{warningsLength} Active</p>

        </div>

        {
            criticalAlerts.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4 m-4">
            {
                criticalAlerts.map((item, index)=>(
                    <div 
                        key={index}
                        className="flex flex-col gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transform cursor-pointer"
                    >
                        <div className="flex justify-between gap-2 items-center flex-wrap">
                            <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-lg
                                ${item.severity === "critical" ? "bg-red-400 text-white" :
                                  item.severity === "high" ? "bg-orange-300 text-white" :
                                    "bg-yellow-200 text-gray-800"}`}>
                                {item.severity.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 mb-2">{item.description}</p>
                        <div className="flex justify-between gap-3 flex-wrap items-center">
                            <div className="flex gap-2 items-center">
                                <FaBuilding size={16} className="text-gray-500"/>
                                <p className="text-sm text-gray-500">{item.department}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <FaClock size={16} className="text-gray-500"/>
                                <p className="text-sm text-gray-500">{item.time}</p>
                            </div>
                        </div>
                    </div>
                ))
            }
            </div> :
            <p className="text-gray-800 text-md font-semibold text-center">
                No Data available
            </p>
        }
        

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-8">
      
      {/* Patient Flow Trends */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Patient Flow Trends
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={patientFlowTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              
              <Area
                type="monotone"
                dataKey="consultations"
                stroke="#3B82F6"
                fill="#93C5FD"
                name="Consultations"
              />
              <Area
                type="monotone"
                dataKey="admissions"
                stroke="#8B5CF6"
                fill="#C4B5FD"
                name="Admissions"
              />
              <Area
                type="monotone"
                dataKey="emergencies"
                stroke="#EF4444"
                fill="#FCA5A5"
                name="Emergencies"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department-wise Distribution */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Department-wise Patient Distribution
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departmentDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
              >
                {departmentDistribution.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full mt-8">

      {/* Revenue vs Expenses */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">
          Revenue vs Expenses
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueVsExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" />
              <Bar dataKey="expenses" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Bed Occupancy */}
      <div className="bg-white rounded-xl border p-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">
          Department Bed Occupancy
        </h3>

        <div className="flex flex-col gap-4">
          {departmentBedOccupancy.map((item, index) => {
            const percent = ((item.occupied / item.total) * 100).toFixed(0);

            return (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.department}</span>
                  <span>{item.occupied}/{item.total}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      percent > 85
                        ? "bg-red-500"
                        : percent > 65
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>

    <div className="bg-white border border-gray-400 rounded-xl p-5 w-full mt-8">
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        Quick Actions
      </h3>

      <div className="grid md:grid-cols-6 sm:grid-cols-3 gap-4">
        {actions.map((item, index) => (
          <div
            key={index}
            onClick={() => {navigate(item.path); window.scroll(0,0)}}
            className="
              group cursor-pointer
              border-2 border-purple-400 rounded-xl
              flex flex-col items-center justify-center
              h-28
              transition-all duration-200
              hover:bg-purple-50
              hover:border-purple-300
            "
          >
            <div
              className="
                text-purple-600 text-2xl mb-2
                transition-transform duration-200
                group-hover:scale-110
              "
            >
              {item.icon}
            </div>

            <p className="text-sm text-gray-700 font-medium">
              {item.label}
            </p>
          </div>
        ))}
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

