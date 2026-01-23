import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

export const MedicineContext = createContext();

const MedicineContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  //Fetch All Medicines
  const fetchMedicines = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/medicine/all-medicines`,
        { headers: { token } }
      );

      if (data.success) {
        setMedicines(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  //Fetch Single Medicine by Custom ID
  const getMedicineById = async (id) => {
    if (!token) return null;
    const cachedMedicine = medicines.find((m) => m.medicineId === id);
    if (cachedMedicine) return cachedMedicine;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/medicine/medicine/${id}`,
        { headers: { token } }
      );
      if (data.success) {
        return data.data;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching medicine details");
      return null;
    }
  };

  //Add Medicine
  const addMedicine = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/medicine/add-medicine`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMedicines(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding medicine");
      return false;
    }
  };

  // Update Medicine
  const updateMedicine = async (id, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/medicine/update/${id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMedicines(); // Refresh list
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating medicine");
      return false;
    }
  };

  // Initial Fetch
  useEffect(() => {
    if (token) {
      fetchMedicines();
    }
  }, [token, fetchMedicines]);

  const value = {
    medicines,
    loading,
    fetchMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,
  };

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicineContextProvider;