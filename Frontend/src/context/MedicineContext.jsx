import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

export const MedicineContext = createContext();

const MedicineContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [prescriptionQueue, setPrescriptionQueue] = useState([]); // New: Prescription Queue
  const [loading, setLoading] = useState(false);

  {/* Medicine Context */}

  const fetchMedicines = useCallback(async () => {
    if (!token) return;
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
      if (data.success) return data.data;
      toast.error(data.message);
      return null;
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
        await fetchMedicines();
        return true;
      }
      toast.error(data.message);
      return false;
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
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error updating medicine");
      return false;
    }
  };

  {/* Supplier Context */}

  const fetchSuppliers = useCallback(async () => {
    if (!token) return;
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
      if (data.success) return data.data;
      toast.error(data.message);
      return null;
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
      }
      toast.error(data.message);
      return false;
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
      }
      toast.error(data.message);
      return false;
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
      if (data.success) {
        toast.success(data.message);
        await fetchSuppliers();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error deleting supplier");
      return false;
    }
  };

  {/* Purchase Order */}

  const fetchPurchaseOrders = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/purchase/all-orders`,
        { headers: { token } }
      );
      if (data.success) {
        setPurchaseOrders(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load purchase orders");
    }
  }, [token, backendUrl]);

  const createPurchaseOrder = async (orderData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/purchase/create`,
        orderData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchPurchaseOrders();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error creating purchase order");
      return false;
    }
  };

  const updatePurchaseOrder = async (orderId, updateData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/purchase/update/${orderId}`,
        updateData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchPurchaseOrders();
        if (updateData.status === "Received") {
          await fetchMedicines(); 
        }
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error updating order");
      return false;
    }
  };

  const deletePurchaseOrder = async (orderId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/purchase/delete/${orderId}`,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchPurchaseOrders();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error deleting order");
      return false;
    }
  };

  {/* Prescription */}

  const fetchPrescriptionQueue = useCallback(async () => {
    if (!token) return;
    try {
      // Updated URL
      const { data } = await axios.get(
        `${backendUrl}/api/prescription/queue`, 
        { headers: { token } }
      );
      if (data.success) {
        setPrescriptionQueue(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load prescription queue");
    }
  }, [token, backendUrl]);

  const checkoutPrescription = async (payload) => {
    try {
      // Updated URL
      const { data } = await axios.post(
        `${backendUrl}/api/prescription/checkout`,
        payload,
        { headers: { token } }
      );

      if (data.success) {
        toast.success("Prescription dispensed successfully!");
        await fetchPrescriptionQueue();
        await fetchMedicines(); // Refresh stock
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed");
      return false;
    }
  };

  {/* Initialization */}

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchMedicines(), 
      fetchSuppliers(), 
      fetchPurchaseOrders(),
      fetchPrescriptionQueue() 
    ]);
    setLoading(false);
  }, [fetchMedicines, fetchSuppliers, fetchPurchaseOrders, fetchPrescriptionQueue]);

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  const value = {
    loading,
    
    // Medicines
    medicines,
    fetchMedicines,
    getMedicineById,
    addMedicine,
    updateMedicine,

    // Suppliers
    suppliers,
    fetchSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier,

    // Purchase Orders
    purchaseOrders,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,

    // Prescriptions 
    prescriptionQueue,
    fetchPrescriptionQueue,
    checkoutPrescription
  };

  return (
    <MedicineContext.Provider value={value}>
      {children}
    </MedicineContext.Provider>
  );
};

export default MedicineContextProvider;