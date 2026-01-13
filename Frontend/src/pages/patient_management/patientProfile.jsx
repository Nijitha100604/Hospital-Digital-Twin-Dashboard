import React from 'react'
import { 
  FaHistory, 
  FaInfoCircle, 
  FaPhone, 
  FaUser, 
  FaEye, 
  FaMicroscope, 
  FaBookMedical,
  FaUserCircle,
  FaArrowLeft
} from "react-icons/fa";
import { assets } from './../../assets/assets';
import { patient_data } from '../../data/patient';
import { useNavigate } from 'react-router-dom';

function PatientProfile() {

  const navigate = useNavigate();

  const getStatusClass = (status) =>{
    switch(status?.toLowerCase()){
      case "normal":
        return "bg-green-700"
      case "elevated":
        return "bg-orange-700"
      case "critical":
        return "bg-red-700"
      case "below normal":
        return "bg-blue-700"
      case "abnormal":
        return "bg-red-700"
      default:
        return "bg-white"
    }
  }

  const getStatusTextClass = (status) =>{
    switch(status?.toLowerCase()){
      case "normal":
        return "text-green-700"
      case "elevated":
        return "text-orange-700"
      case "critical":
        return "text-red-700"
      case "below normal":
        return "text-blue-700"
      case "abnormal":
        return "text-red-700"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Top Section */}
    <div className="w-full items-center flex flex-wrap gap-3 justify-between">

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaUser 
            size={20} 
            className="text-gray-500"
          />
          <p className="text-gray-800 font-bold text-lg">Patient Profile</p>
        </div>
        <p className="text-gray-500 text-sm">Complete Patient Information</p>
      </div>

      <div 
        className="px-3 py-2 flex gap-2 rounded-lg bg-fuchsia-800 text-white cursor-pointer
        transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
        onClick={()=>navigate('/')}
      >
        <FaArrowLeft
          size={18}
          className="text-white" 
        />
        <p className="text-sm font-medium">Back</p>
      </div>
      
    </div>

    {/* Personal Information */}

    <div className="w-full flex flex-wrap gap-4 mt-4">

      <div className="w-full lg:flex-1 px-2 py-4 flex flex-row justify-center items-center gap-4 bg-white rounded-lg border border-gray-500">
      
      {/* Profile photo and name */}
      <div className="flex flex-col gap-2 px-4 items-center">
        <img 
          src={assets.patient_profile_female} 
          className="w-22 h-22 rounded-full border border-gray-600"
        />
        <p className="text-md font-bold text-gray-900">{patient_data.name}</p>
        <div className="px-3 py-1 border border-gray-300 bg-fuchsia-500 rounded-full text-sm font-medium text-white">{patient_data.patientId}</div>
        <div className="flex gap-2 items-center">
          <FaPhone 
            size={12} 
            className="text-gray-500"
          />
          <p className="text-sm text-gray-700">{patient_data.contactNumber}</p>
        </div>
      </div>

      {/* Personal details */}
      <div className="flex flex-col gap-3 px-4">
        <div className="flex gap-2 items-center">
          <FaUserCircle 
            size={20}
            className="text-blue-400"
          /> 
          <p className="font-medium text-gray-900 text-lg">Personal Information</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Age</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.age}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Gender</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.gender}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Blood</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.bloodGroup}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Registered Date</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.registeredDate}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Guardian Name</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.guardian.name}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-sm font-medium">Guardian Contact Number</p>
            <p className="text-gray-900 font-semibold text-md">{patient_data.guardian.contactNumber}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-gray-600 text-sm font-medium">Address</p>
          <p className="text-gray-900 font-semibold text-md">{patient_data.address}</p>
        </div>
      </div>

      </div>

      {/* Medical Information */}

      <div className="w-full lg:w-sm bg-white rounded-lg border border-gray-500 px-4 py-2">
        <div className="flex gap-2 items-center">
          <FaInfoCircle
            className="text-red-500" 
            size={20}
          />
          <p className="font-medium text-gray-900 text-lg">Medical Information</p>
        </div>
        <div className="mt-3 mb-2">
          <p className="text-gray-600 text-sm font-medium">Allergies</p>
          <div className="flex flex-wrap gap-3 mt-1">
            {
              patient_data.medicalInformation.allergies.map((item,index)=>(
                <div 
                  key={index}
                  className="px-2 py-1 border border-gray-300 rounded-lg bg-red-500 text-sm font-medium text-white"
                >
                  {item}
                </div>
              ))
            }
          </div>
        </div>
        <div className="mb-2">
          <p className="text-gray-600 text-sm font-medium">Medical History</p>
          <div className="flex flex-col gap-2 mt-2">
            {
              patient_data.medicalInformation.medicalHistory.map((item, index)=>(
                <p
                  key={index}
                  className="w-fit border border-gray-500 px-3 py-1 rounded-lg bg-blue-100 font-medium text-sm"
                >
                  {item}
                </p>
              ))
            }
          </div>
        </div>
      </div>
    </div>

    {/* Vital Parameters */}

    <div className="w-full border border-gray-500 bg-white rounded-lg px-4 py-2 mt-5">
      
      <div className="flex gap-2 items-center">
        <img 
          src={assets.heart_rate} 
          alt="heart-rate"
          className="w-6" 
        />
        <p className="font-medium text-gray-900 text-lg">Vital Parameters</p>
      </div>

      <div className = "flex flex-wrap justify-between gap-3 mt-4 mb-3">
        {
          patient_data.vitalParameters.map((item,index)=>(
            <div 
              key={index}
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-500 w-40"
            >
              <p className="text-gray-900 text-sm font-medium">{item.name}</p>
              <div className="flex gap-3 mt-2 mb-2 px-3 items-center">
                <p className="font-bold text-lg text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-700">{item.unit}</p>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`p-1.5 w-1 h-1 rounded-full ${getStatusClass(item.status)}`}></div>
                <p className={`text-sm font-bold ${getStatusTextClass(item.status)}`}>{item.status}</p>
              </div>
            </div>
          ))
        }
      </div>

    </div>

    {/* Visit History */}

    <div className="w-full mt-4 rounded-lg bg-white border border-gray-500 p-4">

      <div className="flex gap-2 items-center">
        <FaHistory 
          className="text-gray-700"
          size={18}
        />
        <p className="font-medium text-gray-900 text-lg">Visit History</p>
      </div>

      <div className="w-full mt-4 rounded-lg overflow-x-auto">
        <table className="min-w-max w-full border border-gray-300">
          <thead className="bg-gray-300 text-sm text-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Doctor</th>
              <th className="px-4 py-3 text-left font-semibold">Diagnosis</th>
              <th className="px-4 py-3 text-left font-semibold">Remarks</th>
              <th className="px-4 py-3 text-left font-semibold">View</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700">
            {
              patient_data.visitHistory.map((item, index)=>(
                <tr key={index} className="border-b hover:bg-gray-100 hover:border-2 cursor-pointer">
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.doctor}</td>
                  <td className="px-4 py-3">{item.diagnosis}</td>
                  <td className="px-4 py-3">{item.remarks}</td>
                  <td className="px-4 py-3">
                    <button
                      className="text-gray-600 hover:text-gray-900 cursor-pointer"
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
      
    </div>

    {/* Lab Reports */}

    <div className="mt-4 bg-white px-3 py-4 border border-gray-500 rounded-lg">
      
      <div className="flex gap-3 items-center">
        <FaMicroscope 
          size={20}
          className="text-yellow-700" 
        />
        <p className="font-medium text-gray-900 text-lg">Lab Reports</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-2">
        {
          patient_data.labReports.map((item, index)=>(
            <div 
              key={index}
              className="w-full grid grid-cols-5 items-center border py-2 px-2 rounded-lg border-gray-500 bg-blue-50"
            >

              <div className="flex flex-col gap-2">
                <p className="text-gray-900 font-medium text-sm">{item.testName}</p>
                <p className="text-gray-600 text-sm font-medium">{item.reportNumber}</p>
              </div>

              <div className="flex gap-2 items-center">
                <div className={`p-1.5 w-1 h-1 bg-gray-500 rounded-full ${getStatusClass(item.status)}`}></div>
                <p className={`text-sm font-semibold ${getStatusTextClass(item.status)}`}>{item.status}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600">Conducted By</p>
                <p className="text-sm font-medium text-gray-900">{item.conductedBy}</p>
              </div>

              <p className="text-sm text-gray-700">{item.date}</p>

              <div className="flex gap-3 items-center">
                {
                  item.completed ?
                  <div 
                    className="inline-flex items-center text-sm font-medium bg-green-600 text-white px-3 py-1 rounded-lg
                    transition-all duration-300 ease-in-out
                   hover:bg-green-700 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Completed
                  </div> :
                  <div 
                    className="inline-flex items-center text-sm font-medium bg-orange-600 text-white px-3 py-1 rounded-lg
                    transition-all duration-300 ease-in-out
                    hover:bg-orange-700 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Pending
                  </div>
                }
                <button 
                  className="inline-flex items-center text-sm font-medium bg-blue-300 px-3 py-1 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                          hover:bg-blue-400 hover:scale-105
                          active:scale-95"
                  onClick={()=>{navigate('/lab-reports-list'); window.scroll(0,0)}}
                >View</button>
              </div>

            </div>
          ))
        }
      </div>

    </div>

    {/* Admission Summary */}

    <div className="mt-4 bg-white px-3 py-4 border border-gray-500 rounded-lg">
      <div className="flex gap-3 items-center">
        <FaBookMedical 
          size={20}
          className="text-violet-600"
        />
        <p className="font-medium text-gray-900 text-lg">Admission Details</p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {
          patient_data.admissionDetails.map((item, index)=>(
            <div 
              key={index}
              className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-6 gap-3 border-b border-b-gray-600 py-2"
            >

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Admitted on</p>
                <p className="text-sm font-bold text-gray-900">{item.admittedDate}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Total Days</p>
                <p className="text-sm font-bold text-gray-900">{item.admittedDays}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Block</p>
                <p className="text-sm font-bold text-gray-900">{item.block}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Ward</p>
                <p className="text-sm font-bold text-gray-900">{item.ward}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-600 font-medium">Bed No.</p>
                <p className="text-sm font-bold text-gray-900">{item.bedNo}</p>
              </div>

              <button 
                className="text-sm font-medium bg-violet-500 px-2 py-1 text-white rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-violet-600 hover:scale-105 active:scale-95"
                onClick={()=>navigate(`/discharge-summary/${patient_data.patientId}`)}
              >Summary</button>

            </div>
          ))
        }
      </div>
    </div>

    </div>
  )
}

export default PatientProfile