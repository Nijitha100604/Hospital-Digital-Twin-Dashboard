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

    const value = {
        patients, patientLoading, fetchPatients,
        appointments, fetchAppointments, appLoading,
        conLoading, consultations, fetchConsultations,
        addNewPatient, addPatientLoading
    }

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )

}

export default PatientContextProvider