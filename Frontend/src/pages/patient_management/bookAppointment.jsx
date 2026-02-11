import { useState } from 'react'
import {
  FaCalendarPlus,
  FaEye,
  FaSave,
  FaClipboardList,
  FaTimesCircle,
  FaUser
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useContext } from 'react';
import { StaffContext } from '../../context/StaffContext';
import { AppContext } from '../../context/AppContext';
import { useEffect } from 'react';
import { PatientContext } from '../../context/PatientContext';
import AccessDenied from '../../components/AccessDenied';

function BookAppointment() {

  const navigate = useNavigate();

  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDoc, setSelectedDoc] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");

  const {staffs, fetchStaffs} = useContext(StaffContext);
  const {patients, fetchPatients, bookNewAppointment, bookAppLoading} = useContext(PatientContext);
  const {token, userData} = useContext(AppContext);

  const role = userData?.designation;

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

  const doctorList = staffs?.filter(
    (staff) => staff.designation === "Doctor" && staff.department === selectedDept && staff.available
  );

  const depts = [
    "General Medicine",
    "Gynecology",
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Dermatology"
  ];

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
    setSelectedDoc(""); 
    setDoctorId("");
    setDoctorName("");
    toast.info("All fields cleared !");
  }
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();

    const infoData = {
        patientId,
        docId: doctorId,
        appointmentType,
        department: selectedDept,
        doctorName,
        consultationType,
        date,
        timeSlot,
        remarks,
        name,
        age,
        gender,
        bloodGroup,
        contact
      }
      const result = await bookNewAppointment(infoData);
      if(result){
        setTimeout(()=>{
            navigate("/all-appointments");
        },1000);
      }

  }

  const fetchPatientDetails = (id) =>{

    if(!id){
      setName("");
      setAge("");
      setGender("");
      setBloodGroup("");
      setContact("");
      return;
    };

    const patient = patients.find(
      (p) => p.patientId === id
    );

    if(patient){
      setName(patient?.personal?.name);
      setAge(patient?.personal?.age);
      setGender(patient?.personal?.gender);
      setBloodGroup(patient?.personal?.bloodGroup);
      setContact(patient?.personal?.contact);
    } else{
      setName("");
      setAge("");
      setGender("");
      setBloodGroup("");
      setContact("");
      toast.error("Patient not found");
    }
  }

  useEffect(()=>{

    if(token){
      fetchStaffs();
      fetchPatients();    
    }

  }, [fetchPatients, fetchStaffs, token])

  if(role === "Support" || role === "Pharmacist" || role === "Technician" || role === "Nurse" || role === "Doctor"){
    return <AccessDenied />
  }

  return (
    <>

    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">

    {bookAppLoading && (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="w-14 h-14 border-4 border-gray-200 border-t-fuchsia-700 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">Booking Appointment...</p>
              <p className="text-xs text-gray-500 mt-1">Uploading appointment details</p>
            </div>
          </div>
        </div>
    )}

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
        className="flex items-center gap-2 text-white text-sm font-semibold  bg-fuchsia-800 px-3 py-3 cursor-pointer rounded-xl leading-none shadow-sm shadow-fuchsia-600
        transition-all duration-300 ease-in-out hover:bg-fuchsia-900 hover:scale-105 active:scale-95"
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
            onChange={(e) => {
              const id = e.target.value;
              setPatientId(id);
              fetchPatientDetails(id);
            }}
            required
            placeholder='Enter Patient ID'
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Patient Name */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Patient Name </label>
          <input 
            type="text"
            value={name}
            disabled
            className = "w-full bg-gray-200 mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Gender</label>
          <input
            required
            value={gender}
            disabled
            className = {`w-full bg-gray-200 mt-1 border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          />
        </div>

        {/* Age */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Age</label>
          <input 
            type="number"
            value={age}
            disabled
            className = "w-full bg-gray-200 mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>

        {/* Blood Type */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Blood Group</label>
          <input
            required
            value={bloodGroup}
            disabled
            className = {`w-full bg-gray-200 mt-1 border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700`}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="text-sm text-gray-800 font-medium">Contact Number </label>
          <input 
            type="tel"
            pattern="[0-9]{10}"
            maxLength={10}
            value={contact}
            disabled
            className = "w-full bg-gray-200 mt-1 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
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
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${appointmentType === "" ? "text-gray-500" : "text-gray-900"}`}
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
            setSelectedDoc("");
            setDoctorId("");
            setDoctorName("");
          }}
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${selectedDept === "" ? "text-gray-500" : "text-gray-900"}`}
        >
        <option value="">Select Department</option>
        {depts.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))} 
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Doctor <span className="text-red-600">*</span></label>
        <select
          required
          value={selectedDoc}
          onChange={(e) => {
            const id = e.target.value;
            const name = e.target.selectedOptions[0].dataset.name;
            setSelectedDoc(id);   
            setDoctorId(id);      
            setDoctorName(name);  
          }}
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${selectedDoc=== "" ? "text-gray-500" : "text-gray-900"}`}
          disabled={!selectedDept}
        >
          <option value = "">Select Doctor</option>
          {doctorList.map((doctor) => (
            <option key={doctor.staffId} value={doctor.staffId} data-name={doctor.fullName}>
              {doctor.staffId} - {doctor.fullName}
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
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${consultationType === "" ? "text-gray-500" : "text-gray-900"}`}
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
          min={new Date().toISOString().split("T")[0]}
          required
          placeholder='Select Date '
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${date === "" ? "text-gray-500" : "text-gray-900"}`}
        />
      </div>

      {/* Time Slot */}
      <div>
        <label className="text-sm text-gray-800 font-medium">Time Slot <span className="text-red-600">*</span></label>
        <select
          required
          value={timeSlot}
          onChange={(e)=>setTimeSlot(e.target.value)}
          className = {`w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-fuchsia-700 ${timeSlot === "" ? "text-gray-500" : "text-gray-900"}`}
        >
          <option value = "">Select Time Slot</option>
          <option value = "9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
          <option value = "11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
          <option value = "2:00 PM - 5:00 PM">2:00 PM - 5:00 PM</option>
          <option value = "5:00 PM - 8:00 PM">5:00 PM - 8:00 PM</option>
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
            className = "w-full bg-gray-50 mt-1 border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-fuchsia-700"
          />
        </div>
      </div>

      <div className="mt-10 flex gap-4 items-center justify-end">
      
        <button 
          type="button"
          className="px-3 py-2 bg-gray-500 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-gray-700
          transition-all duration-300 ease-in-out
          hover:scale-105
          active:scale-95"
          onClick={handleCancel}
        >
          <FaTimesCircle /> Cancel
        </button>
      
        {
          (role === "Admin" || role === "Receptionist") && (
            <button 
              type = "submit"
              disabled={bookAppLoading}
              className="px-3 py-2 bg-green-600 flex gap-2 items-center rounded-lg text-white font-medium cursor-pointer hover:bg-green-800
              transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
            >
              <FaSave /> Book Appointment
            </button>
          )
        }
        
      
      </div>

    </form>

    </div>

    </>
  )
}

export default BookAppointment