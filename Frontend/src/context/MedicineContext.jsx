import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

export const MedicineContext = createContext();

const MedicineContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  
  {/* Medicine Context */}
  const fetchMedicines = useCallback(async () => {
    if (!token) return;
    
    setLoading(prev => prev || true); 
    
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


  const updateMedicine = async (id, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/medicine/update/${id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMedicines(); 
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

  {/* Supplier Context */}
  const fetchSuppliers = useCallback(async () => {
    if (!token) return;
    
    setLoading(prev => prev || true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/supplier/all-suppliers`,
        { headers: { token } }
      );

      if (data.success) {
        setSuppliers(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  const getSupplierById = async (id) => {
    if (!token) return null;
    
    const cachedSupplier = suppliers.find((s) => s.supplierId === id);
    if (cachedSupplier) return cachedSupplier;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/supplier/supplier/${id}`,
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
      toast.error("Error fetching supplier details");
      return null;
    }
  };

  const addSupplier = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/supplier/add-supplier`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchSuppliers(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding supplier");
      return false;
    }
  };


  const updateSupplier = async (id, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/supplier/update/${id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchSuppliers(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating supplier");
      return false;
    }
  };

  
  const deleteSupplier = async (id) => {
    try {
        const { data } = await axios.delete(
            `${backendUrl}/api/supplier/delete/${id}`,
            { headers: { token } }
        );

        if(data.success){
            toast.success(data.message);
            await fetchSuppliers();
            return true;
        } else {
            toast.error(data.message);
            return false;
        }
    } catch (error) {
        console.error(error);
        toast.error("Error deleting supplier");
        return false;
    }
  }

  // Fetch both Medicines and Suppliers when token is available
  useEffect(() => {
    if (token) {
      fetchMedicines();
      fetchSuppliers();
    }
  }, [token, fetchMedicines, fetchSuppliers]);

  const value = {
    loading,
    
    // Medicine State & Functions
    medicines,
    fetchMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,

    // Supplier State & Functions
    suppliers,
    fetchSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicineContextProvider;