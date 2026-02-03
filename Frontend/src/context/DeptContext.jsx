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
    const [ issues, setIssues ] = useState([]);
    const [ issueLoading, setIssueLoading ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ beds, setBeds ] = useState([]);
    const [ bedLoading, setBedLoading ] = useState(false);
    const [pendingBedRequests, setPendingBedRequests] = useState([]);

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

    // Create Issue
    const createIssue = async(issueData) =>{
        if(!token) return;

        try{
            const {data} = await axios.post(
                `${backendUrl}/api/issue/create-issue`,
                issueData,
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message);
                return true;
            } else{
                toast.error(data.message);
                return false;
            }
        }catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return false;
        }
    }

    // all issues
    const fetchIssues = async() =>{

        if(!token) return;
        setIssueLoading(true);

        try{
            const {data} = await axios.get(
                `${backendUrl}/api/issue/all-issues`,
                {headers: {token}}
            );
            if(data.success){
                setIssues(data.data);
            }else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error);
            toast.error("Internal Server Error");
        }finally{
            setIssueLoading(false);
        }
    }

    // update issue status
    const updateIssueStatus = async(updateData) =>{

        if(!token) return;

        try{

            const {data} = await axios.put(
                `${backendUrl}/api/issue/update-status`,
                updateData,
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message);
                await fetchIssues();
                return true;
            } else{
                toast.error(data.message);
                return false;
            }

        }catch(error){
            console.log(error);
            return toast.error("Internal Server Error");
        }

    }

    // all beds
    const fetchBeds = async() =>{

        if(!token) return;
        setBedLoading(true);

        try{

            const {data} = await axios.get(
                `${backendUrl}/api/bed/all-beds`, 
                {headers: {token}}
            );
            if(data.success){
                setBeds(data.data);
            }else{
                toast.error(data.message);
            }

        } catch(error){
            console.log(error);
            return toast.error("Internal Server Error");
        } finally{
            setBedLoading(false);
        }

    }

    // fetch pending bed requests
    const fetchPendingBedRequests = async() =>{
        if(!token) return;
        try {
               
            const {data} = await axios.get(
                `${backendUrl}/api/consultation/pending-requests`,
                {headers: {token}}
            );
            if(data.success){
                setPendingBedRequests(data.data);
            } else{
                toast.error(data.message);
            }
                
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        }
    }

    // assign bed 
    const assignBed = async(bedData) =>{

        if(!token) return;
        try{
            console.log(backendUrl);
            const {data} = await axios.post(`${backendUrl}/api/consultation/assign-bed`,
                bedData,
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

    // add Daily Notes
    const addDailyNote = async(payload) =>{

        if(!token) return;
        try{
            const {data} = await axios.post(
                `${backendUrl}/api/consultation/add-daily-note`,
                payload,
                {headers: {token}}
            );
            if(data.success){
                toast.success(data.message);
                return data.dailyNotes;
            }
            toast.error(data.message);
            return null;
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
            return null;
        }
    }

    // discharge
    const dischargePatient = async(payload) =>{
        
        if(!token) return;
        try{

            const {data} = await axios.post(`${backendUrl}/api/consultation/discharge`,
                payload,
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

    const value = {
        addDepartment,
        fetchDepartments,
        departments,
        loading,
        getDepartment,
        updateStatus,
        createIssue,
        fetchIssues,
        issues,
        issueLoading,
        updateIssueStatus,
        fetchBeds,
        beds,
        bedLoading,
        fetchPendingBedRequests,
        pendingBedRequests,
        assignBed,
        addDailyNote,
        dischargePatient
    }

    return(
        <DeptContext.Provider value={value}>
            {props.children}
        </DeptContext.Provider>
    )
}

export default DeptContextProvider;