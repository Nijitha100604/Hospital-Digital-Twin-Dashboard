import { useContext, useEffect, useState, useRef } from 'react'
import { 
  FaRegCalendarCheck, 
  FaPlus, 
  FaCheckCircle, 
  FaRedo, 
  FaCalendarTimes, 
  FaSearch, 
  FaFilter, 
  FaPhone, 
  FaEye,
  FaTimes, 
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from "react-icons/fa";
import { MdSchedule } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { PatientContext } from '../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import AccessDenied from '../../components/AccessDenied';

function AllAppointments() {

  const navigate = useNavigate();
  const { fetchAppointments, appointments, appLoading} = useContext(PatientContext);
  const { token, userData } = useContext(AppContext);

  const role = userData?.designation;
  const staffId = userData?.staffId;

  const roleBasedAppointments = role === "Doctor"
  ? appointments?.filter(item => item?.doctorId === staffId) || []
  : appointments || [];

  // Appointment counts
  const totalAppointments = roleBasedAppointments?.length || 0;
  const scheduledAppointments = roleBasedAppointments?.filter(
    item => item.status === "Scheduled"
  ).length || 0;
  const cancelledAppointments = roleBasedAppointments?.filter(
    item => item.status === "Cancelled"
  ).length || 0;
  const inProgressAppointments = roleBasedAppointments?.filter(
    item => item.status === "In Progress"
  ).length || 0;
   const completedAppointments = roleBasedAppointments?.filter(
    item => item.status === "Completed"
  ).length || 0;

  // Styling for each status
   const getStatusClass = (status) =>{
    switch(status?.toLowerCase()){
      case "scheduled":
        return "bg-blue-500 border border-blue-700"
      case "completed":
        return "bg-green-600 border border-green-700"
      case "in progress":
        return "bg-yellow-600 border border-yellow-700"
      case "cancelled":
        return "bg-red-600 border border-red-700"
      default:
        return "bg-white"
    }
  }

  // Filters 
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filterRef = useRef(null);
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

  const filteredData = roleBasedAppointments?.filter((item)=>{
    
    const searchMatch = searchTerm.trim() === "" || item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item?.patientId?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !filters.status || item?.status?.toLowerCase() === filters.status.toLowerCase();
    const consultationMatch = !filters.consultation || item?.consultationType === filters.consultation;
  
    const dateMatch =
    !filters.date || item?.date === filters.date;
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
  const totalPages = Math.max(1, Math.ceil(filteredData.length / records_per_page));

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (!openFilter) return;

      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [openFilter]);

  useEffect(()=>{
      if(token){
        fetchAppointments();
      }
      window.scroll(0,0);
  }, [token, fetchAppointments]);

  if (!userData || appLoading) {
   return (
      <div className="flex justify-center items-center h-60">
         <div className="w-10 h-10 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
      </div>
   );
  }

  if(role === "Support" || role === "Pharmacist" || role === "Technician"){
    return <AccessDenied />
  }

  if(appLoading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching Appointments...
        </p>
      </div>
      </div>
    )
  };

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

      {/* Header and book appointment */}
      <div className="flex flex-wrap justify-between items-center gap-3">

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
      {
        (role === "Receptionist" || role === "Admin") && (
          <button 
            className="flex gap-2 items-center text-white bg-fuchsia-800 px-3 py-2.5 cursor-pointer rounded-xl leading-none transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
            onClick={()=>navigate("/book-appointment")}
          >
            <FaPlus size={16} />Book Appointment
          </button>
        )
      }
      
      </div>

      {/* Appointment summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 mt-4">

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Appointments</p>
            <p className="text-xl font-bold text-gray-900">{totalAppointments}</p>
          </div>
          <div className="hidden md:flex bg-fuchsia-200 px-3 py-3 rounded-lg border border-fuchsia-300">
            <FaRegCalendarCheck size={20} className="text-fuchsia-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-xl font-bold text-gray-900">{completedAppointments}</p>
          </div>
          <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300 hidden md:flex">
            <FaCheckCircle size={20} className="text-green-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Scheduled</p>
            <p className="text-xl font-bold text-gray-900">{scheduledAppointments}</p>
          </div>
          <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300 hidden md:flex">
            <MdSchedule size={20} className="text-blue-800"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-xl font-bold text-gray-900">{inProgressAppointments}</p>
          </div>
          <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300 hidden md:flex">
            <FaRedo size={20} className="text-yellow-700"/>
          </div>
        </div>

        <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-600">Cancelled</p>
            <p className="text-xl font-bold text-gray-900">{cancelledAppointments}</p>
          </div>
          <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300 hidden md:flex">
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
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-700 bg-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e)=>{
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
        </div>
      
        {/* Filters */}
        <div ref={filterRef} className = "flex flex-wrap gap-3">
      
          {/* Date */}
          <div className="relative flex flex-col">
            <button 
              className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                  hover:shadow-md hover:shadow-gray-400
                  active:scale-95
                  ${openFilter === "date"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-800  hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
                  }`}
                onClick = {()=>setOpenFilter(openFilter === "date" ? null : "date")}
            >
              <FaFilter size={15}/> 
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
                <FaFilter size={15} /> 
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
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
                  {
                    ["All","Completed", "In Progress", "Scheduled", "Cancelled"].map((item, index) => (
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
      
          {/* Consultation Filter */}
          <div className="relative flex flex-col">
      
            <button 
              className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                  hover:shadow-md hover:shadow-gray-400
                  active:scale-95
                  ${openFilter === "consultation"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-800  hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
                  }`}
              onClick={() => setOpenFilter(openFilter === "consultation" ? null : "consultation")}
            >
              <FaFilter size={15}/> 
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

            {/* Consultation drop down */}
            {openFilter === "consultation" && (
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
                  {
                    ["All", "In-Person", "Online"].map((item, index) => (
                      <li 
                        key={index}
                        onClick={()=>handleFilterSelect("consultation", item === "All" ? null : item)}
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

      {!appLoading && paginatedData.length === 0 && (
        <div className="flex flex-col items-center justify-center h-75 gap-4 text-center">
          <div className="bg-gray-200 p-4 rounded-full">
            <FaCalendarTimes className="text-gray-600 text-3xl" />
          </div>
          <p className="text-gray-800 text-lg font-semibold">
            No Appointments Found
          </p>
          <p className="text-gray-500 text-sm max-w-sm">
            There are currently no appointments available.  
          </p>

        </div>
      )}

      {
      !appLoading && paginatedData.length > 0 && (
      <div className="mt-4 w-full px-2 flex flex-col gap-3">
        {
          paginatedData.map((item, index)=>(
            <div 
              key={index}
              className="flex items-center flex-wrap gap-4 justify-between px-3 py-3 bg-white border border-gray-500 rounded-lg hover:bg-gray-100 cursor-pointer hover:shadow-md hover:shadow-gray-500 hover:border-gray-800"
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
              <p className={`text-sm font-medium px-2 py-1 w-20 text-center rounded-lg ${item?.consultationType === "In-Person" ? "bg-red-300 text-red-600" : "bg-blue-300 text-blue-600"}`} >{item?.consultationType}</p>
              <p className="text-sm text-gray-700 font-bold">{item?.date}</p>
              <p className={`text-sm font-semibold px-3 py-2 text-white rounded-lg cursor-pointer ${getStatusClass(item?.status)}`}>{item?.status}</p>
              <FaEye 
                size={20}
                onClick={(e) => { 
                  e.stopPropagation();
                  navigate(`/view-appointment/${item?.appointmentId}`); 
                  window.scrollTo(0, 0)
                }}
              />
            </div>
          ))
        }
      </div>
       )
      }

      {/* table bottom */}
      <div className="flex flex-wrap gap-3 justify-between items-center mt-4">

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

    </>
  )
}

export default AllAppointments