import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  FaSearch,
  FaPrescriptionBottleAlt,
  FaUserMd,
  FaCalendarAlt,
  FaEye,
  FaTimes,
  FaFileDownload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCapsules,
  FaArrowRight,
  FaFilter,
  FaBan,
  FaShoppingCart,
} from "react-icons/fa";
import { MedicineContext } from "../../context/MedicineContext";
import Loading from "../Loading";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const PrescriptionList = () => {
  const {
    prescriptionQueue,
    fetchPrescriptionQueue,
    medicines,
    checkoutPrescription,
    loading,
  } = useContext(MedicineContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initial Fetch
  useEffect(() => {
    fetchPrescriptionQueue();
  }, [fetchPrescriptionQueue]);

  const filteredList = useMemo(() => {
    return prescriptionQueue.filter((item) => {
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSearch =
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.patientId &&
          item.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [prescriptionQueue, searchTerm, statusFilter]);

  /* ------------------ HELPER LOGIC ------------------ */

  const calculateRequiredQty = (frequency, duration) => {
    const dailyCount = Array.isArray(frequency) ? frequency.length : 0;
    const days = parseInt(duration) || 1;
    return dailyCount * days;
  };

  const getStockStatus = (medicineId, requiredQty) => {
    const stockItem = medicines.find((m) => m.medicineId === medicineId);
    if (!stockItem) return { available: 0, status: "Unknown" };

    return {
      available: stockItem.quantity,
      status: stockItem.quantity >= requiredQty ? "In Stock" : "Out of Stock",
    };
  };

  /* ------------------ HANDLERS ------------------ */

  const handleOpenModal = (prescription) => {
    setRemarks("");
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
    setIsProcessing(false);
  };

  const handleCheckout = async (status = "Dispensed") => {
    if (!selectedPrescription) return;

    let medicinesToDispense = [];
    if (status === "Dispensed") {
      medicinesToDispense = selectedPrescription.medicines.map((med) => {
        const qty = calculateRequiredQty(med.frequency, med.duration);
        return {
          medicineId: med.medicineId,
          medicineName: med.medicineName,
          quantityToDeduct: qty,
        };
      });

      const outOfStock = medicinesToDispense.filter((m) => {
        const stock = medicines.find((inv) => inv.medicineId === m.medicineId);
        return !stock || stock.quantity < m.quantityToDeduct;
      });

      if (outOfStock.length > 0) {
        const confirm = window.confirm(
          "Some medicines are Out of Stock. Proceeding will result in negative inventory. Continue?",
        );
        if (!confirm) return;
      }
    } else {
      const confirm = window.confirm(
        "Are you sure you want to CANCEL this prescription?",
      );
      if (!confirm) return;
    }

    setIsProcessing(true);

    const payload = {
      consultationId: selectedPrescription.consultationId,
      prescriptionId: selectedPrescription.prescriptionId,
      remarks: remarks,
      items: medicinesToDispense,
      status: status,
    };

    const success = await checkoutPrescription(payload);

    if (success) {
      if (status === "Cancelled") toast.info("Prescription Cancelled");
      handleCloseModal();
    } else {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedPrescription) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Prescription Slip", 14, 20);

    doc.setFontSize(10);
    doc.text(`Patient Name: ${selectedPrescription.patientName}`, 14, 30);
    doc.text(`Patient ID: ${selectedPrescription.patientId || "N/A"}`, 14, 35);
    doc.text(`Doctor: ${selectedPrescription.doctorName}`, 14, 40);
    doc.text(
      `Date: ${new Date(selectedPrescription.createdAt).toLocaleDateString()}`,
      14,
      45,
    );
    doc.text(`ID: ${selectedPrescription.appointmentId}`, 150, 30);

    const tableRows = selectedPrescription.medicines.map((med) => {
      const qty = calculateRequiredQty(med.frequency, med.duration);
      return [
        med.medicineName,
        med.instruction,
        med.frequency.join("-"),
        med.duration,
        qty,
      ];
    });

    autoTable(doc, {
      head: [["Medicine", "Instruction", "Frequency", "Duration", "Qty"]],
      body: tableRows,
      startY: 55,
      theme: "grid",
      headStyles: { fillColor: [134, 25, 143] },
    });

    if (remarks) {
      doc.text(
        `Pharmacist Remarks: ${remarks}`,
        14,
        doc.lastAutoTable.finalY + 10,
      );
    }

    doc.save(`RX_${selectedPrescription.patientName}.pdf`);
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl mb-8 flex flex-col md:flex-row justify-between items-center border border-gray-200 shadow-sm gap-4">
        <div className="mb-4 md:mb-0 w-full md:w-auto">
          <div className="flex gap-3 items-center">
            <FaShoppingCart className="text-gray-500 text-2xl" />

            <p className="text-gray-800 font-bold text-lg">
              Prescription Queue
            </p>
          </div>

          <p className="text-gray-500 text-sm mt-1">
            Manage pending prescriptions and dispense medicines
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto">
           {/* Search Bar */}
          <div className="relative flex-1 w-full sm:w-64">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, ID or Appt..."
              className="pl-10 pr-4 py-2.5 rounded-xl w-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Status Filter*/}

        </div>
      </div>

      
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredList.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3
                      className="font-bold text-gray-800 text-lg line-clamp-1"
                      title={item.patientName}
                    >
                      {item.patientName}
                    </h3>
                    <p className="text-[11px] text-gray-500  mt-0.5 font-medium">
                      PID: {item.patientId || "N/A"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-bold border shrink-0 ${
                      item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : item.status === "Dispensed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-50 text-red-600 border-red-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <p className="flex items-center gap-2 truncate">
                    <FaUserMd className="text-fuchsia-800" /> Dr.{" "}
                    {item.doctorName}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-fuchsia-900" />{" "}
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Medicine Preview */}
              <div className="px-5 py-4 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FaCapsules /> Medicines
                </p>
                <div className="space-y-2">
                  {item.medicines.slice(0, 2).map((med, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-sm text-gray-700 border-b border-dashed border-gray-100 pb-1"
                    >
                      <span className="truncate max-w-[70%] font-medium">
                        {med.medicineName}
                      </span>
                      <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 rounded">
                        {med.duration}
                      </span>
                    </div>
                  ))}
                  {item.medicines.length > 2 && (
                    <p className="text-[10px] text-fuchsia-800 font-bold mt-1 text-right cursor-default">
                      +{item.medicines.length - 2} more items
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer*/}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => handleOpenModal(item)}
                  disabled={item.status !== "Pending"}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer ${
                    item.status === "Pending"
                      ? "text-white bg-fuchsia-900 border hover:bg-fuchsia-800"
                      : "bg-gray-100 text-gray-400 border border-gray-700 cursor-not-allowed"
                  }`}
                >
                  {item.status === "Pending" ? (
                    <>
                      Checkout <FaArrowRight size={10} />
                    </>
                  ) : (
                    item.status
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
            <FaCheckCircle size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">All Caught Up!</h3>
          <p className="text-gray-500 mt-1">
            No prescriptions found matching the filters.
          </p>
        </div>
      )}

      {/* --- CHECKOUT MODAL --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn border border-gray-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fuchsia-50 rounded-lg text-fuchsia-700">
                  <FaPrescriptionBottleAlt size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Prescription Details
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    #{selectedPrescription.appointmentId}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-8">
              {/* Patient Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Patient Info
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {selectedPrescription.patientName}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    ID: {selectedPrescription.patientId || "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Prescribed By
                  </p>
                  <p className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <FaUserMd className="text-gray-400" />{" "}
                    {selectedPrescription.doctorName}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">
                    Prescribed Date
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {new Date(
                      selectedPrescription.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Medicine Table */}
              <div>
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-5 bg-fuchsia-600 rounded-full"></span>
                  Items to Dispense
                </h3>
                <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[11px] tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Medicine Info</th>
                        <th className="px-5 py-3">Frequency</th>
                        <th className="px-5 py-3 text-center">Qty</th>
                        <th className="px-5 py-3 text-center">Stock</th>
                        <th className="px-5 py-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedPrescription.medicines.map((med, idx) => {
                        const reqQty = calculateRequiredQty(
                          med.frequency,
                          med.duration,
                        );
                        const stockInfo = getStockStatus(
                          med.medicineId,
                          reqQty,
                        );
                        const isStockLow = stockInfo.available < reqQty;

                        return (
                          <tr
                            key={idx}
                            className="hover:bg-fuchsia-50/30 transition-colors"
                          >
                            <td className="px-5 py-3">
                              <p className="font-bold text-gray-800">
                                {med.medicineName}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {med.instruction}
                              </p>
                            </td>
                            <td className="px-5 py-3 text-gray-600">
                              <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs">
                                {med.frequency.join("-")}
                              </span>
                              <span className="text-xs text-gray-400 ml-2">
                                ({med.duration})
                              </span>
                            </td>
                            <td className="px-5 py-3 text-center font-bold text-fuchsia-700 bg-fuchsia-50/50">
                              {reqQty}
                            </td>
                            <td className="px-5 py-3 text-center text-gray-600 font-mono">
                              {stockInfo.available}
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${isStockLow ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"}`}
                              >
                                {isStockLow ? (
                                  <FaExclamationTriangle />
                                ) : (
                                  <FaCheckCircle />
                                )}
                                {stockInfo.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks Input */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                  Pharmacist Notes
                </label>
                <textarea
                  rows={2}
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none transition-all placeholder-gray-400"
                  placeholder="Add optional remarks about this transaction..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse sm:flex-row justify-between items-center rounded-b-2xl gap-4">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 text-gray-600 font-bold text-sm hover:text-gray-900 transition-colors bg-white border border-gray-300 px-4 py-2.5 rounded-lg shadow-sm w-full sm:w-auto justify-center cursor-pointer"
              >
                <FaFileDownload /> PDF Slip
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleCheckout("Cancelled")}
                  disabled={isProcessing}
                  className="px-6 py-2.5 border border-red-200 bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaBan size={14} /> Reject / Cancel
                </button>
                <button
                  onClick={() => handleCheckout("Dispensed")}
                  disabled={isProcessing}
                  className={`px-8 py-2.5 bg-fuchsia-800 text-white font-bold text-sm rounded-lg hover:bg-fuchsia-900 shadow-lg shadow-fuchsia-200 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer ${isProcessing ? "opacity-70 cursor-wait" : ""}`}
                >
                  {isProcessing ? "Dispensing..." : "Confirm Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionList;
