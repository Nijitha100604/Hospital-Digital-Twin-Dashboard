import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import TopNavbar from "./components/TopNavbar";
import SideNavbar from "./components/SideNavbar";
import Login from "./pages/login";
import HomePage from "./components/HomePage";

// Patient Management
import PatientList from "./pages/patient_management/PatientList";
import PatientProfile from "./pages/patient_management/PatientProfile";
import AddNewPatient from "./pages/patient_management/AddNewPatient";
import BookAppointment from "./pages/patient_management/BookAppointment";
import AllAppointments from "./pages/patient_management/AllAppointments";
import DischargeSummary from "./pages/patient_management/DischargeSummary";
import ViewAppointment from "./pages/patient_management/ViewAppointment";
<<<<<<< HEAD
=======
import EquipmentList from './pages/equipment/EquipmentList';
import AddEquipment from './pages/equipment/AddEquipment';
import AddMaintenance from './pages/equipment/AddMaintenance';
import CreateCalibrationSchedule from "./pages/equipment/createCalibrationSchedule";
import CalibrationScheduleList from './pages/equipment/CalibrationScheduleList';
import MaintenanceLog from './pages/equipment/MaintenanceLog';
import ViewEquipment from './pages/equipment/ViewEquipment';
import EditEquipment from './pages/equipment/editEquipment'
import AddDepartment from './pages/infrastructure/AddDepartment';
import BedAvailability from './pages/infrastructure/BedAvailability';
import Department from './pages/infrastructure/Department';
import DepartmentsList from './pages/infrastructure/DepartmentsList';
import FacilityMap from './pages/infrastructure/FacilityMap';
import IssueReport from './pages/infrastructure/IssueReport';
import IssuesList from './pages/infrastructure/IssuesList';
import AddNewMedicine from './pages/inventory/AddNewMedicine';
import CreateNewSupplier from './pages/inventory/CreateNewSupplier';
import CreatePurchaseOrder from './pages/inventory/CreatePurchaseOrder';
import MedicineStocks from './pages/inventory/medicineStocks';
import EditMedicineDetails from './pages/inventory/editMedicineDetails'
import PurchaseOrder from './pages/inventory/PurchaseOrder';
import StockAlerts from './pages/inventory/StockAlerts';
import SuppliersList from './pages/inventory/SuppliersList';
import EditSupplierDetails from "./pages/inventory/editSupplierDetails";
import ViewMedicineDetails from './pages/inventory/viewMedicineDetails';
import LabReportsList from './pages/laboratory/labReportsList';
import LabResultsEntry from './pages/laboratory/LabResultsEntry';
import PatientWiseReports from './pages/laboratory/patientWiseReports';
import UploadReport from './pages/laboratory/uploadReport';
import AddStaff from './pages/staff_management/AddStaff';
import AssignShift from './pages/staff_management/AssignShift';
import Attendance from './pages/staff_management/attendance';
import LeaveManagement from './pages/staff_management/leaveManagement';
import ShiftPlanner from './pages/staff_management/ShiftPlanner';
import StaffList from './pages/staff_management/staffList';
import StaffPerformance from './pages/staff_management/StaffPerformance';
import StaffProfile from './pages/staff_management/staffProfile';
>>>>>>> 08cd23a6a27f6a84a60ec4bad6287bb41fbfd3dc
import VitalsEntry from "./pages/patient_management/VitalsEntry";
import Consultations from "./pages/patient_management/Consultations";
import PatientConsultation from "./pages/patient_management/PatientConsultation";
import AdminDashboard from "./pages/AdminDashboard";

// Equipment
import EquipmentList from "./pages/equipment/EquipmentList";
import AddEquipment from "./pages/equipment/AddEquipment";
import AddMaintenance from "./pages/equipment/AddMaintenance";
import CreateCalibrationSchedule from "./pages/equipment/createCalibrationSchedule";
import CalibrationScheduleList from "./pages/equipment/CalibrationScheduleList";
import MaintenanceLog from "./pages/equipment/MaintenanceLog";
import ViewEquipment from "./pages/equipment/ViewEquipment";
import EditEquipment from "./pages/equipment/editEquipment";

