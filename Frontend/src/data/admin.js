export const dashboardStatus = {
  patients: {
    previous: 279,
    today: 287,
    totalTillDate: 12480
  },

  beds: {
    totalBeds: 300,
    previousOccupied: 255,
    todayOccupied: 261
  },

  emergencyCases: {
    previous: 18,
    today: 23
  },

  surgeries: {
    previous: 9,
    today: 12
  },

  inventory: {
    lowStockItems: 8,
    urgent: true
  },

  staff: {
    total: 420,
    present: 382,
    absent: 38
  },

  revenue: {
    previous: 37400,
    today: 42000
  }
};

export const criticalAlerts = [
  {
    id: 1,
    title: "ICU Bed Capacity Critical",
    description: "ICU occupancy has exceeded 90%. Immediate patient diversion or discharge planning required.",
    department: "Intensive Care Unit",
    severity: "high",
    time: "2 mins ago"
  },
  {
    id: 2,
    title: "Emergency Department Overcrowding",
    description: "Patient inflow is significantly higher than average, leading to increased waiting times.",
    department: "Emergency",
    severity: "high",
    time: "10 mins ago"
  },
  {
    id: 3,
    title: "Ventilator Availability Low",
    description: "Available ventilators are below safe operational threshold.",
    department: "Respiratory Care",
    severity: "medium",
    time: "18 mins ago"
  },
  {
    id: 4,
    title: "Abnormal ECG Patterns Detected",
    description: "Patients show irregular ECG signals requiring cardiologist review.",
    department: "Cardiology",
    severity: "high",
    time: "25 mins ago"
  },
  {
    id: 5,
    title: "Operation Theatre Delay",
    description: "Back-to-back surgeries causing delay in OT availability.",
    department: "Surgery",
    severity: "medium",
    time: "35 mins ago"
  },
  {
    id: 6,
    title: "Oxygen Supply Pressure Drop",
    description: "Central oxygen pipeline pressure is below optimal levels.",
    department: "Facility Management",
    severity: "critical",
    time: "1 hour ago"
  }
];

export const patientFlowTrends = [
  { month: "Jan", admissions: 420, consultations: 900, emergencies: 180 },
  { month: "Feb", admissions: 480, consultations: 950, emergencies: 220 },
  { month: "Mar", admissions: 450, consultations: 910, emergencies: 200 },
  { month: "Apr", admissions: 520, consultations: 1020, emergencies: 240 },
  { month: "May", admissions: 580, consultations: 1080, emergencies: 260 },
  { month: "Jun", admissions: 650, consultations: 1200, emergencies: 300 }
];

export const departmentDistribution = [
  { name: "Cardiology", value: 450 },
  { name: "Neurology", value: 320 },
  { name: "Pediatrics", value: 280 },
  { name: "Orthopedics", value: 250 },
  { name: "Emergency", value: 400 },
  { name: "Others", value: 200 }
];

export const revenueVsExpenses = [
  { month: "Jan", revenue: 450000, expenses: 280000 },
  { month: "Feb", revenue: 520000, expenses: 310000 },
  { month: "Mar", revenue: 480000, expenses: 290000 },
  { month: "Apr", revenue: 580000, expenses: 340000 },
  { month: "May", revenue: 620000, expenses: 370000 },
  { month: "Jun", revenue: 700000, expenses: 400000 }
];

export const departmentBedOccupancy = [
  { department: "Cardiology", occupied: 45, total: 50 },
  { department: "Neurology", occupied: 28, total: 35 },
  { department: "Pediatrics", occupied: 38, total: 45 },
  { department: "Orthopedics", occupied: 32, total: 40 },
  { department: "ICU", occupied: 34, total: 45 },
  { department: "General", occupied: 120, total: 150 }
];