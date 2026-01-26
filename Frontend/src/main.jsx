import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx";
import PatientContextProvider from "./context/PatientContext.jsx";
import MedicineContextProvider from "./context/MedicineContext.jsx";
import StaffContextProvider from "./context/StaffContext.jsx";
import SupplierContextProvider from "./context/SupplierContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <MedicineContextProvider>
        <SupplierContextProvider>
          <StaffContextProvider>
            <PatientContextProvider>
              <App />
            </PatientContextProvider>
          </StaffContextProvider>
        </SupplierContextProvider>
      </MedicineContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
);
