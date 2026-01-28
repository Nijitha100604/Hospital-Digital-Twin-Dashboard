import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaPrescriptionBottleAlt,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaFileDownload,
  FaUserMd,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import Loading from "../Loading";

/* ---------------- DUMMY DATA ---------------- */
const dummyPrescriptions = [
  {
    consultationId: "CON-00045",
    appointmentId: "APT-20241020-01",
    patientId: "PAT-0012",
    patientName: "John Doe",
    date: "2024-10-25T10:30:00.000Z",
    medicines: [
      {
        medicineId: "MED001",
        name: "Paracetamol",
        instruction: "After food",
        frequency: ["Morning", "Night"],
        duration: "5 Days",
        quantityNeeded: 10,
        availableStock: 150,
        inStock: true,
      },
      {
        medicineId: "MED002",
        name: "Amoxicillin",
        instruction: "Complete the course",
        frequency: ["Morning", "Afternoon", "Night"],
        duration: "7 Days",
        quantityNeeded: 21,
        availableStock: 5, // Less than needed
        inStock: false, 
      },
    ],
  },
  {
    consultationId: "CON-00046",
    appointmentId: "APT-20241020-05",
    patientId: "PAT-0034",
    patientName: "Sarah Smith",
    date: "2024-10-25T11:15:00.000Z",
    medicines: [
      {
        medicineId: "MED005",
        name: "Ibuprofen",
        instruction: "Take for pain only",
        frequency: ["As Needed"],
        duration: "3 Days",
        quantityNeeded: 6,
        availableStock: 50,
        inStock: true,
      },
    ],
  },
  {
    consultationId: "CON-00047",
    appointmentId: "APT-20241020-08",
    patientId: "PAT-0056",
    patientName: "Michael Brown",
    date: "2024-10-25T12:00:00.000Z",
    medicines: [
      {
        medicineId: "MED010",
        name: "Metformin",
        instruction: "Before food",
        frequency: ["Morning"],
        duration: "30 Days",
        quantityNeeded: 30,
        availableStock: 200,
        inStock: true,
      },
      {
        medicineId: "MED012",
        name: "Atorvastatin",
        instruction: "At night",
        frequency: ["Night"],
        duration: "30 Days",
        quantityNeeded: 30,
        availableStock: 0, // Out of stock
        inStock: false,
      }
    ],
  }
];

/* ---------------- COMPONENT ---------------- */

const PrescriptionList = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // Simulate Fetching Data
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setQueue(dummyPrescriptions);
      setLoading(false);
    }, 800);
  }, []);

  // Handle Checkout (Simulation)
  const handleCheckout = async (prescription) => {
    // 1. Check for stock issues
    const outOfStockItems = prescription.medicines.filter((m) => !m.inStock);
    
    if (outOfStockItems.length > 0) {
      const confirm = window.confirm(
        `Warning: ${outOfStockItems.length} items are OUT OF STOCK. Continue checkout anyway?`
      );
      if (!confirm) return;
    }

    setProcessingId(prescription.consultationId);

    // Simulate API Call
    setTimeout(() => {
      toast.success(`Prescription dispensed for ${prescription.patientName}!`);
      // Remove item from local list to simulate "Done"
      setQueue((prev) => prev.filter((item) => item.consultationId !== prescription.consultationId));
      setProcessingId(null);
    }, 1500);
  };

  // Generate PDF
  const handleDownloadPDF = (prescription) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Prescription / Medication List", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Patient: ${prescription.patientName}`, 14, 30);
    doc.text(`Date: ${new Date(prescription.date).toLocaleDateString()}`, 14, 35);
    doc.text(`ID: ${prescription.appointmentId}`, 14, 40);

    const tableRows = prescription.medicines.map(m => [
      m.name,
      m.instruction,
      `${Array.isArray(m.frequency) ? m.frequency.join("-") : m.frequency} (${m.duration})`,
      m.quantityNeeded
    ]);

    autoTable(doc, {
      head: [["Medicine", "Instruction", "Dosage", "Qty"]],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [75, 85, 99] },
    });

    doc.save(`Prescription_${prescription.patientName}.pdf`);
  };

  // Filter Logic
  const filteredQueue = queue.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.appointmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="bg-white p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm gap-4">
        <div>
          <div className="flex gap-3 items-center mb-1">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <FaClipboardList size={20} />
            </div>
            <h1 className="font-bold text-2xl text-gray-800">Pharmacy Queue</h1>
          </div>
          <p className="text-gray-500 text-sm ml-11">
            Manage dispensions and track inventory in real-time
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patient or appointment ID..."
            className="pl-10 pr-4 py-2.5 rounded-xl w-full border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- QUEUE LIST --- */}
      {filteredQueue.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredQueue.map((item) => (
            <div 
              key={item.consultationId} 
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {item.patientName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{item.patientName}</h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FaUserMd /> {item.appointmentId}</span>
                      <span className="flex items-center gap-1"><FaCalendarAlt /> {new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleDownloadPDF(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaFileDownload /> Download List
                  </button>
                  <button 
                    onClick={() => handleCheckout(item)}
                    disabled={processingId === item.consultationId}
                    className={`flex items-center gap-2 px-6 py-2 text-white rounded-lg text-sm font-bold shadow-sm transition-all ${
                      processingId === item.consultationId 
                        ? "bg-gray-400 cursor-wait" 
                        : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                    }`}
                  >
                    {processingId === item.consultationId ? "Processing..." : "Checkout & Dispense"}
                  </button>
                </div>
              </div>

              {/* Medicine Table */}
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Medicine Name</th>
                      <th className="px-4 py-3 font-semibold">Dosage / Freq</th>
                      <th className="px-4 py-3 font-semibold text-center">Required</th>
                      <th className="px-4 py-3 font-semibold text-center">Available Stock</th>
                      <th className="px-4 py-3 font-semibold text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {item.medicines.map((med, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {med.name}
                          <p className="text-xs text-gray-400 font-normal mt-0.5">{med.instruction}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">
                            {Array.isArray(med.frequency) ? med.frequency.join("-") : med.frequency}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">({med.duration})</span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-gray-700">
                          {med.quantityNeeded}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600 font-mono">
                          {med.availableStock}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {med.inStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                              <FaCheckCircle /> In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 animate-pulse">
                              <FaTimesCircle /> Out of Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 border-dashed text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FaPrescriptionBottleAlt className="text-gray-300 text-4xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Pending Prescriptions</h3>
          <p className="text-gray-500 max-w-sm">
            Great job! All prescriptions have been dispensed. New orders from doctors will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;