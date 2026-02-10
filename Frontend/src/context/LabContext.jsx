import { createContext, useContext, useState } from "react";
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
    const fetchLabReports = async () => {
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
    };

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
            
            // Required: Report ID
            formData.append("reportId", reportId);
            formData.append("reportFile", file);
            
            // Optional: Correction Reason (for amendments)
            if (patientData.correctionReason) {
                formData.append("correctionReason", patientData.correctionReason);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/reports/upload`, 
                formData,
                { 
                    headers: { token },
                    timeout: 120000 // FIX: Set timeout to 2 minutes (120,000 ms) for slow uploads
                } 
            );

            if (data.success) {
                toast.success(data.message);
                fetchLabReports(); 
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Upload Error:", error);
            // specific error message handling
            const msg = error.response?.data?.message || error.message || "Failed to upload";
            toast.error(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- 5. DELETE REPORT (Soft Delete) ---
    const deleteLabReport = async (reportId, reason) => {
        if (!token) return false;
        setLoading(true);
        try {
            // Note: Use axios.post or axios.put because DELETE requests usually don't carry a body in some server configs. 
            // However, axios.delete supports 'data'. Let's stick to standard DELETE with data config.
            const { data } = await axios.delete(`${backendUrl}/api/reports/delete/${reportId}`, { 
                headers: { token },
                data: { reason } // Pass reason in body
            });

            if (data.success) {
                toast.success(data.message);
                fetchLabReports(); 
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete report");
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
        uploadLabReport,
        deleteLabReport
    }

    return (
        <LabContext.Provider value={value}>
            {props.children}
        </LabContext.Provider>
    )
}

export default LabContextProvider;