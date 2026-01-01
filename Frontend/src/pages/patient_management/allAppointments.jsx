import React, { useState } from 'react'
import { FaRegCalendarCheck, FaPlus, FaCheckCircle, FaRedo, FaCalendarTimes, FaSearch, FaFilter, FaPhone, FaEye } from "react-icons/fa";
import { MdSchedule } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { allAppointments } from './../../data/patient';

function AllAppointments() {

  const navigate = useNavigate();

  // Appointment counts
  const totalAppointments = allAppointments.length;
  const scheduledAppointments = allAppointments.filter(
    item => item.status === "Scheduled"
  ).length;
  const cancelledAppointments = allAppointments.filter(
    item => item.status === "Cancelled"
  ).length;
  const rescheduledAppointments = allAppointments.filter(
    item => item.status === "Rescheduled"
  ).length;
   const completedAppointments = allAppointments.filter(
    item => item.status === "Completed"
  ).length;

  // Styling for each status
   const getStatusClass = (status) =>{
    switch(status?.toLowerCase()){
      case "scheduled":
        return "bg-blue-500 border border-blue-700"
      case "completed":
        return "bg-green-600 border border-green-700"
      case "rescheduled":
        return "bg-yellow-600 border border-yellow-700"
      case "cancelled":
        return "bg-red-600 border border-red-700"
      default:
        return "bg-white"
    }
  }

  // Formating input date

  const formatToInputDate = (dateStr) => {
    const [day, monthStr, year] = dateStr.split(" ");

  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  return `${year}-${months[monthStr]}-${day.padStart(2, "0")}`;
  };


  // Filters 

  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: null,
    consultation: null,
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

  const filteredData = allAppointments.filter((item)=>{
    
    const searchMatch = searchTerm.trim() === "" || item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || item.patientId.toLowerCase().includes(searchTerm.toLowerCase());
  
    const statusMatch = !filters.status || item.status === filters.status;

    const consultationMatch = !filters.consultation || item.appointmentType === filters.consultation;
  
    const dateMatch =
    !filters.date || formatToInputDate(item.date) === filters.date;
    return searchMatch && statusMatch && consultationMatch && dateMatch;

  });


  // Paginating the data

  const records_per_page = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1)*records_per_page;

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + records_per_page
  );
  const totalPages = Math.ceil(filteredData.length / records_per_page);

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

      {/* Header and book appointment */}
      <div className="flex flex-wrap justify-between items-center">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaRegCalendarCheck 
            size={20}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">All Appointments</p>
        </div>
        <p className="text-gray-500 text-sm">Manage all patient appointments</p>
      </div>

      {/* Book appointment Button */}
      <button 
        className="flex gap-2 items-center text-white bg-fuchsia-900 px-3 py-2.5 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600"
        onClick={()=>navigate("/book-appointment")}
      >
        <FaPlus size={16} />Book Appointment
      </button>

      </div>

      {/* Appointment summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 mt-4">

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Appointments</p>
            <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
          </div>
          <div className="bg-fuchsia-200 px-3 py-3 rounded-lg border border-fuchsia-300">
            <FaRegCalendarCheck size={20} className="text-fuchsia-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-xl font-bold text-gray-900">{completedAppointments}</p>
          </div>
          <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
            <FaCheckCircle size={20} className="text-green-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-xl font-bold text-gray-900">{scheduledAppointments}</p>
          </div>
          <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
            <MdSchedule size={20} className="text-blue-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Rescheduled</p>
            <p className="text-xl font-bold text-gray-900">{rescheduledAppointments}</p>
          </div>
          <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300">
            <FaRedo size={20} className="text-yellow-700"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Cancelled</p>
            <p className="text-xl font-bold text-gray-900">{cancelledAppointments}</p>
          </div>
          <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
            <FaCalendarTimes size={20} className="text-red-700"/>
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
                className="flex gap-2 items-center bg-gray-300 px-2 py-2 rounded-xl border border-gray-500 cursor-pointer text-gray-700 text-sm"
                onClick={() => setOpenFilter(openFilter === "status" ? null : "status")}
              >
                <FaFilter size={15} className="text-gray-500"/> Status
              </button>

              {/* Status drop down */}
              {openFilter === "status" && (
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-26 z-10">
                  {
                    ["All","Completed", "Rescheduled", "Scheduled", "Cancelled"].map((item, index) => (
                      <li 
                        key={index}
                        onClick={()=>handleFilterSelect("status", item === "All" ? null : item)}
                        className="px-3 py-2 text-sm cursor-pointer hover:font-semibold hover:text-gray-900 text-gray-700"
                      >
                      {item}
                      </li>
                    ))
                  }
                </ul>
              )}
            </div>
      
          {/* Consultation Filter */}
          <div className="relative flex flex-col">
      
            <button 
              className="flex gap-2 items-center bg-gray-300 px-2 py-2 rounded-xl border border-gray-500 cursor-pointer text-gray-700 text-sm"
              onClick={() => setOpenFilter(openFilter === "consultation" ? null : "consultation")}
            >
              <FaFilter size={15} className="text-gray-500"/> Consultation
            </button>

            {/* Consultation drop down */}
            {openFilter === "consultation" && (
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-lg shadow-sm w-26 z-10">
                  {
                    ["All", "In-Person", "Online"].map((item, index) => (
                      <li 
                        key={index}
                        onClick={()=>handleFilterSelect("consultation", item === "All" ? null : item)}
                        className="px-3 py-2 text-sm cursor-pointer hover:font-semibold hover:text-gray-900 text-gray-700"
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

      <div className="mt-4 w-full px-2 flex flex-col gap-3">
        {
          paginatedData.map((item, index)=>(
            <div 
              key={index}
              className="flex items-center flex-wrap gap-4 justify-between px-3 py-3 bg-white border border-gray-400 rounded-lg hover:bg-gray-300 cursor-pointer"
            >
              <p className="inline-flex text-sm bg-gray-300 font-medium text-gray-800 px-3 py-2 items-center rounded-lg">{item.appointmentNumber}</p>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm font-bold">{item.patient.name}</p>
                <p className="text-sm text-gray-600">{item.patientId}</p>
                <div className="flex gap-2 items-center">
                  <FaPhone 
                    size={12} 
                    className="text-gray-600"
                  />
                  <p className="text-sm text-gray-600">{item.patient.contact}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <p className="text-sm font-bold">{item.doctorName}</p>
                <p className="text-sm text-gray-600">{item.doctorCategory}</p>
              </div>
              <p className={`text-sm font-medium px-2 py-1 w-20 text-center rounded-lg ${item.consultationType === "In-Person" ? "bg-red-300 text-red-600" : "bg-blue-300 text-blue-600"}`} >{item.consultationType}</p>
              <p className="text-sm text-gray-700 font-bold">{item.date}</p>
              <p className={`text-sm font-semibold px-3 py-2 text-white rounded-lg cursor-pointer ${getStatusClass(item.status)}`}>{item.status}</p>
              <FaEye 
                size={20}
                onClick={() => { navigate(`/view-appointment/${item.patientId}`); window.scrollTo(0, 0)}}
              />
            </div>
          ))
        }
      </div>

      {/* Bottom of the table */}
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

export default AllAppointments