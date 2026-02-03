import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify';
import { DeptContext } from '../../context/DeptContext';
import { formatDate } from '../../utils/formatDate';
import { PatientContext } from '../../context/PatientContext';
import { useEffect } from 'react';

function OccupiedBedModal({bed, onClose}) {

    const [bp, setBp] = useState("");
    const [heartRate, setHeartRate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [finalDiagnosis, setFinalDiagnosis] = useState("");
    const [instructions, setInstructions] = useState("");
    const [instructionList, setInstructionList] = useState([]);
    const [dailyNote, setDailyNote] = useState("");
    const [dailyNotes, setDailyNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);

    const [readyToDischarge, setReadyToDischarge] = useState(false);

    const { addDailyNote, dischargePatient, fetchBeds } = useContext(DeptContext);
    const { fetchConsultationById } = useContext(PatientContext);

    const handleAddDailyNote = async() =>{
        if(!dailyNote.trim()){
            toast.error("Enter daily note");
            return;
        }
        const notes = await addDailyNote({
            consultationId: bed?.occupiedDetails?.consultationId,
            admissionIndex: bed?.occupiedDetails?.admissionIndex,
            note: dailyNote
        });
        if (notes) {
            setDailyNotes(notes);
            setDailyNote("");
        }
    }

    const handleSaveInstructions = () =>{
        setInstructions("");
        toast.success("Instructions Added!");
    }

    const handleDischarge = async() =>{

        if(!bp || !heartRate || !remarks || !finalDiagnosis || !instructionList)
        {
            toast.error("Enter all Fields");
            return;
        }

        const payload = {
            consultationId: bed?.occupiedDetails?.consultationId,
            admissionIndex: bed?.occupiedDetails?.admissionIndex,
            dischargeRemarks: remarks,
            finalVitals: {
                bloodPressure: bp,
                heartRate
            },
            finalDiagnosis,
            patientInstructions: instructionList,
            appointmentId: bed?.occupiedDetails?.appointmentId
        }

        const success = await dischargePatient(payload);
        if(success){
            await fetchBeds();
            onClose();
        }
        
        
    }

    useEffect(()=>{
        const loadNotes = async() =>{
            if(!bed?.occupiedDetails?.consultationId) return;
            setLoadingNotes(true);
            const consultation = await fetchConsultationById(bed.occupiedDetails.consultationId);
            if(consultation){
                const admission = consultation.admission?.[bed?.occupiedDetails?.admissionIndex];
                setDailyNotes(admission?.dailyNotes || []);
            }
            setLoadingNotes(false);
        };
        loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bed])

  return (
    <>

    <p className="text-lg font-semibold text-gray-800">{bed.bedId}</p>

    <div className="flex flex-wrap justify-center items-center mt-3 gap-4 bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
        <p className="text-sm font-semibold">Patient ID : {bed?.occupiedDetails?.patientId}</p>
        <p>|</p>
        <p className="text-sm font-semibold">Patient Name : {bed?.occupiedDetails?.patientName}</p>
        <p>|</p>
        <p className="text-sm font-semibold">Admitted Date : {formatDate(bed?.occupiedDetails?.admittedDate)}</p>
    </div>

    <p className="text-md font-semibold text-gray-700 mt-4">
        Daily Notes
    </p>

    {
        loadingNotes ? (
            <p className="text-sm text-gray-500">Loading notes...</p>
        ) : dailyNotes.length === 0 ? (
            <p className="text-sm text-gray-400">No daily notes yet</p>
        ) : (
            dailyNotes.map((item, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded text-sm">
                    <b>{formatDate(item.date)}</b> — {item.note}
                </div>
            ))
        )
    }

    <div className="flex gap-3 mt-2">
        <input
            value={dailyNote}
            onChange={(e) => setDailyNote(e.target.value)}
            placeholder="Enter doctor daily note"
            className="flex-1 bg-gray-300 border rounded-md px-3 py-2"
        />

        <button
            onClick={handleAddDailyNote}
            className="bg-blue-600 text-white px-4 rounded-lg hover:scale-105 transition"
        >
            Add Daily Note
        </button>
    </div>

    <label className="flex items-center gap-2 mt-4 cursor-pointer">
    <input
        type="checkbox"
        checked={readyToDischarge}
        onChange={() => setReadyToDischarge(!readyToDischarge)}
    />
        Ready for Discharge
    </label>

    {
    readyToDischarge && (
    <>
            
    {/* Final Vitals */}
    <p className="text-md font-semibold text-gray-700 mt-4">Final Vitals</p>
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
          className="bg-blue-600 text-white px-3 py-2 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        >
          Add
        </button>
        <button 
            className="bg-green-600 text-white rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
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
        className="px-3 bg-red-600 text-white py-2 rounded-lg mt-6 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
        onClick={handleDischarge}
    >
        Discharge Patient
    </button>

    </>
    )
    }



    </>
  )
}

export default OccupiedBedModal