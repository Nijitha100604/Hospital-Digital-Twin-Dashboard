import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// eslint-disable-next-line react-refresh/only-export-components
export const StaffContext = createContext();

const StaffContextProvider = (props) => {
  const { token, backendUrl } = useContext(AppContext);
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch All Staff
  const fetchStaffs = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/all-staff`, {
        headers: { token },
      });
      if (data.success) {
        setStaffs(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching staff list");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Staff (Handles FormData)
  const addStaff = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/staff/add-staff`,
        formData,
        { headers: { token } } // Axios detects FormData and sets Content-Type automatically
      );
      if (data.success) {
        toast.success(data.message);
        fetchStaffs(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error adding staff");
      return false;
    }
  };

  // 3. Get Single Staff
  const getStaffById = async (id) => {
    // Check if we already have it in state to save a network call
    const found = staffs.find(s => s.staffId === id);
    if(found) return found;

    try {
      const { data } = await axios.get(`${backendUrl}/api/staff/staff/${id}`, {
        headers: { token },
      });
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching staff details");
      return null;
    }
  };

  // 4. Update Staff
  const updateStaff = async (id, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/staff/update/${id}`,
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        fetchStaffs();
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating staff");
      return false;
    }
  };

  useEffect(() => {
    if (token) {
      fetchStaffs();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = {
    loading,
    staffs,
    fetchStaffs,
    addStaff,
    getStaffById,
    updateStaff
  };

  return (
    <StaffContext.Provider value={value}>
      {props.children}
    </StaffContext.Provider>
  );
};

export default StaffContextProvider;