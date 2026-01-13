import React from 'react'
import { assets } from './../assets/assets';
import { FaRegBell } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { MdOutlineHome } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function TopNavbar({ setIsSidebarOpen }) {

  const navigate = useNavigate();

  return (

    <div className="flex justify-between items-center fixed top-0 left-0 w-full h-16 z-50 bg-white px-4 border-b border-gray-300">

      {/* Left section */}
      <div className="flex items-center gap-3">
        <FaBars 
          size={24} 
          className="cursor-pointer text-gray-600 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
        <img className="block w-25 sm:w-28 cursor-pointer" src={assets.logo} alt="hospital-logo"/>
      </div>

      {/* Right section */}
      <div className="flex gap-6 items-center">

        {/* Home  */}
        <MdOutlineHome 
          size={28} 
          className="cursor-pointer text-gray-600"
          onClick={()=>navigate('/')}
        />

        {/* Notification */}
        <FaRegBell size={22} className="cursor-pointer text-gray-600"/>

        {/* User details */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1 rounded-xl border border-gray-900 bg-gray-200">
          <img className="w-10 h-10 rounded-full border border-gray-700" src={assets.topNav_profile} alt="topNavbar-profile"/>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Dr. John Smith</p>
            <p className="text-xs text-gray-600">Doctor</p>
          </div>
        </div>

        {/* Logout */}
        <FaArrowRightFromBracket size={22} className="cursor-pointer text-gray-600"/>
      </div>
    </div>
  )
}

export default TopNavbar