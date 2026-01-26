import React, { useState } from 'react'
import { 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock,
  FaFilter,
  FaSearch,
  FaSyncAlt, 
  FaUserMd,
  FaTimes,
  FaPhone,
  FaEye,
  FaCalendarTimes
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { PatientContext } from '../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import { useEffect } from 'react';

function Consultations() {

  const navigate = useNavigate();

  const {appointments, fetchAppointments, appLoading} = useContext(PatientContext);
  const {token} = useContext(AppContext);

  const totalAppointments = appointments?.length;
  const completed = appointments?.filter(
    item => item?.status === "Completed"
  ).length;
  const inProgress = appointments?.filter(
    item => item?.status === "In Progress"
  ).length;
  const scheduled = appointments?.filter(
    item => item?.status === "Scheduled"
  ).length;

  // Filters
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: null,
    consultation: null,
    date: null
  })

  // eslint-disable-next-line no-unused-vars
  const isActive = (name) => openFilter === name;

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

  const filteredData = appointments?.filter((item)=>{
          
    const searchMatch = searchTerm.trim() === "" || item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !filters.status || item?.status === filters.status;
    const consultationMatch = !filters.consultation || item?.consultationType === filters.consultation;
    const dateMatch = !filters.date || item?.date === filters.date;
          
    return searchMatch && statusMatch && consultationMatch && dateMatch;
      
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
      case "in progress":
        return "bg-yellow-600 border border-orange-700"
      case "scheduled":
        return "bg-blue-600 border border-blue-700"
      default:
        return "bg-white"
    }
  }

  useEffect(()=>{

    if(token){
      fetchAppointments();
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if(appLoading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching onsultations...
        </p>
      </div>
      </div>
    )
  };

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex flex-col gap-1">
      <div className="flex gap-3 items-center">
        <FaUserMd
          size={18}
          className="text-gray-500" 
        />
        <p className="text-gray-800 font-bold text-lg">Doctor Consultation</p>
      </div>
      <p className="text-gray-500 text-sm">Patient evaluation, diagnosis, and treatment</p>
    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">

      {/* total appointments */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Appointments</p>
          <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
        </div>
        <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
          <FaCalendarAlt size={20} className="text-blue-800"/>
        </div>
      </div>

      {/* Completed */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Completed</p>
          <p className="text-xl font-bold text-gray-900">{completed}</p>
        </div>
        <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
          <FaCheckCircle size={20} className="text-green-800"/>
        </div>
      </div>
    
      {/* In Progress */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">In Progress</p>
          <p className="text-xl font-bold text-gray-900">{inProgress}</p>
        </div>
        <div className="bg-orange-200 px-3 py-3 rounded-lg border border-orange-300">
          <FaSyncAlt size={20} className="text-orange-600"/>
        </div>
      </div>

      {/* Scheduled */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Scheduled</p>
          <p className="text-xl font-bold text-gray-900">{scheduled}</p>
        </div>
        <div className="bg-fuchsia-200 px-3 py-3 rounded-lg border border-fuchsia-300">
          <FaClock size={20} className="text-fuchsia-600"/>
        </div>
      </div>
         
    </div>

    {/* Search and Filter */}
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
      <div className="relative">
        <button
          className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
            transition-all duration-300 ease-in-out
            hover:scale-105
            hover:shadow-md hover:shadow-gray-400
            active:scale-95
            ${openFilter === "date"
              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
              : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
            }`}
          onClick={() => setOpenFilter(openFilter === "date" ? null : "date")}
        >
        <FaFilter size={14} />
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

        {openFilter === "date" && (
          <div className="mt-2 absolute top-full left-0 bg-white rounded-lg shadow-sm p-2 z-10">
            <input
              type="date"
              className="border border-gray-400 rounded-md px-2 py-1 text-sm"
              onChange={(e) => {
              setFilters(prev => ({ ...prev, date: e.target.value }));
              setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>
    
      {/* Status filter */}
      <div className="relative">
          <button 
            className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
            transition-all duration-300 ease-in-out
            hover:scale-105
            hover:shadow-md hover:shadow-gray-400
            active:scale-95
            ${openFilter === "status"
              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
              : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
            }`}
          onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
          >
          <FaFilter size={14}/> 
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
    
          {openFilter === "status" && (
            <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
              {["All", "Completed", "In Progress", "Scheduled"].map((item, i) => (
                <li
                  key={i}
                  onClick={() =>
                  handleFilterSelect("status", item === "All" ? null : item)
                  }
                  className="px-3 rounded-md py-2 text-sm cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
      </div>
          
      {/* Consultation Filter */}
      <div className="relative">
        <button
          className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
            transition-all duration-300 ease-in-out
            hover:scale-105
            hover:shadow-md hover:shadow-gray-400
            active:scale-95
          ${openFilter === "consultation"
            ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
            : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
          }`}
          onClick={() =>
            setOpenFilter(openFilter === "consultation" ? null : "consultation")
          }
        >
        <FaFilter size={14} />
        Consultation
        {openFilter === "consultation" && (
          <FaTimes
            size={12}
            className="cursor-pointer"
            onClick={(e) => {
            e.stopPropagation();
            setFilters(prev => ({ ...prev, consultation: null }));
            setOpenFilter(null);
            }}
          />
        )}
        </button>

        {openFilter === "consultation" && (
          <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
            {["All", "In-Person", "Online"].map((item, i) => (
              <li
                key={i}
                onClick={() =>
                  handleFilterSelect("consultation", item === "All" ? null : item)
                }
                className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
          
      </div>
          
    </div>

    {!appLoading && paginatedData.length === 0 && (
      <div className="flex flex-col items-center justify-center h-75 gap-4 text-center">
        <div className="bg-gray-200 p-4 rounded-full">
          <FaCalendarTimes className="text-gray-600 text-3xl" />
        </div>
        <p className="text-gray-800 text-lg font-semibold">
          No consultations found
        </p>
        <p className="text-gray-500 text-sm max-w-sm">
          There are currently no consultations available.  
        </p>
    
      </div>
    )}

    {/* Content */}
    { !appLoading && paginatedData.length > 0 && (
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
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm text-gray-700 font-bold">{item?.date}</p>
              <p className="text-sm text-gray-600">{item?.timeSlot}</p>
            </div>          
            <p className={`text-sm font-medium px-2 py-1 w-20 text-center rounded-lg ${item?.consultationType === "In-Person" ? " text-red-600" : " text-blue-600"}`} >{item?.consultationType}</p>
            <p className={`text-sm font-semibold px-3 py-2 text-white rounded-lg cursor-pointer ${getStatusClass(item?.status)}`}>{item?.status}</p>
            <FaEye 
              size={20}
              className="text-gray-800 cursor-pointer"
              onClick = {()=>{navigate(`/patient-consultation/${item._id}`)}}
            />
          </div>
        ))
      }
    </div>
    ) }

    {/* Bottom of the page */}
    <div className="flex justify-end gap-2 mt-4">
        <button 
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50 cursor-pointer" 
        onClick={()=>setCurrentPage((p)=>p-1)}
        >
          Prev
        </button>

        <span className = "text-sm px-2 py-1">
          Page {currentPage} of {totalPages}
        </span>

        <button 
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50 cursor-pointer" 
        onClick={()=>setCurrentPage((p)=>p+1)}
        >
          Next
        </button>

    </div>

    </div>

    </>
  )
}

export default Consultations