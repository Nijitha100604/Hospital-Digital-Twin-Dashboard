export const shiftData = [
  // --- Dr. John Smith (S000101) ---
  { staffId: "S000101", date: "2025-10-20", type: "Morning", location: "ICU" },
  { staffId: "S000101", date: "2025-10-21", type: "Morning", location: "ICU" },
  { staffId: "S000101", date: "2025-10-22", type: "Morning", location: "ICU" },
  { staffId: "S000101", date: "2025-10-23", type: "Leave", location: "-" }, // CONFLICT EXAMPLE 1 (Leave)
  { staffId: "S000101", date: "2025-10-24", type: "Night", location: "Emergency" }, // CONFLICT EXAMPLE 2 (Shift)

  // --- Sarah Johnson (S000102) ---
  { staffId: "S000102", date: "2025-10-20", type: "Evening", location: "Ward A" },
  { staffId: "S000102", date: "2025-10-21", type: "Evening", location: "Ward A" },
  { staffId: "S000102", date: "2025-10-25", type: "Leave", location: "-" },

  // --- Robert Brown (S000103) ---
  { staffId: "S000103", date: "2025-10-22", type: "Night", location: "Lab" },
  { staffId: "S000103", date: "2025-10-23", type: "Night", location: "Lab" },

  // --- Dr. Emily Davis (S000104) ---
  { staffId: "S000104", date: "2025-10-24", type: "Morning", location: "Neurology" },
  { staffId: "S000104", date: "2025-10-25", type: "Morning", location: "Neurology" },
];