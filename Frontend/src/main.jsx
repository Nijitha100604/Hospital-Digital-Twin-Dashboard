import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import PatientContextProvider from './context/PatientContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <PatientContextProvider>
        <App />
      </PatientContextProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
