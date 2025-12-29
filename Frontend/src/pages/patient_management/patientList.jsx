import React, { useState } from 'react'
import { FaHospitalUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { patient_records } from './../../data/patient';
import { useNavigate } from 'react-router-dom';

function PatientList() {

  const [openFilter, setOpenFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: null,
    age: null,
    date: null
  })

  // Format the Input date

  const formatToInputDate = (dateStr) => {
    const [day, monthStr, year] = dateStr.split(" ");

  const months = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  return `${year}-${months[monthStr]}-${day.padStart(2, "0")}`;
  };

  // data filter 

  const filteredData = patient_records.filter((item)=>{
    const searchMatch = searchTerm.trim() === "" || item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || item.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const genderMatch = !filters.gender || item.gender === filters.gender;

    const ageMatch = (() => {
    if (!filters.age) return true;
    const age = item.age;

    if (filters.age === "1-18") return age >= 1 && age <= 18;
    if (filters.age === "19-30") return age >= 19 && age <= 30;
    if (filters.age === "31-50") return age >= 31 && age <= 50;
    if (filters.age === "51-80") return age >= 51 && age <= 80;
    if (filters.age === "80+") return age > 80;

    return true;
    })();

    const dateMatch =
    !filters.date || formatToInputDate(item.lastVisit) === filters.date;
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
        <button 
          className="flex gap-2 items-center text-white bg-fuchsia-900 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600"
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

      {/* Bottom Section */}

      <div className="mt-4 rounded-lg bg-white p-4">
        <div className="w-full overflow-x-auto">

          {/* patient records table */}

          <table className="min-w-max w-full border border-gray-300">

            <thead className="bg-gray-300 text-sm text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Patient ID</th>
                <th className="px-4 py-3 text-left font-medium">Patient Name</th>
                <th className="px-4 py-3 text-left font-medium">Gender</th>
                <th className="px-4 py-3 text-left font-medium">Age</th>
                <th className="px-4 py-3 text-left font-medium">Last Visit</th>
                <th className="px-4 py-3 text-left font-medium">Phone Number</th>
                <th className="px-4 py-3 text-left font-medium">Visit Mode</th>
                <th className="px-4 py-3 text-left font-medium">View</th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-700">
              {
                paginatedData.map((item)=>(
                  <tr key={item.patientId} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-3">{item.patientId}</td>
                    <td className="px-4 py-3">{item.patientName}</td>
                    <td className="px-4 py-3">{item.gender}</td>
                    <td className="px-4 py-3">{item.age}</td>
                    <td className="px-4 py-3">{item.lastVisit}</td>
                    <td className="px-4 py-3">{item.mobileNumber}</td>
                    <td className="px-4 py-3">
                      <span className = {`py-2 rounded-full text-xs font-semibold ${item.visitMode === "Online" ? "bg-blue-100 text-blue-700 px-4" : "bg-green-100 text-green-700 px-2"}`}>
                        {item.visitMode}
                      </span>
                    </td>
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
        </div>

        {/* Bottom of the table */}

        <div className="flex justify-end gap-2 mt-4">
          <button 
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={()=>setCurrentPage((p)=>p-1)}
          >
            Prev
          </button>

          <span className = "text-sm px-2 py-1">
              Page {currentPage} of {totalPages}
          </span>

          <button 
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50" 
            onClick={()=>setCurrentPage((p)=>p+1)}
          >
            Next
          </button>

        </div>
      </div>

      
    </>
  )
}

export default PatientList