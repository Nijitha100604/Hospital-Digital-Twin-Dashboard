import React, { useState } from "react";
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
} from "react-icons/fa";

const ViewSupplierModal = ({ supplier, onClose, onEdit }) => {
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

  // Pagination for supplies tags
  const [visibleCount, setVisibleCount] = useState(10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="bg-fuchsia-900 text-white px-8 py-6 flex justify-between items-start shrink-0">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold tracking-tight">{supplierName}</h2>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border ${
                  status === "Active"
                    ? "bg-green-500/20 border-green-400 text-green-100"
                    : "bg-red-500/20 border-red-400 text-red-100"
                }`}
              >
                {status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-fuchsia-200 text-sm">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">ID: {supplierId}</span>
              
              <div className="flex items-center gap-1">
                <span className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={i < Math.round(rating) ? "text-yellow-400" : "text-fuchsia-800/50"}
                    />
                  ))}
                </span>
                <span className="ml-1 font-medium text-white">({rating})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 cursor-pointer hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-gray-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact card */}
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

            {/* Business card */}
            <SectionCard title="Business Info">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <FaTag className="text-yellow-600" /> Category
                  </span>
                  <span className="font-medium text-gray-800">{category}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Tax ID / GST</span>
                  <span className="font-mono text-sm text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                    {taxId || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-sm text-gray-500">Payment Terms</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase">
                    {paymentTerms}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMoneyBill className="text-green-600" /> Credit Limit
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    ₹ {creditLimit?.toLocaleString()}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Banking card*/}
            <SectionCard title="Banking Details">
              <div className="flex items-center gap-4 mb-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="p-3 bg-white rounded-full text-blue-700 shadow-sm">
                  <FaUniversity size={20} />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Bank Name</p>
                  <p className="font-bold text-gray-900 text-lg">{bankDetails?.bankName || "N/A"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase">Account Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 mt-1">
                    {bankDetails?.accountNumber || "N/A"}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-400 uppercase">IFSC Code</p>
                  <p className="font-mono text-sm font-semibold text-gray-700 mt-1">
                    {bankDetails?.ifsc || "N/A"}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Statistics card*/}
            <SectionCard title="Performance">
              <div className="flex flex-col items-center justify-center h-full py-2">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-3">
                  <FaBoxOpen size={28} />
                </div>
                <p className="text-4xl font-extrabold text-gray-800">{totalSupplies}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Total Items Supplied</p>
              </div>
            </SectionCard>

            {/* Catlog*/}
            <div className="md:col-span-2">
              <SectionCard title={`Product Catalog (${itemsSupplied?.length || 0})`}>
                <div className="flex flex-wrap gap-2 pt-2">
                  {itemsSupplied?.length > 0 ? (
                    <>
                      {itemsSupplied.slice(0, visibleCount).map((item, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                      {itemsSupplied.length > visibleCount && (
                        <button
                          onClick={() => setVisibleCount((prev) => prev + 10)}
                          className="px-3 py-1.5 bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200 rounded-md text-sm font-medium hover:bg-fuchsia-100 transition-colors"
                        >
                          + {itemsSupplied.length - visibleCount} more
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 italic text-sm py-2">No items listed in the catalog.</p>
                  )}
                </div>
              </SectionCard>
            </div>

          </div>
        </div>

        {/* buttons */}
        <div className="bg-white px-8 py-5 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4 shrink-0">
          
          {/* view document*/}
          {documentUrl ? (
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm group"
            >
              <FaFileAlt className="text-gray-400 group-hover:text-blue-500" />
              View Document
              <FaExternalLinkAlt size={12} className="text-gray-300 group-hover:text-blue-400" />
            </a>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 border border-gray-200 text-gray-400 font-medium rounded-lg cursor-not-allowed"
              title="No valid document attached"
            >
              <FaFileAlt /> No Document
            </button>
          )}

          {/* edit button */}
          <button
            onClick={onEdit}
            className="flex items-center cursor-pointer justify-center gap-2 px-8 py-2.5 bg-fuchsia-900 text-white font-medium rounded-lg hover:bg-fuchsia-800 shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <FaEdit /> Edit Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewSupplierModal;

/* ---------- Internal helpers  ---------- */

const SectionCard = ({ title, children }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
      {title}
    </h3>
    <div className="flex-1">{children}</div>
  </div>
);

const ContactRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 group">
    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-lg group-hover:bg-gray-100 transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800 truncate" title={value}>
        {value || "N/A"}
      </p>
    </div>
  </div>
);