// Infrastructure
import AddDepartment from "./pages/infrastructure/AddDepartment";
import BedAvailability from "./pages/infrastructure/BedAvailability";
import Department from "./pages/infrastructure/Department";
import DepartmentsList from "./pages/infrastructure/DepartmentsList";
import FacilityMap from "./pages/infrastructure/FacilityMap";
import IssueReport from "./pages/infrastructure/IssueReport";
import IssuesList from "./pages/infrastructure/IssuesList";

// Inventory
import AddNewMedicine from "./pages/inventory/AddNewMedicine";
import CreateNewSupplier from "./pages/inventory/CreateNewSupplier";
import CreatePurchaseOrder from "./pages/inventory/CreatePurchaseOrder";
import MedicineStocks from "./pages/inventory/medicineStocks";
import EditMedicineDetails from "./pages/inventory/editMedicineDetails";
import PurchaseOrder from "./pages/inventory/PurchaseOrder";
import StockAlerts from "./pages/inventory/StockAlerts";
import SuppliersList from "./pages/inventory/suppliersList";
import EditSupplierDetails from "./pages/inventory/editSupplierDetails";
import ViewMedicineDetails from "./pages/inventory/viewMedicineDetails";

// Laboratory
import LabReportsList from "./pages/laboratory/labReportsList";
import LabResultsEntry from "./pages/laboratory/LabResultsEntry";
import PatientWiseReports from "./pages/laboratory/PatientWiseReports";
import UploadReport from "./pages/laboratory/UploadReport";

// Staff Management
import AddStaff from "./pages/staff_management/AddStaff";
import AssignShift from "./pages/staff_management/AssignShift";
import Attendance from "./pages/staff_management/attendance";
import LeaveManagement from "./pages/staff_management/leaveManagement";
import ShiftPlanner from "./pages/staff_management/ShiftPlanner";
import StaffList from "./pages/staff_management/staffList";
import StaffPerformance from "./pages/staff_management/StaffPerformance";
import StaffProfile from "./pages/staff_management/staffProfile";
import StaffProfileById from "./pages/staff_management/staffProfile";

