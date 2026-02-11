import { useEffect, useState, useRef, useContext } from 'react'
import { 
  FaDownload, 
  FaNotesMedical, 
  FaPrint, 
  FaRegUser, 
  FaFilePrescription, 
  FaStethoscope,
  FaRegFileAlt,
  FaInfoCircle,
  FaRegCheckCircle
} from 'react-icons/fa'
import { IoDocumentTextOutline, IoMedkitOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
import { PatientContext } from '../../context/PatientContext';
import { AppContext } from '../../context/AppContext';
import { formatDate } from "../../utils/formatDate";
import { LabContext } from '../../context/LabContext';
import { useMemo } from 'react';
import { StaffContext } from './../../context/StaffContext';
import AccessDenied from '../../components/AccessDenied';

function DischargeSummary() {

  const { id: consultationId } = useParams();
  const[patient, setPatient] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const {patients, fetchPatients, appointments, fetchAppointments, consultations, fetchConsultations} = useContext(PatientContext);
  const {reports} = useContext(LabContext);
  const { token, userData } = useContext(AppContext);
  const {staffs} = useContext(StaffContext);

  const role = userData?.designation;

  const reportMap = useMemo(() => {
    const map = {};

    reports?.forEach(report => {
      map[report.labReportId] = report;
    });

    return map;
  }, [reports]);

  const doctor = useMemo(() => {
    if (!staffs || !appointment?.docId) return null;

    return staffs.find(
      (staff) => staff.staffId === appointment.docId
    );
  }, [staffs, appointment?.docId]);

  const admissions = consultation?.admission || [];

  const pdfRef = useRef();

  const handlePrint = () =>{
    window.print();
  }

  const handleDownload = () =>{
  
  const element = pdfRef.current;

  if(!patient) return;

  element.classList.add("pdf-safe");

  html2pdf()
    .from(element)
    .set({
      margin: [5, 5, 5, 5],
      filename: `${patient.personal.name}_discharge_summary.pdf`,
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true
      },
      jsPDF: { format: "a3", unit: "mm", orientation: "portrait" }
    })
    .save()
    .then(() => {
      element.classList.remove("pdf-safe");
    });
  }

  useEffect(()=>{
      
      if(!consultations.length) return;
      const foundConsultation = consultations.find(
        c => c.consultationId === consultationId
      );
      if (!foundConsultation) return;
      setConsultation(foundConsultation);

      const foundPatient = patients.find(
        p => p.patientId === foundConsultation.patientId
      );
      setPatient(foundPatient || null);

      const foundAppointment = appointments.find(
        a => a.appointmentId === foundConsultation.appointmentId
      );
      setAppointment(foundAppointment || null);
  
  },[consultationId, consultations, patients, appointments])

  useEffect(()=>{
      if(token){
        fetchPatients();
        fetchAppointments();
        fetchConsultations();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  if( role === "Support" || role === "Pharmacist" || role === "Technician" ){
    return <AccessDenied />
  }

  if (!consultation || !patient) {
    return <p className="text-center">No Data Available</p>;
  }

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Top Section */}
    <div className="flex flex-wrap gap-2 justify-between items-center">

      {/* Title */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaNotesMedical 
            size={20}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">Discharge Summary</p>
        </div>
        <p className="text-gray-500 text-sm">A complete overview of patient treatment and discharge details.</p>
      </div>

      {/* Print and download button */}
      <div className="flex gap-3">
        <button
          onClick = {handlePrint}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-pink-100 border border-pink-500 text-pink-700 rounded-lg hover:bg-pink-300 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <FaPrint />Print
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-700 text-white rounded-lg cursor-pointer hover:bg-purple-500 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          <FaDownload />Download
        </button>
      </div>
    </div>

    {/* Content */}
    
    <div ref={pdfRef} className="print-area space-y-4 mt-4">

      {/* PDF-only Heading */}
        <div className="pdf-only text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            DISCHARGE SUMMARY
          </h1>
          <p className="text-sm text-gray-600">
          Patient Name: {patient?.personal?.name}
          </p>
        </div>

      {/* Patient and Admission Info */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* Patient details */}
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-emerald-200 rounded-lg pdf-hide">
            <FaRegUser size={16} className="text-emerald-500"/> 
            </div>
            Patient Information
          </h3>
          
          <div className="mt-5 grid grid-cols-2 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Name :</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.personal?.name}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Age :</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.personal?.age}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Gender :</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.personal?.gender}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Contact :</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.personal?.contact}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Patient ID :</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.patientId}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Blood Group:</p>
              <p className="text-sm font-semibold text-gray-900">{patient?.personal?.bloodGroup}</p>
            </div>


          </div>
        </div>

        {/* Admission Details */}
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-blue-200 rounded-lg pdf-hide">
            <IoDocumentTextOutline size={16} className="text-blue-600"/> 
            </div>
            Appointment Details
          </h3>
          
          <div className="mt-5 grid grid-cols-2 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Apt ID :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.appointmentId}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Apt Type :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.appointmentType}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Slot :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.timeSlot}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Date :</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(appointment?.date)}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Visit :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.consultationType}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Status :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.status}</p>
            </div>
   
          </div>
        </div>

      </div>

      {/* Treating doctor details and Diagnosis Details */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* doctor details */}
        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-purple-200 rounded-lg pdf-hide">
            <FaStethoscope size={16} className="text-purple-600"/> 
            </div>
            Doctor Details
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Doctor :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.doctorName}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Doctor ID :</p>
              <p className="text-sm font-semibold text-gray-900">{appointment?.docId}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Specialization :</p>
              <p className="text-sm font-semibold text-gray-900">{doctor?.specialization || "Not Available"}</p>
            </div>
            
          </div>

        </div>

        {/* Lab Reports */}
        <div className="bg-white p-4 rounded-lg border border-gray-300">

          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-gray-200 rounded-lg pdf-hide">
            <FaRegFileAlt size={16} className="text-gray-600"/> 
            </div>
            Lab Reports
          </h3>

            {
              consultation?.labReports?.length > 0 ?
            
              <div className="mt-5 grid grid-cols-1 gap-3">
                
                {
                  consultation?.labReports?.map((item, index)=>{
                    const report = reportMap[item.labReportId];
                    return(
                    <div 
                      key={index}
                      className="flex justify-between px-4 py-1 "
                    >
                      <p className="text-gray-600 text-sm font-medium">{item.testName}</p>
                      <p className={`text-sm px-2 py-1 rounded-lg font-semibold ${ report?.status === "Completed" ? "bg-green-200 text-green-700" : report?.status === "Pending" ? "bg-yellow-200 text-yellow-700" : "bg-gray-200 text-gray-700" }`}>{report?.status || "Not Available"}</p>
                    </div>
                    )
                  })
                }
              </div> :
              <div className="text-gray-900 text-center">
                No Tests were done
              </div>
            }  

        </div>

      </div>

      {/* diagnosis details */}
         <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-red-200 rounded-lg pdf-hide">
            <IoMedkitOutline size={16} className="text-red-600"/> 
            </div>
            Diagnosis Details
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3">
            
            <div className="flex gap-4 items-start px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Diagnosis :</p>
              <p className="text-sm font-semibold text-gray-900">{consultation?.doctor?.diagnosis || "-"}</p>
            </div>       

            <div className="flex gap-4 items-start px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Remarks :</p>
              <p className="text-sm font-semibold text-gray-900">{consultation?.doctor?.remarks || "-"}</p>
            </div>
            
          </div>

        </div>

      {/* Prescription */}
      <div className="bg-white p-4 rounded-lg border border-gray-300">
        <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-pink-200 rounded-lg pdf-hide">
            <FaFilePrescription size={16} className="text-pink-600"/> 
            </div>
            Prescription
        </h3>

        {
          consultation?.prescriptions?.length > 0 ?
          <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-gray-300 border-collapse table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left text-gray-800 text-medium w-16">S.No</th>
                <th className="p-2 text-left text-gray-800 text-medium w-36">Medicine</th>
                <th className="p-2 text-left text-gray-800 text-medium w-42">Frequency</th>
                <th className="p-2 text-left text-gray-800 text-medium w-18">Duration</th>
                <th className="p-2 text-left text-gray-800 text-medium w-32">Instruction</th>
              </tr>
            </thead>
            <tbody >
              {
                consultation?.prescriptions?.map((item, index)=>(
                  <tr 
                    key={index}
                    className="border-b border-gray-300"
                  >
                    <td className="p-2 text-gray-800 text-medium">{index+1}</td>
                    <td className="p-2 text-gray-800 text-left text-medium">{item.medicineName}</td>
                    <td className="p-2 text-gray-800 text-medium">
                      <div className="flex gap-2 items-center justify-start">
                      {item.frequency.map((freq, freqIndex) => (
                      <span
                        key={freqIndex}
                        className="text-sm text-gray-800 font-medium"
                      >
                        {freq}
                      </span>
                      ))}
                      </div>
                    </td>
                    <td className="p-2 text-gray-800 text-medium">{item.duration}</td>
                    <td className="p-2 text-gray-800 text-medium">{item.instructions}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          </div> :
          <div className="text-gray-900 text-center text-sm">No Prescriptions available</div>
        }

        
      </div>

      {/* Post discharge Remarks */}
      <div  className="bg-white p-4 rounded-lg border border-gray-300">
        <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
          <div className="px-1 py-1 bg-orange-200 rounded-lg pdf-hide">
          <FaInfoCircle size={16} className="text-orange-600"/> 
          </div>
          Discharge Details
        </h3>

        {
          admissions.length > 0 ? (
            admissions.map((item, index)=>{
              return(
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-400 mb-4"
                >
                  {/* Header */}
                  <div className="mb-2">
                    <p className="text-gray-900 text-sm font-semibold">Admission #{index+1}</p>
                  </div>

                  {/* Admission Info */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Admitted Date</p>
                      <p className="text-sm font-medium">{formatDate(item?.allocation?.admissionDate) || "-"}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Block</p>
                      <p className="text-sm font-medium">{item?.allocation?.block || "-"}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-sm font-medium">{item?.allocation?.department || "-"}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Bed ID</p>
                      <p className="text-sm font-medium">{item?.allocation?.bedId || "-"}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Total Day(s)</p>
                      <p className="text-sm font-medium">{item?.discharge?.numberOfDays || "-"}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Discharge Date</p>
                      <p className="text-sm font-medium">{formatDate(item?.discharge?.dischargeDate) || "-"}</p>
                    </div>

                  </div>

                  <hr className="mt-3 text-gray-400" />

                  {/* Final Diagnosis and details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Final Diagnosis</p>
                      <p className="text-sm font-medium">{item?.discharge?.finalDiagnosis || "-"}</p>
                      <p className="text-sm">BP: <span className="font-medium">{item?.discharge?.finalVitals?.bloodPressure}</span> mmHg , HR: <span className="font-medium">{item?.discharge?.finalVitals?.heartRate}</span> bpm</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Remarks</p>
                      <p className="text-sm font-medium">{item?.discharge?.dischargeRemarks || "-"}</p>
                    </div>
                  </div>

                  <hr className="mt-3 text-gray-400" />

                  {/* Daily Notes and patient instructions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Daily Notes</p>
                      <div>
                        {
                          item?.dailyNotes?.length > 0 ? (
                            item.dailyNotes.map((item, index)=>(
                              <p
                                key={index}
                                className="text-sm"
                              > <span className="font-medium">{formatDate(item?.date)}</span> - {item.note}</p>
                            ))
                          ) : (
                            <p>Notes not available</p>
                          )
                        }
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Instructions</p>
                      <div className="flex flex-col gap-1">
                        {item.discharge.patientInstructions?.length > 0 ? (
                          item.discharge.patientInstructions.map((ins, i) => (
                            <p key={i} className="text-sm flex gap-2 items-center">
                              <FaRegCheckCircle size={14} className="text-green-600 text-sm pdf-hide"/> {ins}
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

                </div>
              )
            })
          ) : (
            <p className="text-sm text-gray-500 text-center mt-4">
              No admission details available
            </p>
          )
        }

      </div>

    </div>

    </div>

    </>
  ) 
}

export default DischargeSummary