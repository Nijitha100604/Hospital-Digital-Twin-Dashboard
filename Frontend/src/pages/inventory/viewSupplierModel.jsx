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
  } = supplier;

//   To paginating supplies
  const [visibleCount, setVisibleCount] = useState(10);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="bg-fuchsia-900 text-white p-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold flex flex-wrap gap-2 items-center">
              <span className="">{supplierName}</span>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  status === "Active" ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {status}
              </span>
            </h2>

            <p className="text-sm mt-1">Supplier ID: {supplierId}</p>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2 text-sm">{rating} / 5</span>
            </div>
          </div>

          <button onClick={onClose} className="self-end sm:mb-3">
            <FaTimes className="text-xl cursor-pointer" />
          </button>
        </div>

        {/* CONTENT (SCROLLABLE) */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">

          {/* CONTACT */}
          <InfoCard title="Contact Information">
            <p className="flex  items-center text-[16px] gap-2 break-all">
              <FaPhone  className="text-blue-600 text-xl"/> {phone}
            </p>
            <p className="flex items-center gap-2 text-[16px] break-all">
              <FaEnvelope className="text-red-500  text-xl" /> {email}
            </p>
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="mt-1 text-orange-600 text-xl shrink-0" />
              <div className="text-[16px]">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} - {address.zip}
                </p>
                <p>{address.country}</p>
              </div>
            </div>
          </InfoCard>

          {/* BUSINESS */}
          <InfoCard title="Business Details">
            <p className="flex items-center gap-2 text-[16px]">
              <FaTag className="text-yellow-600 text-xl" /> Category: {category}
            </p>
            <p className="text-[16px]">GST / Tax ID: {taxId}</p>
            <p className="text-[16px]">Payment Terms: {paymentTerms}</p>
            <p className="flex items-center text-[16px] gap-2">
              <FaMoneyBill className="text-xl text-green-700" /> Credit Limit: ₹{creditLimit}
            </p>
          </InfoCard>

          {/* BANKING */}
          <InfoCard title="Banking Details">
            <p className="flex items-center gap-2 text-[16px]">
              <FaUniversity className="text-red-800 text-xl" /> Bank: {bankDetails.bankName}
            </p>
            <p className="text-[16px]">Account No: {bankDetails.accountNumber}</p>
            <p className="text-[16px]">IFSC: {bankDetails.ifsc}</p>
          </InfoCard>

          {/* SUPPLY STATS */}
          <InfoCard title="Supply Statistics">
            <p className="text-[16px] p-3">Total Items Supplied: 
                <div className="text-blue-800 text-2xl">
                    {totalSupplies}
                </div>
            </p>
          </InfoCard>

          {/* SUPPLIES */}
          <div className="md:col-span-2">
  <InfoCard title="Items Supplied">
    <div className="flex flex-wrap gap-2">
      {itemsSupplied?.length > 0 ? (
        <>
          {itemsSupplied
            .slice(0, visibleCount)
            .map((item, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-100 border text-purple-700 text-xs rounded-md"
              >
                {item}
              </span>
            ))}

          {/* SEE MORE BUTTON */}
          {itemsSupplied.length > visibleCount && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="text-xs px-3 py-1 border border-purple-600 text-purple-700 rounded-md hover:bg-purple-100"
            >
              See more
            </button>
          )}
        </>
      ) : (
        <p className="text-sm text-gray-500">No items listed</p>
      )}
    </div>
  </InfoCard>
</div>

        </div>

        {/* FOOTER */}
        <div className="p-4 flex justify-end text-gray-400 border-t">
          <button
            onClick={onEdit}
            className="bg-fuchsia-900 cursor-pointer hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md flex gap-2 w-full sm:w-auto justify-center"
          >
            <FaEdit /> Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplierModal;

/* ---------- Helper Component ---------- */

const InfoCard = ({ title, children }) => (
  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
    <p className="font-semibold mb-2">{title}</p>
    <div className="text-md  text-gray-700 space-y-3">{children}</div>
  </div>
);
