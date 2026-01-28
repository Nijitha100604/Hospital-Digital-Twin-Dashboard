import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import PatientContextProvider from "./context/PatientContext.jsx";
import MedicineContextProvider from "./context/MedicineContext.jsx";
import StaffContextProvider from "./context/StaffContext.jsx";
import LabContextProvider from "./context/LabContext.jsx";
import ShiftContextProvider from "./context/ShiftContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <StaffContextProvider>
        <ShiftContextProvider>
          <LabContextProvider>
            <MedicineContextProvider>
              <PatientContextProvider>
                <App />
              </PatientContextProvider>
            </MedicineContextProvider>
          </LabContextProvider>
        </ShiftContextProvider>
      </StaffContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
);
