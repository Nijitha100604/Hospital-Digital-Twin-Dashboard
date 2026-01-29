import { useContext, useEffect, useState } from 'react'
import { 
  FaHospitalUser,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEye,
  FaTimes, 
  FaSpinner,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaExclamationCircle
} from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
import { PatientContext } from '../../context/PatientContext';
import { formatDate } from '../../utils/formatDate';

function PatientList() {

  const { patients, patientLoading } = useContext(PatientContext);

  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    date: null
  })

  // data filter 

  const filteredData = patients.filter((item)=>{
    const searchMatch = searchTerm.trim() === "" || item.personal?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.patientId?.toLowerCase().includes(searchTerm.toLowerCase());

    const genderMatch = !filters.gender || item.personal?.gender === filters.gender;

    const ageMatch = (() => {
    if (!filters.age) return true;
    const age = item.personal?.age;

    if (filters.age === "1-18") return age >= 1 && age <= 18;
    if (filters.age === "19-30") return age >= 19 && age <= 30;
    if (filters.age === "31-50") return age >= 31 && age <= 50;
    if (filters.age === "51-80") return age >= 51 && age <= 80;
    if (filters.age === "80+") return age > 80;

    return true;
    })();

    const dateMatch =
    !filters.date || formatDate(item.createdAt) === formatDate(filters.date);
    return searchMatch && genderMatch && ageMatch && dateMatch;
  });

  const records_per_page = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1)*records_per_page;

  // Paginating the data

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + records_per_page
  );
  const totalPages = Math.ceil(filteredData.length / records_per_page);

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

  const navigate = useNavigate();

  useEffect(()=>{
    window.scroll(0,0);
  })

  return (
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

      {/* Top Section */}
      
      <div className="w-full px-4 py-4 gap-3 flex flex-wrap justify-between items-center">
        
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
        <button 
          className="flex gap-2 items-center text-white bg-fuchsia-800 px-4 py-3 cursor-pointer rounded-xl 
          leading-none transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
          onClick={()=>navigate("/add-new-patient")}
        >
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
                className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                  hover:shadow-md hover:shadow-gray-400
                  active:scale-95
                  ${openFilter === "date"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
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


            {/* Gender filter */}
            <div className="relative flex flex-col">
              <button 
                className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                  hover:shadow-md hover:shadow-gray-400
                  active:scale-95
                  ${openFilter === "gender"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
                  }`}
                onClick={() => setOpenFilter(openFilter === "gender" ? null : "gender")}
              >
                <FaFilter size={15} /> 
                Gender
                {openFilter === "gender" && (
                  <FaTimes
                    size={12}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, gender: null }));
                      setOpenFilter(null);
                    }}
                  />
                )}
              </button>

              {/* Gender Drop down */}

              {openFilter === "gender" && (
                <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
                  {
                    ["Male", "Female"].map((item, index) => (
                      <li 
                        key={index}
                        onClick={()=>handleFilterSelect("Gender", item)}
                        className="px-3 rounded-md py-2 text-sm cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
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
                className={`flex items-center gap-2 px-2 py-2 rounded-xl border text-sm cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:scale-105
                  hover:shadow-md hover:shadow-gray-400
                  active:scale-95
                  ${openFilter === "age"
                  ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700"
                  : "border-gray-500 bg-gray-300 text-gray-800 hover:bg-gray-200 hover:text-gray-900 hover:font-bold"
                  }`}
                onClick = {()=>setOpenFilter(openFilter === "age" ? null : "age")}
              >
                <FaFilter size={15} /> 
                Age Group
                {openFilter === "age" && (
                  <FaTimes
                    size={12}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, age: null }));
                      setOpenFilter(null);
                    }}
                  />
                )}
              </button>

              {
                openFilter === "age" && (
                  <ul className="mt-2 absolute top-full left-0 bg-white border rounded-md shadow-sm w-32 z-10">
                    {
                      ["1-18", "19-30", "31-50", "51-80", "80+"].map((item, index) =>(
                        <li
                          key = {index}
                          onClick = {() => handleFilterSelect("Age", item)}
                          className="px-3 rounded-md py-2 text-sm cursor-pointer hover:bg-fuchsia-200 hover:text-fuchsia-900 hover:font-semibold"
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

      {/* Bottom Section */}

      <div className="mt-2 rounded-lg bg-white-50 p-4">
        <div className="w-full overflow-x-auto">

          {/* patient records table */}

          {
            patientLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-gray-600 text-lg">
                <FaSpinner className="animate-spin" />
                Loading Patients...
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex gap-3 items-center text-fuchsia-800 justify-center py-10 font-medium text-lg">
                <FaExclamationCircle size={18}/>
                No patient data found.
              </div>
            ) : (
            <table className="min-w-max w-full border border-gray-300">

            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Patient ID</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Patient Name</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Gender</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Age</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Created At</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">Contact</th>
                <th className="px-4 py-3 text-left text-sm text-gray-900 font-semibold">View</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-800">
              {
                paginatedData.map((item)=>(
                  <tr key={item.patientId} className="border-b hover:bg-gray-100 hover:border hover:font-semibold cursor-pointer">
                    <td className="px-4 py-3">{item.patientId}</td>
                    <td className="px-4 py-3">{item.personal?.name}</td>
                    <td className="px-4 py-3">{item.personal?.gender}</td>
                    <td className="px-4 py-3">{item.personal?.age}</td>
                    <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">{item.personal?.contact}</td>
                    <td className="px-4 py-3">
                      <button 
                        className="text-gray-600 hover:text-gray-900 cursor-pointer"
                        onClick={()=> {navigate(`/patient-profile/${item.patientId}`); window.scrollTo(0, 0) }}
                      >
                        <FaEye size={20} />
                      </button>
                    </td>

                  </tr>
                ))
              }
            </tbody>

          </table>
          )
          }

          

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

      
    </div>
  )
}

export default PatientList