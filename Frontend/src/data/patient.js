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
    patientName: "Arun Kumar",
    patientId: "P000123",
    patientContact: "9876543210",
    doctorName: "Dr. Meena Raj",
    doctorCategory: "Cardiologist",
    appointmentType: "In-Person",
    date: "05 Jan 2025",
    status: "Scheduled"
  },
  {
    appointmentNumber: "APT-00126",
    patientName: "Priya Sharma",
    patientId: "P000124",
    patientContact: "9123456789",
    doctorName: "Dr. Suresh Patel",
    doctorCategory: "General Physician",
    appointmentType: "Online",
    date: "06 Jan 2025",
    status: "Completed"
  },
  {
    appointmentNumber: "APT-00127",
    patientName: "Ravi Teja",
    patientId: "P000125",
    patientContact: "9988776655",
    doctorName: "Dr. Anitha Rao",
    doctorCategory: "Neurologist",
    appointmentType: "In-Person",
    date: "07 Jan 2025",
    status: "Cancelled"
  },
  {
    appointmentNumber: "APT-00128",
    patientName: "Sneha Iyer",
    patientId: "P000126",
    patientContact: "9090909090",
    doctorName: "Dr. Vikram Singh",
    doctorCategory: "Orthopedic",
    appointmentType: "Online",
    date: "08 Jan 2025",
    status: "Scheduled"
  },
  {
    appointmentNumber: "APT-00129",
    patientName: "Karthik Anand",
    patientId: "P000127",
    patientContact: "9345678123",
    doctorName: "Dr. Neha Verma",
    doctorCategory: "Dermatologist",
    appointmentType: "In-Person",
    date: "09 Jan 2025",
    status: "Rescheduled"
  },
  {
    appointmentNumber: "APT-00130",
    patientName: "Divya Nair",
    patientId: "P000128",
    patientContact: "9567891234",
    doctorName: "Dr. Ramesh Iyer",
    doctorCategory: "Cardiologist",
    appointmentType: "Online",
    date: "10 Jan 2025",
    status: "Completed"
  },
  {
    appointmentNumber: "APT-00131",
    patientName: "Mohammed Faisal",
    patientId: "P000129",
    patientContact: "9898989898",
    doctorName: "Dr. Kavitha Menon",
    doctorCategory: "Pulmonologist",
    appointmentType: "In-Person",
    date: "11 Jan 2025",
    status: "Scheduled"
  },
  {
    appointmentNumber: "APT-00132",
    patientName: "Anjali Gupta",
    patientId: "P000130",
    patientContact: "9012345678",
    doctorName: "Dr. Rahul Khanna",
    doctorCategory: "Gynecologist",
    appointmentType: "Online",
    date: "12 Jan 2025",
    status: "Completed"
  },
  {
    appointmentNumber: "APT-00133",
    patientName: "Suresh Babu",
    patientId: "P000131",
    patientContact: "9871234567",
    doctorName: "Dr. Mahesh Rao",
    doctorCategory: "General Physician",
    appointmentType: "In-Person",
    date: "13 Jan 2025",
    status: "Cancelled"
  },
  {
    appointmentNumber: "APT-00134",
    patientName: "Pooja Malhotra",
    patientId: "P000132",
    patientContact: "9786543210",
    doctorName: "Dr. Swati Joshi",
    doctorCategory: "Psychiatrist",
    appointmentType: "Online",
    date: "14 Jan 2025",
    status: "Scheduled"
  },
  {
    appointmentNumber: "APT-00135",
    patientName: "Naveen Chandra",
    patientId: "P000133",
    patientContact: "9887766554",
    doctorName: "Dr. Prakash N",
    doctorCategory: "Endocrinologist",
    appointmentType: "In-Person",
    date: "15 Jan 2025",
    status: "Completed"
  },
  {
    appointmentNumber: "APT-00136",
    patientName: "Aishwarya Raj",
    patientId: "P000134",
    patientContact: "9001122334",
    doctorName: "Dr. Lakshmi Devi",
    doctorCategory: "Pediatrician",
    appointmentType: "Online",
    date: "16 Jan 2025",
    status: "Scheduled"
  },
  {
    appointmentNumber: "APT-00137",
    patientName: "Vinoth Kumar",
    patientId: "P000135",
    patientContact: "9445566778",
    doctorName: "Dr. Sanjay Mehta",
    doctorCategory: "Urologist",
    appointmentType: "In-Person",
    date: "17 Jan 2025",
    status: "Rescheduled"
  },
  {
    appointmentNumber: "APT-00138",
    patientName: "Keerthana S",
    patientId: "P000136",
    patientContact: "9654321789",
    doctorName: "Dr. Harini Prasad",
    doctorCategory: "ENT",
    appointmentType: "Online",
    date: "18 Jan 2025",
    status: "Completed"
  },
  {
    appointmentNumber: "APT-00139",
    patientName: "Balaji R",
    patientId: "P000137",
    patientContact: "9797979797",
    doctorName: "Dr. Ajay Kulkarni",
    doctorCategory: "Neurologist",
    appointmentType: "In-Person",
    date: "19 Jan 2025",
    status: "Scheduled"
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
