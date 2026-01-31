import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import PatientContextProvider from "./context/PatientContext.jsx";
import MedicineContextProvider from "./context/MedicineContext.jsx";
import StaffContextProvider from "./context/StaffContext.jsx";
import LabContextProvider from "./context/LabContext.jsx";
<<<<<<< HEAD
import ShiftContextProvider from "./context/ShiftContext.jsx";
import DeptContextProvider from "./context/DeptContext.jsx";
=======
>>>>>>> eac17c00959e08e1d83f6cced999f730fb387193

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <StaffContextProvider>
<<<<<<< HEAD
        <DeptContextProvider>
          <ShiftContextProvider>
            <LabContextProvider>
              <MedicineContextProvider>
                <PatientContextProvider>
                  <App />
                </PatientContextProvider>
              </MedicineContextProvider>
            </LabContextProvider>
          </ShiftContextProvider>
        </DeptContextProvider>
=======
          <LabContextProvider>
            <MedicineContextProvider>
              <PatientContextProvider>
                <App />
              </PatientContextProvider>
            </MedicineContextProvider>
          </LabContextProvider>
>>>>>>> eac17c00959e08e1d83f6cced999f730fb387193
      </StaffContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
);
