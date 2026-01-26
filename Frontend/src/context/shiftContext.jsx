import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// eslint-disable-next-line react-refresh/only-export-components
export const ShiftContext = createContext();

const ShiftContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- 1. Fetch All Shifts ---
  const fetchShifts = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/shift/all-shifts`,
        { headers: { token } }
      );

      if (data.success) {
        setShifts(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  // --- 2. Add New Shift ---
  const addShift = async (shiftData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/shift/add-shift`,
        shiftData,
        { headers: { token } } // No need for multipart/form-data as we are sending JSON
      );

      if (data.success) {
        toast.success(data.message);
        await fetchShifts(); // Refresh the list immediately
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding shift");
      return false;
    }
  };

  // --- 3. Update Shift ---
  const updateShift = async (id, shiftData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/shift/update/${id}`,
        shiftData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchShifts(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating shift");
      return false;
    }
  };

  // --- 4. Delete Shift ---
  const deleteShift = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/shift/delete/${id}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchShifts(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting shift");
      return false;
    }
  };

  // --- Initial Fetch on Component Mount/Token Change ---
  useEffect(() => {
    if (token) {
      fetchShifts();
    }
  }, [token, fetchShifts]);

  const value = {
    shifts,
    loading,
    fetchShifts,
    addShift,
    updateShift,
    deleteShift,
  };

  return (
    <ShiftContext.Provider value={value}>
      {children}
    </ShiftContext.Provider>
  );
};

export default ShiftContextProvider;