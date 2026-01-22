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
    const [loading, setLoading] = useState(false);

    const fetchPatients = async() =>{

        if(!token) return;
        setLoading(true);

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
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(token){
            fetchPatients();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const value = {
        patients,
        loading,
        fetchPatients,
        setPatients
    }

    return (
        <PatientContext.Provider value={value}>
            {props.children}
        </PatientContext.Provider>
    )

}

export default PatientContextProvider