// --- Layout Wrapper ---
const Layout = ({ isSidebarOpen, setIsSidebarOpen, activeCategory }) => {
  return (
    <>
      <TopNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <SideNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeCategory={activeCategory}
      />

<<<<<<< HEAD
      {/* Main content area (fixed top navbar + sidebar offset) */}
      <div className="md:ml-52 mt-16 p-4 min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uToken, setUToken] = useState(false);
  const [activeCategory, setActiveCategory] = useState("MAIN");

  return (
    <div className="bg-slate-50 min-h-screen">
      <ToastContainer />
=======
      
      <div className = "flex-1 ml-0 mt-16 p-4">
>>>>>>> 08cd23a6a27f6a84a60ec4bad6287bb41fbfd3dc

      <Routes>
        <Route
          path="/"
          element={
            uToken ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

<<<<<<< HEAD
        {/* Login Route */}
        <Route path="/login" element={<Login setUToken={setUToken} />} />
=======
        {/* Admin Dashboard */}
        <Route path='/admin-dashboard' element={<AdminDashboard />}/>

        {/* patient management routes */}
        <Route path="/" element={uToken ? <PatientList /> : <Navigate to="/login" />}/>
        <Route path='/patient-profile/:id' element={<PatientProfile />}/>
        <Route path='/add-new-patient' element={<AddNewPatient />}/>
        <Route path='/book-appointment' element={<BookAppointment />}/>
        <Route path='/all-appointments' element={<AllAppointments />}/>
        <Route path='/discharge-summary/:id' element={<DischargeSummary />}/>
        <Route path='/view-appointment/:id' element={<ViewAppointment />}/>
        <Route path='/vitals-entry' element={<VitalsEntry />}/>
        <Route path='/consultations' element={<Consultations />}/>
        <Route path='/patient-consultation/:id' element={<PatientConsultation />} />
>>>>>>> 08cd23a6a27f6a84a60ec4bad6287bb41fbfd3dc

        {/* Protected Routes */}
        {uToken ? (
          <Route
            element={
              <Layout
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeCategory={activeCategory}
              />
            }
          >
            {/* Home Page */}
            <Route
              path="/home"
              element={
                <HomePage
                  user={{
                    name: "Dr. John Smith",
                    role: "Admin",
                    initials: "JS",
                  }}
                  setActiveCategory={setActiveCategory}
                />
              }
            />

            {/* Patient Management */}
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/patient-profile/:id" element={<PatientProfile />} />
            <Route path="/add-new-patient" element={<AddNewPatient />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route
              path="/discharge-summary/:id"
              element={<DischargeSummary />}
            />
            <Route path="/view-appointment/:id" element={<ViewAppointment />} />
            <Route path="/vitals-entry" element={<VitalsEntry />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route
              path="/patient-consultation/:id"
              element={<PatientConsultation />}
            />

            {/* Equipment */}
            <Route path="/equipment-list" element={<EquipmentList />} />
            <Route path="/add-equipment" element={<AddEquipment />} />
            <Route path="/add-maintenance" element={<AddMaintenance />} />
            <Route
              path="/create-calibration-schedule"
              element={<CreateCalibrationSchedule />}
            />
            <Route
              path="/calibration-schedule-list"
              element={<CalibrationScheduleList />}
            />
            <Route path="/maintenance-log" element={<MaintenanceLog />} />
            <Route path="/view-equipment/:id" element={<ViewEquipment />} />
            <Route path="/edit-equipment/:id" element={<EditEquipment />} />

            {/* Infrastructure */}
            <Route path="/add-department" element={<AddDepartment />} />
            <Route path="/bed-availability" element={<BedAvailability />} />
            <Route path="/department/:id" element={<Department />} />
            <Route path="/departments-list" element={<DepartmentsList />} />
            <Route path="/facility-map" element={<FacilityMap />} />
            <Route path="/issue-report" element={<IssueReport />} />
            <Route path="/issues-list" element={<IssuesList />} />

<<<<<<< HEAD
            {/* Inventory */}
            <Route path="/add-new-medicine" element={<AddNewMedicine />} />
            <Route
              path="/create-new-supplier"
              element={<CreateNewSupplier />}
            />
            <Route
              path="/create-purchase-order"
              element={<CreatePurchaseOrder />}
            />
            <Route path="/medicine-stocks" element={<MedicineStocks />} />
            <Route path="/purchase-order" element={<PurchaseOrder />} />
            <Route path="/stock-alerts" element={<StockAlerts />} />
            <Route path="/suppliers-list" element={<SuppliersList />} />
            <Route
              path="/edit-supplier/:id"
              element={<EditSupplierDetails />}
            />
            <Route
              path="/medicine-details/:id"
              element={<ViewMedicineDetails />}
            />
            <Route
              path="/edit-medicine/:id"
              element={<EditMedicineDetails />}
            />
=======
        {/* Laboratory */}
        <Route path='/lab-reports-list' element={<LabReportsList />}/>
        <Route path='/lab-results-entry' element={<LabResultsEntry />}/>
        <Route path='/patient-wise-reports' element={<PatientWiseReports />}/>
        <Route path='/upload-report' element={<UploadReport />}/>
        
>>>>>>> 08cd23a6a27f6a84a60ec4bad6287bb41fbfd3dc

            {/* Laboratory */}
            <Route path="/lab-reports-list" element={<LabReportsList />} />
            <Route path="/lab-results-entry" element={<LabResultsEntry />} />
            <Route
              path="/patient-wise-reports"
              element={<PatientWiseReports />}
            />
            <Route path="/upload-report" element={<UploadReport />} />

            {/* Staff Management */}
            <Route path="/add-staff" element={<AddStaff />} />
            <Route path="/assign-shift" element={<AssignShift />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave-management" element={<LeaveManagement />} />
            <Route path="/shift-planner" element={<ShiftPlanner />} />
            <Route path="/staff-list" element={<StaffList />} />
            <Route path="/staff-performance" element={<StaffPerformance />} />
            <Route path="/staff-profile" element={<StaffProfile />} />
            <Route path="/staff-profile/:id" element={<StaffProfileById />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
