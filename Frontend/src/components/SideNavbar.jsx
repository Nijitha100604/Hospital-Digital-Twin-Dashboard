import React from 'react'
import { FaUsers } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { FaMicroscope } from "react-icons/fa";
import { FaCogs } from "react-icons/fa";
import { FaUserNurse } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

function SideNavbar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div 
      className={`
        fixed md:static top-0 left-0
        mt-16 md:mt-16 
        w-52 min-h-screen
        bg-white border border-gray-300 
        py-4 z-40
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}>
    
    <div className="flex justify-end px-4 mb-2 md:hidden">
      <FaTimes 
        size={15} 
        className="cursor-pointer text-gray-500"
         onClick={() => setIsSidebarOpen(false)}
      />
    </div>

    {/* Patient Management */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaUsers size={22} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">PATIENT SERVICES</p>
      </div>
      
      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Patient List</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Add New Patient</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Patient Profile</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Appointment Booking</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Discharge Summary</li>
      </ul>

    </div>

    {/* Hospital Infrastructure */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaHospital size={20} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">INFRASTRUCTURE</p>
      </div>

      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Department List</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Bed Availability</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Facility Map</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Cleaning Schedule</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Report Issue</li>
      </ul>

    </div>

    {/* Inventory */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaBoxes size={20} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">INVENTORY</p>
      </div>

      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Medicine Stock</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Add Medicine</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Stock Alerts</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Suppliers</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Purchase Orders</li>
      </ul>

    </div>
    
    {/* Equipment */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaCogs size={20} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">EQUIPMENT</p>
      </div>

      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Equipment List</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Add New Equipment</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Calibration Schedule</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Maintenace Log</li>
      </ul>

    </div>

    {/* Laboratory */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaMicroscope size={20} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">LABORATORY</p>
      </div>

      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Lab Reports</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Results Entry</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Patient-Wise Reports</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Upload Report</li>
      </ul>

    </div>

    {/* Staff Management */}
    <div className="mb-4">

      <div className="flex gap-2 px-4">
        <FaUserNurse size={20} className="text-gray-500"/>
        <p className="font-semibold text-md text-gray-500 mb-2">WORKFORCE</p>
      </div>

      <ul className="items-center">
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Staff List</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Add New Staff</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Staff Profile</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Shift Planner</li>
        <li className="hover:font-semibold text-sm text-gray-800 cursor-pointer px-4 py-1">Attendance and Leave</li>
      </ul>

    </div>

    </div>
  )
}

export default SideNavbar