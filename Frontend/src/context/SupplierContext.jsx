import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// eslint-disable-next-line react-refresh/only-export-components
export const SupplierContext = createContext();

const SupplierContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  //Fetch All Suppliers
  const fetchSuppliers = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
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

  //Fetch Single Supplier by Custom ID
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

  // Add Supplier
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

  //Update Supplier
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

  //Delete Supplier
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

  // Initial Fetch on Load
  useEffect(() => {
    if (token) {
      fetchSuppliers();
    }
  }, [token, fetchSuppliers]);

  const value = {
    suppliers,
    loading,
    fetchSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};

export default SupplierContextProvider;