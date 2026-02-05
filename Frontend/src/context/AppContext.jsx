import { useState, useEffect } from "react";
import { createContext } from "react";
import { isTokenValid } from "../utils/auth.js";
import { jwtDecode } from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) =>{

    const storedToken = localStorage.getItem('token');

    const [token, setToken] = useState(storedToken && isTokenValid(storedToken) ? storedToken : "");
    const [userData, setUserData] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
        userData, setUserData,
        backendUrl,
        isAuthenticated: !!token,
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider