import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  FaEye, 
  FaClipboardList,
  FaCalendarCheck,
  FaUserCircle,
  FaInfoCircle,
  FaFileAlt,
  FaStethoscope,
  FaList,
  FaFlask,
  FaHospital,
} from "react-icons/fa";
import { assets } from '../../assets/assets';
import { PatientContext } from '../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import { LabContext } from './../../context/LabContext';
import { formatDate } from '../../utils/formatDate';

function ViewAppointment() {

  const [appData, setAppData] = useState(null);
  const [conData, setConData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [vitals, setVitals] = useState({});
  const {id} = useParams();
  const navigate = useNavigate();

  const {appointments, fetchAppointments, patients, fetchPatients, consultations, fetchConsultations} = useContext(PatientContext);
  const {reports, fetchLabReports} = useContext(LabContext);
  const {token} = useContext(AppContext);

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
      case "normal":
        return "text-green-700"
      case "elevated":
        return "text-orange-700"
      case "critical":
        return "text-red-700"
      case "high":
        return "text-red-700"
      case "below normal":
        return "text-blue-700"
      case "abnormal":
        return "text-red-700"
      default:
        return "bg-white"
    }
  }

  const getStatusDivClass = (status) =>{
    switch(status?.toLowerCase()){
      case "normal":
        return "bg-green-700"
      case "elevated":
        return "bg-orange-700"
      case "critical":
        return "bg-red-700"
      case "high":
        return "bg-red-700"
      case "below normal":
        return "bg-blue-700"
      case "abnormal":
        return "bg-red-700"
      default:
        return "bg-white"
    }
  }

  const getVitals = () =>{
    if(patientData){
      const foundVital = patientData?.vitals?.find(
        (item) => item.appointmentId === id
      )
      if(foundVital){
        setVitals(foundVital);
      }
    }
  }

  const getReportById = (labReportId) => {
    return reports.find(r => r.labReportId === labReportId);
  };

  const getReportStatus = (id) =>{
    const report = getReportById(id);
    return report?.status || "Requested";
  } 

  useEffect(()=>{
    
    const fetchDetails = () =>{
      if (!id || appointments.length === 0) return;
      const foundAppointment = appointments.find(
        (item) => item.appointmentId === id
      );
      setAppData(foundAppointment || null);
      const foundPatient = patients.find(
        (item) => item.patientId === foundAppointment?.patientId
      )
      setPatientData(foundPatient || null)
      const foundConsultation = consultations.find(
        (item) => item.appointmentId === foundAppointment?.appointmentId
      );
      setConData(foundConsultation || null);
      getVitals();
    }
    fetchDetails();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id]);

  useEffect(()=>{
    if(token){
      fetchAppointments();
      fetchPatients();
      fetchConsultations();
      fetchLabReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return appData ? (
    <>

    <div className="bg-gray-50 rounded-lg px-3 py-4 border border-gray-300">

    {/* Top Section */}
    <div className="flex flex-wrap justify-between items-center mb-4">
    
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaClipboardList 
            size={20}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">Appointment Details</p>
        </div>
        <p className="text-gray-500 text-sm">View Complete Appointment Information</p>
      </div>
    
      {/* view all appointment Button */}
      <button 
        className="flex gap-2 items-center text-white bg-fuchsia-800 px-3 py-2.5 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600
          transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
        onClick={()=>navigate("/all-appointments")}
      >
        <FaEye size={16} />View All Appointments
      </button>
    
    </div>

    {/* Patient Information and appointment details */}
    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4">

      {/* Patient Information */}
      <div className="px-3 py-2 border border-gray-200 rounded-lg bg-white">

        <div className="flex gap-2 items-center">
          <FaUserCircle 
            size={18}
            className="text-blue-500"
          />
          <p className="text-md text-gray-700 font-medium">Patient Details</p>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">

          <div className="px-8 flex flex-col gap-2 items-center">

            {
              appData?.gender === "Male" ?
              <img 
              src={assets.patient_profile_male} 
              alt="male_profile"
              className="w-22 h-22 rounded-full border border-gray-600"
              /> :
              <img 
              src={assets.patient_profile_female} 
              alt="female_profile"
              className="w-22 h-22 rounded-full border border-gray-600"
              />
            }
            <p className="font-bold text-gray-900 font-md">{appData?.name}</p>
          </div>

          <div className="pr-8 flex-1 flex flex-col gap-1 ">

            <div className="flex justify-between px-4 py-1">
              <p className="text-gray-600 text-sm font-medium">Patient ID:</p>
              <p className="text-sm font-medium text-gray-900">{appData?.patientId}</p>
            </div>

            <div className="flex justify-between px-4 py-1">
              <p className="text-gray-600 text-sm font-medium">Age:</p>
              <p className="text-sm font-medium text-gray-900">{appData?.age}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Gender:</p>
              <p className="text-sm font-medium text-gray-900">{appData?.gender}</p>
            </div>

            <div className="flex justify-between px-4 py-1">
              <p className="text-gray-600 text-sm font-medium">Contact:</p>
              <p className="text-sm font-medium text-gray-900">{appData?.contact}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Appointment details */}
      <div className="px-3 py-4 items-center border border-gray-200 rounded-lg bg-white">

        <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <FaCalendarCheck 
            size={18}
            className="text-gray-500"
          />
          <p className="text-md text-gray-700 font-medium">Appointment Details</p>
        </div>
        <p className="text-sm font-medium text-fuchsia-700">{appData?.appointmentId}</p>
        </div>

        <div className=" mt-5 grid grid-cols-2 gap-3 px-2">

          <div className="flex justify-between py-1 ">
            <p className="text-gray-600 text-sm font-medium">Doctor:</p>
            <p className="text-sm font-medium text-gray-900">{appData?.doctorName}</p>
          </div>

          <div className="flex justify-between py-1 ">
            <p className="text-gray-600 text-sm font-medium">Department:</p>
            <p className="text-sm font-medium text-gray-900">{appData?.department}</p>
          </div>

          <div className="flex justify-between py-1 ">
            <p className="text-gray-600 text-sm font-medium">Date</p>
            <p className="text-sm font-medium text-gray-900">{appData?.date}</p>
          </div>

          <div className="flex justify-between py-1 ">
            <p className="text-gray-600 text-sm font-medium">Time Slot:</p>
            <p className="text-sm font-medium text-gray-900">{appData?.timeSlot}</p>
          </div>

          <div className="flex justify-between py-1 ">
            <p className="text-gray-600 text-sm font-medium">Consultation:</p>
            <p className={`text-sm font-semibold ${appData?.consultationType === "In-Person" ? "text-red-600" : "text-blue-600"}`}>{appData?.consultationType}</p>
          </div>
          
          <div className="flex justify-between py-1 items-center">
            <p className="text-gray-600 text-sm font-medium">Status:</p>
            <p className={`text-sm font-semibold px-2 py-1 text-white rounded-lg cursor-pointer ${getStatusClass(appData?.status)}`}>{appData?.status}</p>
          </div>         

        </div>

      </div>

    </div>

    {/* Consultation remarks */}
    <div className="mt-3 px-2 w-full flex gap-3 items-center">
      <p className="text-red-600 text-sm">Consultation Remarks : </p>
      <p className="text-gray-900 font-medium text-sm">{appData?.remarks}</p>
    </div>

    {/* Vital Parameters */}

    <div className="mt-4 w-full flex flex-wrap items-start gap-6 bg-white px-3 py-3 rounded-lg border border-gray-200">
      <div className="flex gap-2 mt-1 items-center">
        <img 
          src={assets.heart_rate} 
          alt="heart-rate"
          className="w-5" 
        />
        <p className="font-medium text-gray-700 text-md">Vital Parameters</p>
      </div>

      <div>
        {
          vitals?.vitalsData?.length > 0 ? 
          <div className="flex flex-wrap gap-2 items-center">
            {
              vitals?.vitalsData?.map((item, index)=>(
                <div 
                  key={index}
                  className="flex flex-col items-start gap-1 border border-gray-300 bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <div className="flex gap-4 items-center">
                    <p className="text-sm font-medium text-gray-600">{item?.name}</p>
                    <div className="flex gap-2 items-center">
                      <p className="font-medium text-md text-gray-900">{item?.value}</p>
                      <p className="text-sm text-gray-500">{item?.unit}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className={`p-1 w-1 h-1 rounded-full ${getStatusDivClass(item?.status)}`}></div>
                    <p className={`text-sm font-bold ${getStatusClass(item?.status)}`}>{item?.status}</p>
                  </div>
                </div>
              ))
            }
          </div> :
          <div className="flex mt-2 gap-3 px-6 items-center">
            <FaInfoCircle 
              size={18}
              className="text-orange-400"
            />
            <p className = "text-md font-medium text-orange-400">Pending</p>
          </div>
        }
      </div>
    </div>

    {/* Doctor Identification */}

    <div className="w-full mt-4 flex flex-wrap items-center rounded-lg bg-white gap-6 px-3 py-3 border border-gray-200">

      <div className="flex gap-2 items-center">
        <FaStethoscope 
          size={18}
          className="text-violet-600"
        />
        <p className="font-medium text-gray-700 text-md">Identifications</p>
      </div>

      {
      (conData?.doctor?.diagnosis || conData?.doctor?.remarks) ? 
       
        <div className="flex gap-4">
        <p className="px-3 py-1 border border-gray-100 bg-gray-200 rounded-lg text-sm text-gray-900"><span className="font-medium">Diagnosis :</span> {conData?.doctor?.diagnosis}</p>
        <p className="px-3 py-1 border border-gray-100 bg-gray-200 rounded-lg text-sm text-gray-900"><span className="font-medium">Remarks :</span> {conData?.doctor?.remarks}</p>
        </div>
      :
      <div className="flex mt-2 gap-3 px-6 items-center">
        <FaInfoCircle 
          size={18}
          className="text-orange-400"
        />
        <p className = "text-md font-medium text-orange-400">Pending</p>
      </div>
      }
    </div> 

    {/* Prescriptions */} 
    <div className="w-full mt-4 bg-white rounded-lg px-3 py-3 border border-gray-200">
      <div className="flex gap-2 items-center">
        <FaList 
          size={16}
          className="text-emerald-600"
        />
        <p className="font-medium text-gray-700 text-md">Prescriptions</p>
      </div>

      {
        conData?.prescriptions?.length > 0 ? 
        <div className="mt-4 overflow-x-auto">
        <div className="flex flex-col gap-2">
          {
            conData?.prescriptions?.map((item, index)=>(
              <div key={index}
                className = "w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_2fr_2fr_1fr_1.5fr] px-4 py-2 border-b border-gray-300"
              >
                <div className="flex justify-center items-center">
                  <div className="inline-flex bg-emerald-200 rounded-full px-4 py-1 w-fit">
                    <p className="font-semibold text-sm">
                      {index + 1}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Medicine Name</p>
                  <p className="text-md font-medium text-gray-900">{item?.medicineName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Frequency</p>
                  <div className="flex gap-2">
                  {
                    item?.frequency.map((freqItem, freqIndex)=>(
                      <p 
                        key={freqIndex}
                        className="px-2 py-1 text-sm text-gray-900 font-medium bg-emerald-100 border border-emerald-700 rounded-xl"
                      >{freqItem}</p>
                    ))
                  }
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="text-md font-medium text-gray-900">{item?.duration}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Instruction</p>
                  <p className="text-md font-medium text-gray-900">{item?.instruction}</p>
                </div>
              </div>
            ))
          }
        </div> 
        </div>:
        <div className="flex items-center justify-center gap-3 mt-2 text-md text-gray-500 font-medium">
          <FaFileAlt size={20}/>
          <p>No Data Available</p>
        </div>
      }
    </div>

    {/* Lab Reports */}
    {
      conData?.labReports?.length > 0 ?
      <div className="w-full mt-4 bg-white rounded-lg px-3 py-3 border border-gray-200">
        <div className="flex gap-2 items-center">
          <FaFlask
            size={18}
            className="text-cyan-900"
          />
          <p className="font-medium text-gray-700 text-md">Lab Reports</p>
        </div>
        <div className="w-full mt-4 grid sm:grid-cols-1 md:grid-cols-2 gap-5">
          {
            conData?.labReports?.map((item, index)=>(
              <div 
                key={index}
                className="flex justify-between items-center border border-gray-300 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-300 cursor-pointer"
              >
                <p className="text-sm font-semibold text-gray-900">{item.testName}</p>
                <p className={`px-3 py-2 text-sm text-white font-medium rounded-lg ${getReportStatus(item.labReportId) === "Completed" ? "bg-green-600": "bg-yellow-600"}`}>{getReportStatus(item.labReportId)}</p>
                {
                  getReportStatus(item.labReportId) === "Completed" &&
                  <div>
                    <FaEye size={20}/>
                  </div>
                }

              </div>
            ))
          }
        </div>
      </div> :
      <></>
    }

    {/* Admitted Status */}
    <div className="w-full mt-4 bg-white rounded-lg px-3 py-3 border border-gray-200">

    {/* HEADER */}
    <div className="flex gap-2 items-center mb-4">
      <FaHospital size={18} className="text-yellow-600" />
      <p className="font-medium text-gray-700 text-md">
        Admission Details
      </p>
    </div>

    {
      conData?.admission?.length > 0 &&
      conData.admission.some(adm => adm.admitted) ? (

      conData.admission
        .filter(adm => adm.admitted)
        .map((adm, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-5 border-b border-gray-300 pb-4 mb-4"
          >

            {/* Bed Details */}
            <div className="flex flex-col gap-4 border border-gray-300 rounded-lg px-4 py-3 items-center">
              <p className="text-sm font-medium">Block: {adm.block || "—"}</p>
              <p className="text-sm font-medium">Ward: {adm.ward || "—"}</p>
              <p className="text-sm font-medium">Bed: {adm.bedNumber || "—"}</p>
              <p className="text-sm font-medium">
                Days: {adm.numberOfDays}
              </p>
            </div>

            {/* Daily Notes */}
            <div className="flex flex-col gap-2 border border-gray-300 rounded-lg px-4 py-3">
              <p className="text-sm font-medium text-gray-700">
                Daily Notes
              </p>

              {
                adm.dailyNotes?.length > 0 ? (
                  adm.dailyNotes.map((note, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{formatDate(note.date)}</span>
                      <span>{note.note}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No daily notes available
                  </p>
                )
              }
            </div>

          </div>
        ))

      ) : (

      <p className="text-center text-gray-500 text-sm py-4">
        No Admission Details Available
      </p>
    )
  }

    </div>

  </div>
    
    </>
  ) : (
    <>
      No Data available
    </>
  )
}

export default ViewAppointment