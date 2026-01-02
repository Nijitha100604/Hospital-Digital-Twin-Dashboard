import React, { useEffect, useState, useRef } from 'react'
import { 
  FaDownload, 
  FaNotesMedical, 
  FaPrint, 
  FaRegUser, 
  FaFilePrescription, 
  FaStethoscope,
  FaRegHeart,
  FaRegFileAlt,
  FaInfoCircle,
  FaRegCheckCircle
} from 'react-icons/fa'
import { IoDocumentTextOutline, IoMedkitOutline } from "react-icons/io5";
import { useParams } from 'react-router-dom'
import { allAppointments } from '../../data/patient';
import html2pdf from "html2pdf.js";

function DischargeSummary() {

  const {id} = useParams();
  const[patientData, setPatientData] = useState(null);

  const pdfRef = useRef();

  const handlePrint = () =>{
    window.print();
  }

  const handleDownload = () =>{
  
  const element = pdfRef.current;

  const patientName = patientData.patient.name
    .replace(/\s+/g, "_")
    .toLowerCase();

  element.classList.add("pdf-safe");

  html2pdf()
    .from(element)
    .set({
      margin: [5, 5, 5, 5],
      filename: `${patientName}_discharge_summary.pdf`,
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
      
      const fetchAppointment = async() =>{
        console.log(id);
        await new Promise(resolve => setTimeout(resolve, 200));
  
        const foundAppointment = allAppointments.find(
          (item) => item.patientId === id
        );
        setPatientData(foundAppointment ?? null);
        console.log(patientData);
      }
      fetchAppointment();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])


  return patientData ? (
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
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-pink-100 border border-pink-500 text-pink-700 rounded-lg hover:bg-pink-300 cursor-pointer"
        >
          <FaPrint />Print
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-700 text-white rounded-lg cursor-pointer hover:bg-purple-500"
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
          Patient Name: {patientData.patient.name}
          </p>
        </div>

      {/* Patient and Admission Info */}
      <div className="grid md:grid-cols-2 gap-4">

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
              <p className="text-sm font-semibold text-gray-900">{patientData.patient.name}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Age :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.patient.age}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Gender :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.patient.gender}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Contact :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.patient.contact}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Patient ID :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.patientId}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Blood Group:</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.patient.blood}</p>
            </div>


          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-blue-200 rounded-lg pdf-hide">
            <IoDocumentTextOutline size={16} className="text-blue-600"/> 
            </div>
            Admission and Discharge Details
          </h3>
          
          <div className="mt-5 grid grid-cols-2 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Apt ID :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.appointmentNumber}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Admission :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.date}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Discharge :</p>
              <p className="text-sm font-semibold text-gray-900">2025-01-12</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Total days</p>
              <p className="text-sm font-semibold text-gray-900">4 days</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Ward :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.admitted.ward}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Bed No:</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.admitted.bedNo}</p>
            </div>
   
          </div>
        </div>

      </div>

      {/* Treating Medical Team and Diagnosis Details */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-purple-200 rounded-lg pdf-hide">
            <FaStethoscope size={16} className="text-purple-600"/> 
            </div>
            Treating Medical Team
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Doctor :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.doctorName}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Doctor ID :</p>
              <p className="text-sm font-semibold text-gray-900">DOC000123</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Department :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.doctorCategory}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Nurse :</p>
              <p className="text-sm font-semibold text-gray-900">Sarah Davis</p>
            </div>
            
          </div>

        </div>

         <div className="bg-white p-4 rounded-lg border border-gray-300">
          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-red-200 rounded-lg pdf-hide">
            <IoMedkitOutline size={16} className="text-red-600"/> 
            </div>
            Diagnosis Details
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Provisonal Diagnosis :</p>
              <p className="text-sm font-semibold text-gray-900">{patientData.diagnosis}</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Final Diagnosis :</p>
              <p className="text-sm font-semibold text-gray-900">Myocardial Infarction</p>
            </div>
            
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
                patientData.prescriptions.map((item, index)=>(
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
        </div>
      </div>

      {/* Discharge Condition and Reports */}
      <div className="grid md:grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-lg border border-gray-300">

          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-green-200 rounded-lg pdf-hide">
            <FaRegHeart size={16} className="text-green-600"/> 
            </div>
            Patient Condition at Discharge
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3">
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Status :</p>
              <p className="text-sm bg-green-200 px-2 py-1 rounded-lg font-semibold text-green-700">Stable and Improved</p>
            </div>

            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Vitals :</p>
              <p className="text-sm font-semibold text-gray-900">BP 120/80, HR 75 bpm</p>
            </div>
            
            <div className="flex justify-between px-4 py-1 ">
              <p className="text-gray-600 text-sm font-medium">Mobility :</p>
              <p className="text-sm font-semibold text-gray-900">Ambulatory with assistance</p>
            </div>
          </div>

        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-300">

          <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
            <div className="px-1 py-1 bg-gray-200 rounded-lg pdf-hide">
            <FaRegFileAlt size={16} className="text-gray-600"/> 
            </div>
            Lab Reports
          </h3>

            {
              patientData.labReports.length > 0 ?
            
              <div className="mt-5 grid grid-cols-1 gap-3">
                
                {
                  patientData.labReports.map((item, index)=>(
                    <div 
                      key={index}
                      className="flex justify-between px-4 py-1 "
                    >
                      <p className="text-gray-600 text-sm font-medium">{item.testName}</p>
                      <p className="text-sm bg-green-200 px-2 py-1 rounded-lg font-semibold text-green-700">{item.status}</p>
                    </div>
                  ))
                }
              </div> :
              <div>
                No Tests were done
              </div>
            }  

        </div>

      </div>

      {/* Post discharge Remarks */}
      <div  className="bg-white p-4 rounded-lg border border-gray-300">
        <h3 className="flex text-sm items-center gap-2 font-semibold text-gray-700 mb-2">
          <div className="px-1 py-1 bg-orange-200 rounded-lg pdf-hide">
          <FaInfoCircle size={16} className="text-orange-600"/> 
          </div>
          Post Discharge Remarks
        </h3>

        <div className="mt-4 flex flex-col gap-2">
          <h3 className="text-medium text-gray-800 text-md">Doctor's Remarks</h3>
          <p className="text-sm text-gray-900">Patient has shown excellent recovery post-intervention. Continue prescribed medications and maintain a heart-healthy lifestyle. Regular follow-up is essential for monitoring cardiac function.</p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <h3 className="text-medium text-gray-800 text-md">Patient Instruction</h3>
          <div className="flex gap-2">
            <FaRegCheckCircle size={20} className="text-green-600 text-md pdf-hide"/> 
            <p className="text-sm text-gray-900">Follow a low-sodium, heart-healthy diet</p>
          </div>
          <div className="flex gap-2">
            <FaRegCheckCircle size={20} className="text-green-600 text-md pdf-hide"/> 
            <p className="text-sm text-gray-900">Avoid strenuous physical activities for 2 weeks</p>
          </div>
          <div className="flex gap-2">
            <FaRegCheckCircle size={20} className="text-green-600 text-md pdf-hide"/> 
            <p className="text-sm text-gray-900">Seek immediate medical attention if experiencing chest pain, shortness of breath, or swelling</p>
          </div>
        </div>
      </div>

    </div>

    </div>

    </>
  ) : (
    <>No Data Available</>
  )
}

export default DischargeSummary