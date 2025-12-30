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
