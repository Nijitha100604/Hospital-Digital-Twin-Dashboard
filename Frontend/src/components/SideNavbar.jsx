import React from "react";
import { FaUsers } from "react-icons/fa";
import { FaHospital } from "react-icons/fa";
import { FaBoxes } from "react-icons/fa";
import { FaMicroscope } from "react-icons/fa";
import { FaCogs } from "react-icons/fa";
import { FaUserNurse } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SideNavbar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <div
      className={`
    fixed top-16 left-0
    w-52
    h-[calc(100vh-4rem)]
    bg-white border-r border-gray-300
    py-4 z-40
    overflow-y-auto hide-scrollbar
    transition-transform duration-300
    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
    >
      <div className="flex justify-end px-4 mb-2 md:hidden">
        <FaTimes
          size={15}
          className="cursor-pointer text-gray-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* MAIN */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaHome size={22} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">HOME</p>
        </div>

        <ul>
          <NavLink
            to="/home"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `
              block px-4 py-1 text-sm cursor-pointer
              ${
                isActive
                  ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
                  : "text-gray-800 hover:font-semibold"
              }
            `}
          >
            Main
          </NavLink>
        </ul>
      </div>

      {/* Patient Management */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaUsers size={22} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">
            PATIENT SERVICE
          </p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/patient-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Patient List
          </NavLink>

          <NavLink
            to="/add-new-patient"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Add New Patient
          </NavLink>

          <NavLink
            to="/all-appointments"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Appointment Booking
          </NavLink>

          <NavLink
            to="/vitals-entry"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Vitals Entry
          </NavLink>

          <NavLink
            to="/consultations"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Consultations
          </NavLink>
        </ul>
      </div>

      {/* Hospital Infrastructure */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaHospital size={20} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">
            INFRASTRUCTURE
          </p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/departments-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Department List
          </NavLink>

          <NavLink
            to="/bed-availability"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Bed Availability
          </NavLink>

          <NavLink
            to="/facility-map"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Facility Map
          </NavLink>

          <NavLink
            to="/issues-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Report issues
          </NavLink>
        </ul>
      </div>

      {/* Inventory */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaBoxes size={20} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">INVENTORY</p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/medicine-stocks"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Medicine Stock
          </NavLink>

          <NavLink
            to="/add-new-medicine"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Add Medicine
          </NavLink>

          <NavLink
            to="/stock-alerts"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Stock Alerts
          </NavLink>

          <NavLink
            to="/suppliers-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Suppliers
          </NavLink>

          <NavLink
            to="/purchase-order"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Purchase Order
          </NavLink>
        </ul>
      </div>

      {/* Equipment */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaCogs size={20} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">EQUIPMENT</p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/equipment-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Equipment List
          </NavLink>

          <NavLink
            to="/add-equipment"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Add New Equipment
          </NavLink>

          <NavLink
            to="/calibration-schedule-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Calibration Schedule
          </NavLink>

          <NavLink
            to="/maintenance-log"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Maintenance Log
          </NavLink>
        </ul>
      </div>

      {/* Laboratory */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaMicroscope size={20} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">LABORATORY</p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/lab-reports-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Lab Reports
          </NavLink>

          <NavLink
            to="/lab-results-entry"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Results Entry
          </NavLink>

          <NavLink
            to="/patient-wise-reports"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Patient-Wise Reports
          </NavLink>

          <NavLink
            to="/upload-report"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Upload Report
          </NavLink>
        </ul>
      </div>

      {/* Staff Management */}
      <div className="mb-4">
        <div className="flex gap-2 px-4">
          <FaUserNurse size={20} className="text-gray-500" />
          <p className="font-semibold text-md text-gray-500 mb-2">WORKFORCE</p>
        </div>

        <ul className="items-center">
          <NavLink
            to="/staff-list"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Staff List
          </NavLink>

          <NavLink
            to="/add-staff"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Add Staff
          </NavLink>

          <NavLink
            to="/staff-profile"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Staff Profile
          </NavLink>

          <NavLink
            to="/shift-planner"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Shift Planner
          </NavLink>

          <NavLink
            to="/leave-management"
            onClick={() => window.scrollTo(0, 0)}
            className={({ isActive }) => `block px-4 py-1 text-sm cursor-pointer
          ${
            isActive
              ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
              : "text-gray-800 hover:font-semibold"
          }`}
          >
            Attendance and Leave
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default SideNavbar;
