export const hospitalDepartments = [
  {
    departmentId: "DEP001",
    departmentName: "Emergency",
    departmentHead: "Dr. Arun Mehta",
    departmentType: "Critical",
    block: "A",
    floor: "Ground Floor",
    staffCount: 45,
    status: "Active",

    beds: {
      totalBeds: 30,
      icuBeds: 10,
      otBeds: 2
    },

    staffDetails: {
      doctors: 12,
      nurses: 20,
      technicians: 5,
      supportingStaff: 8
    },

    equipments: [
      "ECG Machine",
      "Defibrillator",
      "Cardiac Monitor",
      "Ventilator",
      "Infusion Pump"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP002",
    departmentName: "Cardiology",
    departmentHead: "Dr. Meera Iyer",
    departmentType: "Super Speciality",
    block: "B",
    floor: "2nd Floor",
    staffCount: 38,
    status: "Active",

    beds: {
      totalBeds: 25,
      icuBeds: 8,
      otBeds: 3
    },

    staffDetails: {
      doctors: 10,
      nurses: 15,
      technicians: 6,
      supportingStaff: 7
    },

    equipments: [
      "ECG Machine",
      "Defibrillator",
      "Cardiac Monitor",
      "Treadmill Test Unit"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP003",
    departmentName: "Radiology",
    departmentHead: "Dr. Sanjay Rao",
    departmentType: "Laboratory",
    block: "C",
    floor: "1st Floor",
    staffCount: 28,
    status: "Active",

    beds: {
      totalBeds: 10,
      icuBeds: 0,
      otBeds: 0
    },

    staffDetails: {
      doctors: 6,
      nurses: 5,
      technicians: 12,
      supportingStaff: 5
    },

    equipments: [
      "X-Ray Machine",
      "CT Scanner",
      "MRI Scanner",
      "Ultrasound Machine"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Not Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP004",
    departmentName: "ICU",
    departmentHead: "Dr. Karthik Subramanian",
    departmentType: "Critical",
    block: "A",
    floor: "1st Floor",
    staffCount: 50,
    status: "Active",

    beds: {
      totalBeds: 20,
      icuBeds: 20,
      otBeds: 0
    },

    staffDetails: {
      doctors: 15,
      nurses: 25,
      technicians: 5,
      supportingStaff: 5
    },

    equipments: [
      "Ventilator",
      "Cardiac Monitor",
      "Infusion Pump",
      "Defibrillator"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP005",
    departmentName: "Physiotherapy",
    departmentHead: "Dr. Nisha Verma",
    departmentType: "General",
    block: "D",
    floor: "Ground Floor",
    staffCount: 18,
    status: "Active",

    beds: {
      totalBeds: 12,
      icuBeds: 0,
      otBeds: 0
    },

    staffDetails: {
      doctors: 4,
      nurses: 4,
      technicians: 6,
      supportingStaff: 4
    },

    equipments: [
      "Ultrasound Therapy Unit",
      "TENS Machine",
      "Traction Unit"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP006",
    departmentName: "Operation Theatre",
    departmentHead: "Dr. Rajesh Khanna",
    departmentType: "Critical",
    block: "B",
    floor: "3rd Floor",
    staffCount: 42,
    status: "Active",

    beds: {
      totalBeds: 10,
      icuBeds: 0,
      otBeds: 10
    },

    staffDetails: {
      doctors: 14,
      nurses: 16,
      technicians: 6,
      supportingStaff: 6
    },

    equipments: [
      "Anesthesia Workstation",
      "Surgical Lights",
      "Patient Monitor",
      "Electrosurgical Unit"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP007",
    departmentName: "Neurology",
    departmentHead: "Dr. Prakash Menon",
    departmentType: "Super Speciality",
    block: "C",
    floor: "2nd Floor",
    staffCount: 30,
    status: "Active",

    beds: {
      totalBeds: 18,
      icuBeds: 5,
      otBeds: 2
    },

    staffDetails: {
      doctors: 8,
      nurses: 12,
      technicians: 5,
      supportingStaff: 5
    },

    equipments: [
      "EEG Machine",
      "EMG Machine",
      "Patient Monitor"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP008",
    departmentName: "Laboratory Services",
    departmentHead: "Dr. Pooja Sharma",
    departmentType: "Laboratory",
    block: "E",
    floor: "1st Floor",
    staffCount: 35,
    status: "Active",

    beds: {
      totalBeds: 0,
      icuBeds: 0,
      otBeds: 0
    },

    staffDetails: {
      doctors: 5,
      nurses: 0,
      technicians: 20,
      supportingStaff: 10
    },

    equipments: [
      "Biochemistry Analyzer",
      "Hematology Analyzer",
      "Microscope"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Not Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP009",
    departmentName: "Pediatrics",
    departmentHead: "Dr. Anjali Nair",
    departmentType: "General",
    block: "D",
    floor: "2nd Floor",
    staffCount: 26,
    status: "Active",

    beds: {
      totalBeds: 20,
      icuBeds: 5,
      otBeds: 1
    },

    staffDetails: {
      doctors: 7,
      nurses: 12,
      technicians: 3,
      supportingStaff: 4
    },

    equipments: [
      "Infant Warmer",
      "Patient Monitor",
      "Syringe Pump"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  },

  {
    departmentId: "DEP010",
    departmentName: "Dialysis Unit",
    departmentHead: "Dr. Ramesh Patel",
    departmentType: "Super Speciality",
    block: "F",
    floor: "Ground Floor",
    staffCount: 22,
    status: "Inactive",

    beds: {
      totalBeds: 15,
      icuBeds: 0,
      otBeds: 0
    },

    staffDetails: {
      doctors: 4,
      nurses: 10,
      technicians: 4,
      supportingStaff: 4
    },

    equipments: [
      "Dialysis Machine",
      "Water Treatment System",
      "Patient Monitor"
    ],

    utilities: {
      "Power Backup": "Available",
      "Oxygen Supply": "Available",
      "Fire Extinguisher": "Available"
    }
  }
];

export const departmentBedData = [
  {
    departmentId: "DEP001",
    departmentName: "Cardiology",
    floor : "Ground Floor",
    totalBeds: 14,
    beds: [
      { bedId: "CAR-ICU-01", bedType: "ICU", status: "Occupied" },
      { bedId: "CAR-ICU-02", bedType: "ICU", status: "Available" },
      { bedId: "CAR-ICU-03", bedType: "ICU", status: "Maintenance" },

      { bedId: "CAR-OT-01", bedType: "OT", status: "Available" },
      { bedId: "CAR-OT-02", bedType: "OT", status: "Occupied" },

      { bedId: "CAR-GEN-01", bedType: "General", status: "Available" },
      { bedId: "CAR-GEN-02", bedType: "General", status: "Occupied" },
      { bedId: "CAR-GEN-03", bedType: "General", status: "Available" },
      { bedId: "CAR-GEN-04", bedType: "General", status: "Available" },
      { bedId: "CAR-GEN-05", bedType: "General", status: "Occupied" },
      { bedId: "CAR-GEN-06", bedType: "General", status: "Maintenance" },
      { bedId: "CAR-GEN-07", bedType: "General", status: "Available" },
      { bedId: "CAR-GEN-08", bedType: "General", status: "Occupied" },
      { bedId: "CAR-GEN-09", bedType: "General", status: "Available" }
    ]
  },

  {
    departmentId: "DEP002",
    departmentName: "Pediatrics",
    floor : "Second Floor",
    totalBeds: 11,
    beds: [
      { bedId: "PED-ICU-01", bedType: "ICU", status: "Available" },
      { bedId: "PED-ICU-02", bedType: "ICU", status: "Occupied" },

      { bedId: "PED-OT-01", bedType: "OT", status: "Available" },

      { bedId: "PED-GEN-01", bedType: "General", status: "Available" },
      { bedId: "PED-GEN-02", bedType: "General", status: "Available" },
      { bedId: "PED-GEN-03", bedType: "General", status: "Occupied" },
      { bedId: "PED-GEN-04", bedType: "General", status: "Occupied" },
      { bedId: "PED-GEN-05", bedType: "General", status: "Maintenance" },
      { bedId: "PED-GEN-06", bedType: "General", status: "Available" },
      { bedId: "PED-GEN-07", bedType: "General", status: "Occupied" },
      { bedId: "PED-GEN-08", bedType: "General", status: "Available" }
    ]
  },

  {
    departmentId: "DEP003",
    departmentName: "Orthopedics",
    floor : "First Floor",
    totalBeds: 17,
    beds: [
      { bedId: "ORT-ICU-01", bedType: "ICU", status: "Occupied" },
      { bedId: "ORT-ICU-02", bedType: "ICU", status: "Available" },
      { bedId: "ORT-ICU-03", bedType: "ICU", status: "Available" },

      { bedId: "ORT-OT-01", bedType: "OT", status: "Occupied" },
      { bedId: "ORT-OT-02", bedType: "OT", status: "Available" },
      { bedId: "ORT-OT-03", bedType: "OT", status: "Maintenance" },

      { bedId: "ORT-GEN-01", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-02", bedType: "General", status: "Occupied" },
      { bedId: "ORT-GEN-03", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-04", bedType: "General", status: "Occupied" },
      { bedId: "ORT-GEN-05", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-06", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-07", bedType: "General", status: "Maintenance" },
      { bedId: "ORT-GEN-08", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-09", bedType: "General", status: "Occupied" },
      { bedId: "ORT-GEN-10", bedType: "General", status: "Available" },
      { bedId: "ORT-GEN-11", bedType: "General", status: "Occupied" }
    ]
  },

  {
    departmentId: "DEP004",
    departmentName: "Neurology",
    floor : "Ground Floor",
    totalBeds: 9,
    beds: [
      { bedId: "NEU-ICU-01", bedType: "ICU", status: "Available" },
      { bedId: "NEU-ICU-02", bedType: "ICU", status: "Occupied" },

      { bedId: "NEU-OT-01", bedType: "OT", status: "Available" },

      { bedId: "NEU-GEN-01", bedType: "General", status: "Available" },
      { bedId: "NEU-GEN-02", bedType: "General", status: "Occupied" },
      { bedId: "NEU-GEN-03", bedType: "General", status: "Available" },
      { bedId: "NEU-GEN-04", bedType: "General", status: "Maintenance" },
      { bedId: "NEU-GEN-05", bedType: "General", status: "Available" },
      { bedId: "NEU-GEN-06", bedType: "General", status: "Occupied" }
    ]
  }
];
