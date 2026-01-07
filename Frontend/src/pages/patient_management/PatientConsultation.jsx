import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorConsultations } from '../../data/patient';
import { FaCheckCircle, FaEye, FaPlus, FaSave, FaTrash, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';

function PatientConsultation() {

    const navigate = useNavigate();
    const {id} = useParams();
    const [consultation, setConsultation] = useState(null);
    const [diagnosis, setDiagnosis] = useState("");
    const [doctorRemarks, setDoctorRemarks] = useState("");
    const [prescriptions, setPrescriptions] = useState([]);
    const [medicineName, setMedicineName] = useState("");
    const [frequency, setFrequency] = useState([]);
    const [duration, setDuration] = useState("");
    const [instruction, setInstruction] = useState("");
    const [labTestName, setLabTestName] = useState("");
    const [labReports, setLabReports] = useState([]);
    const [newLabReports, setNewLabReports] = useState([]);

    const handleSaveDiagnosis = () =>{
      if(!diagnosis || !doctorRemarks) return;

      setConsultation(prev => ({
        ...prev,
        diagnosis,
        doctorRemarks
      }));
      toast.success("Diagnosis and Remarks Added");
      setDiagnosis("");
      setDoctorRemarks("");
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
        medicineName,
        frequency,
        duration,
        instruction
      };

      setPrescriptions(prev => [...prev, newMedicine]);

      setMedicineName("");
      setFrequency([]);
      setDuration("");
      setInstruction("");
    };

    const handleDeleteMedicine = (index) => {
      setPrescriptions(prev =>
        prev.filter((_, i) => i !== index)
      );
    };

    const handleSavePrescription = () => {
      if (prescriptions.length === 0) return;

      setConsultation(prev => ({
        ...prev,
        prescriptions
      }));
    };

    const handleAddLabTest = () =>{
      if(!labTestName) return;

      const newTest = {
      testName: labTestName,
      status: "Pending",
      };

      setLabReports(prev => [...prev, newTest]);
      setNewLabReports(prev => [...prev, newTest]);
      setLabTestName("");

    }

    const handleSaveLabReports = () => {
      setConsultation(prev => ({
        ...prev,
        labReports
      }));
      toast.success("Lab tests requested");
      setNewLabReports([]);
    };

    useEffect(()=>{
      const fetchConsultation = async() =>{
        console.log(id);
        await new Promise(resolve => setTimeout(resolve, 200));

        const foundConsultation = doctorConsultations.find(
          (item) => item.appointmentId === id
        );

        if(foundConsultation){
          setConsultation(foundConsultation);
          setDiagnosis(consultation?.diagnosis || "");
          setDoctorRemarks(consultation?.doctorRemarks || "");
          setPrescriptions(consultation?.prescriptions || []);
          setLabReports(consultation?.labReports || []);
        }
      }
      fetchConsultation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

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

  return consultation ? (
    <>
    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Heading */}
    <div className="flex flex-wrap justify-between gap-2">
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
      className="px-3 py-1 text-sm text-white font-semibold bg-fuchsia-800 rounded-lg cursor-pointer hover:bg-fuchsia-700"
      onClick={()=>navigate('/consultations')}
    >View All Consultations</button>
    </div>

    {/* General details and Vital Parameters */}

    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">

      {/* General details */}
      <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg">

        <div className="mb-3">
          <p className="text-fuchsia-900 text-sm font-semibold">Patient Details</p>
          <div className="mt-2 flex flex-wrap justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Name</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.patientDetails.name}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Age</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.patientDetails.age}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Gender</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.patientDetails.gender}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Blood Group</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.patientDetails.bloodGroup}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-fuchsia-900 text-sm font-semibold">Appointment Details</p>
          <div className="mt-2 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Date</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.appointmentDetails.date}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Time</p>
              <p className="text-sm font-bold text-gray-900">{consultation?.appointmentDetails.timeSlot}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-700">Consultation</p>
              <p className={`text-sm font-bold ${consultation?.consultationType === "In Person" ? "text-red-600" : "text-blue-600"}`}>{consultation?.consultationType}</p>
            </div>
            <p className={`text-sm px-2 py-1 rounded-lg font-bold text-white ${getStatusClass(consultation?.consultationStatus)}`}>{consultation?.consultationStatus}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-3 items-center">
          <p className="text-red-600 text-sm">Consultation remarks :</p>
          <p className="text-sm text-gray-800">{consultation?.appointmentDetails.reason}</p>
        </div>

      </div>

      {/* Vital Parameters */}
      <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg">
        
        {/* Medical History */}
        <div className="mb-3">
          <p className="text-fuchsia-900 text-sm font-semibold">Medical History</p>
          {
            consultation.patientDetails.medicalHistory.length > 0 ?
            <div className="flex flex-wrap gap-3 mt-2">
              {
                consultation.patientDetails.medicalHistory.map((item, index)=>(
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
            consultation.patientDetails.allergies.length > 0 ?
            <div className="flex flex-wrap gap-3 mt-2">
              {
                consultation.patientDetails.allergies.map((item, index)=>(
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
            consultation?.vitals.length > 0 ?
            <div className="grid grid-cols-2 items-center gap-3 mt-2">
              {
                consultation?.vitals.map((item, index)=>(
                  <div 
                    key = {index}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <p className="text-sm">{item.name} : <span className={`font-bold ${item.status === "Normal" ? "text-green-600" : "text-red-600"}`}>{item.value}</span> <span className="text-sm text-gray-600">{item.unit}</span></p>
                  </div>
                ))
              }
            </div> :
            <div className="text-sm font-medium text-gray-700">No vitals recorded</div>
          }
        </div>

      </div>

    </div>

    {/* Add Diagnosis and Add Remarks */}
    <div className="w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600">Doctor Diagnosis and Remarks</p>
    {
      (consultation?.diagnosis && consultation?.doctorRemarks) ?
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 items-center px-3 mt-2">

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-900 font-medium">Diagnosis</p>
        <p className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-sm font-semibold text-gray-900">{consultation?.diagnosis}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-900 font-medium">Remarks</p>
        <p className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-sm font-semibold text-gray-900">{consultation?.doctorRemarks}</p>
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
            className="px-3 py-3 flex items-center gap-2 mt-4 cursor-pointer bg-fuchsia-800 hover:bg-fuchsia-700 text-white text-sm font-medium rounded-lg"
          >
            <FaPlus size={18}/> Add Diagnosis and Remarks
          </button>
        </div>

      </div>
    }
    </div>

    {/* Prescription */}
    <div className="w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
      <p className="text-sm font-medium text-gray-600 mb-4">Prescriptions</p>

      {
        consultation?.prescriptions?.length > 0 ? (
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
                {consultation.prescriptions.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="p-2 border">{item.medicineName}</td>
                    <td className="p-2 border">
                    {Array.isArray(item.frequency)
                      ? item.frequency.join(" • ")
                      : "-"}
                    </td>
                    <td className="p-2 border">{item.duration}</td>
                    <td className="p-2 border">{item.instruction || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
          <div className="grid md:grid-cols-4 gap-3 items-center">

            <div>
              <label className="text-sm text-gray-800 font-medium">Medicine name<span className="text-red-600">*</span></label>
              <input
                value={medicineName}
                onChange={e => setMedicineName(e.target.value)}
                placeholder="Medicine Name"
                className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
              />
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
              className="flex gap-2 items-center px-3 py-2 bg-fuchsia-700 text-white rounded-md text-sm"
            >
              <FaPlus size={18}/> Add Medicine
            </button>

            <button
              onClick={handleSavePrescription}
              className="flex gap-2 items-center px-3 py-2 bg-green-800 text-white rounded-md text-sm"
            >
             <FaSave size={18}/> Save Prescription
            </button>

          </div>

          {
            prescriptions.length > 0 && (
              <div className="mt-4 space-y-2">
                {
                  prescriptions.map((item, index)=>(
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
        consultation?.labReports?.length > 0 && (
          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
            {
              consultation.labReports.map((item, index)=>(
                <div 
                  key = {index}
                  className="px-3 py-2 flex items-center flex-wrap justify-between gap-3 border border-gray-300 rounded-lg"
                >
                  <p className="text-sm font-medium">{item.testName}</p>
                  <p className={`text-white px-2 py-1 rounded-lg text-sm font-medium ${item.status === "Pending" ? "bg-orange-500" : item.status === "Requested" ? "bg-blue-500" : "bg-green-500"}`}>{item.status}</p>
                  {
                    item.status === "Completed" &&
                    <FaEye size={18}/>
                  }
                </div>
              ))
            }
          </div>
        ) 
      }

      {consultation.consultationStatus !== "Completed" && (
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
          className="flex gap-2 items-center px-3 py-2 bg-fuchsia-700 text-white rounded-md text-sm"
        >
          <FaPlus size={18}/>Add Test
        </button>

        <button
          onClick={handleSaveLabReports}
          className="px-3 py-2 bg-green-800 text-white rounded-md text-sm"
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
                    className="flex flex-wrap gap-10 justify-between px-3 py-1 border border-gray-500 bg-white rounded-lg"
                  >
                    <p className="text-sm text-gray-900 font-medium">{item.testName}</p>
                    <p className="text-sm text-gray-900 font-medium">{item.status}</p>
                  </div>
                ))
              }
            </div>
          )
        }

        
      </>
      )}

      {consultation.consultationStatus === "Completed" && consultation.labReports.length === 0 && (
        <p className="text-sm text-gray-600 text-center">
          No lab reports available
        </p>
      )}

    </div>

    {/* Admitted Status */}
    {
      consultation?.admissionDetails?.admitted && (
        <div className="w-full bg-white px-3 py-3 mt-4 rounded-lg border border-gray-300">
          <p className="text-sm font-medium text-gray-600 mb-4">Admitted Details</p>

          <div className="w-full px-3 py-2 flex gap-5 justify-between">

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">Block</p>
              <p className="text-sm font-bold text-gray-900">A Block</p>
            </div>
            
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">Ward</p>
              <p className="text-sm font-bold text-gray-900">General Ward</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">Bed Number</p>
              <p className="text-sm font-bold text-gray-900">G-103</p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">Number of days</p>
              {
                consultation?.admissionDetails?.numberOfDays ?
                <p className="text-sm font-bold text-gray-900">{consultation?.admissionDetails.numberOfDays} day(s)</p> :
                <p className="text-sm font-bold text-gray-900">-</p>
              }
              
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-600">Discharge Remarks</p>
              {consultation?.admissionDetails.dischargeRemarks ? 
              <p className="text-sm font-bold text-gray-900">{consultation?.admissionDetails.dischargeRemarks}</p> :
              <p> - </p>
              }
              
            </div>

          </div>

          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 items-top mt-4">
            <div className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
              <p className="text-sm font-medium text-gray-700 mb-4">Daily Notes</p>
              {
                consultation?.admissionDetails?.dailyNotes ? 
                <div className="flex items-start pl-2 flex-col gap-2">
                 { consultation?.admissionDetails.dailyNotes.map((item, index) => (
                    <p 
                      key={index}
                      className="text-sm text-gray-800 font-medium"
                    >
                      12 Jul 2025 - {item}
                    </p>
                  ))
                }
                </div> :
                <p className="text-sm text-gray-800 font-bold text-center">Notes not available</p>
              }
            </div>

            <div className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
              <p className="text-sm font-medium text-gray-700 mb-4">Final Vitals</p>

              {
                consultation?.admissionDetails?.finalVitals ?
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3">
                    <p className="text-sm text-gray-800">Blood Pressure : <span className="font-bold">{consultation?.admissionDetails.finalVitals.bloodPressure}</span></p>
                    <p className="text-green-700 font-semibold text-sm">Normal</p>
                  </div>

                  <div className="flex gap-3">
                    <p className="text-sm text-gray-800">Heart Rate : <span className="font-bold">{consultation?.admissionDetails.finalVitals.heartRate}</span></p>
                    <p className="text-green-700 font-semibold text-sm">Normal</p>
                  </div>
                </div> :
                <p className="text-sm text-gray-800 font-bold text-center">No Vitals Recorded</p>
              }
            </div>

            <div className="bg-gray-100 rounded-lg px-3 py-2 border border-gray-300">
              <p className="text-sm font-medium text-gray-700 mb-4">Patient Instructions</p>
              {
                consultation?.patientInstructions ? 
                <div className="flex items-start pl-2 flex-col gap-2">
                 { consultation?.patientInstructions.map((item, index) => (
                    <p 
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-800 font-medium"
                    >
                     <FaCheckCircle 
                      size={18} 
                      className="text-green-600"
                    />
                    {item}
                    </p>
                  ))
                }
                </div> :
                <p className="text-sm text-gray-800 font-bold text-center">Instructions not available</p>
              }
            </div>
          </div>
        </div>
      )
    }

    {/* Action Buttons */}
    <div className="w-full flex justify-end items-center mt-5 gap-3">

    {consultation?.consultationStatus === "Scheduled" && (
    <button
      className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
    >
      Start Consultation
    </button>
    )}

    {consultation?.consultationStatus === "In Progress" && (
    <button
      className="px-4 py-2 rounded-lg text-white bg-orange-700 hover:bg-orange-800 text-sm font-semibold"
    >
      Complete Consultation
    </button>
    )}

    {consultation?.consultationStatus === "Completed" && (
    <button
      className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${getStatusClass(
        consultation?.consultationStatus
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