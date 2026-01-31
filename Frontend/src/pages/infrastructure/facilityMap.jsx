import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaExclamationTriangle,
  FaUsers,
  FaArrowUp,
  FaChild,
  FaBone,
  FaFemale,
  FaFlask,
  FaAllergies,
  FaUserMd,
  FaXRay,
  FaBrain
} from "react-icons/fa";
import { DeptContext } from './../../context/DeptContext';
import { AppContext } from "../../context/AppContext";

export default function FacilityMap() {

  const navigate = useNavigate();
  const { departments, fetchDepartments } = useContext(DeptContext);
  const { token } = useContext(AppContext);
  const [selectedDept, setSelectedDept] = useState(null);

  const mappedDepartments = departments?.map((dept) => ({
    departmentId: dept.deptId,
    departmentName: dept.deptName,
    departmentType: dept.deptType,
    floor: dept.floor,
    block: dept.block,
    status: dept.status,
  }));

  // Style by Department Type
  const getDeptStyle = (type) => {
    switch (type) {
      case "Critical Care":
        return "bg-red-100 border-red-300 text-red-600";
      case "Emergency":
        return "bg-orange-100 border-orange-400 text-orange-700";
      case "Laboratory":
        return "bg-blue-100 border-blue-400 text-blue-700";
      case "General":
        return "bg-green-100 border-green-400 text-green-700";
      default:
        return "bg-gray-100 border-gray-300 text-gray-600";
    }
  };

  // Icon by Department Name 
  const getIcon = (name) => {
  switch (name) {
    case "Cardiology":
      return <FaHeartbeat />;

    case "Pediatrics":
      return <FaChild />;

    case "Orthopedics":
      return <FaBone />;

    case "Gynecology":
      return <FaFemale />;

    case "Emergency":
      return <FaExclamationTriangle />;

    case "Laboratory Services":
      return <FaFlask />;

    case "Dermatology":
      return <FaAllergies />;

    case "General Medicine":
      return <FaUserMd />;

    case "Radiology":
      return <FaXRay />;

    case "Neurology":
      return <FaBrain />;

    case "Lobby":
      return <FaUsers />;

    case "Elevator":
      return <FaArrowUp />;

    default:
      return <FaUserMd />;
  }
  };


  // Pick departments manually
  const topRow = mappedDepartments?.slice(0, 4);
  const middleLeft = mappedDepartments?.[4];
  const middleRight = mappedDepartments?.[5];
  const bottomRow = mappedDepartments?.slice(6, 10);

  useEffect(()=>{
    if(token){
      fetchDepartments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-800">Facility Map</h2>
      <p className="text-sm text-gray-500 mb-4">
        Interactive floor plan and department navigation
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Facility Map */}
        <div className="lg:col-span-3 bg-white rounded-xl p-4 shadow">
          <p className="text-sm font-medium text-gray-600 mb-3">
            Block
          </p>

          <div className="grid grid-cols-4 gap-4">

            {/* Row  */}
            {topRow.map((dept) => (
              <DepartmentTile
                key={dept.departmentId}
                dept={dept}
                onSelect={setSelectedDept}
                getIcon={getIcon}
                getDeptStyle={getDeptStyle}
              />
            ))}

            {/* Row 2 */}
            <DepartmentTile
              dept={middleLeft}
              onSelect={setSelectedDept}
              getIcon={getIcon}
              getDeptStyle={getDeptStyle}
            />

            {/* Lobby */}
            <div className="h-24 rounded-lg border bg-gray-100 flex flex-col items-center justify-center text-gray-700
              transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FaUsers size={20} />
              <p className="text-xs mt-1 font-medium">Lobby</p>
            </div>

            {/* Elevator */}
            <div className="h-24 rounded-lg border bg-gray-100 flex flex-col items-center justify-center text-gray-700
              transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FaArrowUp size={20} />
              <p className="text-xs mt-1 font-medium">Elevator</p>
            </div>

            <DepartmentTile
              dept={middleRight}
              onSelect={setSelectedDept}
              getIcon={getIcon}
              getDeptStyle={getDeptStyle}
            />

            {/* Row 3 */}
            {bottomRow.map((dept) => (
              <DepartmentTile
                key={dept.departmentId}
                dept={dept}
                onSelect={setSelectedDept}
                getIcon={getIcon}
                getDeptStyle={getDeptStyle}
              />
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Legend</h4>

            <LegendItem color="bg-red-400" label="Critical Department" />
            <LegendItem color="bg-blue-400" label="Laboratory" />
            <LegendItem color="bg-orange-400" label="Emergency" />
            <LegendItem color="bg-green-400" label="General" />

            <p className="text-xs font-medium text-gray-500 mt-4 mb-2">
              Facilities
            </p>

            <LegendItem color="bg-gray-400" label="Elevator, Lobby" />
          </div>

          {/* Department Details */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Department Details
            </h4>

            {!selectedDept ? (
              <p className="text-xs text-gray-500">
                Select a department to view details
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                <Detail label="Department" value={selectedDept.departmentName} />
                <Detail label="Block" value={selectedDept.block} />
                <Detail label="Floor" value={selectedDept.floor} />
                <Detail label="Type" value={selectedDept.departmentType} />

                <span className={`inline-block mt-2 px-2 py-1 rounded font-medium ${selectedDept.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {selectedDept.status}
                </span>
                <button
                  className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md text-sm font-medium
                  transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                  onClick={() => navigate(`/department/${selectedDept.departmentId}`)}
                >
                  View Department
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Components

const DepartmentTile = ({ dept, onSelect, getIcon, getDeptStyle }) => {
  if (!dept) return null;

  return (
    <button
      onClick={() => onSelect(dept)}
      className={`h-24 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer
      ${getDeptStyle(dept.departmentType)}
      hover:shadow-md transition`}
    >
      <div className="text-xl mb-1">
        {getIcon(dept.departmentName)}
      </div>
      <p className="text-xs font-medium text-center">
        {dept.departmentName}
      </p>
    </button>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 mb-2">
    <span className={`w-3 h-3 rounded ${color}`} />
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const Detail = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);
