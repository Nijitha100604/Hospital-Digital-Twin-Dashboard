export const patient_records = [
    {
    "patientId": "P000123",
    "patientName": "Arun Kumar",
    "age": 28,
    "gender": "Male",
    "mobileNumber": "9876543210",
    "lastVisit": "12 Jun 2025",
    "visitMode": "In Person"
  },
  {
    "patientId": "P000124",
    "patientName": "Divya R",
    "age": 34,
    "gender": "Female",
    "mobileNumber": "9123456789",
    "lastVisit": "08 Jun 2025",
    "visitMode": "Online"
  },
  {
    "patientId": "P000125",
    "patientName": "Suresh Babu",
    "age": 52,
    "gender": "Male",
    "mobileNumber": "9988776655",
    "lastVisit": "30 May 2025",
    "visitMode": "In Person"
  },
  {
    "patientId": "P000126",
    "patientName": "Meena Lakshmi",
    "age": 45,
    "gender": "Female",
    "mobileNumber": "9090909090",
    "lastVisit": "02 Jun 2025",
    "visitMode": "Online"
  },
  {
    "patientId": "P000127",
    "patientName": "Rahul Sharma",
    "age": 23,
    "gender": "Male",
    "mobileNumber": "9345678123",
    "lastVisit": "15 Jun 2025",
    "visitMode": "In Person"
  },
  {
    "patientId": "P000128",
    "patientName": "Anita Joseph",
    "age": 61,
    "gender": "Female",
    "mobileNumber": "9786543211",
    "lastVisit": "20 May 2025",
    "visitMode": "In Person"
  },
  {
    "patientId": "P000129",
    "patientName": "Vignesh K",
    "age": 39,
    "gender": "Male",
    "mobileNumber": "8899776655",
    "lastVisit": "05 Jun 2025",
    "visitMode": "Online"
  },
  {
    "patientId": "P000130",
    "patientName": "Priya Nair",
    "age": 31,
    "gender": "Female",
    "mobileNumber": "9871234567",
    "lastVisit": "10 Jun 2025",
    "visitMode": "In Person"
  },
  {
    "patientId": "P000131",
    "patientName": "Mohammed Faisal",
    "age": 47,
    "gender": "Male",
    "mobileNumber": "9012345678",
    "lastVisit": "01 Jun 2025",
    "visitMode": "Online"
  },
  {
    "patientId": "P000132",
    "patientName": "Kavitha S",
    "age": 26,
    "gender": "Female",
    "mobileNumber": "9966332211",
    "lastVisit": "18 Jun 2025",
    "visitMode": "In Person"
  }
]

export const patient_data = {
  "patientId": "P000123",
  "name": "Ananya Rao",
  "contactNumber": "9876543210",
  "age": 29,
  "gender": "Female",
  "bloodGroup": "O+ve",
  "registeredDate": "15 Dec 2025",
  "guardian": {
    "name": "Ramesh Rao",
    "contactNumber": "9123456780"
  },
  "address": "123 Main Street, Highway Road, Chicago, 643109",
  "vitalParameters":[
    {
      "name" : "Blood Pressure",
      "value": "118/76",
      "unit": "mm/Hg",
      "status": "Normal"
    },
    {
      "name" : "Heart Rate",
      "value": "54",
      "unit": "BPM",
      "status": "Below Normal"
    },
    {
      "name" : "Temperature",
      "value": "99.6",
      "unit": "F",
      "status": "Elevated"
    },
    {
      "name" : "Glucose",
      "value": "182",
      "unit": "mg/dl",
      "status": "Critical"
    },
    {
      "name" : "SpO2",
      "value": "98",
      "unit": "%",
      "status": "Below Normal"
    }
  ],
  "medicalInformation": {
    "allergies": [
      "Penicillin",
      "Dust",
      "Berries",
      "Pollen"
    ],
    "medicalHistory": [
      "Asthma",
      "Seasonal Allergic Rhinitis",
      "Type 2 Diabetes Milletus"
    ]
  },
  "admissionDetails":[ 
    {
    "bedNo": "B-14",
    "ward": "General Ward",
    "block": "Block A",
    "admittedDays": 4,
    "admittedDate": "12 Jun 2025"
    } 
  ],
  "visitHistory": [
    {
      "date": "16 Nov 2025",
      "doctor": "Dr. Priya Menon",
      "diagnosis": "Acute Bronchitis",
      "remarks": "Prescribed antibiotics and nebulization"
    },
    {
      "date": "18 Nov 2025",
      "doctor": "Dr. Arun Kumar",
      "diagnosis": "Improving respiratory condition",
      "remarks": "Reduced medication dosage"
    }
  ],
  "labReports": [
    {
      "testName": "Complete Blood Count",
      "reportNumber": "LR0001",
      "status": "Normal",
      "date": "16 Nov 2024",
      "conductedBy": "John Doe",
      "completed": true
    },
    {
      "testName": "Chest X-Ray",
      "reportNumber": "LR002",
      "status": "Abnormal",
      "date": "17 Dec 2024",
      "conductedBy": "John Doe",
      "completed": true
    },
    {
      "testName": "Blood Glucose",
      "reportNumber": "LR003",
      "status": "Normal",
      "date": "18 Nov 2025",
      "conductedBy": "John Doe",
      "completed": true
    }
  ]
}

