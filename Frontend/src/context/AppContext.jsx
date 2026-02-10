import { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import { isTokenValid } from "../utils/auth.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) =>{

    const storedToken = localStorage.getItem('token');
    const [token, setToken] = useState(storedToken && isTokenValid(storedToken) ? storedToken : "");
    const [userData, setUserData] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Get staff profile
    const fetchUserProfile = useCallback(async(passedToken) =>{
        const authToken = passedToken || token;
        if(!authToken) return;
        try{
            const {data} = await axios.get(
                `${backendUrl}/api/get-profile`, 
                {headers: {token}}
            );
            if(data.success){
                setUserData(data.data);
            }
        } catch(error){
            console.log(error);
            toast.error("Internal Server Error");
        }

    }, [token, backendUrl])

    useEffect(() => {
        if (!token) return;

        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000 - Date.now();

        const logoutTimer = setTimeout(() => {
            localStorage.removeItem("token");
            setToken("");
            window.location.href = "/login";
        }, expiryTime);

        return () => clearTimeout(logoutTimer);
    }, [token]);

    const value = {
        token, setToken,
        userData,
        backendUrl,
        isAuthenticated: !!token,
        fetchUserProfile
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider