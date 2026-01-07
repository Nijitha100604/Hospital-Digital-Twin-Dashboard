export const equipment_records = [
  {
    equipmentId: "EQ001",
    equipmentName: "MRI Scanner",
    serialNumber: "SN-MRI-2301",
    modelName: "Magnetom Skyra",
    manufacturer: "Siemens Healthineers",
    category: "Diagnostic",
    department: "Radiology",
    location: "Radiology - Ground Floor",
    equipmentStatus: "Working",

    // Technical Specifications
    fieldStrength: "3 Tesla",
    boreSize: "70 cm",
    maxGradient: "45 mT/m",
    slewRate: "200 T/m/s",
    powerRequirement: "480V, 3 Phase",

    // Service Schedule - STATUS: UPCOMING (Due in 2026)
    lastService: "2024-02-15",
    nextService: "2026-02-15",

    // Purchase & Warranty
    installationDate: "10-01-2022",
    purchaseCost: "₹12,50,00,000",
    warrantyPeriod: "5 Years",
    warrantyExpiry: "10-01-2027",

    // Supplier
    supplierName: "Siemens Medical Solutions",
    contactNumber: "+91 9876543210",
    emailId: "support@siemens-health.com",

    description: "High-resolution MRI scanner for advanced diagnostic imaging.",
    equipmentImage: "Mri",
  },

  {
    equipmentId: "EQ002",
    equipmentName: "Ultrasound Machine",
    serialNumber: "SN-US-1120",
    modelName: "LOGIQ E10",
    manufacturer: "GE Healthcare",
    category: "Diagnostic",
    department: "Radiology",
    location: "Radiology - First Floor",
    equipmentStatus: "Under Maintenance",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: OVERDUE (Due in 2024)
    lastService: "2023-01-20",
    nextService: "2024-01-20",

    installationDate: "05-06-2021",
    purchaseCost: "₹65,00,000",
    warrantyPeriod: "3 Years",
    warrantyExpiry: "05-06-2024",

    supplierName: "GE Revolution",
    contactNumber: "+91 9123456780",
    emailId: "service@gehealthcare.com",

    description: "Advanced ultrasound system with real-time imaging.",
    equipmentImage: "Ultrasound_machine",
  },

  {
    equipmentId: "EQ003",
    equipmentName: "Patient Monitor",
    serialNumber: "SN-PM-7782",
    modelName: "IntelliVue MX800",
    manufacturer: "Philips",
    category: "ICU",
    department: "ICU",
    location: "ICU Ward - Block A",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: DUE SOON (Due in 10 days)
    lastService: "2024-03-05",
    nextService: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],

    installationDate: "18-08-2022",
    purchaseCost: "₹4,50,000",
    warrantyPeriod: "2 Years",
    warrantyExpiry: "18-08-2024",

    supplierName: "Philips Healthcare",
    contactNumber: "+91 9988776655",
    emailId: "support@philips.com",

    description: "Multi-parameter patient monitoring system for ICU.",
    equipmentImage: "Patient_monitor",
  },

  {
    equipmentId: "EQ004",
    equipmentName: "ECG Machine",
    serialNumber: "SN-ECG-5561",
    modelName: "PageWriter TC30",
    manufacturer: "Philips",
    category: "Diagnostic",
    department: "Cardiology",
    location: "Cardiology - Room 203",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: OVERDUE (Due in 2024)
    lastService: "2023-02-28",
    nextService: "2024-02-28",

    installationDate: "14-09-2021",
    purchaseCost: "₹2,80,000",
    warrantyPeriod: "3 Years",
    warrantyExpiry: "14-09-2024",

    supplierName: "Philips Healthcare",
    contactNumber: "+91 9001122334",
    emailId: "ecg@philips.com",

    description: "12-channel ECG system for cardiac diagnosis.",
    equipmentImage: "Ecg",
  },

  {
    equipmentId: "EQ005",
    equipmentName: "Defibrillator",
    serialNumber: "SN-DEF-4412",
    modelName: "HeartStart XL",
    manufacturer: "Philips",
    category: "Emergency",
    department: "Emergency",
    location: "Emergency Ward",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "Battery + 220V",

    // Service Schedule - STATUS: UPCOMING (Due in 2025)
    lastService: "2024-01-20",
    nextService: "2025-08-20",

    installationDate: "10-03-2022",
    purchaseCost: "₹3,20,000",
    warrantyPeriod: "2 Years",
    warrantyExpiry: "10-03-2024",

    supplierName: "Philips Emergency Care",
    contactNumber: "+91 9090909090",
    emailId: "emergency@philips.com",

    description: "Portable defibrillator for cardiac emergencies.",
    equipmentImage: "Defibrillator",
  },

  {
    equipmentId: "EQ006",
    equipmentName: "Anesthesia Machine",
    serialNumber: "SN-ANE-9931",
    modelName: "Aestiva 5",
    manufacturer: "GE Healthcare",
    category: "Surgical",
    department: "Operation Theatre",
    location: "OT Block - 2",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: DUE SOON (Due tomorrow)
    lastService: "2024-01-02",
    nextService: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],

    installationDate: "11-07-2021",
    purchaseCost: "₹18,00,000",
    warrantyPeriod: "4 Years",
    warrantyExpiry: "11-07-2025",

    supplierName: "GE Medical Systems",
    contactNumber: "+91 9887766554",
    emailId: "support@ge.com",

    description: "Advanced anesthesia delivery system for surgeries.",
    equipmentImage: "Anesthesia_machine",
  },

  {
    equipmentId: "EQ007",
    equipmentName: "Ventilator",
    serialNumber: "SN-VEN-7789",
    modelName: "Servo-i",
    manufacturer: "Maquet",
    category: "ICU",
    department: "ICU",
    location: "ICU Ward - Block B",
    equipmentStatus: "Under Maintenance",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: OVERDUE (Due in 2024)
    lastService: "2023-12-10",
    nextService: "2024-12-10",

    installationDate: "20-04-2020",
    purchaseCost: "₹22,00,000",
    warrantyPeriod: "5 Years",
    warrantyExpiry: "20-04-2025",

    supplierName: "Maquet Medical",
    contactNumber: "+91 9555443322",
    emailId: "service@maquet.com",

    description: "Critical care ventilator for ICU patients.",
    equipmentImage: "Ventilator",
  },

  {
    equipmentId: "EQ008",
    equipmentName: "X-Ray Machine",
    serialNumber: "SN-XR-6622",
    modelName: "DRX Compass",
    manufacturer: "Carestream",
    category: "Diagnostic",
    department: "Radiology",
    location: "Radiology - Basement",
    equipmentStatus: "Offline",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "440V AC",

    // Service Schedule - STATUS: DUE SOON (Due in 15 days)
    lastService: "2023-10-05",
    nextService: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],

    installationDate: "12-11-2019",
    purchaseCost: "₹45,00,000",
    warrantyPeriod: "5 Years",
    warrantyExpiry: "12-11-2024",

    supplierName: "Carestream Health",
    contactNumber: "+91 9877001122",
    emailId: "support@carestream.com",

    description: "Digital X-ray imaging system.",
    equipmentImage: "Xray",
  },

  {
    equipmentId: "EQ009",
    equipmentName: "Infusion Pump",
    serialNumber: "SN-INF-3341",
    modelName: "BeneFusion VP5",
    manufacturer: "Mindray",
    category: "ICU",
    department: "ICU",
    location: "ICU Ward - Block C",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "Battery + 220V",

    // Service Schedule - STATUS: UPCOMING (Due in 2026)
    lastService: "2024-01-18",
    nextService: "2026-01-18",

    installationDate: "22-06-2022",
    purchaseCost: "₹1,20,000",
    warrantyPeriod: "2 Years",
    warrantyExpiry: "22-06-2024",

    supplierName: "Mindray Medical",
    contactNumber: "+91 9443322110",
    emailId: "info@mindray.com",

    description: "Accurate infusion pump for drug delivery.",
    equipmentImage: "Infusion_pump",
  },

  {
    equipmentId: "EQ010",
    equipmentName: "CT Scanner",
    serialNumber: "SN-CT-9988",
    modelName: "Aquilion Prime",
    manufacturer: "Canon Medical",
    category: "Diagnostic",
    department: "Radiology",
    location: "Radiology - First Floor",
    equipmentStatus: "Working",

    fieldStrength: "128 Slice",
    boreSize: "78 cm",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "480V AC",

    // Service Schedule - STATUS: OVERDUE (Due in 2024)
    lastService: "2023-02-12",
    nextService: "2024-02-12",

    installationDate: "30-09-2021",
    purchaseCost: "₹9,80,00,000",
    warrantyPeriod: "5 Years",
    warrantyExpiry: "30-09-2026",

    supplierName: "Canon Medical Systems",
    contactNumber: "+91 9665544332",
    emailId: "support@canonmedical.com",

    description: "High-speed CT scanner for diagnostic imaging.",
    equipmentImage: "Ct_scanner",
  },

  {
    equipmentId: "EQ011",
    equipmentName: "Surgical Light",
    serialNumber: "SN-SL-2211",
    modelName: "Polaris 600",
    manufacturer: "Dräger",
    category: "Surgical",
    department: "Operation Theatre",
    location: "OT Block - 1",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "220V AC",

    // Service Schedule - STATUS: UPCOMING (Due in 2026)
    lastService: "2024-03-01",
    nextService: "2026-03-01",

    installationDate: "14-05-2022",
    purchaseCost: "₹6,50,000",
    warrantyPeriod: "3 Years",
    warrantyExpiry: "14-05-2025",

    supplierName: "Dräger Medical",
    contactNumber: "+91 9112233445",
    emailId: "ot@drager.com",

    description: "Shadow-free LED surgical lighting system.",
    equipmentImage: "Surgical_light",
  },

  {
    equipmentId: "EQ012",
    equipmentName: "Autoclave",
    serialNumber: "SN-AUT-9090",
    modelName: "HS-6610",
    manufacturer: "Steris",
    category: "Sterilization",
    department: "CSSD",
    location: "Central Sterile Supply Dept",
    equipmentStatus: "Working",

    fieldStrength: "N/A",
    boreSize: "N/A",
    maxGradient: "N/A",
    slewRate: "N/A",
    powerRequirement: "415V AC",

    // Service Schedule - STATUS: DUE SOON (Due in 25 days)
    lastService: "2024-01-22",
    nextService: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0],

    installationDate: "10-10-2020",
    purchaseCost: "₹9,50,000",
    warrantyPeriod: "5 Years",
    warrantyExpiry: "10-10-2025",

    supplierName: "Steris Healthcare",
    contactNumber: "+91 9332211000",
    emailId: "service@steris.com",

    description: "Steam sterilization unit for surgical instruments.",
    equipmentImage: "Autoclave",
  },
];