import React, { useContext, useState, useRef } from "react";
import {
  FaTimes,
  FaStar,
  FaEdit,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUniversity,
  FaTag,
  FaMoneyBill,
  FaFileAlt,
  FaBoxOpen,
  FaExternalLinkAlt,
  FaDownload,
  FaFileCsv 
} from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const ViewSupplierModal = ({ supplier, onClose, onEdit }) => {
  const reportRef = useRef(null); 
  
  if (!supplier) return null;

  const {
    supplierId,
    supplierName,
    status,
    rating,
    phone,
    email,
    address,
    category,
    taxId,
    paymentTerms,
    creditLimit,
    bankDetails,
    itemsSupplied,
    totalSupplies,
    documentUrl,
  } = supplier;

  const [visibleCount, setVisibleCount] = useState(10);
  const { userData } = useContext(AppContext);

  // --- PDF DOWNLOAD HANDLER ---
  const handleDownloadPdf = async () => {
    if (reportRef.current === null) return;

    try {
      const dataUrl = await toPng(reportRef.current, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2 
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Supplier_Profile_${supplierId}.pdf`);

    } catch (err) {
      console.error("PDF Export Error:", err);
    }
  };

  // --- CSV DOWNLOAD HANDLER ---
  const handleDownloadCsv = () => {
    if (!itemsSupplied || itemsSupplied.length === 0) {
      alert("No supplies to download.");
      return;
    }

    // Create CSV content: Header + Items
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Item Name\n" // Header
      + itemsSupplied.map(item => `"${item}"`).join("\n"); // Rows

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${supplierName}_Supplies.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
      
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn relative">
        
        {/* Header */}
        <div className="bg-fuchsia-900 text-white px-8 py-6 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">{supplierName}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${status === "Active" ? "bg-green-500/20 border-green-400 text-green-100" : "bg-red-500/20 border-red-400 text-red-100"}`}>
                {status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-fuchsia-200 text-sm">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">ID: {supplierId}</span>
              <div className="flex items-center gap-1">
                <span className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={14} className={i < Math.round(rating) ? "text-yellow-400" : "text-fuchsia-800/50"} />
                  ))}
                </span>
                <span className="ml-1 font-medium text-white">({rating})</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 cursor-pointer hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-8 overflow-y-auto bg-gray-50 flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SectionCard title="Contact Details">
              <div className="space-y-4">
                <ContactRow icon={<FaPhone className="text-blue-600" />} label="Phone" value={phone} />
                <ContactRow icon={<FaEnvelope className="text-red-500" />} label="Email" value={email} />
                <div className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <FaMapMarkerAlt className="text-orange-600 text-xl mt-1 shrink-0" />
                  <div className="text-gray-700 text-sm">
                    <p className="font-semibold text-gray-900">{address?.street}</p>
                    <p>{address?.city}, {address?.state} - {address?.zip}</p>
                    <p className="text-gray-500 font-medium mt-0.5">{address?.country}</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Business Info">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500 flex items-center gap-2"><FaTag className="text-yellow-600" /> Category</span>
                  <span className="font-medium text-gray-800">{category}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Tax ID / GST</span>
                  <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{taxId || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Payment Terms</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase">{paymentTerms}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-500 flex items-center gap-2"><FaMoneyBill className="text-green-600" /> Credit Limit</span>
                  <span className="text-lg font-bold text-gray-800">₹ {creditLimit?.toLocaleString()}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Banking Details">
              <div className="flex items-center gap-4 mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="p-3 bg-white rounded-full text-blue-700 shadow-sm"><FaUniversity size={20} /></div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Bank Name</p>
                  <p className="font-bold text-gray-900 text-lg">{bankDetails?.bankName || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase">Account Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 mt-1">{bankDetails?.accountNumber || "N/A"}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase">IFSC Code</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 mt-1">{bankDetails?.ifsc || "N/A"}</p>
                </div>
              </div>
            </SectionCard>

            <div className="md:col-span-2">
              <SectionCard title={`Product Catalog (${itemsSupplied?.length || 0})`}>
                
                {/* Download CSV Button inside the card header or content */}
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Preview</span>
                    <button
                        onClick={handleDownloadCsv}
                        className="text-xs cursor-pointer flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded hover:bg-green-100 transition-colors"
                        title="Download full list as CSV"
                    >
                        <FaFileCsv /> Download List
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {itemsSupplied?.length > 0 ? itemsSupplied.slice(0, visibleCount).map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm">{item}</span>
                  )) : <p className="text-gray-400 italic text-sm">No items listed.</p>}
                  
                  {itemsSupplied?.length > visibleCount && (
                    <button 
                        onClick={() => setVisibleCount(itemsSupplied.length)}
                        className="text-xs text-blue-600 underline self-center ml-2"
                    >
                        Show All
                    </button>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-white px-8 py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4 shrink-0">
          {/* DOWNLOAD BUTTON */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm group"
          >
            <FaDownload className="text-gray-400 group-hover:text-blue-500" />
            Download Details
          </button>

          {userData && (userData?.designation === 'Pharmacist'|| userData.designation === 'Admin') && (
            <button onClick={onEdit} className="flex items-center cursor-pointer justify-center gap-2 px-8 py-2.5 bg-fuchsia-900 text-white font-medium rounded-lg hover:bg-fuchsia-800 shadow-md hover:shadow-lg transition-all transform active:scale-95">
              <FaEdit /> Edit Details
            </button>
          )}
        </div>
      </div>

      {/* HIDDEN REPORT UI (Off-screen for PDF generation)  */}
      <div style={{ position: "fixed", top: 0, left: "-9999px", width: "800px" }}>
        <div ref={reportRef} className="p-8 bg-white text-gray-800 border border-gray-300">
          
          {/* Report Header */}
          <div className="flex justify-between items-start mb-8 border-b-2 border-fuchsia-800 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-fuchsia-900">City Care Hospital</h1>
              <p className="text-sm text-gray-500 font-medium tracking-wide">Supplier Profile & Agreement Record</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-600">Generated: {new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">Supplier ID: {supplierId}</p>
            </div>
          </div>

          {/* Supplier Basic Info */}
          <div className="bg-fuchsia-50 rounded-lg p-6 mb-8 border border-fuchsia-100">
            <h2 className="text-xl font-bold text-fuchsia-900 mb-4">{supplierName}</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-12 text-sm">
                <div><span className="text-gray-500 font-semibold block">Category:</span> {category}</div>
                <div><span className="text-gray-500 font-semibold block">Status:</span> {status}</div>
                <div><span className="text-gray-500 font-semibold block">Rating:</span> {rating} / 5.0</div>
                <div><span className="text-gray-500 font-semibold block">Total Supplies:</span> {totalSupplies}</div>
            </div>
          </div>

          {/* Detailed Tables Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            
            {/* Column 1: Contact & Address */}
            <div>
               <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Contact Information</h3>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="font-medium">{email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium">{phone}</span></div>
                  <div className="mt-2">
                    <span className="text-gray-500 block mb-1">Address:</span> 
                    <span className="font-medium block bg-gray-50 p-2 rounded">{address?.street}, {address?.city}, {address?.state} - {address?.zip}, {address?.country}</span>
                  </div>
               </div>
            </div>

            {/* Column 2: Financials */}
            <div>
               <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Financial Details</h3>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Tax ID:</span> <span className="font-mono">{taxId}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Credit Limit:</span> <span className="font-bold">₹{creditLimit?.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Terms:</span> <span className="bg-blue-50 text-blue-800 px-2 rounded text-xs font-bold">{paymentTerms}</span></div>
                  
                  <div className="mt-4 pt-2 border-t border-gray-100">
                    <p className="text-gray-500 mb-1 text-xs uppercase font-bold">Banking</p>
                    <p className="font-bold text-gray-800">{bankDetails?.bankName}</p>
                    <p className="text-xs text-gray-600 font-mono">AC: {bankDetails?.accountNumber}</p>
                    <p className="text-xs text-gray-600 font-mono">IFSC: {bankDetails?.ifsc}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="mb-12">
             <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Product Catalog Preview</h3>
             <div className="flex flex-wrap gap-2">
                {itemsSupplied?.slice(0, 20).map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-gray-300 text-gray-600 text-xs rounded-full">{item}</span>
                ))}
                {itemsSupplied?.length > 20 && <span className="text-xs text-gray-400 self-center">...and {itemsSupplied.length - 20} more</span>}
             </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between mt-20 pt-8 border-t border-gray-300">
             <div className="text-center">
                <p className="w-48 border-b border-gray-400 mb-2"></p>
                <p className="text-xs text-gray-500 font-bold uppercase">Authorized Hospital Signatory</p>
             </div>
             <div className="text-center">
                <p className="w-48 border-b border-gray-400 mb-2"></p>
                <p className="text-xs text-gray-500 font-bold uppercase">Supplier Representative</p>
             </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-[10px] text-gray-400 border-t pt-2">
             <p>This document is electronically generated by the Hospital Digital Twin System.</p>
             <p>City Care Hospital • Contact: support@citycare.com</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ViewSupplierModal;

/* ---------- Internal helpers  ---------- */
const SectionCard = ({ title, children }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 h-full flex flex-col">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
      <span>{title}</span>
    </h3>
    <div className="flex-1">{children}</div>
  </div>
);

const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-lg text-gray-500">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate">{value || "N/A"}</p>
    </div>
  </div>
);