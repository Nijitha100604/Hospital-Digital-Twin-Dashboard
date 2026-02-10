import { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { 
  FaEye,
  FaBuilding, 
  FaCheckCircle, 
  FaFilter, 
  FaFlask,  
  FaHospital, 
  FaPlus,
  FaSearch,
  FaTimes,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaCalendarTimes,
  FaTimesCircle
} from 'react-icons/fa';
import { DeptContext } from '../../context/DeptContext';
import { AppContext } from '../../context/AppContext';

function DepartmentsList() {

  const navigate = useNavigate(); 
  const { departments, fetchDepartments, loading } = useContext(DeptContext);
  const { token, userData } = useContext(AppContext);
  const role = userData?.designation;

  const totalDept = departments?.length;
  const activeDept = departments?.filter(
    item => item.status === "Active"
  ).length;
  const inactiveDept = departments?.filter(
    item => item.status === "Inactive"
  ).length;
  const labUnits = departments?.filter(
    item => item.deptType === "Laboratory"
  ).length;

  // Filters
  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const filterRef = useRef(null);
  const [filters, setFilters] = useState({
    status: null,
    floor: null
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

  const filteredData = departments?.filter((item)=>{
            
    const searchMatch = searchTerm.trim() === "" || item.deptName?.toLowerCase().includes(searchTerm.toLowerCase()) || item.deptId?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = !filters.status || item?.status === filters.status;
    const floorMatch = !filters.floor || item?.floor === filters.floor;
            
    return searchMatch && statusMatch && floorMatch ;
        
  });

  // Paginated Data
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
      fetchDepartments();
    }
  }, [token, fetchDepartments])


  if(loading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching Departments...
        </p>
      </div>
      </div>
    )
  };

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading and button */}
    <div className="flex flex-wrap gap-3 justify-between items-center">

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaBuilding 
            size={18}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">Departments List</p>
        </div>
        <p className="text-gray-500 text-sm">Complete list of hospital departments and their status</p>
      </div>

      {
        role === "Admin" && (
          <button 
            className="flex gap-2 items-center text-white bg-fuchsia-800 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600 
            transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
            onClick={()=>navigate("/add-department")}
          >
            <FaPlus size={16} />Add Department
          </button>
        )
      }
      

    </div>

    {/* Summary */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-4">

      {/* Total Departments */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Departments</p>
          <p className="text-xl font-bold text-gray-900">{totalDept}</p>
        </div>
        <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
          <FaHospital size={20} className="text-blue-800"/>
        </div>
      </div>

      {/* Active */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Active Departments</p>
          <p className="text-xl font-bold text-gray-900">{activeDept}</p>
        </div>
        <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
          <FaCheckCircle size={20} className="text-green-800"/>
        </div>
      </div>

      {/* Inactive */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Inactive Departments</p>
          <p className="text-xl font-bold text-gray-900">{inactiveDept}</p>
        </div>
        <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
          <FaTimesCircle size={20} className="text-red-800"/>
        </div>
      </div>

      {/* Laboratory */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Laboratories</p>
          <p className="text-xl font-bold text-gray-900">{labUnits}</p>
        </div>
        <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300">
          <FaFlask size={20} className="text-yellow-800"/>
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
            placeholder = "Search by Dept Name or Dept ID"
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
           
        {/* Floor Filter */}
        <div className="relative">
          <button
            className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm
              transition-all duration-300 ease-in-out
              hover:scale-105
              hover:shadow-md hover:shadow-gray-400
              active:scale-95
              cursor-pointer
            ${openFilter === "floor"
              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
              : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
            }`}
            onClick={() =>
              setOpenFilter(openFilter === "floor" ? null : "floor")
            }
          >
          <FaFilter size={14} />
          Floor
          {openFilter === "floor" && (
            <FaTimes
              size={12}
              className="cursor-pointer"
              onClick={(e) => {
              e.stopPropagation();
              setFilters(prev => ({ ...prev, floor: null }));
              setOpenFilter(null);
              }}
            />
          )}
          </button>
    
          {openFilter === "floor" && (
            <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
              {["All", "Ground Floor", "Second Floor", "First Floor", "Third Floor"].map((item, i) => (
                <li
                  key={i}
                  onClick={() =>
                  handleFilterSelect("floor", item === "All" ? null : item)
                  }
                  className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
                >
                  {item}
                </li>
              ))}
            </ul>
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
              cursor-pointer
            ${openFilter === "status"
              ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
              : "border-gray-500 bg-gray-300 text-gray-800  hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
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
            <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-28 z-10">
              {["All", "Active", "Inactive"].map((item, i) => (
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
              
      </div>
              
    </div>

    {/* Content */}

    <div className="mt-4 w-full overflow-x-auto">

    <table className="min-w-max w-full border border-gray-300">
    
      <thead className="bg-gray-300">
        <tr>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Department ID</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Department Name</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Head of Department</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Block</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Floor</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Status</th>
          <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">View</th>
        </tr>
      </thead>
    
      <tbody className="text-sm text-gray-700">

      {!loading && paginatedData.length === 0 ? (
      <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
          <div className="bg-gray-200 p-4 rounded-full">
            <FaCalendarTimes className="text-gray-600 text-3xl" />
          </div>
          <p className="text-gray-800 text-lg font-semibold">
            No Departments found
          </p>
          <p className="text-gray-500 text-sm max-w-sm">
            There are currently no departments available.
          </p>
        </div>
      </td>
      </tr>
      ) : (
      paginatedData.map((item) => (
      <tr
        key={item.deptId}
        className="border-b hover:bg-gray-100 hover:border-2 hover:font-semibold cursor-pointer"
      >
        <td className="px-4 py-3">{item?.deptId}</td>
        <td className="px-4 py-3">{item?.deptName}</td>
        <td className="px-4 py-3">{item?.hod}</td>
        <td className="px-4 py-3">{item?.block}</td>
        <td className="px-4 py-3">{item?.floor}</td>
        <td
          className={`px-4 py-3 font-semibold ${
            item?.status === "Active"
              ? "text-green-700"
              : "text-red-700"
          }`}
        >
          {item.status}
        </td>
        <td className="px-4 py-3">
          <button
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={() => {
              navigate(`/department/${item.deptId}`);
              window.scrollTo(0, 0);
            }}
          >
            <FaEye size={20} />
          </button>
        </td>
      </tr>
      ))
      )}
      </tbody>
 
    </table> 

    </div>

    {/* Bottom of the table */}

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

export default DepartmentsList