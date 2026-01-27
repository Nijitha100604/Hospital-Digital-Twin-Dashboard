import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const LabContext = createContext();

const LabContextProvider = (props) =>{

    const {token, backendUrl} = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);

    const fetchLabReports = async() =>{

        if(!token) return;
        setLoading(true);

        try{
            
            const {data} = await axios.get(`${backendUrl}/api/reports/all-reports`, {headers: {token}});
            if(data.success){
                setReports(data.data);
            } else{
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally{
            setLoading(false);
        }

    }

    useEffect(()=>{

        if(token){
            fetchLabReports();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const value = {
        loading,
        reports,
        fetchLabReports,
        setReports
    }

    return(
        <LabContext.Provider value={value}>
            {props.children}
        </LabContext.Provider>
    )

}

export default LabContextProvider;