import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

// eslint-disable-next-line react-refresh/only-export-components
export const EquipmentContext = createContext();

const EquipmentContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);
  const [equipments, setEquipments] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]); 
  const [loading, setLoading] = useState(false);

  {/* Equipment Context */}

  // Fetch All Equipment
  const fetchEquipments = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/equipment/all-equipments`,
        { headers: { token } }
      );
      if (data.success) {
        setEquipments(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch equipment list");
    } finally {
      setLoading(false);
    }
  }, [token, backendUrl]);

  // Get Single Equipment by ID
  const getEquipmentById = async (id) => {
    if (!token) return null;
    
    // Check cache first
    const cachedItem = equipments.find((e) => e.equipmentId === id);
    if (cachedItem) return cachedItem;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/equipment/${id}`,
        { headers: { token } }
      );
      if (data.success) return data.data;
      toast.error(data.message);
      return null;
    } catch (error) {
      console.error(error);
      toast.error("Error fetching equipment details");
      return null;
    }
  };

  // Add Equipment
  const addEquipment = async (formData) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/equipment/add-equipment`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchEquipments(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding equipment");
      return false;
    }
  };

  // Update Equipment
  const updateEquipment = async (id, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/equipment/update/${id}`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchEquipments(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating equipment");
      return false;
    }
  };

  // Delete Equipment
  const deleteEquipment = async (id) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/equipment/delete/${id}`,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchEquipments(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting equipment");
      return false;
    }
  };

  { /* Maintenance Context*/ }

  // Fetch Maintenance Logs
  const fetchMaintenanceLogs = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/maintenance/all`, { headers: { token } });
      if (data.success) {
        setMaintenanceLogs(data.data);
      }
    } catch (error) {
      console.error("Maintenance fetch error:", error);
    }
  }, [token, backendUrl]);

  // Add Maintenance Log
  const addMaintenanceLog = async (formData) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/maintenance/add`, formData, { headers: { token } });
      if (data.success) {
        toast.success(data.message);
        await Promise.all([fetchMaintenanceLogs(), fetchEquipments()]);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating maintenance log");
      return false;
    }
  };

  //Update Log
  const updateMaintenanceLog = async (logId, formData) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/maintenance/update/${logId}`, 
        formData, 
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMaintenanceLogs(); 
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating log");
      return false;
    }
  };

  // Delete Log
  const deleteMaintenanceLog = async (logId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/maintenance/delete/${logId}`, 
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMaintenanceLogs();
        return true;
      }
      toast.error(data.message);
      return false;
    } catch (error) {
      console.error(error);
      toast.error("Error deleting log");
      return false;
    }
  };


  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchEquipments(), fetchMaintenanceLogs()])
        .finally(() => setLoading(false));
    }
  }, [token, fetchEquipments, fetchMaintenanceLogs]);

  const value = {
    loading,
    
    equipments,
    fetchEquipments,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment,

    maintenanceLogs,
    fetchMaintenanceLogs,
    addMaintenanceLog,
    updateMaintenanceLog,
    deleteMaintenanceLog,
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export default EquipmentContextProvider;