export const allAppointments = [
  {
    appointmentNumber: "APT-00125",
    patientId: "P000123",
    patient: {
      name: "Arun Kumar",
      age: 45,
      gender: "Male",
      contact: "9876543210",
      blood: "O+ve", 
      reasonForAppointment: "Chest pain and shortness of breath"
    },
    doctorName: "Dr. Meena Raj",
    doctorCategory: "Cardiologist",
    appointmentType: "Emergency",
    consultationType: "In-Person",
    date: "2025-01-05",
    timeSlot: "09:00 – 10:00 AM",
    status: "Scheduled",
    vitals: [],
    diagnosis: "",
    remarks: "",
    prescriptions: [],
    labReports: [],
    admitted: { 
      isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: ""
     }
  },

  {
    appointmentNumber: "APT-00126",
    patientId: "P000124",
    patient: {
      name: "Priya Sharma",
      age: 29,
      gender: "Female",
      contact: "9123456789",
      blood: "O+ve",
      reasonForAppointment: "Fever and body pain"
    },
    doctorName: "Dr. Suresh Patel",
    doctorCategory: "Physician",
    appointmentType: "General Consultation",
    consultationType: "Online",
    date: "2025-01-06",
    timeSlot: "10:00 – 11:00 AM",
    status: "Completed",
    vitals: [
      { name: "Blood Pressure", value: "130/85", unit: "mmHg", status: "High" },
      { name: "Pulse Rate", value: 82, unit: "bpm", status: "Normal" },
      { name: "Temperature", value: 98.6, unit: "°F", status: "Normal" },
      { name: "SpO₂", value: 98, unit: "%", status: "Normal" }
    ],
    diagnosis: "Viral Fever",
    remarks: "Rest and hydration advised",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [
      { testName: "Complete Blood Count", status: "Completed" },
      { testName: "Dengue Test", status: "Completed" }
    ],
    admitted: {
      isAdmitted: true,
      ward: "ICU",
      bedNo: "ICU-03",
      block: "Block C",
      dailyNotes: [
        {
          date: "2025-01-05",
          note: "Patient admitted with chest pain, ECG taken"
        },
        {
          date: "2025-01-06",
          note: "Condition stable, monitoring continued"
        }
      ],
      dischargeStatus: "Under Treatment"
    }

  },

  {
    appointmentNumber: "APT-00127",
    patientId: "P000125",
    patient: {
      name: "Ravi Teja",
      age: 38,
      gender: "Male",
      contact: "9988776655",
      blood: "O+ve",
      reasonForAppointment: "Severe headaches"
    },
    doctorName: "Dr. Anitha Rao",
    doctorCategory: "Neurologist",
    appointmentType: "Specialist Consultation",
    consultationType: "In-Person",
    date: "2025-01-07",
    timeSlot: "11:00 – 12:00 PM",
    status: "Cancelled",
    vitals: [],
    diagnosis: "",
    remarks: "",
    prescriptions: [],
    labReports: [],
    admitted: { 
      isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: ""
     }
  },

  {
    appointmentNumber: "APT-00128",
    patientId: "P000126",
    patient: {
      name: "Sneha Iyer",
      age: 34,
      gender: "Female",
      contact: "9090909090",
      blood: "O+ve",
      reasonForAppointment: "Knee pain while walking"
    },
    doctorName: "Dr. Vikram Singh",
    doctorCategory: "Orthopedic",
    appointmentType: "Specialist Consultation",
    consultationType: "Online",
    date: "2025-01-08",
    timeSlot: "08:00 – 09:00 AM",
    status: "Completed",
    vitals: [
      { name: "Blood Pressure", value: "128/80", unit: "mmHg", status: "Normal" },
      { name: "Pulse Rate", value: 78, unit: "bpm", status: "Normal" }
    ],
    diagnosis: "Early Osteoarthritis",
    remarks: "Physiotherapy suggested",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [
      { testName: "X-Ray Knee", status: "Completed" }
    ],
    admitted: { 
      isAdmitted: true,
      ward: "General Ward",
      bedNo: "GW-18",
      block: "Block B",
      dailyNotes: [
        {
          date: "2025-01-10",
          note: "Admitted for BP monitoring"
        }
      ],
      dischargeStatus: "Discharged" 
    }
  },

  {
    appointmentNumber: "APT-00129",
    patientId: "P000127",
    patient: {
      name: "Karthik Anand",
      age: 26,
      gender: "Male",
      contact: "9345678123",
      blood: "O+ve",
      reasonForAppointment: "Skin rashes and itching"
    },
    doctorName: "Dr. Neha Verma",
    doctorCategory: "Dermatologist",
    appointmentType: "General Consultation",
    consultationType: "In-Person",
    date: "2025-01-09",
    timeSlot: "02:00 – 03:00 PM",
    status: "Rescheduled",
    vitals: [],
    diagnosis: "",
    remarks: "",
    prescriptions: [],
    labReports: [
      { testName: "Allergy Test", status: "Pending" }
    ],
    admitted: { isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: "" }
  },

  {
    appointmentNumber: "APT-00130",
    patientId: "P000128",
    patient: {
      name: "Divya Nair",
      age: 52,
      gender: "Female",
      contact: "9567891234",
      blood: "O+ve",
      reasonForAppointment: "High blood pressure follow-up"
    },
    doctorName: "Dr. Ramesh Iyer",
    doctorCategory: "Cardiologist",
    appointmentType: "Follow-up",
    consultationType: "Online",
    date: "2025-01-10",
    timeSlot: "09:00 – 10:00 AM",
    status: "Completed",
    vitals: [
      { name: "Blood Pressure", value: "145/90", unit: "mmHg", status: "High" }
    ],
    diagnosis: "Hypertension",
    remarks: "Lifestyle changes advised",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [
      { testName: "ECG", status: "Completed" },
      { testName: "Lipid Profile", status: "Pending" }
    ],
    admitted: { 
      isAdmitted: true,
      ward: "Private Ward",
      bedNo: "PW-05",
      block: "Block A",
      dailyNotes: [
      {
        date: "2025-01-15",
        note: "Blood sugar high, insulin started"
      },
      {
        date: "2025-01-16",
        note: "Sugar levels improving"
      }
      ],
      dischargeStatus: "Under Treatment"
    }
  },

  {
    appointmentNumber: "APT-00131",
    patientId: "P000129",
    patient: {
      name: "Mohammed Faisal",
      age: 41,
      gender: "Male",
      contact: "9898989898",
      blood: "O+ve",
      reasonForAppointment: "Chronic cough"
    },
    doctorName: "Dr. Kavitha Menon",
    doctorCategory: "Pulmonologist",
    appointmentType: "Specialist Consultation",
    consultationType: "In-Person",
    date: "2025-01-11",
    timeSlot: "03:00 – 04:00 PM",
    status: "Scheduled",
    vitals: [],
    diagnosis: "",
    remarks: "",
    prescriptions: [],
    labReports: [],
    admitted: { 
      isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: ""
     }
  },

  {
    appointmentNumber: "APT-00132",
    patientId: "P000130",
    patient: {
      name: "Anjali Gupta",
      age: 31,
      gender: "Female",
      contact: "9012345678",
      blood: "O+ve",
      reasonForAppointment: "Irregular periods"
    },
    doctorName: "Dr. Rahul Khanna",
    doctorCategory: "Gynecologist",
    appointmentType: "Specialist Consultation",
    consultationType: "Online",
    date: "2025-01-12",
    timeSlot: "11:00 – 12:00 PM",
    status: "Completed",
    vitals: [
      { name: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Normal" }
    ],
    diagnosis: "PCOS",
    remarks: "Diet and exercise advised",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [
      { testName: "Ultrasound Pelvis", status: "Completed" },
      { testName: "Hormone Panel", status: "Completed" }
    ],
    admitted: { 
      isAdmitted: true,
      ward: "Private Ward",
      bedNo: "PW-05",
      block: "Block A",
      dailyNotes: [
      {
        date: "2025-01-15",
        note: "Blood sugar high, insulin started"
      },
      {
        date: "2025-01-16",
        note: "Sugar levels improving"
      }
      ],
      dischargeStatus: "Under Treatment"
     }
  },

  {
    appointmentNumber: "APT-00133",
    patientId: "P000131",
    patient: {
      name: "Suresh Babu",
      age: 48,
      gender: "Male",
      contact: "9871234567",
      blood: "O+ve",
      reasonForAppointment: "General health check-up"
    },
    doctorName: "Dr. Mahesh Rao",
    doctorCategory: "Physician",
    appointmentType: "General Consultation",
    consultationType: "In-Person",
    date: "2025-01-13",
    timeSlot: "08:00 – 09:00 AM",
    status: "Cancelled",
    vitals: [],
    diagnosis: "",
    remarks: "",
    prescriptions: [],
    labReports: [],
    admitted: { 
      isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: ""
     }
  },

  {
    appointmentNumber: "APT-00134",
    patientId: "P000132",
    patient: {
      name: "Pooja Malhotra",
      age: 36,
      gender: "Female",
      contact: "9786543210",
      blood: "O+ve",
      reasonForAppointment: "Anxiety and sleep issues"
    },
    doctorName: "Dr. Swati Joshi",
    doctorCategory: "Psychiatrist",
    appointmentType: "Specialist Consultation",
    consultationType: "Online",
    date: "2025-01-14",
    timeSlot: "04:00 – 05:00 PM",
    status: "Completed",
    vitals: [
      { name: "Pulse Rate", value: 90, unit: "bpm", status: "High" }
    ],
    diagnosis: "Anxiety Disorder",
    remarks: "Counselling advised",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [],
    admitted: { isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: "" }
  },

  {
    appointmentNumber: "APT-00135",
    patientId: "P000133",
    patient: {
      name: "Naveen Chandra",
      age: 55,
      gender: "Male",
      contact: "9887766554",
      blood: "O+ve",
      reasonForAppointment: "High sugar levels"
    },
    doctorName: "Dr. Prakash N",
    doctorCategory: "Endocrinologist",
    appointmentType: "Follow-up",
    consultationType: "In-Person",
    date: "2025-01-15",
    timeSlot: "10:00 - 11:00 AM",
    status: "Completed",
    vitals: [
      { name: "Blood Sugar", value: 180, unit: "mg/dL", status: "High" }
    ],
    diagnosis: "Type 2 Diabetes",
    remarks: "Sugar monitoring advised",
    prescriptions: [
      {
        medicineName: "Paracetamol 650mg",
        frequency: ["Morning", "Night"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Ibuprofen 400mg",
        frequency: ["Morning", "Evening"],
        duration: "5 days",
        instructions: "After food"
      },
      {
        medicineName: "Amlodipine 5mg",
        frequency: ["Morning"],
        duration: "30 days",
        instructions: "Same time daily"
      },
      {
        medicineName: "Metformin 500mg",
        frequency: ["Morning", "Night"],
        duration: "30 days",
        instructions: "After food"
      }
    ],
    labReports: [
      { testName: "Blood Sugar Test", status: "Completed" },
      { testName: "HbA1c", status: "Pending" }
    ],
    admitted: { 
      isAdmitted: false,
      ward: "",
      bedNo: "",
      block: "",
      dailyNotes: [],
      dischargeStatus: ""
     }
  }
];

export const departmentDoctorData = [
  {
    department: "Cardiology",
    doctors: [
      "Dr. Meena Raj",
      "Dr. Ramesh Iyer",
      "Dr. Arjun Nair",
      "Dr. Kavitha Menon",
      "Dr. Suresh Pillai"
    ]
  },
  {
    department: "Neurology",
    doctors: [
      "Dr. Anitha Rao",
      "Dr. Ajay Kulkarni",
      "Dr. Mahesh Verma",
      "Dr. Priya Deshmukh",
      "Dr. Sanjay Joshi"
    ]
  },
  {
    department: "Orthopedics",
    doctors: [
      "Dr. Vikram Singh",
      "Dr. Sanjay Mehta",
      "Dr. Rohit Agarwal",
      "Dr. Neeraj Malhotra",
      "Dr. Karthik Subramanian"
    ]
  },
  {
    department: "Dermatology",
    doctors: [
      "Dr. Neha Verma",
      "Dr. Swati Joshi",
      "Dr. Aarti Kulkarni",
      "Dr. Pankaj Sharma",
      "Dr. Ritu Bansal"
    ]
  },
  {
    department: "Pediatrics",
    doctors: [
      "Dr. Lakshmi Devi",
      "Dr. Sunil Kumar",
      "Dr. Anjali Mehta",
      "Dr. Ramesh Chand",
      "Dr. Nivedita Rao"
    ]
  },
  {
    department: "Gynecology",
    doctors: [
      "Dr. Kavitha Reddy",
      "Dr. Anu Thomas",
      "Dr. Pooja Malhotra",
      "Dr. Shalini Gupta",
      "Dr. Deepa Menon"
    ]
  },
  {
    department: "Psychiatry",
    doctors: [
      "Dr. Swati Joshi",
      "Dr. Rahul Khanna",
      "Dr. Sneha Kapoor",
      "Dr. Aman Verma",
      "Dr. Nitin Bhat"
    ]
  },
  {
    department: "General Medicine",
    doctors: [
      "Dr. Suresh Patel",
      "Dr. Mahesh Rao",
      "Dr. Prakash N",
      "Dr. Vinod Kumar",
      "Dr. Ritu Sharma"
    ]
  }
];
