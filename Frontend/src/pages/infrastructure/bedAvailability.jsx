import React, { useState } from 'react'
import { departmentBedData } from '../../data/infrastructure';
import {
  FaBed,
  FaMinusCircle,
  FaCheckCircle,
  FaChartPie,
  FaSearch
} from "react-icons/fa";
import { MdOutlineBed } from "react-icons/md";

function BedAvailability() {

  const totalBeds = departmentBedData.reduce(
    (sum, dept) => sum + dept.beds.length, 0
  );
  const occupiedBeds = departmentBedData.reduce(
    (sum, dept) => sum + dept.beds.filter(b => b.status === "Occupied").length, 0
  );
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = departmentBedData
    .map(dept => {
    const filteredBeds = dept.beds.filter(bed =>
      bed.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deptMatch = dept.departmentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return {
      ...dept,
      beds: deptMatch ? dept.beds : filteredBeds
    };
  }).filter(dept => dept.beds.length > 0);



  return (
    <>
    
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex flex-col gap-1">
      <p className="text-gray-800 font-bold text-lg">Bed Availability</p>
      <p className="text-gray-500 text-sm">View and manage real-time bed occupancy across hospital wards</p>
    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">

    {/* Total Beds */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Total Beds</p>
        <p className="text-xl font-bold text-gray-900">{totalBeds}</p>
      </div>
      <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
        <FaBed size={20} className="text-blue-800"/>
      </div>
    </div>

    {/* Occupied beds */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Occupied Beds</p>
        <p className="text-xl font-bold text-gray-900">{occupiedBeds}</p>
      </div>
      <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
        <FaMinusCircle size={20} className="text-red-800"/>
      </div>
    </div>

    {/* Available beds */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Available Beds</p>
        <p className="text-xl font-bold text-gray-900">{availableBeds}</p>
      </div>
      <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
        <FaCheckCircle size={20} className="text-green-800"/>
      </div>
    </div>

    {/* Occupancy Rate */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
        <p className="text-xl font-bold text-gray-900">{occupancyRate} %</p>
      </div>
      <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300">
        <FaChartPie size={20} className="text-yellow-800"/>
      </div>
    </div>

    </div>

    {/* Search button */}
    <div className="relative flex-1">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-500"/>
        <input 
          type="text" 
          placeholder = "Search by Ward Name or Bed Type"
          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-700 bg-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e)=>{
            setSearchTerm(e.target.value);
          }}
        />
    </div>

    {/* Bed Availability */}
    <div className="flex flex-col gap-5 mt-4">
      {
        filteredDepartments.map((dept, deptIndex)=>{

          const total = dept.beds.length;
          const oBeds = dept.beds.filter(b => b.status === "Occupied").length;
          const aBeds = total - oBeds;
          const rate = Math.round((oBeds / total) * 100);

          return(
            <div 
              key={deptIndex}
              className="bg-white border border-gray-300 rounded-xl p-4"
            >

            {/* Header */}
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-800">{dept.departmentName}</p>
              <p className="text-sm text-gray-500">{dept.floor}</p>
            </div>

            {/* Bed Grid */}

            <div className="flex flex-wrap gap-4 items-center mb-4">
              {
                dept.beds.map((bed, index)=>(
                  <div
                    key = {index}
                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg border
                    ${ bed.status === "Available"
                    ? "bg-green-50 border-green-400 text-green-600"
                    : "bg-red-50 border-red-400 text-red-600"
                    }`}
                  >
                    <MdOutlineBed 
                      size={24} 
                    />
                    <p className="text-xs">{bed.bedId}</p>
                  </div>
                ))
              }
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              
            {/* Total Beds */}
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-700">Total Beds</p>
              <p className="text-lg font-bold text-blue-800">{total}</p>
            </div>

            {/* Occupied Beds */}
            <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-center">
              <p className="text-sm text-red-700">Occupied</p>
              <p className="text-lg font-bold text-red-800">{oBeds}</p>
            </div>

            {/* Occupancy Rate */}
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center">
              <p className="text-sm text-yellow-700">Occupancy</p>
              <p className="text-lg font-bold text-yellow-800">
                {rate}%
              </p>
            </div>

            {/* Available Beds */}
            <div className="bg-green-50 border border-green-300 rounded-lg p-3 text-center">
              <p className="text-sm text-green-700">Available</p>
              <p className="text-lg font-bold text-green-800">{aBeds}</p>
            </div>

            </div>


            </div>
          )
        })
      }
    </div>

    </div>

    </>
  )
}

export default BedAvailability