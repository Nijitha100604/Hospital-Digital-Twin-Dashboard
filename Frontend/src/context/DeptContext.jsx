import { useContext, useState } from "react";
import { createContext } from "react";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const DeptContext = createContext();

const DeptContextProvider = (props) => {

    const { backendUrl, token } = useContext(AppContext);
    const [ departments, setDepartments ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    // add department
    const addDepartment = async(formData) =>{

        if(!token) return;

        try{
            const {data} = await axios.post(
                `${backendUrl}/api/dept/add-dept`, 
                formData, 
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message);
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

    // all departments
    const fetchDepartments = async() =>{

        if(!token) return;
        setLoading(true);
        
        try{
            const {data} = await axios.get(`${backendUrl}/api/dept/all-depts`,
                {headers: {token}}
            );
            if(data.success){
                setDepartments(data.data);
            } else{
                toast.error(data.message);
            }
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
        } finally{
            setLoading(false);
        }
    }

    // department
    const getDepartment = async(id) =>{

        if(!token) return null;

        try{
        
            const {data} = await axios.get(`${backendUrl}/api/dept/${id}`,
                {headers: {token}}
            )

            if(data.success){
                return data.data;
            } else{
                toast.error(data.message);
                return null;
            }

        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return null;
        }
    }

    // update department status
    const updateStatus = async(id)=>{
        if(!token) return;
        try{
            const {data} = await axios.put(`${backendUrl}/api/dept/update/${id}`,
                {},
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message);
                await fetchDepartments();
                return true;
            }else{
                toast.error(data.message);
                return false;
            }
        }catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return null;
        }
    }

    const value = {
        addDepartment,
        fetchDepartments,
        departments,
        loading,
        getDepartment,
        updateStatus
    }

    return(
        <DeptContext.Provider value={value}>
            {props.children}
        </DeptContext.Provider>
    )
}

export default DeptContextProvider;