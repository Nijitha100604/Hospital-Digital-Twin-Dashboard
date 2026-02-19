import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserInjured, 
  FaCalendarCheck, 
  FaArrowRight, 
  FaChartLine, 
  FaHospital, 
  FaMicroscope, 
  FaBoxes, 
  FaUserNurse, 
  FaFlask,
  FaPhoneAlt,
  FaClock
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';


const HomePage = ({ setActiveCategory }) => {

  const {userData, fetchUserProfile, token} = useContext(AppContext);

  const navigate = useNavigate();

  useEffect(()=>{
    if(token){
      fetchUserProfile(token)
    }
  }, [token, fetchUserProfile])

  // Quick Access Modules Configuration 
  const quickLinks = [
    {
      id: 1,
      title: "Patient Management",
      desc: "Manage patient records, appointments, and medical history.",
      icon: <FaUserInjured className="text-white text-xl" />,
      bg: "bg-purple-600",
      route: "/patient-list",
      category: "PATIENT SERVICE",
      roles: ["Admin", "Doctor", "Nurse", "Receptionist"]
    },
    {
      id: 2,
      title: "Analytics Dashboard",
      desc: "View real-time analytics, statistics, and performance metrics.",
      icon: <FaChartLine className="text-white text-xl" />,
      bg: "bg-blue-600",
      route: "/admin-dashboard", 
      category: "MAIN",
      roles: ["Admin"]
    },
    {
      id: 3,
      title: "Infrastructure",
      desc: "Monitor departments, room availability, and facility issues.",
      icon: <FaHospital className="text-white text-xl" />,
      bg: "bg-green-600",
      route: "/departments-list",
      category: "INFRASTRUCTURE",
      roles: ["Admin", "Nurse", "Receptionist", "Techician", "Doctor", "Support", "Pharmacist"]
    },
    {
      id: 4,
      title: "Equipment Management",
      desc: "Track medical equipment, maintenance logs, and availability.",
      icon: <FaMicroscope className="text-white text-xl" />,
      bg: "bg-orange-600",
      route: "/equipment-list",
      category: "EQUIPMENT",
      roles: ["Admin", "Pharmacist"]
    },
    {
      id: 5,
      title: "Inventory & Pharmacy",
      desc: "Manage medicine stock, suppliers, and purchase orders.",
      icon: <FaBoxes className="text-white text-xl" />,
      bg: "bg-teal-600",
      route: "/medicine-stocks",
      category: "INVENTORY",
      roles: ["Admin", "Pharmacist", "Technician"]
    },
    {
      id: 6,
      title: "Staff Management",
      desc: "View staff directory, shifts, and department assignments.",
      icon: <FaUserNurse className="text-white text-xl" />,
      bg: "bg-indigo-600",
      route: "/staff-list",
      category: "WORKFORCE",
      roles: ["Admin", "Support", "Pharmacist", "Technician", "Nurse", "Doctor", "Receptionist"]
    },
    {
      id: 7,
      title: "Lab Reports",
      desc: "Access and manage laboratory test results and reports.",
      icon: <FaFlask className="text-white text-xl" />,
      bg: "bg-pink-600",
      route: "/lab-reports-list",
      category: "LABORATORY",
      roles: ["Admin", "Doctor", "Technician"]
    },
    {
      id: 8,
      title: "Appointments",
      desc: "Book and manage patient appointments and schedules.",
      icon: <FaCalendarCheck className="text-white text-xl" />,
      bg: "bg-yellow-500",
      route: "/all-appointments",
      category: "PATIENT SERVICE",
      roles: ["Admin", "Doctor", "Receptionist"]
    }
  ];

  const getInitials = (fullName) => {
  if (!fullName) return "";

  const titles = ["dr", "mr", "mrs", "ms", "miss", "prof"];

  const nameParts = fullName
    .replace(/\./g, "")
    .split(" ")
    .filter(word => !titles.includes(word.toLowerCase()));

  if (nameParts.length === 0) return "";

  if (nameParts.length === 1) {
    return nameParts[0][0].toUpperCase();
  }

  return (
    nameParts[0][0] + nameParts[1][0]
  ).toUpperCase();
};

  // Navigation Handler 
  const handleNavigation = (route, category) => {
    
    if (setActiveCategory) {
      setActiveCategory(category);
    }
    navigate(route);
    window.scrollTo(0, 0);
  };

  return (
    <div className="md:p-6 bg-slate-50 min-h-screen">
      
      {/* --- HERO BANNER --- */}
      <div className="bg-fuchsia-900 rounded-2xl p-6 md:p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-fuchsia-200 text-sm mb-1 font-medium tracking-wide">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold">{userData?.fullName || "-"}</h1>
          <div className="mt-2 inline-block px-3 py-1 bg-fuchsia-800 rounded-full text-xs font-semibold border border-fuchsia-600">
            {userData?.designation || "-"} Home
          </div>
        </div>
        
        <div className="w-16 h-16 rounded-full border-4 border-fuchsia-800 flex items-center justify-center bg-white text-fuchsia-900 text-xl font-bold shadow-md">
          {getInitials(userData?.fullName)}
        </div>
      </div>

      {/* --- QUICK ACCESS SECTION --- */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="w-1.5 h-6 bg-fuchsia-600 rounded-full"></span>
          Quick Access
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickLinks
            .filter(link => link.roles.includes(userData?.designation)) // Filter based on User Role
            .map((link) => (
              <div 
                key={link.id}
                onClick={() => handleNavigation(link.route, link.category)}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full relative overflow-hidden"
              >
                {/* Decorative Background Circle on Hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 z-0"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${link.bg} shadow-md transition-transform group-hover:rotate-6`}>
                    {link.icon}
                  </div>
                  <div className="p-2 bg-gray-50 rounded-full text-gray-400 group-hover:bg-fuchsia-50 group-hover:text-fuchsia-600 transition-colors">
                    <FaArrowRight size={14} />
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-fuchsia-800 transition-colors relative z-10">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">
                  {link.desc}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* --- SUPPORT FOOTER --- */}
      <div className="bg-gray-800 rounded-2xl p-8 text-center text-white shadow-md relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gray-700 rounded-full -ml-10 -mt-10 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gray-700 rounded-full -mr-8 -mb-8 opacity-30"></div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-2">Need Support?</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto">
            For any technical or administrative assistance, contact our support team. 
            Our team is available 24/7 to assist with dashboard issues.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-sm">
            <div className="flex items-center justify-center gap-3 bg-gray-700/50 px-5 py-2.5 rounded-lg border border-gray-600 backdrop-blur-sm">
              <FaPhoneAlt className="text-fuchsia-400" />
              <span>Emergency: +91 1800-123-4567</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-700/50 px-5 py-2.5 rounded-lg border border-gray-600 backdrop-blur-sm">
              <MdEmail className="text-fuchsia-400 text-lg" />
              <span>support@hospital.com</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-gray-700/50 px-5 py-2.5 rounded-lg border border-gray-600 backdrop-blur-sm">
              <FaClock className="text-fuchsia-400" />
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- COPYRIGHT --- */}
      <div className="text-center mt-10 mb-4">
        <p className="text-xs text-fuchsia-600 font-medium flex items-center justify-center gap-1">
           ♥ Hospital Digital Twin v4.1.3 (River Surfer)
        </p>
        <p className="text-[10px] text-gray-400 mt-1 flex items-center justify-center">
          © 2026 Hospital Management System 
        </p>
      </div>

    </div>
  );
};

export default HomePage;