import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { useContext } from 'react';
import { DeptContext } from '../../context/DeptContext';
import { AppContext } from '../../context/AppContext';
import { StaffContext } from './../../context/StaffContext';

function Department() {

  const {id} = useParams();

  const { getDepartment, updateStatus } = useContext(DeptContext);
  const { token, userData } = useContext(AppContext);
  const { staffs, fetchStaffs } = useContext(StaffContext);

  const role = userData?.designation;

  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totEquipment, setTotEquipment] = useState(0);

  const deptStaffMap = {
  "Laboratory Services": [
    "Biochemistry",
    "Pathology",
    "Microbiology"
  ],
  "Radiology": [
    "X-Ray",
    "CT-Scan"
  ]
  };

  const doctorsInDept = staffs?.filter(
    (staff) => {

      if(deptStaffMap[dept?.deptName]){
        return deptStaffMap[dept.deptName].includes(staff.department);
      }else{
        return staff.designation === "Doctor" && staff.department === dept?.deptName
      }
    }
  )

  const handleDeptStatus = async() =>{
    if(!dept?.deptId) return;
    const success = await updateStatus(dept.deptId);
    if(success){
      const updated = await getDepartment(dept.deptId);
      setDept(updated);
    }
  };

  useEffect(()=>{
  
    const fetchDepartment = async() =>{
      console.log(id);
      setLoading(true);
      const data = await getDepartment(id);
      if(data){
        setDept(data);
        setTotEquipment(data?.equipments?.length);
      }
      setLoading(false);
    };

    fetchDepartment();

  }, [id, getDepartment])

  useEffect(()=>{

    if(token){
      fetchStaffs();
    }

  }, [token, fetchStaffs])

  if(loading){
    return(
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
      <div className="flex flex-col items-center justify-center h-75 gap-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-fuchsia-700 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm font-medium tracking-wide">
          Fetching Department...
        </p>
      </div>
      </div>
    )
  };

  if (!loading && !dept) {
  return (
    <div className="text-center text-gray-500 font-medium py-10">
      Department data not available
    </div>
  );
  }

  return (
    <>

    <div className="bg-gray-50 rounded-lg px-3 py-4 border border-gray-300">

    <div className="flex flex-wrap gap-4 justify-between items-center mb-4">

      {/* Department heading */}
      <div className="flex flex-col gap-1">
        <p className="text-gray-800 font-bold text-lg">{dept?.deptName} Department</p>
        <div className="flex gap-3 items-center"> 
          <p className="text-sm text-blue-600 bg-blue-200 border border-blue-900 px-3 py-1 rounded-lg">{dept?.deptType}</p>
          <p className={`text-sm px-3 py-1 rounded-lg ${dept?.status === "Active" ? "text-green-700 bg-green-200 border border-green-700" : "text-red-700 bg-red-200 border border-red-700"}`}>{dept?.status}</p>
          <p className="text-sm text-red-600 bg-red-200 border border-red-900 px-3 py-1 rounded-lg">24 X 7</p>
        </div>
      </div>

      {/* Activate or Deactive department */}
     
      <div className="flex gap-3 items-center">

       {
        role === "Admin" && (
          dept?.status === "Active" ?
        <button 
          onClick={handleDeptStatus}
          className="text-sm font-bold text-white bg-red-600 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Deactivate Department
        </button> :
        <button 
          onClick={handleDeptStatus}
          className="text-sm font-bold text-white bg-green-600 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Activate Department
        </button>
        )
      }

      

      <div 
        className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-400 cursor-pointer
        transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
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
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.total}</p>
        </div>  
      </div>

      {/* OT beds */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-red-200 px-3 py-3 rounded-lg border border-red-300">
          <FaProcedures size={20} className="text-red-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">OT Beds</p>
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.ot}</p>
        </div>  
      </div>

      {/* ICU beds */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-yellow-200 px-3 py-3 rounded-lg border border-yellow-300">
          <FaUserMd size={20} className="text-yellow-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">ICU Beds</p>
          <p className="text-xl font-bold text-gray-900">{dept?.beds?.icu}</p>
        </div>  
      </div>

      {/* Total staffs */}
      <div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <div className="bg-violet-200 px-3 py-3 rounded-lg border border-violet-300">
          <FaUsers size={20} className="text-violet-800"/>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-600">Total Staffs</p>
          <p className="text-xl font-bold text-gray-900">{doctorsInDept?.length || 0}</p>
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
            <p className="text-md font-semibold text-gray-900">{dept?.hod}</p>
            <div className="flex gap-2 items-center">
              <FaPhone 
                size={14}
                className="text-gray-500 text-sm"
              />
              <p className="text-gray-500 text-sm">{dept?.contact}</p>
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
          <FaUsers size={20} className="text-cyan-800"/>
        </div>
        <p className="text-md text-gray-700 font-medium">Staffs Allocated</p>
      </div>

      {/* Content */}
      <div className="px-4 py-3 m-2 mt-5 border border-gray-600 rounded-lg h-56 overflow-y-auto flex flex-col gap-3">
      {
        doctorsInDept?.length > 0 ? (
          doctorsInDept.map((doc, index)=>(
          <div 
            key={index}
            className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md"
          >
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900">{doc.fullName}</p>
              <p className="text-xs text-gray-500">{doc.contactNumber}</p>
            </div>
            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
              {doc.designation}
            </span>
          </div>
          ))
          
        ) : (
          <p className="text-sm text-gray-500 text-center mt-6">
            No doctors allocated
          </p>
        )
      }
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
        dept?.powerbackup &&
        <div className="flex gap-2 items-center">
          <div className="p-1 rounded-full bg-green-600"></div>
          <p className="text-sm font-medium text-gray-800">Power Backup</p>
        </div>
      }
      {
        dept?.fireExtinguisher &&
        <div className="flex gap-2 items-center">
          <div className="p-1 rounded-full bg-green-600"></div>
          <p className="text-sm font-medium text-gray-800">Fire Extinguisher</p>
        </div>
      }
      {
        dept?.oxygenSupply &&
        <div className="flex gap-2 items-center">
          <div className="p-1 rounded-full bg-green-600"></div>
          <p className="text-sm font-medium text-gray-800">Oxygen Supply</p>
        </div>
      }
      </div>

    </div>

    </div>

    </>
  )
}

export default Department