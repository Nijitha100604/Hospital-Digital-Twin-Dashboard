import { useCallback, useContext, useState } from "react";
import { createContext } from "react";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const PatientContext = createContext();

const PatientContextProvider = (props) =>{

    const {token, backendUrl} = useContext(AppContext);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [consultations, setConsultations] = useState([]);

    // loading states
    const [addPatientLoading, setAddPatientLoading] = useState(false);
    const [patientLoading, setPatientLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(false);
    const [conLoading, setConLoading] = useState(false);
    const [bookAppLoading, setBookAppLoading] = useState(false);
    
    // get all patients
    const fetchPatients = useCallback(async() =>{

        if(!token) return;
        setPatientLoading(true);

        try{

            const {data} = await axios.get(`${backendUrl}/api/patient/all-patients`,{ headers: {token} });
            if(data.success){
                setPatients(data.data)
            }
            else{
                toast.error(data.message);
            }

        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            
        } finally{
            setPatientLoading(false);
        }
    }, [token, backendUrl])

    // add new patient
    const addNewPatient = async(formData) =>{
        if(!token) return;

        setAddPatientLoading(true);
        try{

            const {data} = await axios.post(
                `${backendUrl}/api/patient/add-patient`,
                formData,
                {
                    headers: {token, "Content-Type": "multipart/form-data"}
                }
            );
            if(data.success){
                toast.success(data.message, {autoClose:2000})
                await fetchPatients();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }

        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        } finally{
            setAddPatientLoading(false);
        }
    }

    // book appointment
    const bookNewAppointment = async(infoData) => {

        if(!token) return;
        setBookAppLoading(true);

        try {
            
            const {data} = await axios.post(
                `${backendUrl}/api/appointment/book-appointment`,
                infoData,
                {headers: {token}}
            );

            if(data.success){
                toast.success(data.message, {autoClose: 2000})
                await fetchAppointments();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }


        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        } finally{
            setBookAppLoading(false);
        }

    }

    // get all appointments
    const fetchAppointments = useCallback(async() =>{

        if(!token) return;
        setAppLoading(true);

        try {
            
            const {data} = await axios.get(`${backendUrl}/api/appointment/all-appointments`, { headers: {token} });
            if(data.success){
                setAppointments(data.data);
            } else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally{
            setAppLoading(false);
        }

    }, [token, backendUrl])

    // save vitals
    const savePatientVitals = async(vitalsData) =>{
        if(!token) return;
        try{
            const {data} = await axios.post(
                `${backendUrl}/api/patient/add-vitals`,
                vitalsData,
                {headers: {token}}
            );
            if(data.success){
                toast.success("Vitals saved successfully", { autoClose: 2000 });
                await fetchPatients();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // update patient vitals
    const updatePatientVitals = async(updatedData) =>{
        if(!token) return;

        try{
            const {data} = await axios.post(
                `${backendUrl}/api/patient/add-vitals`,
                updatedData,
                {headers: {token}}
            );
            if(data.success){
                toast.success("Vitals Updated" , { autoClose: 2000 });
                await fetchPatients();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // get all consultations
    const fetchConsultations = useCallback(async() =>{

        if(!token) return;
        setConLoading(true);

        try{

            const {data} = await axios.get(`${backendUrl}/api/consultation/all-consultations`, {headers: {token}});
            if(data.success){
                setConsultations(data.data);
            }else{
                toast.error(data.message);
            }

        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
        } finally{
            setConLoading(false);
        }

    }, [token, backendUrl])

    // save remarks and diagnosis
    const saveRemarksAndDiagnosis = async(diagnosisData) =>{
        if(!token) return;
        try {
            
            const {data} = await axios.post(
                `${backendUrl}/api/consultation/add-diagnosis-remarks`,
                diagnosisData,
                { headers: {token} }
            );
            if(data.success){
                toast.success(data.message, {autoClose: 2000});
                await fetchConsultations();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }

        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // save prescriptions
    const savePrescriptions = async(presData) =>{
        if(!token) return;
        try {
           const {data} = await axios.post(
            `${backendUrl}/api/consultation/add-prescriptions`,
            presData,
            {headers : {token}}
           );
           if(data.success){
            toast.success(data.message, {autoClose: 2000});
            await fetchConsultations();
            return true;
           } else{
            toast.error(data.message);
            return false;
           }
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // save lab Reports
    const saveLabReports = async(labData) =>{
        if(!token) return;
        try {
            const {data} = await axios.post(
                `${backendUrl}/api/consultation/add-labReports`,
                labData,
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message, {autoClose: 2000});
                await fetchConsultations();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // update appointment action
    const updateAppointmentAction = async(statusData) =>{
        if(!token) return;

        try{
        const {data} = await axios.put(
            `${backendUrl}/api/appointment/update-status`,
            statusData,
            {headers: {token}}
        )
        if(data.success){
            toast.success(data.message, {autoClose: 2000});
            await fetchConsultations();
            return true;
        } else{
            toast.error(data.message);
            return false;
        }
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // request admission
    const requestAddmission = async(requestData) =>{
        if(!token) return;

        try{

            const {data} = await axios.post(
                `${backendUrl}/api/consultation/request-admission`,
                requestData,
                {headers: {token}}
            );
            if(data.success){
                toast.success("Admission requested successfully");
                await fetchConsultations();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }

        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    const value = {
        patients, patientLoading, fetchPatients,
        appointments, fetchAppointments, appLoading, bookNewAppointment, bookAppLoading,
        conLoading, consultations, fetchConsultations,
        addNewPatient, addPatientLoading,
        savePatientVitals, updatePatientVitals,
        saveRemarksAndDiagnosis, savePrescriptions, saveLabReports, updateAppointmentAction, requestAddmission
    }

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )

}

export default PatientContextProvider