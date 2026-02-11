import { useState, useRef } from 'react'
import { 
  FaExclamationCircle, 
  FaPlus,
  FaBug, 
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaPauseCircle,
  FaSearch,
  FaFilter,
  FaTimes,
  FaMapMarkerAlt,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCalendarTimes
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DeptContext } from '../../context/DeptContext';
import { useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { formatDate } from './../../utils/formatDate';

function IssuesList() {

  const navigate = useNavigate();

  const { token, userData } = useContext(AppContext);
  const { fetchIssues, issues, issueLoading, updateIssueStatus } = useContext(DeptContext);

  const role = userData?.designation;
  const staffId = userData?.staffId;

  const roleBasedIssues = role !== "Admin"
  ? issues?.filter(item => item?.reporterId === staffId) || []
  : issues || [];

  const totalIssues = roleBasedIssues ?.length;
  const completed = roleBasedIssues ?.filter(
    item => item.status === "Resolved"
  ).length;
  const pending = roleBasedIssues ?.filter(
    item => item.status === "Pending"
  ).length;
  const inProgress = roleBasedIssues ?.filter(
    item => item.status === "In Progress"
  ).length;
  const onHold = roleBasedIssues ?.filter(
    item => item.status === "On Hold"
  ).length;

  // Filters
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const records_per_page = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const filterRef = useRef(null);
  const [filters, setFilters] = useState({
      status: null,
      priority: null
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

  const filteredData = roleBasedIssues ?.filter((item)=>{
              
    const searchMatch = searchTerm.trim() === "" || item.issueType?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !filters.status || item.status === filters.status;
    const priorityMatch = !filters.priority || item.priorityLevel === filters.priority;
              
    return searchMatch && statusMatch && priorityMatch;
          
  });

  // Paginated Data
  const startIndex = (currentPage - 1)*records_per_page;      
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + records_per_page
  );
  const totalPages = Math.ceil(filteredData.length / records_per_page);

  const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {

    case "critical":
      return "text-red-500";

    case "high":
      return "text-orange-500";

    case "medium":
      return "text-yellow-600";

    case "low":
      return "text-blue-500";

    case "resolved":
      return "bg-green-600 border border-green-700 text-white";

    case "pending":
      return "bg-gray-500 border border-gray-700 text-white";

    case "in progress":
      return "bg-blue-600 border border-blue-700 text-white";

    case "on hold":
      return "bg-amber-600 border border-amber-800 text-white";


    default:
      return "bg-gray-200 border border-gray-300 text-gray-800";
  }
  };

  const STATUS_FLOW = {
    "Pending": ["In Progress", "On Hold", "Resolved"],
    "In Progress": ["On Hold", "Resolved"],
    "On Hold": ["In Progress", "Resolved"],
  };

  const [activeStatusIssue, setActiveStatusIssue] = useState(null);

  const handleStatusUpdate = async(issueId, newStatus) => {
    const updateData = {
      id: issueId,
      status: newStatus
    }
    const check = await updateIssueStatus(updateData);
    if (check) {
      setActiveStatusIssue(null);
    }
  };

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
      fetchIssues();
    }

  }, [token, fetchIssues])

  if(issueLoading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching Issues...
        </p>
      </div>
      </div>
    )
  };


  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading and Button */}
    <div className="flex flex-wrap gap-3 justify-between items-center">
    
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaExclamationCircle 
            size={18}
            className="text-gray-500" 
          />
            <p className="text-gray-800 font-bold text-lg">Infrastructure Issue Reports</p>
        </div>
        <p className="text-gray-500 text-sm">Report and track infrastructure problems</p>
      </div>
    
      <button 
        className="flex gap-2 items-center text-white bg-fuchsia-900 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        onClick={()=>navigate("/issue-report")}
      >
        <FaPlus size={16} />Report Issue
      </button>
    
    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 mt-4">

    {/* Total Issues */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Total Issues</p>
        <p className="text-xl font-bold text-gray-900">{totalIssues}</p>
      </div>
      <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
        <FaBug size={20} className="text-blue-800"/>
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
        <p className="text-sm font-medium text-gray-600">Pending</p>
        <p className="text-xl font-bold text-gray-900">{pending}</p>
      </div>
      <div className="bg-orange-200 px-3 py-3 rounded-lg border border-orange-300">
        <FaClock size={20} className="text-orange-800"/>
      </div>
    </div>

    {/* Pending */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">In Progress</p>
        <p className="text-xl font-bold text-gray-900">{inProgress}</p>
      </div>
      <div className="bg-cyan-200 px-3 py-3 rounded-lg border border-cyan-300">
        <FaSpinner size={20} className="text-cyan-800"/>
      </div>
    </div>

    {/* On Hold */}
    <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">On Hold</p>
        <p className="text-xl font-bold text-gray-900">{onHold}</p>
      </div>
      <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
        <FaPauseCircle size={20} className="text-red-800"/>
      </div>
    </div>

    </div>

    {/* Search and Filters */}
    <div className="w-full flex flex-wrap gap-4 items-center">

    {/* Search */}
    <div className="relative flex-1">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none text-gray-500"/>
        <input 
          type="text" 
          placeholder = "Search by Issue Type"
          className="w-lg pl-9 pr-3 py-2.5 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-700 bg-gray-300 rounded-lg"
          value={searchTerm}
          onChange={(e)=>{
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
    </div>

    {/* Filters */}
    <div ref={filterRef} className = "flex gap-3">
               
      {/* Status Filter */}
      <div className="relative">
        <button
          className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
            transition-all duration-300 ease-in-out
            hover:scale-105
            hover:shadow-md hover:shadow-gray-400
            active:scale-95
            cursor-pointer
            ${openFilter === "status"
              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
              : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
              }`}
              onClick={() =>
                setOpenFilter(openFilter === "status" ? null : "status")
              }
              >
              <FaFilter size={14} />
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
            {["All", "Pending", "Resolved", "In Progress", "On Hold"].map((item, i) => (
              <li
                key={i}
                onClick={() =>
                  handleFilterSelect("status", item === "All" ? null : item)
                }
                className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    
      {/* Priority filter */}
      <div className="relative">
        <button 
          className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
            transition-all duration-300 ease-in-out
            hover:scale-105
            hover:shadow-md hover:shadow-gray-400
            active:scale-95
            cursor-pointer
            ${openFilter === "priority"
            ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
            : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
          }`}
          onClick={() => setOpenFilter(openFilter === "priority" ? null : "priority")}
        >
        <FaFilter size={14}/> 
          Priority Level
        {openFilter === "priority" && (
          <FaTimes
            size={12}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setFilters(prev => ({ ...prev, priority: null }));
              setOpenFilter(null);
            }}
          />
        )}
        </button>
            
        {openFilter === "priority" && (
          <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-28 z-10">
            {["All", "High", "Medium", "Low", "Critical"].map((item, i) => (
              <li
                key={i}
                onClick={() =>
                  handleFilterSelect("priority", item === "All" ? null : item)
                }
                className="px-3 rounded-md py-2 text-sm cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
                  
    </div>

    </div>

    {!issueLoading && paginatedData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-75 gap-4 text-center">
            <div className="bg-gray-200 p-4 rounded-full">
              <FaCalendarTimes className="text-gray-600 text-3xl" />
            </div>
            <p className="text-gray-800 text-lg font-semibold">
              No issues found
            </p>
            <p className="text-gray-500 text-sm max-w-sm">
              There are currently no issues available.  
            </p>
        
          </div>
    )}

    {/* Content */}
    {
      !issueLoading && paginatedData.length > 0 && ( 
    <div className="mt-4 w-full px-2 flex flex-col gap-3">
      {
        paginatedData.map((item,index)=>(
          <div 
            key={index}
            className="flex items-center flex-wrap gap-4 justify-between px-3 py-3 bg-white border border-gray-400 rounded-lg hover:bg-gray-50 hover:border-2 cursor-pointer"
          >
            <div className="w-full flex flex-col gap-2">

              <div className="w-full flex flex-wrap justify-between items-center gap-4 px-3 border-b border-gray-400 pb-3">
                
                <div className="flex flex-col gap-2 items-start">
                  <p className="text-gray-900 font-semibold">{item?.issueType}</p>
                  <div className="flex gap-2 items-center">
                    <FaMapMarkerAlt 
                      size={16}
                      className="text-gray-800"
                    />
                    <p className="text-sm text-gray-800 font-medium">{item?.location}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm text-gray-700">Reported By</p>
                  <p className="text-gray-900 font-semibold text-sm">{item?.reportedBy}</p>
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm text-gray-700">Reported Date</p>
                  <p className="text-gray-900 font-semibold text-sm">{formatDate(item?.createdAt)}</p>
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm text-gray-700">Status</p>
                  <p className={`text-sm px-3 py-1 rounded-lg ${getStatusClass(item?.status)}`}>{item?.status}</p>
                </div>

                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm text-gray-700">Priority Level</p>
                  <p className={`text-sm font-bold ${getStatusClass(item.priorityLevel)}`}>{item?.priorityLevel}</p>
                </div>

              </div>

              <div className="w-full px-3 flex justify-between flex-wrap items-center mb-1 mt-2">

                <div className="flex gap-2 items-center">
                  <p className="text-sm px-2 py-1 bg-cyan-200 text-gray-900 rounded-md">{item?.block}</p>
                  <p className="text-sm font-medium text-gray-700">{item?.description}</p>
                </div>


                {
                  role === "Admin" && item.status !== "Resolved" && (
                    <div className="relative">
                    <button
                      onClick={() =>
                        setActiveStatusIssue(
                          activeStatusIssue === item.issueId ? null : item.issueId
                        )
                      }
                    className="px-3 py-2 bg-fuchsia-800 text-sm text-white font-medium rounded-lg cursor-pointer
                    transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                    >
                      Update Status
                    </button>

                    {/* Status Options Dropdown */}
                    {activeStatusIssue === item.issueId && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-20 w-40">
                      {STATUS_FLOW[item.status]?.map((nextStatus, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          handleStatusUpdate(item.issueId, nextStatus)
                        }
                        className="w-full text-left px-4 py-2 text-sm hover:bg-fuchsia-100 hover:text-fuchsia-900"
                      >
                        {nextStatus}
                      </button>
                    ))}
                    </div>
                )}
                    </div>
                  )
                }

              </div>

            </div>
          </div>
        ))
      }
    </div>
     )
    }

    {/* Bottom */}
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

    </>
  )
}

export default IssuesList