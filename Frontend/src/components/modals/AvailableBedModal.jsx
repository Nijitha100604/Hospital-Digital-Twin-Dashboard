import React, { useState } from 'react'
import { toast } from 'react-toastify';

function AvailableBedModal({ bed, onClose }) {

    const [patientId, setPatientId] = useState("");
    const [patientName, setPatientName] = useState("");

    const handleOccupy = () =>{
        if (!patientId || !patientName) {
            toast.error("Please enter Patient ID and Name");
            return;
        }

        toast.success(`${bed.bedId} Bed Occupied`);
        onClose();
    }

  return (
    <>

    <p className="text-lg font-semibold text-gray-800 mb-4">{bed.bedId}</p>
    
    <div className="bg-green-50 text-green-800 font-semibold border border-green-300 rounded-lg p-3 mb-4">
        Available for Assignment
    </div>

    <div className="w-full grid grid-cols-2 gap-6 mt-2">
        <div>
            <label className="text-sm text-gray-800 font-medium">Patient ID <span className="text-red-600">*</span></label>
            <input
            placeholder="Enter Patient ID"
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            />
        </div>

        <div>
            <label className="text-sm text-gray-800 font-medium">Patient Name <span className="text-red-600">*</span></label>
            <input
            placeholder="Enter Patient Name"
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            />
        </div>
    </div>

    <button 
        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mt-8 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        onClick={handleOccupy}
    >
        Occupy Bed
    </button>

    </>
  )
}

export default AvailableBedModal