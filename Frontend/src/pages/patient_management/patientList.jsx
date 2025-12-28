import React, { useState } from 'react'
import { FaHospitalUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";

function PatientList() {

  const [openFilter, setOpenFilter] = useState(null);

  const handleFilterSelect = (type, value) =>{
    console.log(`${type} selected : `, value);
    setOpenFilter(null);
  }

  return (
    <>

      {/* Top Section */}

      <div className="w-full bg-white px-4 py-4 gap-3 flex flex-wrap justify-between items-center">
        
        {/* Page description */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <FaHospitalUser 
              size={24}
              className="text-gray-500" 
            />
            <p className="text-gray-800 font-bold text-lg">Patient Records</p>
          </div>
          <p className="text-gray-500 text-sm">Centralized Patient Details and Visit Information</p>
        </div>

        {/* Add New Patient Button */}
        <button className="flex gap-2 items-center text-white bg-fuchsia-900 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600">
          <FaPlus size={16} />Add New Patient
        </button>

        <div className="w-full flex flex-wrap gap-4 items-center">

          {/* Search button */}

          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-500"/>
            <input 
              type="text" 
              placeholder = "Search by Patient Name or Patient ID"
              className="w-lg pl-9 pr-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-700 bg-gray-300 rounded-lg"
            />
          </div>

          {/* Filters */}
          <div className = "flex gap-3">

            {/* Date */}
            <div className="relative flex flex-col">

              <button 
                className="flex gap-2 items-center bg-gray-300 px-2 py-2 rounded-xl border border-gray-500 cursor-pointer text-gray-700 text-sm"
                onClick = {()=>setOpenFilter(openFilter === "date" ? null : "date")}
              >
                <FaFilter size={15} className="text-gray-500"/> Date
              </button>

              {
                openFilter === "date" && (
                  <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-30 z-10">
                    <li>
                      <input
                        type="date"
                        onChange={(e) => handleFilterSelect("Date", e.target.value)}
                        className="w-full border border-gray-500 rounded-md px-2 py-1 text-sm cursor-pointer"
                      />
                    </li>
                  </ul>
                )
              }

            </div>


            {/* Gender filter */}
            <div className="relative flex flex-col">
              <button 
                className="flex gap-2 items-center bg-gray-300 px-2 py-2 rounded-xl border border-gray-500 cursor-pointer text-gray-700 text-sm"
                onClick={() => setOpenFilter(openFilter === "gender" ? null : "gender")}
              >
                <FaFilter size={15} className="text-gray-500"/> Gender
              </button>

              {/* Gender Drop down */}

              {openFilter === "gender" && (
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-22 z-10">
                  {
                    ["Male", "Female"].map((item, index) => (
                      <li 
                        key={index}
                        onClick={()=>handleFilterSelect("Gender", item)}
                        className="px-3 py-2 text-sm cursor-pointer hover:font-semibold hover:text-gray-900 text-gray-700"
                      >
                      {item}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>

            {/* Age Filter */}
            <div className="relative flex flex-col">

              <button 
                className="flex gap-2 items-center bg-gray-300 px-2 py-2 rounded-xl border border-gray-500 cursor-pointer text-gray-700 text-sm"
                onClick = {()=>setOpenFilter(openFilter === "age" ? null : "age")}
              >
                <FaFilter size={15} className="text-gray-500"/> Age Group
              </button>

              {
                openFilter === "age" && (
                  <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-27 z-10">
                    {
                      ["1-18", "19-30", "31-50", "51-80", "80+"].map((item, index) =>(
                        <li
                          key = {index}
                          onClick = {() => handleFilterSelect("Age", item)}
                          className="px-3 py-2 text-sm cursor-pointer hover:font-semibold hover:text-gray-900 text-gray-700"
                        >
                          {item}
                        </li>
                      ))
                    }
                  </ul>
                )
              }

            </div>

            

          </div>

        </div>

      </div>

      
    </>
  )
}

export default PatientList