import { useState } from "react"
import TopNavbar from "./components/TopNavbar"
import SideNavbar from "./components/sideNavbar"
import Login from './pages/login';
import { ToastContainer} from 'react-toastify';
import { Routes, Route } from 'react-router-dom';
import PatientList from "./pages/patient_management/PatientList";
import PatientProfile from "./pages/patient_management/PatientProfile";
import AddNewPatient from './pages/patient_management/AddNewPatient';
import BookAppointment from "./pages/patient_management/BookAppointment";
import AllAppointments from "./pages/patient_management/AllAppointments";
import DischargeSummary from "./pages/patient_management/DischargeSummary";
import ViewAppointment from "./pages/patient_management/ViewAppointment";
import EquipmentList from './pages/equipment/EquipmentList';
import AddEquipment from './pages/equipment/AddEquipment';
import AddMaintenance from './pages/equipment/AddMaintenance';
import CalibrationScheduleList from './pages/equipment/CalibrationScheduleList';
import MaintenanceLog from './pages/equipment/MaintenanceLog';
import ViewEquipment from './pages/equipment/ViewEquipment';
import AddDepartment from './pages/infrastructure/AddDepartment';
import BedAvailability from './pages/infrastructure/BedAvailability';
import CleaningScheduleList from './pages/infrastructure/CleaningScheduleList';
import CreateSchedule from './pages/infrastructure/CreateSchedule';
import Department from './pages/infrastructure/Department';
import DepartmentsList from './pages/infrastructure/DepartmentsList';
import FacilityMap from './pages/infrastructure/FacilityMap';
import IssueReport from './pages/infrastructure/IssueReport';
import IssuesList from './pages/infrastructure/IssuesList';
import AddNewMedicine from './pages/inventory/AddNewMedicine';
import CreateNewSupplier from './pages/inventory/CreateNewSupplier';
import CreatePurchaseOrder from './pages/inventory/CreatePurchaseOrder';
import MedicineStocks from './pages/inventory/MedicineStocks';
import PurchaseOrder from './pages/inventory/PurchaseOrder';
import StockAlerts from './pages/inventory/StockAlerts';
import SuppliersList from './pages/inventory/SuppliersList';
import ViewMedicineDetails from './pages/inventory/ViewMedicineDetails';
import LabReportsList from './pages/laboratory/LabReportsList';
import LabResultsEntry from './pages/laboratory/LabResultsEntry';
import PatientWiseReports from './pages/laboratory/PatientWiseReports';
import UploadReport from './pages/laboratory/UploadReport';
import AddStaff from './pages/staff_management/AddStaff';
import AssignShift from './pages/staff_management/AssignShift';
import Attendance from './pages/staff_management/Attendance';
import LeaveManagement from './pages/staff_management/LeaveManagement';
import ShiftPlanner from './pages/staff_management/ShiftPlanner';
import StaffList from './pages/staff_management/StaffList';
import StaffPerformance from './pages/staff_management/StaffPerformance';
import StaffProfile from './pages/staff_management/StaffProfile';


function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [uToken, setUToken] = useState(true)

  return uToken ? (
    <div>
      <ToastContainer />
      <TopNavbar setIsSidebarOpen={setIsSidebarOpen}/>
      <div className="flex items-start">
      
      <SideNavbar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className = "flex-1 ml-0 mt-16 p-4">

      <Routes>

        {/* patient management routes */}
        <Route path="/" element={uToken ? <PatientList /> : <Navigate to="/login" />}/>
        <Route path='/patient-profile' element={<PatientProfile />}/>
        <Route path='/add-new-patient' element={<AddNewPatient />}/>
        <Route path='/book-appointment' element={<BookAppointment />}/>
        <Route path='/all-appointments' element={<AllAppointments />}/>
        <Route path='/discharge-summary' element={<DischargeSummary />}/>
        <Route path='/view-appointment' element={<ViewAppointment />}/>

        {/* Equipment */}
        <Route path='/equipment-list' element={<EquipmentList />}/>
        <Route path='/add-equipment' element={<AddEquipment />}/>
        <Route path='/add-maintenance' element={<AddMaintenance />}/>
        <Route path='/calibration-schedule-list' element={<CalibrationScheduleList />}/>
        <Route path='/maintenance-log' element={<MaintenanceLog />}/>
        <Route path='/view-equipment' element={<ViewEquipment />}/>

        {/* Infrastructure */}
        <Route path='/add-department' element={<AddDepartment />}/>
        <Route path='/bed-availability' element={<BedAvailability />}/>
        <Route path='/cleaning-schedule-list' element={<CleaningScheduleList />}/>
        <Route path='/create-schedule' element={<CreateSchedule />}/>
        <Route path='/department' element={<Department />}/>
        <Route path='/departments-list' element={<DepartmentsList />}/>
        <Route path='/facility-map' element={<FacilityMap />}/>
        <Route path='/issue-report' element={<IssueReport />}/>
        <Route path='/issues-list' element={<IssuesList />}/>

        {/* Inventory */}
        <Route path='/add-new-medicine' element={<AddNewMedicine />}/>
        <Route path='/create-new-supplier' element={<CreateNewSupplier />}/>
        <Route path='/create-purchase-order' element={<CreatePurchaseOrder />}/>
        <Route path='/medicine-stocks' element={<MedicineStocks />}/>
        <Route path='/purchase-order' element={<PurchaseOrder />}/>
        <Route path='/stock-alerts' element={<StockAlerts />}/>
        <Route path='/suppliers-list' element={<SuppliersList />}/>
        <Route path='/view-medicine-details' element={<ViewMedicineDetails />}/>

        {/* Laboratory */}
        <Route path='/lab-reports-list' element={<LabReportsList />}/>
        <Route path='/lab-results-entry' element={<LabResultsEntry />}/>
        <Route path='/patient-wise-reports' element={<PatientWiseReports />}/>
        <Route path='/upload-report' element={<UploadReport />}/>

        {/* Staff Management */}
        <Route path='/add-staff' element={<AddStaff />}/>
        <Route path='/assign-shift' element={<AssignShift />}/>
        <Route path='/attendance' element={<Attendance />}/>
        <Route path='/leave-management' element={<LeaveManagement />}/>
        <Route path='/shift-planner' element={<ShiftPlanner />}/>
        <Route path='/staff-list' element={<StaffList />}/>
        <Route path='/staff-performance' element={<StaffPerformance />}/>
        <Route path='/staff-profile' element={<StaffProfile />}/>

      </Routes>
      </div>

      </div>
      
    </div>
  ) : (
    <>
      <Login setUToken={setUToken}/>
      <ToastContainer />
    </>
  )
}

export default App
