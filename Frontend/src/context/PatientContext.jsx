import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const PatientContext = createContext();

const PatientContextProvider = (props) =>{

    const {token, backendUrl} = useContext(AppContext);
    const [patients, setPatients] = useState([]);
    const [patientLoading, setPatientLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [conLoading, setConLoading] = useState(false);
    const [consultations, setConsultations] = useState([]);
    

    const fetchPatients = async() =>{

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
    }

    const fetchAppointments = async() =>{

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

    }

    const fetchConsultations = async() =>{

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

    }

    
    useEffect(()=>{
        if(token){
            fetchPatients();
            fetchAppointments();
            fetchConsultations();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const value = {
        patients,
        patientLoading,
        fetchPatients,
        setPatients,
        appointments,
        fetchAppointments,
        setAppointments,
        appLoading,
        conLoading,
        consultations,
        setConsultations,
        fetchConsultations
    }

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )

}

export default PatientContextProvider