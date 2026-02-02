import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "./AppContext";

export const EquipmentContext = createContext();

const EquipmentContextProvider = ({ children }) => {
  const { token, backendUrl } = useContext(AppContext);

  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);

  //Fetch All Equipment
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

  //Get Single Equipment by ID
  const getEquipmentById = async (id) => {
    if (!token) return null;
    
    // Check if we already have it in state
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

  //Add New Equipment
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

  //Update Equipment
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

  //Delete Equipment
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


  useEffect(() => {
    if (token) {
      fetchEquipments();
    }
  }, [token, fetchEquipments]);

  const value = {
    loading,
    equipments,
    fetchEquipments,
    getEquipmentById,
    addEquipment,
    updateEquipment,
    deleteEquipment
  };

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  );
};

export default EquipmentContextProvider;