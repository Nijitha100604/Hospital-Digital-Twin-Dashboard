import { useContext } from "react";
import {
  FaUsers,
  FaHospital,
  FaBoxes,
  FaMicroscope,
  FaCogs,
  FaUserNurse,
  FaUserShield
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function SideNavbar({ isSidebarOpen, setIsSidebarOpen }) {

  const { userData } = useContext(AppContext);
  const role = userData?.designation;

  const handleNavClick = () => {
    window.scrollTo(0, 0);

    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const menuItems = [

    // ADMIN
    {
      title: "ADMIN",
      icon: <FaUserShield size={20} className="text-gray-500" />,
      links: [
        { name: "Dashboard", path: "/admin-dashboard", roles: ["Admin"] }
      ]
    },

    // PATIENT SERVICE
    {
      title: "PATIENT SERVICE",
      icon: <FaUsers size={22} className="text-gray-500" />,
      links: [
        { name: "Patient List", path: "/patient-list", roles: ["Admin","Doctor","Nurse","Receptionist"] },
        { name: "Add New Patient", path: "/add-new-patient", roles: ["Admin","Receptionist"] },
        { name: "Appointments", path: "/all-appointments", roles: ["Admin","Doctor","Nurse","Receptionist"] },
        { name: "Vitals Entry", path: "/vitals-entry", roles: ["Admin","Nurse"] },
        { name: "Consultations", path: "/consultations", roles: ["Admin","Doctor"] }
      ]
    },

    // INFRASTRUCTURE
    {
      title: "INFRASTRUCTURE",
      icon: <FaHospital size={20} className="text-gray-500" />,
      links: [
        { name: "Department List", path: "/departments-list", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] },
        { name: "Bed Availability", path: "/bed-availability", roles: ["Admin","Nurse","Receptionist"] },
        { name: "Facility Map", path: "/facility-map", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] },
        { name: "Report Issues", path: "/issues-list", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] }
      ]
    },

    // INVENTORY
    {
      title: "INVENTORY",
      icon: <FaBoxes size={20} className="text-gray-500" />,
      links: [
        { name: "Medicine Stock", path: "/medicine-stocks", roles: ["Admin","Pharmacist"] },
        { name: "Add Medicine", path: "/add-new-medicine", roles: ["Admin","Pharmacist"] },
        { name: "Stock Alerts", path: "/stock-alerts", roles: ["Admin","Pharmacist"] },
        { name: "Prescription", path: "/prescription-list", roles: ["Admin","Pharmacist"] },
        { name: "Suppliers", path: "/suppliers-list", roles: ["Admin","Pharmacist"] },
        { name: "Purchase Order", path: "/purchase-order", roles: ["Admin","Pharmacist"] }
      ]
    },

    // EQUIPMENT
    {
      title: "EQUIPMENT",
      icon: <FaCogs size={20} className="text-gray-500" />,
      links: [
        { name: "Equipment List", path: "/equipment-list", roles: ["Admin","Technician"] },
        { name: "Add New Equipment", path: "/add-equipment", roles: ["Admin","Technician"] },
        { name: "Calibration Schedule", path: "/calibration-schedule-list", roles: ["Admin","Technician"] },
        { name: "Maintenance Log", path: "/maintenance-log", roles: ["Admin","Technician"] }
      ]
    },

    // LAB
    {
      title: "LABORATORY",
      icon: <FaMicroscope size={20} className="text-gray-500" />,
      links: [
        { name: "Lab Reports", path: "/lab-reports-list", roles: ["Admin","Technician", "Doctor", "Nurse", "Receptionist"] },
        { name: "Results Entry", path: "/lab-results-entry", roles: ["Technician"] },
        { name: "Patient-Wise Reports", path: "/patient-wise-reports", roles: ["Admin","Technician", "Doctor", "Nurse"] },
        { name: "Upload Report", path: "/upload-report", roles: ["Technician"] }
      ]
    },

    // WORKFORCE
    {
      title: "WORKFORCE",
      icon: <FaUserNurse size={20} className="text-gray-500" />,
      links: [
        { name: "Staff List", path: "/staff-list", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] },
        { name: "Staff Profile", path: "/staff-profile", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] },
        { name: "Attendance and Leave", path: "/leave-management", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] },
        { name: "Add Staff", path: "/add-staff", roles: ["Admin"] },
        { name: "Shift Planner", path: "/shift-planner", roles: ["Admin","Doctor","Nurse","Receptionist","Technician","Support","Pharmacist"] }
      ]
    }
  ];

  return (
    <div
      className={`
        fixed md:sticky top-16 left-0
        w-52 h-[calc(100vh-4rem)]
        bg-white border border-gray-300
        py-4 z-40 overflow-y-auto hide-scrollbar
        transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {menuItems.map((section, index) => {

        const allowedLinks = section.links.filter(link =>
          link.roles.includes(role)
        );

        if (!allowedLinks.length) return null;

        return (
          <div key={index} className="mb-4">

            <div className="flex gap-2 px-4">
              {section.icon}
              <p className="font-semibold text-md text-gray-500 mb-2">
                {section.title}
              </p>
            </div>

            <ul>
              {allowedLinks.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.path}
                  onClick={
                    handleNavClick
                  }
                  className={({ isActive }) =>
                    `block px-4 py-1 text-sm cursor-pointer ${
                      isActive
                        ? "font-bold text-fuchsia-900 border-r-4 border-fuchsia-900"
                        : "text-gray-800 hover:font-semibold"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </ul>

          </div>
        );
      })}

    </div>
  );
}

export default SideNavbar;