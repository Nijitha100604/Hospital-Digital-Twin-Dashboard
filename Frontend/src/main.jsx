import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import PatientContextProvider from './context/PatientContext.jsx';
import MedicineContextProvider from './context/MedicineContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <MedicineContextProvider>
        <PatientContextProvider>
        <App />
      </PatientContextProvider>
      </MedicineContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
