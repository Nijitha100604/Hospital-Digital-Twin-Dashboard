import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { hospitalDepartments } from './../../data/infrastructure';
import {
  FaBed,
  FaProcedures,
  FaUserMd,
  FaUsers,
  FaTools,
  FaUserTie,
  FaPhone,
  FaArrowLeft
} from "react-icons/fa";
import { assets } from '../../assets/assets';


function Department() {

  const {id} = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState("");
  const [totEquipment, setTotEquipment] = useState("");

  useEffect(()=>{
  
    const fetchDepartment = async() =>{
      console.log(id);
      await new Promise(resolve => setTimeout(resolve, 200));

      const foundDepartment = hospitalDepartments.find(
        item => item.departmentId === id
      );
      setDept(foundDepartment ?? null);
      setTotEquipment(foundDepartment?.equipments?.length);
      console.log(dept);
    }

    fetchDepartment();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <>

    <div className="bg-gray-50 rounded-lg px-3 py-4 border border-gray-300">

    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">

      {/* Department heading */}
      <div className="flex flex-col gap-1">
        <p className="text-gray-800 font-bold text-lg">{dept?.departmentName} Department</p>
        <div className="flex gap-3 items-center"> 
          <p className="text-sm text-blue-600 bg-blue-200 border border-blue-900 px-3 py-1 rounded-lg">{dept?.departmentType}</p>
          <p className={`text-sm px-3 py-1 rounded-lg ${dept.status === "Active" ? "text-green-700 bg-green-200 border border-green-700" : "text-red-700 bg-red-200 border border-red-700"}`}>{dept?.status}</p>
          <p className="text-sm text-red-600 bg-red-200 border border-red-900 px-3 py-1 rounded-lg">24 X 7</p>
        </div>
      </div>

      {/* Activate or Deactive department */}
      <div className="flex gap-3 items-center">
      {
        dept?.status === "Active" ?
        <button className="text-sm font-bold text-white bg-red-600 px-3 py-2 rounded-lg cursor-pointer">Deactivate Department</button> :
        <button className="text-sm font-bold text-white bg-green-600 px-3 py-2 rounded-lg cursor-pointer">Activate Department</button>
      }

      <div 
        className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-400 cursor-pointer"
        onClick={()=>navigate('/departments-list')}
      >
        <FaArrowLeft 
          size={18}
          className="text-gray-800" 
        />
        <p className="text-sm font-medium">Back</p>
      </div>
      </div>

    </div>

    {/* Summary */}
    <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 mt-5">

      {/* Total Beds */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-blue-200 px-3 py-3 rounded-lg border border-blue-300">
          <FaBed size={20} className="text-blue-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Total Beds</p>
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.totalBeds}</p>
        </div>  
      </div>

      {/* OT beds */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
          <FaProcedures size={20} className="text-red-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">OT Beds</p>
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.otBeds}</p>
        </div>  
      </div>

      {/* ICU beds */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300">
          <FaUserMd size={20} className="text-yellow-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">ICU Beds</p>
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.icuBeds}</p>
        </div>  
      </div>

      {/* Total staffs */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-violet-200 px-3 py-3 rounded-lg border border-violet-300">
          <FaUsers size={20} className="text-violet-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Total Staffs</p>
          <p className="text-xl font-bold text-gray-900">20</p>
        </div>  
      </div>

      {/* total Equipment */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-green-200 px-3 py-3 rounded-lg border border-green-300">
          <FaTools size={20} className="text-green-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Equipment</p>
          <p className="text-xl font-bold text-gray-900">{totEquipment}</p>
        </div>  
      </div>

    </div>

    {/* Head of the department and staffs */}
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">

      {/* HOD */}
      <div className="border border-gray-300 px-3 py-3 bg-white rounded-lg">

        {/* Heading */}
        <div className="flex gap-4 items-center">
          <div className="bg-blue-200 p-1 rounded-lg border border-blue-300">
            <FaUserTie size={20} className="text-blue-800"/>
          </div>
          <p className="text-md text-gray-700 font-medium">Head of the Department</p>
        </div>

        {/* Content */}
        <div className="mt-3 flex items-center justify-center gap-10 px-4 py-2">
          <img 
            src={assets.hospital_user_profile} 
            alt="hospital_user_profile"
            className="w-18 border border-gray-400"
          />
          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-gray-900">{dept?.departmentHead}</p>
            <div className="flex gap-2 items-center">
              <FaPhone 
                size={14}
                className="text-gray-500 text-sm"
              />
              <p className="text-gray-500 text-sm">9876543210</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-2 m-2 flex flex-col gap-2 border border-gray-600 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Block</p>
            <p className="text-sm font-semibold text-gray-900">Block {dept?.block}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Floor</p>
            <p className="text-sm font-semibold text-gray-900">{dept?.floor}</p>
          </div>
        </div>
      </div>

      {/* Staffs */}
      <div className="border border-gray-300 px-3 py-3 bg-white rounded-lg">

      {/* Heading */}
      <div className="flex gap-4 items-center">
        <div className="bg-blue-200 p-1 rounded-lg border border-blue-300">
          <FaUserTie size={20} className="text-blue-800"/>
        </div>
        <p className="text-md text-gray-700 font-medium">Staffs Allocated</p>
      </div>

      {/* Content */}
      <div className="px-8 py-2 m-2 mt-5 flex flex-col gap-4 border border-gray-600 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Number of Doctors</p>
          <p className="text-sm font-semibold text-gray-900">{dept?.staffDetails?.doctors}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Number of Nurses</p>
          <p className="text-sm font-semibold text-gray-900">{dept?.staffDetails?.nurses}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Number of Technicians</p>
          <p className="text-sm font-semibold text-gray-900">{dept?.staffDetails?.technicians}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Number of Supporting Staffs</p>
          <p className="text-sm font-semibold text-gray-900">{dept?.staffDetails?.supportingStaff}</p>
        </div>
      </div>

      </div>
    
    </div>

    {/* Equipment & utilities */}

    <div className="mt-4 px-3 py-2 border border-gray-300 rounded-lg bg-white">

      <div className="flex gap-4 items-center">
        <div className="bg-green-200 p-1 rounded-lg border border-green-300">
          <FaTools size={20} className="text-green-800"/>
        </div>
        <p className="text-md text-gray-700 font-medium">Equipments & Utilities</p>
      </div>

      {
        dept?.equipments?.length > 0 ?
        <div className="flex flex-wrap gap-4 px-3 mt-4 items-center">
        {
          dept?.equipments?.map((item, index)=>(
            <div 
              key={index}
              className='text-sm bg-cyan-800 px-3 py-2 rounded-lg text-white font-medium'
            >
              {item}
            </div>
          ))
        }
        </div> :
        <p className="text-gray-500 font-semibold text-center text-sm">No Equipment Available</p>
      }

      <div className="flex flex-wrap gap-4 px-3 mt-4 items-center">
      {
        dept?.utilities &&
        Object.entries(dept.utilities)
          // eslint-disable-next-line no-unused-vars
          .filter(([_, value]) => value === "Available")
          .map(([key], index) => (
          <div
            key={index}
            className="flex gap-2 items-center"
          >
            <div className="p-1 rounded-full bg-green-600"></div>
            <p className="text-sm font-medium text-gray-800">{key}</p>
          </div>
      ))
      }
      </div>

    </div>

    </div>

    </>
  )
}

export default Department