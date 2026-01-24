import { useContext } from "react";
import { createContext } from "react";
import { AppContext } from "./AppContext";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const StaffContext = createContext();

const StaffContextProvider = (props) =>{

    const {token, backendUrl} = useContext(AppContext);
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchStaffs = async() =>{

        if(!token) return;
        setLoading(true);

        try{
            const {data} = await axios.get(`${backendUrl}/api/staff/all-staff`, {headers: {token}})
            if(data.success){
                setStaffs(data.data);
            }else{
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
            fetchStaffs();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    const value = {
        loading,
        staffs,
        fetchStaffs,
        setStaffs
    }

    return(
        <StaffContext.Provider value={value}>
            {props.children}
        </StaffContext.Provider>
    )

}

export default StaffContextProvider