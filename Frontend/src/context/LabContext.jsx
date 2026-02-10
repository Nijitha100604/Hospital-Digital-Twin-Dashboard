import { createContext, useCallback, useContext, useState } from "react";
import { AppContext } from "./AppContext";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const LabContext = createContext();

const LabContextProvider = (props) => {

    const { token, backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState([]);

    // --- 1. FETCH ALL REPORTS ---
    const fetchLabReports = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/reports/all-reports`, { headers: { token } });
            if (data.success) {
                setReports(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Internal Server Error");
        } finally {
            setLoading(false);
        }
    }, [token, backendUrl]);

    // --- 2. FETCH SINGLE REPORT ---
    const fetchReportById = async (reportId) => {
        if (!token) return null;
        setLoading(true);
        try {
            const { data } = await axios.get(`${backendUrl}/api/reports/${reportId}`, { 
                headers: { token } 
            });
            
            if (data.success) {
                return data.data;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch report details");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // --- 3. SUBMIT MANUAL RESULTS ---
    const submitLabResults = async (reportId, payload) => {
        if (!token) return false;
        setLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/reports/submit-results`, 
                { reportId, ...payload }, 
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                fetchLabReports(); // Refresh list
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to submit results");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- 4. UPLOAD REPORT FILE ---
    const uploadLabReport = async (reportId, file, patientData = {}) => {
        if (!token) return false;
        setLoading(true);
        try {
            const formData = new FormData();
            
            if (reportId) formData.append("reportId", reportId);
            
            formData.append("reportFile", file);
            
            // Append metadata for new creations
            formData.append("patientId", patientData.patientId);
            formData.append("patientName", patientData.patientName);
            formData.append("testName", patientData.testType); 
            formData.append("doctorName", patientData.referringDr);
            
            // Safe parsing for Age/Gender string "25 / Male"
            const ageVal = patientData.ageGender ? patientData.ageGender.split('/')[0]?.trim() : "0";
            const genderVal = patientData.ageGender ? patientData.ageGender.split('/')[1]?.trim() : "Unknown";
            
            formData.append("age", ageVal);
            formData.append("gender", genderVal);
            formData.append("department", patientData.dept);
            formData.append("sampleDate", patientData.sampleDate);

            const { data } = await axios.post(
                `${backendUrl}/api/reports/upload`, 
                formData,
                { headers: { token } } 
            );

            if (data.success) {
                toast.success("Report uploaded successfully");
                fetchLabReports(); // Refresh list
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload report");
            return false;
        } finally {
            setLoading(false);
        }
    };


    const value = {
        loading,
        reports,
        fetchLabReports,
        setReports,
        fetchReportById,
        submitLabResults,
        uploadLabReport // <--- THIS WAS MISSING IN YOUR CODE
    }

    return (
        <LabContext.Provider value={value}>
            {props.children}
        </LabContext.Provider>
    )
}

export default LabContextProvider;