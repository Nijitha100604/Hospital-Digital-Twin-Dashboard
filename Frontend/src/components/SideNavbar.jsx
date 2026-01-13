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
import PatientList from "./pages/patient_management/patientList";
import PatientProfile from "./pages/patient_management/patientProfile";
import AddNewPatient from "./pages/patient_management/addNewPatient";
import BookAppointment from "./pages/patient_management/bookAppointment";
import AllAppointments from "./pages/patient_management/allAppointments";
import DischargeSummary from "./pages/patient_management/dischargeSummary";
import ViewAppointment from "./pages/patient_management/viewAppointment";
import VitalsEntry from "./pages/patient_management/vitalsEntry";
import Consultations from "./pages/patient_management/Consultations";
import PatientConsultation from "./pages/patient_management/PatientConsultation";

// Equipment
import EquipmentList from "./pages/equipment/equipmentList";
import AddEquipment from "./pages/equipment/addEquipment";
import AddMaintenance from "./pages/equipment/addMaintenance";
import CreateCalibrationSchedule from "./pages/equipment/createCalibrationSchedule";
import CalibrationScheduleList from "./pages/equipment/calibrationScheduleList";
import MaintenanceLog from "./pages/equipment/maintenanceLog";
import ViewEquipment from "./pages/equipment/viewEquipment";
import EditEquipment from "./pages/equipment/editEquipment";

// Infrastructure
import AddDepartment from "./pages/infrastructure/addDepartment";
import BedAvailability from "./pages/infrastructure/bedAvailability";
import Department from "./pages/infrastructure/department";
import DepartmentsList from "./pages/infrastructure/departmentsList";
import FacilityMap from "./pages/infrastructure/facilityMap";
import IssueReport from "./pages/infrastructure/issueReport";
import IssuesList from "./pages/infrastructure/issuesList";

// Inventory
import AddNewMedicine from "./pages/inventory/addNewMedicine";
import CreateNewSupplier from "./pages/inventory/createNewSupplier";
import CreatePurchaseOrder from "./pages/inventory/createPurchaseOrder";
import MedicineStocks from "./pages/inventory/medicineStocks";
import EditMedicineDetails from "./pages/inventory/editMedicineDetails";
import PurchaseOrder from "./pages/inventory/purchaseOrder";
import StockAlerts from "./pages/inventory/stockAlerts";
import SuppliersList from "./pages/inventory/suppliersList";
import EditSupplierDetails from "./pages/inventory/editSupplierDetails";
import ViewMedicineDetails from "./pages/inventory/viewMedicineDetails";

// Laboratory
import LabReportsList from "./pages/laboratory/labReportsList";
import LabResultsEntry from "./pages/laboratory/labResultsEntry";
import PatientWiseReports from "./pages/laboratory/patientWiseReports";
import UploadReport from "./pages/laboratory/uploadReport";

// Staff Management
import AddStaff from "./pages/staff_management/AddStaff";
import AssignShift from "./pages/staff_management/assignShift";
import Attendance from "./pages/staff_management/attendance";
import LeaveManagement from "./pages/staff_management/leaveManagement";
import ShiftPlanner from "./pages/staff_management/shiftPlanner";
import StaffList from "./pages/staff_management/staffList";
import StaffPerformance from "./pages/staff_management/staffPerformance";
import StaffProfile from "./pages/staff_management/staffProfile";
import StaffProfileById from "./pages/staff_management/staffProfile";

// Admin Dashboard
import AdminDashboard from "./pages/AdminDashboard";


// ---------------------- LAYOUT WRAPPER ----------------------
const Layout = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <TopNavbar setIsSidebarOpen={setIsSidebarOpen} />
      <SideNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="md:ml-52 mt-16 p-4 min-h-screen">
        <Outlet />
      </div>
    </>
  );
};


// ---------------------- MAIN APP ----------------------
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uToken, setUToken] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen">
      <ToastContainer />

      <Routes>
        {/* Default Route */}
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

        {/* Login */}
        <Route path="/login" element={<Login setUToken={setUToken} />} />

        {/* Protected Routes */}
        {uToken ? (
          <Route
            element={
              <Layout
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            }
          >
            {/* HOME */}
            <Route
              path="/home"
              element={
                <HomePage
                  user={{
                    name: "Dr. John Smith",
                    role: "Admin",
                    initials: "JS",
                  }}
                />
              }
            />

            {/* ADMIN DASHBOARD */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* PATIENT MANAGEMENT */}
            <Route path="/patient-list" element={<PatientList />} />
            <Route path="/patient-profile/:id" element={<PatientProfile />} />
            <Route path="/add-new-patient" element={<AddNewPatient />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/discharge-summary/:id" element={<DischargeSummary />} />
            <Route path="/view-appointment/:id" element={<ViewAppointment />} />
            <Route path="/vitals-entry" element={<VitalsEntry />} />
            <Route path="/consultations" element={<Consultations />} />
            <Route
              path="/patient-consultation/:id"
              element={<PatientConsultation />}
            />

            {/* EQUIPMENT */}
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

            {/* INFRASTRUCTURE */}
            <Route path="/add-department" element={<AddDepartment />} />
            <Route path="/bed-availability" element={<BedAvailability />} />
            <Route path="/department/:id" element={<Department />} />
            <Route path="/departments-list" element={<DepartmentsList />} />
            <Route path="/facility-map" element={<FacilityMap />} />
            <Route path="/issue-report" element={<IssueReport />} />
            <Route path="/issues-list" element={<IssuesList />} />

            {/* INVENTORY */}
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
            <Route path="/edit-supplier/:id" element={<EditSupplierDetails />} />
            <Route
              path="/medicine-details/:id"
              element={<ViewMedicineDetails />}
            />
            <Route path="/edit-medicine/:id" element={<EditMedicineDetails />} />

            {/* LABORATORY */}
            <Route path="/lab-reports-list" element={<LabReportsList />} />
            <Route path="/lab-results-entry" element={<LabResultsEntry />} />
            <Route
              path="/patient-wise-reports"
              element={<PatientWiseReports />}
            />
            <Route path="/upload-report" element={<UploadReport />} />

            {/* STAFF */}
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
