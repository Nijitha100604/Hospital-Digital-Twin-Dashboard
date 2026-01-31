import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// eslint-disable-next-line react-refresh/only-export-components
export const StaffContext = createContext();

const StaffContextProvider = (props) => {
  const { token, backendUrl } = useContext(AppContext);

  // --- STATE ---
  const [staffs, setStaffs] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]); // <--- NEW
  const [loading, setLoading] = useState(false);

  // --- 1. STAFF ---
  const fetchStaffs = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/all-staff`, { headers: { token } });
      if (data.success) setStaffs(data.data);
      else toast.error(data.message);
    } catch (error) { console.log(error); toast.error("Error fetching staff"); }
  }, [token, backendUrl]);

  const addStaff = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/staff/add-staff`, formData, { headers: { token } });
      if (data.success) { toast.success(data.message); fetchStaffs(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error adding staff"); return false; }
  };

  const getStaffById = async (id) => {
    const found = staffs.find((s) => s.staffId === id);
    if (found) return found;
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/staff/${id}`, { headers: { token } });
      return data.success ? data.data : null;
    } catch (error) { console.log(error); return null; }
  };

  const updateStaff = async (id, formData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/staff/update/${id}`, formData, { headers: { token } });
      if (data.success) { toast.success(data.message); fetchStaffs(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error updating staff"); return false; }
  };

  // --- 2. SHIFTS ---
  const fetchShifts = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/shift/all-shifts`, { headers: { token } });
      if (data.success) setShifts(data.data);
    } catch (error) { console.log(error); toast.error("Error fetching shifts"); }
  }, [token, backendUrl]);

  const addShift = async (shiftData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/shift/add-shift`, shiftData, { headers: { token } });
      if (data.success) { toast.success(data.message); await fetchShifts(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error adding shift"); return false; }
  };

  const updateShift = async (id, shiftData) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/shift/update/${id}`, shiftData, { headers: { token } });
      if (data.success) { toast.success(data.message); await fetchShifts(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error updating shift"); return false; }
  };

  const deleteShift = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/shift/delete/${id}`, { headers: { token } });
      if (data.success) { toast.success(data.message); await fetchShifts(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error deleting shift"); return false; }
  };

  // --- 3. LEAVES ---
  const fetchLeaves = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/leave/all-leaves`, { headers: { token } });
      if (data.success) setLeaves(data.data);
    } catch (error) { console.log(error); toast.error("Error fetching leaves"); }
  }, [token, backendUrl]);

  const applyForLeave = async (leaveData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/leave/apply`, leaveData, { headers: { token } });
      if (data.success) { toast.success(data.message); await fetchLeaves(); return true; }
      else { toast.error(data.message); return false; }
    } catch (error) { console.log(error); toast.error("Error applying leave"); return false; }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/leave/update-status/${id}`, { status }, { headers: { token } });
      if (data.success) { toast.success(data.message); await fetchLeaves(); return true; }
    } catch (error) { console.log(error); toast.error("Error updating status"); }
  };

  // --- 4. ATTENDANCE (NEW) ---
  const fetchAttendance = useCallback(async (date) => {
    if (!token) return;
    try {
      // date format: YYYY-MM-DD
      const { data } = await axios.get(`${backendUrl}/api/attendance/daily?date=${date}`, { headers: { token } });
      if (data.success) setAttendance(data.data);
    } catch (error) { console.log(error); console.error("Error fetching attendance"); }
  }, [token, backendUrl]);

  const markAttendance = async (payload) => {
    try {
        const { data } = await axios.post(`${backendUrl}/api/attendance/mark`, payload, { headers: { token }});
        if(data.success) {
            toast.success("Attendance Updated");
            fetchAttendance(payload.date); // Refresh list
        } else {
            toast.error(data.message);
        }
    } catch (error) { console.log(error); toast.error("Failed to mark attendance"); }
  };

  // --- INIT ---
  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchStaffs(), fetchShifts(), fetchLeaves()]).finally(() => setLoading(false));
    }
  }, [token, fetchStaffs, fetchShifts, fetchLeaves]);

  const value = {
    loading,
    staffs, fetchStaffs, addStaff, updateStaff, getStaffById,
    shifts, fetchShifts, addShift, updateShift, deleteShift,
    leaves, fetchLeaves, applyForLeave, updateLeaveStatus,
    attendance, fetchAttendance, markAttendance // Export new methods
  };

  return (
    <StaffContext.Provider value={value}>
      {props.children}
    </StaffContext.Provider>
  );
};

export default StaffContextProvider;