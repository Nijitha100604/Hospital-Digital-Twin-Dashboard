import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import PatientContextProvider from './context/PatientContext.jsx';
import MedicineContextProvider from './context/MedicineContext.jsx';
import StaffContextProvider from './context/StaffContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <MedicineContextProvider>
        <StaffContextProvider>
          <PatientContextProvider>
            <App />
          </PatientContextProvider>
      </StaffContextProvider>
      </MedicineContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
