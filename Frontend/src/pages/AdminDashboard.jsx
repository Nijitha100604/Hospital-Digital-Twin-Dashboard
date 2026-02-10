import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import {
  FaBed,
  FaUsers,
  FaChartLine, 
  FaSyncAlt,
  FaBoxes,
  FaUserPlus,
  FaHeartbeat,
  FaFlask,
  FaCalendarCheck,
  FaHospitalAlt,
  FaTools,
  FaPills,
  FaUserTie,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCube,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { PatientContext } from './../context/PatientContext';
import { AppContext } from '../context/AppContext';
import { LabContext } from '../context/LabContext';
import { StaffContext } from '../context/StaffContext';
import { MedicineContext } from '../context/MedicineContext';
import { EquipmentContext } from '../context/EquipmentContext';
import { DeptContext } from '../context/DeptContext';
import AccessDenied from '../components/AccessDenied';

function AdminDashboard() {

    const [currentTime, setCurrentTime] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    const isExpiringSoon = (dateStr) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      const expiry = new Date(dateStr);
      expiry.setHours(0, 0, 0, 0); 

      const diffTime = expiry - today;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 90; 
    };

    const { token, userData } = useContext(AppContext);
    const { patients, fetchPatients, appointments, fetchAppointments } = useContext(PatientContext);
    const { reports, fetchLabReports } = useContext(LabContext);
    const { staffs, fetchStaffs} = useContext(StaffContext);
    const { medicines, fetchMedicines } = useContext(MedicineContext);
    const { equipments, fetchEquipments } = useContext(EquipmentContext);
    const { departments, fetchDepartments, beds, fetchBeds, issues, fetchIssues } = useContext(DeptContext);

    const role = userData?.designation
    
    // patients data
    const totalPatients = patients?.length || 0;
    const activePatients = appointments?.filter(
      a => a?.status === "In Progress"
    ).length || 0;

    // appointments
    const totalAppointments = appointments?.length || 0;
    const completedAppointments = appointments?.filter(
      a => a?.status === "Completed"
    ).length || 0;

    // lab reports
    const totalReports = reports?.length || 0;
    const completedReports = reports?.filter(
      r => r?.status === "Completed"
    ).length || 0;

    // staffs data
    const totalStaffs = staffs?.length || 0;
    const presentStaffs = 0;

    // medicines data
    const totalMedicines = medicines?.length || 0;
    const lowStockCount = medicines?.filter(
      m => m.quantity <= m.minimumThreshold
    ).length || 0;
    const expiringSoonCount = medicines?.filter((m) =>
      isExpiringSoon(m.expiryDate)
    ).length || 0;
    const inStock = totalMedicines - lowStockCount;

    // equipments data
    const totalEquipments = equipments?.length || 0;
    const maintenanceEquipments = 0;

    // departments data
    const totalDepartments = departments?.length || 0;
    const activeDepartments = departments?.filter(
      d => d?.status === "Active"
    ).length || 0;

    // issues 
    const totalIssues = issues?.length || 0;
    const resolvedIssues = issues?.filter(
      i => i?.status === "Resolved" 
    ).length || 0;
    const pendingIssues = issues?.filter(
      i => i.status === "Pending"
    ).length || 0;
    const inProgressIssues = issues?.filter(
      i => i.status === "In Progress"
    ).length || 0;

    // bed details
    const totalBeds = beds?.reduce(
      (sum, dept) => sum + (dept.beds?.length || 0), 0
    );
    const occupiedBeds = beds?.reduce(
      (sum, dept) => sum + dept.beds.filter(b => b.status === "Occupied").length, 0
    );
    const occupancyRate = totalBeds ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0;

    // calculate department bed status
    const departmentStats = beds?.map((dept)=>{

      const totalBeds = dept.beds.length;
      const occupiedBeds = dept.beds.filter(
        (bed) => bed.status === "Occupied"
      ).length;
      const availableBeds = totalBeds - occupiedBeds;
      const percentage = totalBeds === 0 ? 0 : Math.round((occupiedBeds / totalBeds) * 100);

      let status = "Low";
      let color = "bg-green-500";

      if (percentage >= 85) {
        status = "High";
        color = "bg-red-500";
      } else if (percentage >= 60) {
        status = "Moderate";
        color = "bg-yellow-500";
      }

      return {
        ...dept,
        totalBeds,
        occupiedBeds,
        availableBeds,
        percentage,
        status,
        color
      };

    })

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

    useEffect(()=>{
      if(token){
        Promise.all([
          fetchPatients(),
          fetchAppointments(),
          fetchLabReports(),
          fetchStaffs(),
          fetchMedicines(),
          fetchEquipments(),
          fetchDepartments(),
          fetchBeds(),
          fetchIssues()
        ]);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    // refresh
    const handleRefresh = () => {
        window.location.reload(); 
    };

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

    if(role !== "Admin"){
      return <AccessDenied />
    }


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
    <div className="mt-6">
        <div className="flex gap-2 items-center">
            <FaChartLine size={18} className="text-gray-600"/>
            <p className="font-medium text-gray-600">Clinical Operations Dashboard</p>
        </div>

        {/* Overview Cards */}
        <div className="mt-5 grid md:grid-cols-4 grid-cols-1 gap-5">

          {/* patients */}
          <div 
            onClick = {()=>{
              navigate('/patient-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-fuchsia-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-fuchsia-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Patients</p>
              <div className={`p-2 rounded-lg text-xl bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-300`}>
                <FaUsers />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalPatients}</p>
              <p className="text-xs text-gray-600 font-medium">Total Patients</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{activePatients}</p>
              <p className="text-xs text-gray-600 font-medium">Active Patients</p>
            </div>


          </div>

          {/* Appointments */}
          <div 
            onClick = {()=>{
              navigate('/all-appointments');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-green-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-green-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Appointments</p>
              <div className={`p-2 rounded-lg text-xl bg-green-100 text-green-600 border border-green-300`}>
                <FaCalendarCheck />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalAppointments}</p>
              <p className="text-xs text-gray-600 font-medium">Total Appointments</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{completedAppointments}</p>
              <p className="text-xs text-gray-600 font-medium">Completed Appointments</p>
            </div>


          </div>

          {/* Lab Reports */}
          <div 
            onClick = {()=>{
              navigate('/lab-reports-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-pink-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Lab Reports</p>
              <div className={`p-2 rounded-lg text-xl bg-pink-100 text-pink-600 border border-pink-300`}>
                <FaFlask />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalReports}</p>
              <p className="text-xs text-gray-600 font-medium">Total Reports</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{completedReports}</p>
              <p className="text-xs text-gray-600 font-medium">Completed Reports</p>
            </div>

          </div>

          {/* staffs */}
          <div 
            onClick = {()=>{
              navigate('/staff-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-indigo-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Staffs</p>
              <div className={`p-2 rounded-lg text-xl bg-indigo-100 text-indigo-600 border border-indigo-300`}>
                <FaUserTie />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalStaffs}</p>
              <p className="text-xs text-gray-600 font-medium">Total Staffs</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{presentStaffs}</p>
              <p className="text-xs text-gray-600 font-medium">Available Staffs</p>
            </div>

          </div>

          {/* Medicines */}
          <div 
            onClick = {()=>{
              navigate('/medicine-stocks');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-rose-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-rose-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Medicine Stocks</p>
              <div className={`p-2 rounded-lg text-xl bg-rose-100 text-rose-600 border border-rose-300`}>
                <FaPills />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalMedicines}</p>
              <p className="text-xs text-gray-600 font-medium">Total Stocks</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{inStock}</p>
              <p className="text-xs text-gray-600 font-medium">In Stock</p>
            </div>

          </div>

          {/* Equipments */}
          <div 
            onClick = {()=>{
              navigate('/equipment-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-yellow-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Equipment</p>
              <div className={`p-2 rounded-lg text-xl bg-yellow-100 text-yellow-600 border border-yellow-300`}>
                <FaTools />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalEquipments}</p>
              <p className="text-xs text-gray-600 font-medium">Total Equipment</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{maintenanceEquipments}</p>
              <p className="text-xs text-gray-600 font-medium">In Maintenace</p>
            </div>

          </div>

          {/* Bed occupancy */}
          <div 
            onClick = {()=>{
              navigate('/bed-availability');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-orange-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Bed Occupancy</p>
              <div className={`p-2 rounded-lg text-xl bg-orange-100 text-orange-600 border border-orange-300`}>
                <FaBed />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalBeds}</p>
              <p className="text-xs text-gray-600 font-medium">Total Beds</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{occupancyRate} % <span className="text-sm font-medium text-gray-600">( {occupiedBeds}/{totalBeds} )</span></p>
              <p className="text-xs text-gray-600 font-medium">Occupancy Rate</p>
            </div>

          </div>

          {/* Departments */}
          <div 
            onClick = {()=>{
              navigate('/departments-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-cyan-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Departments</p>
              <div className={`p-2 rounded-lg text-xl bg-cyan-100 text-cyan-600 border border-cyan-300`}>
                <FaHospitalAlt />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalDepartments}</p>
              <p className="text-xs text-gray-600 font-medium">Total Departments</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{activeDepartments}</p>
              <p className="text-xs text-gray-600 font-medium">Active Departments</p>
            </div>

          </div>

          {/* Issues */}
          <div 
            onClick = {()=>{
              navigate('/issues-list');
              window.scroll(0,0);
            }}
            className="relative bg-white px-5 py-4 border border-gray-300 flex flex-col gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-lg hover:bg-gray-50 cursor-pointer overflow-hidden group"
          >
            <span className="absolute bottom-0 left-0 w-0 h-1 bg-gray-600 transition-all duration-300 group-hover:w-full"></span>

            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-700 font-medium">Issues</p>
              <div className={`p-2 rounded-lg text-xl bg-gray-100 text-gray-600 border border-gray-300`}>
                <FaInfoCircle />
              </div>
            </div>

            <div className="flex flex-col items-start gap-1">
              <p className="text-xl text-gray-900 font-extrabold">{totalIssues}</p>
              <p className="text-xs text-gray-600 font-medium">Total Issues</p>
            </div>

            <hr className="text-gray-300"/>

            <div className="flex flex-col items-start gap-1">
              <p className="text-md text-gray-800 font-bold">{resolvedIssues}</p>
              <p className="text-xs text-gray-600 font-medium">Resolved Issues</p>
            </div>

          </div>
        
        </div>

    </div>

    {/* Critical Alerts and Warnings */}
    {
      (expiringSoonCount > 0 || lowStockCount > 0 || maintenanceEquipments > 0 || pendingIssues > 0 || inProgressIssues > 0) && (
        <div className="bg-white border border-gray-300 rounded-xl px-5 py-3 w-full mt-8">
          <div className="flex items-center gap-1">
            <div className={`p-2 rounded-lg text-xl text-rose-600`}>
              <FaInfoCircle />
            </div>
            <p className="font-semibold text-gray-700">Need Attention</p>
          </div>

          {/* cards */}
          <div className="flex flex-wrap gap-3 items-center mt-3">
            {
              lowStockCount > 0 && (
                <div className="p-6 border w-52 border-red-300 rounded-xl flex flex-col items-center shadow-sm hover:bg-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center rounded-2xl bg-orange-200 text-orange-600 p-4">
                    <FaCube size={22}/>
                  </div>
                  <p className="text-center mt-3 text-md font-semibold text-gray-800">Emergency Medicine Stock</p>
                  <p className="text-sm mt-3 text-center text-gray-700"><span className="font-semibold text-gray-900">{lowStockCount}</span> medicine(s) are below the required threshold</p>
                  <button 
                    onClick = {()=>{
                      navigate('/stock-alerts');
                      window.scroll(0,0)
                    }}
                    className="mt-8 px-3 py-1 bg-red-700 text-white text-sm rounded-xl hover:bg-red-800 cursor-pointer"
                  >View Details</button>
                </div>
              )
            }

            {
              expiringSoonCount > 0 && (
                <div className="p-6 border w-54 border-red-300 rounded-xl flex flex-col items-center shadow-sm hover:bg-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center rounded-2xl bg-orange-200 text-orange-600 p-4">
                    <FaPills size={22}/>
                  </div>
                  <p className="text-center mt-3 text-md font-semibold text-gray-800">Expiring Soon Medicines</p>
                  <p className="text-sm mt-3 text-center text-gray-700"><span className="font-semibold text-gray-900">{expiringSoonCount}</span> medicine(s) approaching their expiry date</p>
                  <button
                    onClick = {()=>{
                      navigate('/stock-alerts');
                      window.scroll(0,0);
                    }} 
                    className="mt-8 px-3 py-1 bg-red-700 text-white text-sm rounded-xl hover:bg-red-800 cursor-pointer"
                  >View Details</button>
                </div>
              )
            }

            {
              maintenanceEquipments > 0 && (
                <div className="p-6 border w-54 border-red-300 rounded-xl flex flex-col items-center shadow-sm hover:bg-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center rounded-2xl bg-orange-200 text-orange-600 p-4">
                    <FaTools size={22}/>
                  </div>
                  <p className="text-center mt-3 text-md font-semibold text-gray-800">Equipment Maintenance</p>
                  <p className="text-sm mt-3 text-center text-gray-700"><span className="font-semibold text-gray-900">{maintenanceEquipments}</span> Medical equipment is due for maintenance</p>
                  <button 
                    onClick = {()=> {
                      navigate('/maintenance-log');
                      window.scroll(0,0);
                    }}
                    className="mt-8 px-3 py-1 bg-red-700 text-white text-sm rounded-xl hover:bg-red-800 cursor-pointer"
                  >View Details</button>
                </div>
              )
            }

            {
              (pendingIssues > 0 || inProgressIssues > 0) && (
                <div className="p-6 border w-54 border-red-300 rounded-xl flex flex-col items-center shadow-sm hover:bg-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center rounded-2xl bg-orange-200 text-orange-600 p-4">
                    <FaExclamationTriangle size={22}/>
                  </div>
                  <p className="text-center mt-3 text-md font-semibold text-gray-800">Infrastructure Maintenance Alerts</p>
                  <p className="text-sm mt-3 text-center text-gray-700">
                    { pendingIssues > 0 && <span className="font-semibold text-gray-900">{pendingIssues || 0} <span className="font-normal text-gray-700">pending</span> </span> } 
                    { pendingIssues > 0 && inProgressIssues > 0 && <span>/</span> }
                    { inProgressIssues > 0 && <span className="font-semibold text-gray-900">{inProgressIssues || 0} <span className="font-normal text-gray-700">in progress</span></span> } issues need to be resolved</p>
                  <button 
                    onClick={()=>{
                      navigate('/issues-list');
                      window.scroll(0,0);
                    }}
                    className="mt-8 px-3 py-1 bg-red-700 text-white text-sm rounded-xl hover:bg-red-800 cursor-pointer"
                  >View Details</button>
                </div>
              )
            }
          </div>
        </div>
      )
    }

    {/* department wise bed occupancy */}
    <div className="w-full px-5 py-3 mt-8 border border-gray-300 rounded-xl bg-white">

    {/* heading */}
    <div className="px-1 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className={`p-1 rounded-lg text-xl bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-300`}>
          <FaBed size={18}/>
        </div>
        <p className="font-medium text-gray-700">Department Wise Bed Occupancy</p>
      </div>
      <p className="bg-fuchsia-200 border-fuchsia-700 text-fuchsia-600 px-3 py-1 rounded-lg text-xs font-medium">Real-Time</p>
    </div>

    <div className="grid md:grid-cols-3 grid-cols-2 gap-3 mt-4 mb-3">
    {
      departmentStats?.map((dept, index)=>(
        <div
         key={index}
         className="p-5 rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition"
        >

        {/* Header */}
        <div className="flex justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">
            {dept.departmentName}
          </p>

          <span className="text-sm font-bold text-gray-800">
            {dept.percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">

          <div
            className={`h-full ${dept.color} transition-all duration-500`}
            style={{ width: `${dept.percentage}%` }}
          />

        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 space-y-1">

          <p className="flex justify-between">
            <span>Total Beds</span>
            <span className="font-medium">{dept.totalBeds}</span>
          </p>

          <p className="flex justify-between">
            <span>Occupied</span>
            <span className="text-red-500 font-medium">
              {dept.occupiedBeds}
            </span>
          </p>

          <p className="flex justify-between">
            <span>Available</span>
            <span className="text-green-600 font-medium">
              {dept.availableBeds}
            </span>
          </p>

        </div>

        {/* Status badge */}
        <div
          className={`mt-4 text-center py-2 rounded-lg text-sm font-semibold
          ${dept.status === "High" && "bg-red-100 text-red-600"}
          ${dept.status === "Moderate" && "bg-yellow-100 text-yellow-700"}
          ${dept.status === "Low" && "bg-green-100 text-green-700"}
          `}
        >
          {dept.status} Occupancy
        </div>

        </div>
      ))
    }
    </div>

    </div>

    {/* quick actions */}
    <div className="bg-white border border-gray-400 rounded-xl p-5 w-full mt-8">
      <h3 className="text-md font-semibold text-gray-700 mb-4">
        Quick Actions
      </h3>

      <div className="grid md:grid-cols-6 grid-cols-3 gap-4">
        {actions.map((item, index) => (
          <div
            key={index}
            onClick={() => {navigate(item.path); window.scroll(0,0)}}
            className="
              group cursor-pointer 
              border-2 border-purple-300 rounded-xl
              flex flex-col items-center justify-center
              py-4
              transition-all duration-200
              hover:bg-purple-100
              hover:border-purple-400
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


