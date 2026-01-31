import React, { useState } from 'react'
import { 
    FaNotesMedical,
    FaCalendarAlt,
    FaCheckCircle,
    FaHourglassHalf,
    FaFilter,
    FaSearch,
    FaPhone,
    FaEdit,
    FaEye,
    FaTimes,
    FaAngleDoubleRight,
    FaAngleDoubleLeft
 } from "react-icons/fa";
import VitalModal from './../../components/modals/VitalModal';
import { useContext } from 'react';
import { PatientContext } from './../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import { useEffect } from 'react';

function VitalsEntry() {

  const {appointments,fetchAppointments, patients, fetchPatients} = useContext(PatientContext);
  const {token} = useContext(AppContext);

  const getAppointmentStatus = (appointmentId, patientId)=>{

    const patient = patients.find(p => p.patientId === patientId);
    if(!patient || !patient.vitals) return "Pending";

    const hasVitals = patient.vitals.some(
      v => v.appointmentId === appointmentId
    );

    return hasVitals ? "Completed" : "Pending";
  }

  const vitalsList = appointments?.map((appt) => ({
    ...appt,
    status: getAppointmentStatus(appt.appointmentId, appt.patientId)
  }));

    const totalAppointments = vitalsList.length;
    const completed = vitalsList.filter(
        item => item.status === "Completed"
    ).length;
    const pending = vitalsList.filter(
        item => item.status === "Pending"
    ).length;

    // Filters
    const [openFilter, setOpenFilter] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        status: null,
        date: null
    })

    const handleFilterSelect = (type, value) =>{
    setFilters((prev)=>(
      {
        ...prev,
        [type.toLowerCase()] : value, 
      }
    ));
    setCurrentPage(1);
    setOpenFilter(null)
    }

    const filteredData = vitalsList.filter((item)=>{
        
      const searchMatch = searchTerm.trim() === "" || item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item?.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusMatch = !filters.status || item?.status === filters.status;
      
      const dateMatch = !filters.date || item?.date === filters.date;
        
      return searchMatch && statusMatch && dateMatch;
    
    });

    // Paginated data

    const records_per_page = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1)*records_per_page;
    
    const paginatedData = filteredData.slice(
        startIndex,
        startIndex + records_per_page
    );
    const totalPages = Math.ceil(filteredData.length / records_per_page);

    const getStatusClass = (status) =>{
    switch(status?.toLowerCase()){
      case "completed":
        return "bg-green-600 border border-green-700"
      case "pending":
        return "bg-yellow-600 border border-orange-700"
      default:
        return "bg-white"
      }
    }

    // PopUp screens

    const [openPopUp, setOpenPopUp] = useState(false);
    const [popUpType, setPopUpType] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(()=>{
      if(token){
        fetchAppointments();
        fetchPatients();
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
            <FaNotesMedical
                size={18}
                className="text-gray-500" 
            />
            <p className="text-gray-800 font-bold text-lg">Vitals Entry</p>
        </div>
        <p className="text-gray-500 text-sm">Record and update patient vital signs</p>
    </div>

     {/* Summary */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 mt-4">
     
        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
            </div>
            <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
                <FaCalendarAlt size={20} className="text-blue-800"/>
            </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900">{completed}</p>
            </div>
            <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
                <FaCheckCircle size={20} className="text-green-800"/>
            </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">{pending}</p>
            </div>
            <div className="bg-orange-200 px-3 py-3 rounded-lg border border-orange-300">
                <FaHourglassHalf size={20} className="text-orange-600"/>
            </div>
        </div>
     
    </div>

    {/* Search and Filters */}
    <div className="w-full flex flex-wrap gap-4 items-center">
          
        {/* Search button */}
          
        <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-500"/>
                <input 
                type="text" 
                placeholder = "Search by Patient Name or Patient ID"
                className="w-lg pl-9 pr-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-700 bg-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e)=>{
                setSearchTerm(e.target.value);
                setCurrentPage(1);
                }}
                />
        </div>
          
        {/* Filters */}
        <div className = "flex gap-3">
          
            {/* Date */}
            <div className="relative flex flex-col">
                <button 
                  className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
                  ${openFilter === "date"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-700"
                  }`}
                  onClick = {()=>setOpenFilter(openFilter === "date" ? null : "date")}
                >
                  <FaFilter size={15} /> 
                  Date
                  {openFilter === "date" && (
                    <FaTimes
                      size={12}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters(prev => ({ ...prev, date: null }));
                        setOpenFilter(null);
                      }}
                    />
                  )}
                </button>
    
                {
                  openFilter === "date" && (
                  <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-30 z-10">
                    <li>
                      <input
                        type="date"
                        onChange={(e) => {
                        setFilters((prev) => ({
                        ...prev,
                        date: e.target.value,
                        }));
                        setCurrentPage(1);
                        }}
                        className="w-full border border-gray-500 rounded-md px-2 py-1 text-sm cursor-pointer"
                        />
                    </li>
                  </ul>
                    )
                  }
    
            </div>
    
            {/* Status filter */}
            <div className="relative flex flex-col">
                <button 
                  className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
                  ${openFilter === "status"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-700"
                  }`}
                    onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
                >
                    <FaFilter size={15}/> 
                    Status
                    {openFilter === "status" && (
                      <FaTimes
                        size={12}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilters(prev => ({ ...prev, status: null }));
                            setOpenFilter(null);
                          }}
                      />
                    )}
                </button>
    
                {/* Status drop down */}
                {openFilter === "status" && (
                    <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-28 z-10">
                      {
                        ["All","Completed", "Pending"].map((item, index) => (
                          <li 
                            key={index}
                            onClick={()=>handleFilterSelect("status", item === "All" ? null : item)}
                            className="px-3 rounded-md py-2 text-sm cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
                          >
                          {item}
                          </li>
                        ))
                      }
                    </ul>
                  )}
            </div>
          
        </div>
          
    </div>

    {/* Data */}
    <div className="mt-4 w-full px-2 flex flex-col gap-3">
        {
            paginatedData.map((item, index)=>(
            <div 
            key={index}
            className="flex items-center flex-wrap gap-4 justify-between px-3 py-3 bg-white border border-gray-400 rounded-lg hover:bg-gray-100 cursor-pointer hover:shadow-md hover:shadow-gray-500 hover:border-gray-800"
            >
                <p className="inline-flex text-sm bg-gray-300 font-medium text-gray-800 px-3 py-2 items-center rounded-lg">{item?.appointmentId}</p>
                <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm font-bold">{item?.name}</p>
                    <p className="text-sm text-gray-600">{item?.patientId}</p>
                    <div className="flex gap-2 items-center">
                    <FaPhone 
                    size={12} 
                    className="text-gray-600"
                    />
                    <p className="text-sm text-gray-600">{item?.contact}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <p className="text-sm font-bold">{item?.doctorName}</p>
                    <p className="text-sm text-gray-600">{item?.department}</p>
                </div>
                <p className="text-sm text-gray-700 font-bold">{item?.date}</p>
                <p className={`text-sm font-semibold px-3 py-2 text-white rounded-lg cursor-pointer ${getStatusClass(item?.status)}`}>{item?.status}</p>
                
                {
                  item?.status === "Pending" ?
                  <FaEdit
                    size={20}
                    className="text-blue-700 cursor-pointer"
                    onClick={()=>{
                      setSelectedPatient(item);
                      setPopUpType("edit");
                      setOpenPopUp(true);
                    }}
                  /> :
                  <FaEye 
                    size={20}
                    className="text-gray-800 cursor-pointer"
                    onClick={()=>{
                      setSelectedPatient(item);
                      setPopUpType("view");
                      setOpenPopUp(true);
                    }}
                  />
                }
                
                </div>
              ))
            }
    </div>

    {/* Bottom of the page */}
    <div className="flex justify-between items-center mt-4">
    
      <div className="text-gray-600 text-sm">
        Showing {paginatedData.length} of {filteredData.length} records
      </div>
    
      <div className="flex gap-2 items-center">
        <button 
          disabled={currentPage === 1}
          className="px-2 py-2 text-sm text-fuchsia-800 border rounded-full disabled:opacity-50 cursor-pointer" 
          onClick={()=>setCurrentPage((p)=>p-1)}
        >
          <FaAngleDoubleLeft size={18}/>
        </button>
    
        <span className = "text-sm px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>
    
        <button 
          disabled={currentPage === totalPages}
          className="px-2 py-2 text-sm text-fuchsia-800 border rounded-full disabled:opacity-50 cursor-pointer" 
          onClick={()=>setCurrentPage((p)=>p+1)}
        >
          <FaAngleDoubleRight size={18}/>
        </button>
      </div>
    
    </div>

    </div>

    <VitalModal
      open={openPopUp}
      type={popUpType}
      item={selectedPatient}
      patients={patients}
      onClose={() => setOpenPopUp(false)}
    />

    </>
  )
}


export default VitalsEntry

