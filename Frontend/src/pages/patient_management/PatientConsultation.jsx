import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaEye, FaInfoCircle, FaPlus, FaSave, FaTrash, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PatientContext } from './../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { LabContext } from '../../context/LabContext';
import { MedicineContext } from './../../context/MedicineContext';
import { formatDate } from './../../utils/formatDate';
import AccessDenied from '../../components/AccessDenied';

function PatientConsultation() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [consultation, setConsultation] = useState(null);
    const [diagnosis, setDiagnosis] = useState("");
    const [doctorRemarks, setDoctorRemarks] = useState("");
    const [prescriptionsList, setPrescriptionsList] = useState([]);
    const [medicineName, setMedicineName] = useState("");
    const [frequency, setFrequency] = useState([]);
    const [duration, setDuration] = useState("");
    const [instruction, setInstruction] = useState("");
    const [labTestName, setLabTestName] = useState("");
    const [labReports, setLabReports] = useState([]);
    const [newLabReports, setNewLabReports] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [bedType, setBedType] = useState("");

    const { fetchPatients, consultations, fetchConsultations, saveRemarksAndDiagnosis, savePrescriptions, saveLabReports, updateAppointmentAction, requestAddmission } = useContext(PatientContext);
    const { fetchMedicines, medicines } = useContext(MedicineContext);
    const { token, backendUrl, userData } = useContext(AppContext);
    const { fetchLabReports, reports } = useContext(LabContext);
    const [ patient, setPatient ] = useState({});
    const [ appointment, setAppointment ] = useState({});

    const role = userData?.designation;

    const patientDetails = async(id) =>{

      try{

        const {data} = await axios.get(`${backendUrl}/api/patient/${id}`, {headers: {token}});
        if(data.success){
          setPatient(data.data);
        } else{
          toast.error(data.message);
        }

      } catch(error){
        console.log(error);
        toast.error("Internal Server Error");
      }

    }

    const appointmentDetails = async(id) =>{

      try{
        const {data} = await axios.get(`${backendUrl}/api/appointment/${id}`, {headers: {token}});
        if(data.success){
          setAppointment(data.data);
        } else{
          toast.error(data.message);
        }
      } catch(error){
        console.log(error);
        toast.error("Internal Server Error");
      }

    }

    const handleSaveDiagnosis = async() =>{
      
      if(!diagnosis || !doctorRemarks){
        toast.error("Diagnosis and Remarks required");
        return;
      }

      const diagnosisData = {
        appointmentId : consultation?.appointmentId,
        diagnosis,
        remarks: doctorRemarks
      }

      const result = await saveRemarksAndDiagnosis(diagnosisData);
      if(result){
        setDiagnosis("");
        setDoctorRemarks("");
      }

    }

    const frequencyMap = {
      M: "Morning",
      A: "Afternoon",
      E: "Evening",
      N: "Night"
    }

    const addFrequency = (value) => {

      const freq = frequencyMap[value];
      setFrequency(prev =>
      prev.includes(freq)
        ? prev.filter(item => item !== freq)
        : [...prev, freq]
      );
    };

    const handleAddMedicine = () => {
      if (!medicineName || frequency.length === 0 || !duration) return;

      const newMedicine = {
        medicineId: selectedMedicine?.medicineId || null,
        medicineName,
        frequency,
        duration,
        instruction
      };

      setPrescriptionsList(prev => [...prev, newMedicine]);

      setMedicineName("");
      setSelectedMedicine(null);
      setFrequency([]);
      setDuration("");
      setInstruction("");
    };

    const handleDeleteMedicine = (index) => {
      setPrescriptionsList(prev =>
        prev.filter((_, i) => i !== index)
      );
    };

    const handleSavePrescription = async() => {
      if (prescriptionsList.length === 0) {
        toast.error("Add at least one medicine");
        return;
      }

      const presData = {
        appointmentId: consultation?.appointmentId,
        prescriptions: prescriptionsList
      }

      const result = await savePrescriptions(presData);
      if(result){
        setPrescriptionsList([]);
      }

    };

    const handleAddLabTest = () =>{
      if(!labTestName) return;

      const newTest = {
      testName: labTestName
      };

      setNewLabReports(prev => [...prev, newTest]);
      setLabTestName("");
    }

    const handleRemoveNewLabTest = (index) => {
      setNewLabReports(prev =>
        prev.filter((_, i) => i !== index)
      );
    };

    const handleSaveLabReports = async() => {

      if (newLabReports.length === 0) {
        toast.error("Add at least one lab test");
        return;
      }

      const labData = {
        appointmentId: consultation.appointmentId,
        consultationId: consultation.consultationId,
        patientId: consultation.patientId,
        labTests: newLabReports.map(test => ({
          testName: test.testName
        }))
      }

      const result = await saveLabReports(labData);
      if(result){
        setNewLabReports([]);
        await fetchLabReports();
      }

    };

    const getLabReports = (appointmentId) =>{

      if(!reports || reports.length === 0 || !appointmentId){
        return;
      }

      const mappedReports = reports
      .filter(report => report.appointmentId === appointmentId)
      .map(report => ({
        labReportId: report.labReportId,
        testName: report.testName,
        status: report.status
      }));

      setLabReports(mappedReports);

    }

    const handleAppointmentAction = async(status) =>{

      if(status !== "In Progress" && status !== "Completed"){
        toast.error("Invalid action");
        return;
      }

      if(status === "Completed" && 
        (
          !consultation?.doctor?.diagnosis?.trim() ||
          !consultation?.doctor?.remarks?.trim() ||
          !consultation?.prescriptions || consultation.prescriptions.length === 0
        )){
          toast.error("Enter the diagnosis, remarks and prescriptions before completing the status");
          return;
        }

      const statusData = {
        appointmentId: consultation?.appointmentId,
        status
      }

      const result = await updateAppointmentAction(statusData);
      if(result){
        return;
      }

    }

    const handleRequestAdmission = async() =>{
      if(!bedType){
        toast.error("Select bed type");
        return;
      }

      const requestData = {
        consultationId: consultation.consultationId,
        appointmentId: consultation.appointmentId,
        patientId: consultation.patientId,
        patientName: patient?.personal?.name,
        doctorId: consultation.doctorId,
        bedType
      }

      const result = await requestAddmission(requestData);
      if(result){
        setBedType("");
      }
      
    }

    const checkBP = (value) =>{
      const [systolic, diastolic] = value.split("/").map(Number);
      if (!systolic || !diastolic) return false;
      return systolic < 120 && diastolic < 80;
    }

    const checkHR = (value) => {
      return value >= 60 && value <= 100;
    }

    const reportStatusMap = reports?.reduce((acc, report) => {
      acc[report.labReportId] = report.status;
      return acc;
    }, {});

    useEffect(()=>{
      const fetchConsultation = async() =>{
      
        if(!consultations || consultations.length === 0) return;

        const foundConsultation = consultations.find(
          (item) => item.appointmentId === id
        );

        if(foundConsultation){
          setConsultation(foundConsultation);
          patientDetails(foundConsultation?.patientId);
          appointmentDetails(foundConsultation?.appointmentId);
          setDiagnosis(foundConsultation?.doctor?.diagnosis || "");
          setDoctorRemarks(foundConsultation?.doctor?.remarks || "");
        }
      }
      fetchConsultation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, consultations]);

    useEffect(()=>{

      if(token){
        fetchPatients();
        fetchConsultations();
        fetchLabReports();
        fetchMedicines();
      }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    useEffect(()=>{
      if (consultation?.appointmentId && reports?.length > 0) {
        getLabReports(consultation.appointmentId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consultation, reports])

    const getStatusClass = (status) =>{
    switch(status?.toLowerCase()){
      case "completed":
        return "bg-green-600 border border-green-700"
      case "in progress":
        return "bg-yellow-600 border border-orange-700"
      case "scheduled":
        return "bg-blue-600 border border-blue-700"
      default:
        return "bg-white"
      }
    }

    if( role === "Nurse" || role === "Support" || role === "Pharmacist" || role === "Technician" || role === "Receptionist" ){
      return <AccessDenied />
    }

  return consultation ? (
    <>
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex flex-wrap justify-between items-center gap-2">
    <div className="flex flex-col gap-1">
      <div className="flex gap-3 items-center">
        <FaUserMd
          size={18}
          className="text-gray-500" 
        />
        <p className="text-gray-800 font-bold text-lg">Doctor Consultation</p>
      </div>
      <p className="text-gray-500 text-sm">Patient evaluation, diagnosis, and treatment</p>
    </div>
    <button
      className="px-3 py-2 text-sm text-white font-semibold bg-fuchsia-800 rounded-lg cursor-pointer hover:bg-fuchsia-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
      onClick={()=>navigate('/consultations')}
    >View All Consultations</button>
    </div>

    {/* General details and Vital Parameters */}
    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">

      {/* General details */}
      <div className="bg-white border border-gray-300 p-4 rounded-lg flex flex-col justify-between">

        <div className="mb-3">
          <p className="text-fuchsia-900 text-sm font-semibold">Patient Details</p>
          <div className="mt-2 flex flex-wrap justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Name</p>
              <p className="text-sm font-bold text-gray-900">{patient?.personal?.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Age</p>
              <p className="text-sm font-bold text-gray-900">{patient?.personal?.age}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Gender</p>
              <p className="text-sm font-bold text-gray-900">{patient?.personal?.gender}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Blood Group</p>
              <p className="text-sm font-bold text-gray-900">{patient?.personal?.bloodGroup}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-fuchsia-900 text-sm font-semibold">Appointment Details</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Date</p>
              <p className="text-sm font-bold text-gray-900">{appointment?.date}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Time</p>
              <p className="text-sm font-bold text-gray-900">{appointment?.timeSlot}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Consultation</p>
              <p className={`text-sm font-bold ${appointment?.consultationType === "In-Person" ? "text-red-600" : "text-blue-600"}`}>{appointment?.consultationType}</p>
            </div>
            <p className={`text-sm px-2 py-1 rounded-lg font-bold text-white ${getStatusClass(appointment?.status)}`}>{appointment?.status}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-3 items-center">
          <p className="text-red-600 text-sm">Consultation remarks :</p>
          <p className="text-sm text-gray-800">{appointment?.remarks}</p>
        </div>

      </div>

      {/* Vital Parameters */}
      <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg">
        
        {/* Medical History */}
        <div className="mb-3">
          <p className="text-fuchsia-900 text-sm font-semibold">Medical History</p>
          {
            patient?.medical?.history?.length > 0 ?
            <div className="flex flex-wrap gap-3 mt-2">
              {
                patient?.medical?.history.map((item, index)=>(
                  <div key={index}>
                    <p className="text-sm text-gray-700 px-2 py-1 border border-gray-200">{item}</p>
                  </div>
                ))
              }
            </div> :
            <p className="text-sm text-gray-900 text-center font-medium">No medical History</p>
          }

        </div>

        {/* Allergies */}
        <div className="mb-3">
          <p className="text-fuchsia-900 text-sm font-semibold">Allergies</p>
          {
            patient?.medical?.allergies?.length > 0 ?
            <div className="flex flex-wrap gap-3 mt-2">
              {
                patient?.medical?.allergies.map((item, index)=>(
                  <div key={index}>
                    <p className="text-sm text-gray-700 px-2 py-1 border border-gray-200">{item}</p>
                  </div>
                ))
              }
            </div> :
            <p className="text-sm text-gray-900 text-center font-medium">No allergies</p>
          }

        </div>

        {/* Vitals */}
        <div>
          <p className="text-fuchsia-900 text-sm font-semibold">Vitals</p>
          {
            patient?.vitals?.length > 0 ?
            <div className="grid grid-cols-2 items-center gap-3 mt-2">
              {
                patient?.vitals[0]?.vitalsData.map((item, index)=>(
                  <div 
                    key = {index}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <p className="text-sm">{item?.name} : <span className={`font-bold ${item?.status === "Normal" ? "text-green-600" : "text-red-600"}`}>{item?.value}</span> <span className="text-sm text-gray-600">{item?.unit}</span></p>
                  </div>
                ))
              }
            </div> :
            <div className="text-sm font-medium text-gray-700 mt-2 text-center">No vitals recorded</div>
          }
        </div>

      </div>

    </div>

    {/* Add Diagnosis and Add Remarks */}
    <div className="w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600">Doctor Diagnosis and Remarks</p>
    {
      (consultation?.doctor?.diagnosis && consultation?.doctor?.remarks) ?
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 items-center px-3 mt-2">

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-900 font-medium">Diagnosis</p>
        <p className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-sm font-semibold text-gray-900">{consultation?.doctor?.diagnosis}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-900 font-medium">Remarks</p>
        <p className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-sm font-semibold text-gray-900">{consultation?.doctor?.remarks}</p>
      </div>

      </div> :
      <div className="mt-2">
        <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 items-center">
        
        <div>
          <label className="text-sm text-gray-800 font-medium">Diagnosis <span className="text-red-600">*</span></label>
          <input 
            type="text"
            value={diagnosis}
            onChange={(e)=>setDiagnosis(e.target.value)}
            required
            placeholder='Enter diagnosis'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        <div>
          <label className="text-sm text-gray-800 font-medium">Remarks <span className="text-red-600">*</span></label>
          <input 
            type="text"
            value={doctorRemarks}
            onChange={(e)=>setDoctorRemarks(e.target.value)}
            required
            placeholder='Enter remarks'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        </div>
        <div className="flex justify-start items-center">
          <button 
            onClick={handleSaveDiagnosis}
            className="px-3 py-3 flex items-center gap-2 mt-4 cursor-pointer bg-fuchsia-800 hover:bg-fuchsia-700 text-white text-sm font-medium rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <FaPlus size={18}/> Add Diagnosis and Remarks
          </button>
        </div>

      </div>
    }
    </div>

    {/* Prescription */}
    <div className="w-full bg-white px-3 py-3 mt-4 mb-2 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600 mb-4">Prescriptions</p>

      {
        consultation?.prescriptions?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Medicine</th>
                  <th className="p-2 border">Frequency</th>
                  <th className="p-2 border">Duration</th>
                  <th className="p-2 border">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {consultation?.prescriptions.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{item?.medicineName}</td>
                    <td className="p-2 border">
                    {Array.isArray(item?.frequency)
                      ? item.frequency.join(" • ")
                      : "-"}
                    </td>
                    <td className="p-2 border">{item?.duration}</td>
                    <td className="p-2 border">{item?.instruction || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) 
      }
        {
          (appointment?.status !== "Completed" && consultation?.prescriptions?.length === 0) && (
          <div>
          <div className="grid md:grid-cols-4 gap-3 mt-3 items-center">

            <div>
              <label className="text-sm text-gray-800 font-medium">Medicine name<span className="text-red-600">*</span></label>
              <input
                value={medicineName}
                onChange={e => {
                  setMedicineName(e.target.value);
                  setSelectedMedicine(null);
                  setShowDropdown(true);
                }}
                placeholder="Medicine Name"
                className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
              />

              {
                showDropdown && medicineName && (
                <div className="absolute z-10 w-56 mt-2 bg-white border border-gray-600 rounded-md max-h-40 overflow-y-auto">
                {
                  medicines
                    .filter(med =>
                    med.medicineName
                    .toLowerCase()
                    .includes(medicineName.toLowerCase())
                  )
                  .map((med, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setMedicineName(med.medicineName);
                    setSelectedMedicine(med);
                    setShowDropdown(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                >
                  {med.medicineName}
                </div>
                ))
                }
                {
                  medicines.filter(med =>
                    med.medicineName
                    .toLowerCase()
                    .includes(medicineName.toLowerCase())
                  ).length === 0 && (
                  <div className="px-3 py-2 text-sm text-red-600">
                    Medicine not available
                  </div>
                  )
                }
                </div>
                )
              }
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">Frequency <span className="text-red-600">*</span></label>
              <div className="flex gap-3 items-center flex-wrap">
                {(['A', 'M', 'N', 'E']).map((item, index) => {
                  const full = frequencyMap[item];
                return (
                <button
                  key={index}
                  type="button"
                  onClick={() => addFrequency(item)}
                  className={`px-3 py-1 rounded-md border text-sm font-semibold
                    ${frequency.includes(full)
                    ? "bg-fuchsia-800 text-white border-fuchsia-800"
                    : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                {item}
                </button> )
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">Duration <span className="text-red-600">*</span></label>
              <input
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="Duration"
                className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
              />
            </div>

            <div>
              <label className="text-sm text-gray-800 font-medium">Instructions <span className="text-red-600">*</span></label>
              <input
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                placeholder="Instructions"
                className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
              />
            </div>

          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAddMedicine}
              className="flex gap-2 items-center px-3 py-2 bg-fuchsia-700 text-white rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <FaPlus size={18}/> Add Medicine
            </button>

            <button
              onClick={handleSavePrescription}
              className="flex gap-2 items-center px-3 py-2 bg-green-800 text-white rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
             <FaSave size={18}/> Save Prescription
            </button>

          </div>

          {
            prescriptionsList.length > 0 && (
              <div className="mt-4 space-y-2">
                {
                  prescriptionsList.map((item, index)=>(
                    <div 
                      key={index}
                      className="flex items-center justify-between border border-gray-300 p-2 rounded-md"
                    >
                      <p className="text-sm font-medium text-gray-900">{item.medicineName}</p>
                      <p className="text-sm font-medium text-gray-900">{item.frequency.join(", ")}</p>
                      <p className="text-sm font-medium text-gray-900">{item.duration}</p>
                      <p className="text-sm font-medium text-gray-900">{item.instruction}</p>
                      <FaTrash 
                        size={18} 
                        onClick={() => handleDeleteMedicine(index)}
                        className="text-red-600 cursor-pointer"
                      />
                    </div>
                  ))
                }
              </div>
            )
          }

          </div>
          ) 
        }
        
      

    </div>

    {/* Lab Reports */}
    <div className = "w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600 mb-4">Lab Reports</p>

      {
        labReports?.length > 0 && (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
            {
              labReports.map((item, index)=>{

                const status = reportStatusMap?.[item.labReportId] || "Requested";

                const statusColor =
                  status === "Requested"
                  ? "bg-blue-500"
                  : status === "Completed"
                  ? "bg-green-600"
                  : "bg-gray-500";

                return(
                <div 
                  key = {index}
                  className="px-3 py-2 flex items-center flex-wrap justify-between gap-3 border border-gray-300 rounded-lg"
                >
                  <p className="text-sm font-medium">{item?.testName}</p>
                  <p className={`text-white px-2 py-1 rounded-lg text-sm font-medium ${statusColor}`}>{status}</p>
                  {
                    status === "Completed" &&
                    <FaEye 
                    size={18}
                    onClick = {()=>{
                      navigate(`/patient-wise-reports/${item?.labReportId}`);
                      window.scroll(0,0);
                    }}
                    />
                  }
                </div> 
                )
              })
            }
          </div>
        ) 
      }

      {appointment?.status !== "Completed" && (
      <>
        <p className="mt-3 text-gray-600 text-sm font-medium">Request Lab Reports</p>
        <div className="mt-4 flex gap-3 items-end">

        <div>
          <label className="text-sm font-medium text-gray-800">Lab Test Name <span className="text-red-600">*</span></label>
          <input
            value={labTestName}
            onChange={e => setLabTestName(e.target.value)}
            placeholder="Enter lab test"
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        />
        </div>

        <button
          onClick={handleAddLabTest}
          className="flex gap-2 items-center px-3 py-2 bg-fuchsia-700 text-white rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <FaPlus size={18}/>Add Test
        </button>

        <button
          onClick={handleSaveLabReports}
          className="px-3 py-2 bg-green-800 text-white rounded-md text-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Save Lab Requests
        </button>
        </div>

        {
          newLabReports.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center mt-4">
              {
                newLabReports.map((item, index)=>(
                  <div
                    key = {index} 
                    className="flex items-center gap-4 justify-between px-3 py-2 border border-gray-500 bg-white rounded-lg"
                  >
                    <p className="text-sm text-gray-900 font-medium">{item.testName}</p>
                    <FaTrash
                      size={16}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      onClick={() => handleRemoveNewLabTest(index)}
                    />
                  </div>
                ))
              }
            </div>
          )
        }

        
      </>
      )}

      {appointment?.status === "Completed" && consultation.labReports.length === 0 && (
        <p className="text-sm text-gray-600 text-center">
          No lab reports available
        </p>
      )}

    </div>

    {/* Admitted Status */}
    <div className="w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600 mb-4">
        Admission Details
      </p>

      {
        appointment?.status !== "Completed" && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Request Admission</p>
            <div className="flex flex-wrap items-center gap-3">

              <div className="flex gap-3 items-center">
                <label className="text-sm font-medium text-gray-700">Bed Type <span className="text-red-600">*</span></label>
                <select
                  value = {bedType}
                  onChange={(e)=>setBedType(e.target.value)}
                  className = {`w-xs bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${bedType === "" ? "text-gray-500" : "text-gray-900"}`}
                >
                  <option value="">Select</option>
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="OT">OT</option>
                </select>
              </div>

              <button
                onClick={handleRequestAdmission}
                className="text-sm px-3 py-2 bg-fuchsia-700 text-white rounded-md cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                Request Admission
              </button>
            </div>
          </div>
        )
      }

      {
        consultation?.admission?.length > 0 ? (
          consultation.admission.map((item, index)=>{
            const isRequested = item.request?.requested && item.request?.requestStatus === "Pending";
            const isAdmitted = item.allocation?.admitted && !item.discharge?.dischargeDate;
            const isDischarged = item.discharge?.dischargeDate;

            return (
              <div
                key={index}
                className="border border-gray-300 rounded-lg mb-4 mt-5 pb-3 bg-gray-50" 
              >
                <div className="flex justify-between items-center p-3">
                  <p className="text-sm font-semibold text-fuchsia-800">Admission #{index+1}</p>
                  <span className={`text-xs px-2 py-1 rounded-md font-semibold text-white ${ isRequested ? "bg-blue-600" : isAdmitted ? "bg-orange-600" : "bg-green-700" }`}>
                    {isRequested
                      ? "Requested"
                      : isAdmitted
                      ? "Admitted"
                      : "Discharged"}
                  </span>
                </div>

                {
                  isRequested && (
                    <p className="text-sm text-gray-700 px-3">Requested on <span className="font-semibold">{formatDate(item.request.requestDate)}</span></p>
                  )
                }

                {
                  (isAdmitted || isDischarged) && (
                    <div className="grid grid-cols-3 gap-3 mb-3 px-3">
                      <div>
                        <p className="text-xs text-gray-500">Block</p>
                        <p className="text-sm font-bold">{item.allocation.block || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        <p className="text-sm font-bold">{item.allocation.department || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bed ID</p>
                        <p className="text-sm font-bold">{item.allocation.bedId || "-"}</p>
                      </div>
                    </div>
                  )
                }

                {
                  (isAdmitted || isDischarged) && (
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 px-3 border border-gray-300 mx-3 rounded-lg py-4 gap-4">

                    {/* Daily Notes */}
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-900">Daily Notes</p>
                      {
                        item.dailyNotes?.length > 0 ? (
                          item.dailyNotes.map((note, i)=>(
                            <p key={i} className="text-sm text-gray-700"> <span className="font-medium text-gray-900">{formatDate(note.date)}</span> - {note.note}</p>
                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No daily notes available</p>
                        )
                      }
                    </div>

                    {/* Discharge details */}

                    {
                      isDischarged && (
                        <div>
                          <p className="text-sm font-medium mb-3 text-gray-900">Discharge Details</p>
                          <div className="flex flex-col gap-2 items-start">
                            <p className="text-sm text-gray-700">Duration: <span className="font-semibold ml-1 text-gray-900">{item.discharge.numberOfDays} day(s)</span> </p>
                            <p className="text-sm text-gray-700">Final Vitals: BP: <span className={`font-semibold ${checkBP(item.discharge.finalVitals?.bloodPressure)? "text-green-700" : "text-red-700"}`}>{item.discharge.finalVitals?.bloodPressure}</span> mmHg , HR: <span className={`font-semibold ${checkHR(item.discharge.finalVitals?.heartRate)? "text-green-700" : "text-red-700"}`}>{item.discharge.finalVitals?.heartRate}</span> bpm</p>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-700">Patient Instructions</p>
                              {item.discharge.patientInstructions?.length > 0 ? (
                                item.discharge.patientInstructions.map((ins, i) => (
                                <p key={i} className="text-sm">
                                  • {ins}
                                </p>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 mt-1">
                                  No instructions provided
                                </p>
                              )}
                          </div>
                          </div>
                          
                        </div>
                      )
                    }


                    </div>
                  )
                }

                
              </div>
            )
          })
        ) : (
          <p className="text-sm text-gray-500 text-center mt-4">
            No admission details available
          </p>
        )
      }
      {
        appointment?.admissionStatus === "Discharged" && (
          <button 
            onClick = {()=>navigate(`/discharge-summary/${consultation?.consultationId}`)}
            className="px-3 py-2 bg-fuchsia-700 hover:bg-fuchsia-800 text-white rounded-lg cursor-pointer text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            View Discharge Summary
          </button>
        )
      }
      
    </div>

    {/* Action Buttons */}
    <div className="w-full flex justify-end items-center mt-5 gap-3">

    {appointment?.status === "Scheduled" && (
      <div className="flex gap-4 items-center">
        <p className="flex gap-2 items-center text-sm text-blue-700"><FaInfoCircle size={18}/>{appointment?.status}</p>
        <button
          onClick={() => handleAppointmentAction("In Progress")}
          className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Start Consultation
        </button>
      </div>
    )}

    {appointment?.status === "In Progress" && (
    <div className="flex gap-4 items-center">
    <p className="flex gap-2 items-center text-sm text-orange-700"><FaInfoCircle size={18}/>{appointment?.status}</p>

    <button
      onClick={() => handleAppointmentAction("Completed")}
      className="px-4 py-2 rounded-lg text-white bg-fuchsia-700 hover:bg-fuchsia-800 text-sm font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
    >
      Complete Consultation
    </button>
    
    </div>
    )}

    {appointment?.status === "Completed" && (
    <button
      className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${getStatusClass(
        appointment?.status
      )}`}
    >
      Completed
    </button>
    )}

    </div>

    </div>
    </>
  ) :
  (
    <div>No Data Available</div>
  )
}

export default PatientConsultation