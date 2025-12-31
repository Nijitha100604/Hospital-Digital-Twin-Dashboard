import React, { useState } from 'react'
import {
  FaCalendarPlus,
  FaEye,
  FaSave,
  FaClipboardList,
  FaTimesCircle,
  FaUser
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { departmentDoctorData } from '../../data/patient';
import { toast } from "react-toastify";

function BookAppointment() {

  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const[name, setName] = useState("");
  const[patientId, setPatientId] = useState("");
  const[age, setAge] = useState('');
  const[gender, setGender] = useState('');
  const[bloodGroup, setBloodGroup] = useState('');
  const[contact, setContact] = useState('');
  const[appointmentType, setAppointmentType] = useState("");
  const[consultationType, setConsultationType] = useState("");
  const[date, setDate] = useState("")
  const[timeSlot, setTimeSlot] = useState("")
  const[remarks, setRemarks] = useState("");

  const doctorList = departmentDoctorData.find(
    (item) => item.department === selectedDept
  )?.doctors || [];

  const formattedData = {
    "Name" : name,
    "PatientId" : patientId,
    "Age": age,
    "Gender": gender,
    "Blood Group": bloodGroup,
    "Contact": contact,
    "Appointment Type": appointmentType,
    "Consultation Type": consultationType,
    "Department": selectedDept,
    "Doctor": selectedDoctor,
    "Date": date,
    "Time Slot": timeSlot,
    "remarks": remarks
  }

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to clear the form?")){
    setName("");
    setAge("");
    setGender("");
    setBloodGroup("");
    setPatientId("");
    setContact("");
    setAppointmentType("");
    setConsultationType("");
    setDate("");
    setRemarks("");
    setTimeSlot("");
    setSelectedDept("");
    setSelectedDoctor(""); }
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    console.log(formattedData);
    toast.success("Patient added successfully");
    navigate("/all-appointments");
  }

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {/* Header and view all appointments */}
    <div className="flex flex-wrap justify-between items-center">

      <div className="flex flex-col gap-1">
        <div className="flex gap-3 items-center">
          <FaCalendarPlus 
            size={20}
            className="text-gray-500" 
          />
          <p className="text-gray-800 font-bold text-lg">Book Appointment</p>
        </div>
        <p className="text-gray-500 text-sm">Schedule a new appointment for patient</p>
      </div>

      <button 
        className="flex items-center gap-2 text-white text-sm font-semibold  bg-fuchsia-900 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600"
        onClick={()=>navigate('/all-appointments')}
      >
        <FaEye size={18} /> View All appointments
      </button>
    </div>

    <form 
      className="mt-5 bg-white px-3 py-4 rounded-lg border border-gray-400"
      onSubmit = {handleSubmit}
    >

      <div className="mb-5 flex gap-2 items-center">
        <FaUser 
          size={18}
          className="text-gray-800"
        />
        <p className="text-md text-gray-800 font-medium">Patient Information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">

        {/* Patient ID */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Patient ID <span className="text-red-600">*</span></label>
          <input 
            type="text"
            value={patientId}
            onChange={(e)=>setPatientId(e.target.value)}
            required
            placeholder='Enter Patient ID'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Patient Name */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Patient Name <span className="text-red-600">*</span></label>
          <input 
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            placeholder='Enter Patient Name'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Gender <span className="text-red-600">*</span></label>
          <select
            required
            value={gender}
            onChange={(e)=>setGender(e.target.value)}
            className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          >
            <option value = "">Select Gender</option>
            <option value = "Male">Male</option>
            <option value = "Female">Female</option>
            <option value = "Others">Others</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Age <span className="text-red-600">*</span></label>
          <input 
            type="number"
            value={age}
            onChange={(e)=>setAge(e.target.value)}
            required
            placeholder='Enter the Age'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Blood Type */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Blood Group <span className="text-red-600">*</span></label>
          <select
            required
            value={bloodGroup}
            onChange={(e)=>setBloodGroup(e.target.value)}
            className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          >
            <option value = "">Select Blood Group</option>
            <option value = "A+ve">A+ve</option>
            <option value = "B+ve">B+ve</option>
            <option value = "A-ve">A-ve</option>
            <option value = "B-ve">B-ve</option>
            <option value = "AB+ve">AB+ve</option>
            <option value = "AB-ve">AB-ve</option>
            <option value = "O+ve">O+ve</option>
            <option value = "O-ve">O-ve</option>
          </select>
        </div>

        {/* Contact Number */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Contact Number <span className="text-red-600">*</span></label>
          <input 
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            value={contact}
            onChange={(e)=>setContact(e.target.value)}
            required
            placeholder='Enter the Contact Number'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

      </div>

      <div className="mb-5 flex gap-2 items-center">
        <FaClipboardList 
          size={18}
          className="text-gray-800"
        />
        <p className="text-md text-gray-800 font-medium">Appointment Details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">

      {/* Appointment Type */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Appointment Type <span className="text-red-600">*</span></label>
        <select
          required
          value={appointmentType}
          onChange={(e)=>setAppointmentType(e.target.value)}
          className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
        >
          <option value = "">Select Appointment Type</option>
          <option value = "General Consultation">General Consultation</option>
          <option value = "Follow-Up">Follow-Up</option>
          <option value = "Emergency">Emergency</option>
          <option value = "Specialist Consultation">Specialist Consultation</option>
        </select>
      </div>

      {/* Department */}
      <div>
        <label className="text-sm text-gray-800 font-medium"> Department <span className="text-red-600">*</span></label>
        <select
          required
          value={selectedDept}
          onChange={(e)=>{
            setSelectedDept(e.target.value);
            setSelectedDoctor("");
          }}
          className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
        >
        <option value="">Select Department</option>
        {departmentDoctorData.map((item) => (
          <option key={item.department} value={item.department}>
            {item.department}
          </option>
        ))} 
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Doctor <span className="text-red-600">*</span></label>
        <select
          required
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          disabled={!selectedDept}
        >
          <option value = "">Select Doctor</option>
          {doctorList.map((doctor) => (
            <option key={doctor} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>
      </div>

      {/* Consultation Type */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Consultation Type <span className="text-red-600">*</span></label>
        <select
          required
          value={consultationType}
          onChange={(e)=>setConsultationType(e.target.value)}
          className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
        >
          <option value = "">Select Consultation Type</option>
          <option value = "In-Person">In-Person</option>
          <option value = "Online">Online</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Date <span className="text-red-600">*</span></label>
        <input 
          type="date"
          value={date}
          onChange={(e)=>setDate(e.target.value)}
          required
          placeholder='Select Date '
          className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Time Slot <span className="text-red-600">*</span></label>
        <select
          required
          value={timeSlot}
          onChange={(e)=>setTimeSlot(e.target.value)}
          className = {`w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
        >
          <option value = "">Select Time Slot</option>
          <option value = "9-11">9:00 - 11:00 AM</option>
          <option value = "11-1">11:00 - 1:00 PM</option>
          <option value = "2-5">2:00 - 5:00 PM</option>
          <option value = "5-8">5:00 - 8:00 PM</option>
        </select>
      </div>


      </div>

      <div className="w-full mt-5">
        <div>
          <label className="text-sm text-gray-800 font-medium">Additional Remarks </label>
          <textarea 
            rows={3}
            value={remarks}
            onChange={(e)=>setRemarks(e.target.value)}
            placeholder='Enter Appointment Reason'
            className = "w-full bg-gray-300 mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>
      </div>

      <div className="mt-10 flex gap-4 items-center justify-end">
      
        <button 
          type="button"
          className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700"
          onClick={handleCancel}
        >
          <FaTimesCircle /> Cancel
        </button>
      
        <button 
          type = "submit"
          className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800"
        >
          <FaSave /> Book Appointment
        </button>
      
      </div>

    </form>

    </div>

    </>
  )
}

export default BookAppointment