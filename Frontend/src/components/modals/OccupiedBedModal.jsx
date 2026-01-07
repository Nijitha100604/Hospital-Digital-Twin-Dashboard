import React, { useState } from 'react'
import { toast } from 'react-toastify';

function OccupiedBedModal({bed, onClose}) {

    const [bp, setBp] = useState("");
    const [heartRate, setHeartRate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [finalDiagnosis, setFinalDiagnosis] = useState("");
    const [instructions, setInstructions] = useState("");
    const [instructionList, setInstructionList] = useState([]);

    const handleSaveInstructions = () =>{
        setInstructionList([]);
        setInstructions("");
        toast.success("Instructions Added!");
    }

    const handleDischarge = () =>{
        if(!bp || !heartRate || !remarks || !finalDiagnosis || !instructions)
        {
            toast.error("Enter all Fields");
            return;
        }
        toast.success(`${bed.bedId} Bed Available`);
        onClose();
    }

  return (
    <>

    <p className="text-lg font-semibold text-gray-800">{bed.bedId}</p>

    <div className="flex flex-wrap justify-center items-center mt-3 gap-4 bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
        <p className="text-sm font-semibold">Patient ID : P000123</p>
        <p>|</p>
        <p className="text-sm font-semibold">Patient Name : John Doe</p>
        <p>|</p>
        <p className="text-sm font-semibold">Admitted Date : 06 Dec 2025</p>
    </div>

    {/* Final Vitals */}
    <p className="text-md font-semibold text-gray-700">Final Vitals</p>
    <div className="w-full grid grid-cols-2 gap-6 mt-2">
        <div>
            <label className="text-sm text-gray-800 font-medium">Blood Pressure<span className="text-red-600">*</span></label>
            <input
            placeholder="Enter Blood Pressure Value"
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            value={bp}
            onChange={e => setBp(e.target.value)}
            />
        </div>

        <div>
            <label className="text-sm text-gray-800 font-medium">Heart Rate<span className="text-red-600">*</span></label>
            <input
            placeholder="Enter Heart Rate Value"
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            value={heartRate}
            onChange={e => setHeartRate(e.target.value)}
            />
        </div>
    </div>

    {/* Doctor Remarks */}
    <p className="text-md font-semibold text-gray-700 mt-3">Remarks & Diagnosis</p>

    <div className="w-full grid grid-cols-2 gap-6 mt-2">
    <div>
        <label className="text-sm text-gray-800 font-medium">Doctor Remarks<span className="text-red-600">*</span></label>
        <textarea
            placeholder="Doctor Remarks"
            required
            rows = {2}
            value = {remarks}
            onChange={(e)=>setRemarks(e.target.value)}
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        />
    </div>

    <div>
        <label className="text-sm text-gray-800 font-medium">Final Diagnosis<span className="text-red-600">*</span></label>
        <textarea
            placeholder="Final Diagnosis"
            required
            rows = {2}
            value = {finalDiagnosis}
            onChange={(e)=>setFinalDiagnosis(e.target.value)}
            className="w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        />
    </div>
    </div>

    {/* Patient Instructions */}
    <p className="text-md font-semibold text-gray-700 mt-3">Patient Instructions</p>
    <div className="flex gap-4 items-center">
        <div>
            <input
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
            placeholder="Patient Instruction"
            className="w-lg bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
            />
        </div>

        <button
          onClick={() => {
            if (instructions) {
              setInstructionList([...instructionList, instructions]);
              setInstructions("");
            }
          }}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer"
        >
          Add
        </button>
        <button 
            className="bg-green-600 text-white rounded-lg px-3 py-2 cursor-pointer"
            onClick={handleSaveInstructions}
        >
            Save Instructions
        </button>
    </div>

    {instructionList.map((item, index) => (
        <p key={index} className="text-sm bg-gray-100 p-2 rounded mb-1">
          • {item}
        </p>
    ))}

    

    <button 
        className="w-full bg-red-600 text-white py-2 rounded-lg mt-6 cursor-pointer"
        onClick={handleDischarge}
    >
        Discharge Patient
    </button>



    </>
  )
}

export default OccupiedBedModal