import { useEffect, useState } from 'react'
import { useContext } from 'react';
import { FaTimes, FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { PatientContext } from '../../context/PatientContext';

const VitalModal = ({ open, type, patients, item, onClose }) =>{

    const {savePatientVitals, updatePatientVitals} = useContext(PatientContext);

    const vital_units = {
        "Heart Rate": "bpm",
        "Blood Pressure": "mmHg",
        "Temperature" : "°F",
        "SpO2": "%",
        "Respiratory Rate": "bpm",
        "Blood Glucose": "mg/dl",
    }

    const checkVitalStatus = (name, value) => {
        switch(name) {
            case "Heart Rate":
                return value >= 60 && value <= 100;
            case "Blood Pressure": {
                const [systolic, diastolic] = value.split("/").map(Number);
                if (!systolic || !diastolic) return false;
                return systolic < 120 && diastolic < 80;
            }
            case "Temperature":
                return value >= 97 && value <= 99;
            case "SpO2":
                return value >= 95;
            case "Respiratory Rate":
                return value >= 12 && value <= 20;
            case "Blood Glucose":
                return value >= 70 && value <= 140;
            default:
                return false;
        }
    }

    const [vitalName, setVitalName] = useState("");
    const [value, setValue] = useState("");
    const [vitals, setVitals] = useState([]);
    const [newVitals, setNewVitals] = useState([]);

    const unit = vital_units[vitalName] || "";

    const handleVital = () =>{
        if (!vitalName || !value) return;
        const isNormal = checkVitalStatus(vitalName, value);
        if (vitals.some(v => v.name === vitalName)) {
            toast.error("Vital already added");
            return;
        }
        setVitals(prev => [
            ...prev,
            {
                name: vitalName,
                value,
                unit,
                status: isNormal ? "Normal" : "Abnormal"
            }
        ]);
        setVitalName("");
        setValue("");
    }

    const handleUpdateVital = () =>{
        if (!vitalName || !value) return;
        const isNormal = checkVitalStatus(vitalName, value);
        if (vitals.some(v => v.name === vitalName) || newVitals.some(v => v.name === vitalName)) {
            toast.error("Vital already exists");
            return;
        }
        setNewVitals(prev => [
            ...prev,
            {
                name: vitalName,
                value,
                unit,
                status: isNormal ? "Normal" : "Abnormal"
            }
        ]);
        setVitalName("");
        setValue("");
    }

    const handleDeleteVital = (index) => {
        setVitals(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteNewVital = (index) => {
        setNewVitals(prev => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setNewVitals([]);
        setVitalName("");
        setValue("");
        onClose();
    };

    const saveVitals = async() =>{
        const vitalsData = {
            patientId: item.patientId,
            appointmentId: item.appointmentId,
            vitals
        }
        const result = await savePatientVitals(vitalsData); 
        if(result){
            setTimeout(() => { handleClose() }, 1000);
        } 
    }

    const updateVitals = async() =>{

        const updatedData = {
            patientId: item.patientId,
            appointmentId: item.appointmentId,
            vitals: [...vitals, ...newVitals]
        }

        const result = await updatePatientVitals(updatedData);
        if(result){
           setTimeout(() => { handleClose() }, 1000); 
        }

    }

   useEffect(()=>{

    const fetchDetails = () =>{
        if(!item || !patients) return

        const patient = patients.find(
            p => p.patientId === item.patientId
        );

        if(!patient || !patient.vitals){
            setVitals([]);
            return;
        }

        const appointmentVitals = patient.vitals.find(
            v => v.appointmentId === item.appointmentId
        );

        setVitals(appointmentVitals?.vitalsData || []);

    }
    fetchDetails();

   }, [item, patients])

    if(!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3">
            <div  className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-fuchsia-900 text-white px-2 py-2 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                    {type === "edit" ? "Enter Vitals" : "Vitals Details"}
                    </h2> 
                    <button onClick={handleClose}>
                    <FaTimes className="text-xl cursor-pointer" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {type === "edit" ? (
                        <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <p className="text-gray-800 font-semibold">{item?.name}</p>
                            <p>|</p>
                            <p className="px-2 py-1 bg-fuchsia-300 rounded-lg text-sm font-medium text-gray-800">{item?.patientId}</p>
                        </div>

                        <p className="text-sm text-gray-900 font-medium">Enter the patient Vital Details</p>

                        <div className="flex items-center gap-3 mt-2">

                        {/* Vital name */}
                        <div>
                            <label className="text-sm text-gray-800 font-medium">Vital Name <span className="text-red-600">*</span></label>
                            <select 
                                value={vitalName}
                                required
                                onChange={(e) => setVitalName(e.target.value)}
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            >
                               <option value="">Select Vital</option>
                                {Object.keys(vital_units).map(v => (
                                <option key={v}>{v}</option>
                                ))} 
                            </select>
                        </div>

                        {/* Value */}
                        <div>
                            <label className="text-sm text-gray-800 font-medium">Value <span className="text-red-600">*</span></label>
                            <input 
                                type={vitalName === "Blood Pressure" ? "text" : "number"}
                                step="any"
                                required
                                onWheel={(e) => e.target.blur()}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Vital value"
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            />
                        </div>

                        {/* Unit */}

                        <div>
                            <label className="text-sm text-gray-800 font-medium">Unit</label>
                            <input 
                                value={unit}
                                disabled
                                placeholder="Unit"
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            />
                        </div>

                        </div>

                        <div className="text-center">
                            <button 
                                onClick={handleVital}
                                className=" px-3 py-2 bg-fuchsia-700 rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-fuchsia-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                            >
                            Add Vital
                            </button>
                        </div>

                        <p className="text-sm text-gray-900 font-bold">Created Vitals</p>

                        {/* Vitals Data */}
                        <div>
                            {
                                vitals.length > 0 ? 
                                <div className="mt-2 space-y-2">
                                    {
                                        vitals.map((v, index)=>(
                                            <div 
                                                key={index}
                                                className="place-items-center grid grid-cols-5 mt-3 text-sm border-b border-gray-400"
                                            >
                                                <p>{v.name}</p>
                                                <p>{v.value}</p>
                                                <p>{v.unit}</p>
                                                <p className={`font-semibold ${v.status === "Normal" ? "text-green-600": "text-red-600"}`}>
                                                    {v.status}
                                                </p>

                                                <button
                                                    onClick={() => handleDeleteVital(index)}
                                                    className="text-red-600 hover:text-red-800 cursor-pointer"
                                                >
                                                <FaTrash />
                                                </button>
                                                
                                            </div>
                                        ))
                                    }
                                    <button onClick={saveVitals}
                                        className="mt-5 bg-green-600 text-white cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                                    >Save Vitals</button>

                                </div> :
                                <div className="text-center text-gray-800 font-bold text-sm">
                                    <p>No Vitals Created</p>
                                </div>
                            }
                        </div>

                        
                    </div>
                        
                    ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 items-center">
                            <p className="text-gray-800 font-semibold">{item?.name}</p>
                            <p>|</p>
                            <p className="px-2 py-1 bg-fuchsia-300 rounded-lg text-sm font-medium text-gray-800">{item?.patientId}</p>
                        </div>

                        <p className="text-md text-gray-700 font-bold">Vitals Recordered</p>

                        {/* content */}
                        <div className="flex flex-col gap-3 px-3">
                            {
                                vitals.map((item, index)=>(
                                    <div 
                                        key={index}
                                        className="grid grid-cols-4 place-items-center border-b border-gray-300"
                                    >
                                        <p className="text-sm text-gray-700 font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-900 font-bold">{item.value}</p>
                                        <p className="text-sm text-gray-700 font-medium">{item.unit}</p>
                                        <p className={`text-sm font-semibold ${item.status === "Normal" ? "text-green-700" : "text-red-700"}`}>{item.status}</p>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Add New Vitals */}
                        <p className="mt-3 text-md text-gray-700 font-bold">Add New Vitals</p>

                        <div className="flex items-center gap-3 mt-2">

                        {/* Vital name */}
                        <div>
                            <label className="text-sm text-gray-800 font-medium">Vital Name <span className="text-red-600">*</span></label>
                            <select 
                                value={vitalName}
                                required
                                onChange={(e) => setVitalName(e.target.value)}
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            >
                               <option value="">Select Vital</option>
                                {Object.keys(vital_units).map(v => (
                                <option key={v}>{v}</option>
                                ))} 
                            </select>
                        </div>

                        {/* Value */}
                        <div>
                            <label className="text-sm text-gray-800 font-medium">Value <span className="text-red-600">*</span></label>
                            <input 
                                type={vitalName === "Blood Pressure" ? "text" : "number"}
                                step="any"
                                required
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Vital value"
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            />
                        </div>

                        {/* Unit */}

                        <div>
                            <label className="text-sm text-gray-800 font-medium">Unit</label>
                            <input 
                                value={unit}
                                disabled
                                placeholder="Unit"
                                className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
                            />
                        </div>

                        </div>

                        <div className="text-center">
                            <button 
                                onClick={handleUpdateVital}
                                className=" px-3 py-2 bg-fuchsia-700 rounded-lg text-white text-sm font-medium cursor-pointer hover:bg-fuchsia-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                            >
                            Add Vital
                            </button>
                        </div>

                        <p className="text-sm text-gray-900 font-bold">Created Vitals</p>

                        {/* Display data */}
                        <div>
                            {
                                newVitals.length > 0 ? 
                                <div className="mt-2 space-y-2">
                                    {
                                        newVitals.map((v, index)=>(
                                            <div 
                                                key={index}
                                                className="place-items-center grid grid-cols-5 mt-3 text-sm border-b border-gray-400"
                                            >
                                                <p>{v.name}</p>
                                                <p>{v.value}</p>
                                                <p>{v.unit}</p>
                                                <p className={`font-semibold ${v.status === "Normal" ? "text-green-600": "text-red-600"}`}>
                                                    {v.status}
                                                </p>

                                                <button
                                                    onClick={() => handleDeleteNewVital(index)}
                                                    className="text-red-600 hover:text-red-800 cursor-pointer"
                                                >
                                                <FaTrash />
                                                </button>
                                                
                                            </div>
                                        ))
                                    }
                                    <button onClick={updateVitals}
                                        className="mt-5 bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                                    >Update Vitals</button>

                                </div> :
                                <div className="text-center text-gray-800 font-bold text-sm">
                                    <p>No New Vitals Created</p>
                                </div>
                            }
                        </div>

                    </div>
                    )
                    }
                </div>

            </div>
        </div>
    )

}

export default VitalModal;
