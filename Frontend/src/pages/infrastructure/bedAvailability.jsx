import React, { useState } from 'react';
import {
  FaBed,
  FaMinusCircle,
  FaCheckCircle,
  FaChartPie,
  FaSearch
} from "react-icons/fa";
import { MdOutlineBed } from "react-icons/md";
import AvailableBedModal from '../../components/modals/AvailableBedModal';
import OccupiedBedModal from '../../components/modals/OccupiedBedModal';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { DeptContext } from '../../context/DeptContext';
import { useEffect } from 'react';
import { StaffContext } from './../../context/StaffContext';

function BedAvailability() {

  const { token } = useContext(AppContext);
  const { fetchBeds, beds, bedLoading, fetchPendingBedRequests, pendingBedRequests } = useContext(DeptContext);
  const { staffs, fetchStaffs } = useContext(StaffContext);

  const totalBeds = beds?.reduce(
    (sum, dept) => sum + dept.beds.length, 0
  );
  const occupiedBeds = beds?.reduce(
    (sum, dept) => sum + dept.beds.filter(b => b.status === "Occupied").length, 0
  );

  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = totalBeds ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBed, setSelectedBed] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBedRequest, setSelectedBedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const filteredDepartments = beds
    ?.map(dept => {
    const filteredBeds = dept.beds.filter(bed =>
      bed.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.bedType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deptMatch = dept.departmentName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return {
      ...dept,
      beds: deptMatch ? dept.beds : filteredBeds
    };
  }).filter(dept => dept.beds.length > 0);

  const getBedStyle = (bedType, status) => {
  if (status === "Occupied") {
    return "bg-red-100 border-red-400 text-red-700";
  }

  switch (bedType) {
    case "ICU":
      return "bg-violet-100 border-violet-400 text-violet-700";
    case "OT":
      return "bg-amber-100 border-amber-500 text-amber-800";
    case "General":
    default:
      return "bg-green-100 border-green-400 text-green-700";
  }
  };

  const doctorMap = React.useMemo(() => {
    const map = {};
    staffs?.forEach(staff => {
      map[staff.staffId] = staff.fullName;
    });
    return map;
  }, [staffs]);

  useEffect(()=>{

    if(token){
      fetchBeds();
      fetchPendingBedRequests();
      fetchStaffs();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if(bedLoading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching Beds...
        </p>
      </div>
      </div>
    )
  };


  return (
    <>
    
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex justify-between items-center gap-4">
    <div className="flex flex-col gap-1">
      <p className="text-gray-800 font-bold text-lg">Bed Availability</p>
      <p className="text-gray-500 text-sm">View and manage real-time bed occupancy across hospital wards</p>
    </div>

    {/* Bed requests */}
    <button
      onClick={() => setShowRequestModal(true)}
      className="relative px-4 py-2 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg border cursor-pointer border-gray-600 transition-all"
    >
      Bed Requests
      {
        pendingBedRequests.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {pendingBedRequests.length}
          </span>
        )
      }
    </button>
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

    {/* Legend */}
    <div className="flex flex-wrap gap-4 mt-3 mb-3 text-xs">
  
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
        <p>General Bed</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-violet-500 rounded-sm"></span>
        <p>ICU Bed</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
        <p>OT Bed</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
        <p>Occupied</p>
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
              <p className="text-sm text-gray-500">{dept.floor} • {dept.block}</p>
            </div>

            {/* Bed Grid */}

            <div className="flex flex-wrap gap-4 items-center mb-4">
              {
                dept.beds.map((bed, index)=>{
                  const isMismatch = selectedBedRequest && bed.bedType !== selectedBedRequest.bedType;
                  return(
                  <div
                    key = {index}

                    onClick={() => {
                      if(isMismatch) return;
                      setSelectedBed({
                        ...bed,
                        department: dept.departmentName
                      });
                      setModalType(
                        bed.status === "Available" ? "AVAILABLE" : "OCCUPIED"
                      );
                      setShowModal(true);
                    }}

                    className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-md border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95
                    ${isMismatch ? "opacity-40 cursor-not-allowed" : ""}
                    ${getBedStyle(bed.bedType, bed.status)}`}
                  >
                    <MdOutlineBed 
                      size={18} 
                    />
                    <p className="text-[10px] font-medium">{bed.bedId}</p>
                  </div>)
                })
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
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-700">Occupancy</p>
              <p className="text-lg font-bold text-gray-800">
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

    {/* Modal */}
    {
      showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg max-h-[90vh] flex flex-col relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            >
              x
            </button>
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
            {modalType === "AVAILABLE" && (
              <AvailableBedModal 
                bed={selectedBed} 
                bedRequest={selectedBedRequest}
                onClose={() => {
                  setSelectedBedRequest(null);
                  setShowModal(false);
                }}
              />
            )}
            {modalType === "OCCUPIED" && (
              <OccupiedBedModal 
                bed={selectedBed} 
                onClose={() => setShowModal(false)}
              />
            )}
            </div>
          </div>
        </div>
      )
    }

    {
      showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <p className="text-lg font-bold text-gray-800">Bed Requests</p>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-500 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* requests */}
            <div className="p-4 overflow-y-auto flex flex-col gap-3">
              {
                pendingBedRequests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">
                    No pending bed requests
                  </p>
                ) : (
                  pendingBedRequests.map((req, index)=>(
                    <div
                      key={index}
                      className="w-full border border-gray-300 rounded-lg p-3 flex flex-col gap-3"
                    >

                      <span className="text-sm text-gray-900 font-medium border border-gray-500 rounded-lg px-3 py-1 w-fit">
                        {req.requestId}
                      </span>

                      <div className="flex flex-wrap md:px-10 items-center justify-between gap-4">

                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-900">{req.patientName}</p>
                          <p className="text-sm text-gray-500">{req.patientId}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-gray-900">{req.doctorId}</p>
                          <p className="text-sm text-gray-500">{doctorMap[req.doctorId] || "-"}</p>
                        </div>

                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Bed Type</p>
                          <p className="text-sm font-medium text-gray-900">{req.bedType}</p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedBedRequest(req);
                            setShowRequestModal(false);
                          }}
                          className="px-4 py-2 bg-green-700 text-white text-sm rounded-md hover:bg-green-800 whitespace-nowrap cursor-pointer"
                        >
                          Assign Bed
                        </button>

                      </div>
                    </div>

                  ))
                )
              }
            </div>
          </div>
        </div>
      )
    }

    </>
  )
}

export default BedAvailability