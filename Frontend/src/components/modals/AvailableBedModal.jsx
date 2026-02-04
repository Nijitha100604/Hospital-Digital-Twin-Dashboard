import React, { useContext, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { DeptContext } from '../../context/DeptContext';
import { PatientContext } from '../../context/PatientContext';

function AvailableBedModal({ bed, bedRequest, onClose }) {

  const [loading, setLoading] = useState(false);
  const { assignBed, fetchBeds, fetchPendingBedRequests  } = useContext(DeptContext);
  const { fetchConsultations } = useContext(PatientContext);

    const handleOccupy = async() =>{
        if (!bedRequest) {
            toast.error("No bed request selected");
            return;
        }

        if (bed.bedType !== bedRequest.bedType) {
          toast.error(`Cannot assign ${bedRequest.bedType} bed request to ${bed.bedType} bed` );
          return;
        }

        try{
          setLoading(true);

          const bedData = {
            bedId: bed.bedId,
            requestId: bedRequest.requestId,
            consultationId: bedRequest.consultationId,
            admissionIndex: bedRequest.admissionIndex,
            appointmentId: bedRequest.appointmentId,
            patientName: bedRequest.patientName,
            patientId: bedRequest.patientId,
            doctorId: bedRequest.doctorId,
            department: bed.department,
            block: bed.block || "Block A"
          }

          const success = await assignBed(bedData);
          if(success){
            onClose();
            await Promise.all([
              fetchBeds(),
              fetchPendingBedRequests(),
              fetchConsultations()
            ]);
          }

        } catch(error){
          console.log(error);
          toast.error("Internal Server Error");
        } finally{
          setLoading(false);
        }
    }

    const isTypeMismatch = bedRequest && bed.bedType !== bedRequest.bedType;
    const isDisabled = !bedRequest || isTypeMismatch;

  return (
    <>

    <p className="text-lg font-semibold text-gray-800 mb-4">{bed.bedId}</p>
    
    <div className="bg-green-50 text-green-800 font-semibold border border-green-300 rounded-lg p-3 mb-4">
        Available for Assignment
    </div>

    {
        !bedRequest && (
            <p className="flex gap-2 text-sm text-red-600 mb-3">
                <FaInfoCircle />
                <span>Please select a bed request first</span>
            </p>
        )
    }

    {
      isTypeMismatch && (
        <p className="flex gap-2 text-sm text-red-600 mb-3">
          <FaInfoCircle />
          <span>
            Requested bed type is <b>{bedRequest.bedType}</b>.  
            Please select a matching bed.
          </span>
        </p>
      )
    }

    {
        bedRequest && (
        <div className="w-full grid grid-cols-2 gap-6 mt-2">
        <div>
            <label className="text-sm text-gray-800 font-medium">Patient ID <span className="text-red-600">*</span></label>
            <input
            readOnly
            className="w-full bg-gray-100 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            value={bedRequest?.patientId || ""}
            />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Patient Name</label>
          <input
            value={bedRequest?.patientName || ""}
            readOnly
            className="w-full bg-gray-100 mt-1 border rounded-md px-3 py-2 text-gray-700"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Consultation ID</label>
          <input
            value={bedRequest?.consultationId || ""}
            readOnly
            className="w-full bg-gray-100 mt-1 border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Appointment ID</label>
          <input
            value={bedRequest?.appointmentId || ""}
            readOnly
            className="w-full bg-gray-100 mt-1 border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-800">Bed Type</label>
          <input
            value={bedRequest?.bedType || ""}
            readOnly
            className="w-full bg-gray-100 mt-1 border rounded-md px-3 py-2"
          />
        </div>

        </div>
        ) 
    }

    <button 
        disabled={isDisabled || loading}
        className={`px-3 py-2 mt-8 rounded-lg text-white transition-all
          ${
            isDisabled || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95"
            }`}
        onClick={handleOccupy}
    >
        {loading ? "Assigning..." : "Occupy Bed"}
    </button>

    </>
  )
}

export default AvailableBedModal
