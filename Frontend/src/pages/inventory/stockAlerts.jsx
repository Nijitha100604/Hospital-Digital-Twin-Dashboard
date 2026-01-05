import React, { useState, useMemo } from "react";
import {
  FaExclamationTriangle,
  FaCalendarAlt,
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaEye,
  FaBoxOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { medicine_records } from "../../data/medicine";
import { purchase_orders } from "../../data/purchaseOrders";


const StockAlerts = () => {
  const navigate = useNavigate();
  const today = new Date();

  const [search, setSearch] = useState("");
  const [urgencySort, setUrgencySort] = useState("ALL");

  /* ---------- Date helpers ---------- */
  const parseDate = (d) => new Date(d);
  const daysLeft = (d) =>
    Math.ceil((parseDate(d) - today) / (1000 * 60 * 60 * 24));

  /* ---------- Live search ---------- */
  const filteredMedicines = useMemo(() => {
    return medicine_records.filter(
      (m) =>
        m.medicineName.toLowerCase().includes(search.toLowerCase()) ||
        m.medicineId.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  /* ---------- Alert logic (NO duplicates) ---------- */
  const critical = filteredMedicines.filter(
    (m) => m.quantity <= m.minimumThreshold / 2
  );

  const lowStock = filteredMedicines.filter(
    (m) =>
      m.quantity < m.minimumThreshold &&
      m.quantity > m.minimumThreshold / 2 &&
      !critical.includes(m)
  );

  const expiringSoon = filteredMedicines.filter((m) => {
    const d = daysLeft(m.expiryDate);
    return d > 0 && d <= 90 && !critical.includes(m) && !lowStock.includes(m);
  });

  const showCritical = urgencySort === "ALL" || urgencySort === "CRITICAL";
  const showLow = urgencySort === "ALL" || urgencySort === "LOW";
  const showExpiry = urgencySort === "ALL" || urgencySort === "EXPIRY";

  const [lowLimit, setLowLimit] = useState(3);
  const [critLimit, setCritLimit] = useState(3);
  const [expLimit, setExpLimit] = useState(3);

  return (
    <>
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg mb-4 flex justify-between items-center border border-gray-300 shadow">
        <div>
          <div className="flex gap-3 items-center">
            <FaExclamationTriangle className="text-gray-500 text-xl" />
            <p className="font-bold text-lg">Low Stock and Expiry Alerts</p>
          </div>
          <p className="text-sm text-gray-500">
            Items requiring urgent attention
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-6">
        <SummaryCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={<FaExclamationTriangle className="text-yellow-600 text-xl" />}
          iconBg="bg-yellow-200"
        />
        <SummaryCard
          title="Expiring Soon"
          value={expiringSoon.length}
          icon={<FaCalendarAlt className="text-orange-600 text-xl" />}
          iconBg="bg-orange-200"
        />
        <SummaryCard
          title="Critical Alerts"
          value={critical.length}
          icon={<FaExclamationTriangle className="text-red-600 text-xl" />}
          iconBg="bg-red-200"
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-5 mb-6">
        {/* Search */}
        <div className="relative w-full flex-1 md:w-80">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by medicine, ID or category"
            className="pl-10 pr-3 py-2 rounded-md w-full border bg-gray-300 border-gray-400 focus:ring-1 focus:ring-fuchsia-600 outline-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort / Urgency Filter */}
        <div className="flex gap-5">
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              className="pl-9 h-10 pr-3 rounded-md outline-0 border border-gray-400"
              value={urgencySort}
              onChange={(e) => setUrgencySort(e.target.value)}
            >
              <option
                className="text-white font-medium bg-fuchsia-500"
                value="ALL"
              >
                All Alerts
              </option>
              <option
                className="text-white font-medium bg-fuchsia-500"
                value="CRITICAL"
              >
                Critical
              </option>
              <option
                className="text-white font-medium bg-fuchsia-500"
                value="LOW"
              >
                Low Stock
              </option>
              <option
                className="text-white font-medium bg-fuchsia-500"
                value="EXPIRY"
              >
                Expiring Soon
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* CRITICAL */}
      {showCritical && (
        <Section
          title="Critical Alerts"
          badge={`${critical.length} Critical`}
          badgeColor="bg-red-100 text-red-700"
        >
          {critical.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {critical.slice(0, critLimit).map((m) => (
                <StockCard
                  key={m.medicineId}
                  medicine={m}
                  severity="Critical"
                />
              ))}
              {critLimit < critical.length && (
                <SeeMore onClick={() => setCritLimit(critLimit + 3)} />
              )}
            </>
          )}
        </Section>
      )}
      {/* LOW STOCK */}
      {showLow && (
        <Section
          title="Low Stock Alerts"
          badge={`${lowStock.length} Items`}
          badgeColor="bg-yellow-100 text-yellow-700"
        >
          {lowStock.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {lowStock.slice(0, lowLimit).map((m) => (
                <StockCard key={m.medicineId} medicine={m} severity="Medium" />
              ))}
              {lowLimit < lowStock.length && (
                <SeeMore onClick={() => setLowLimit(lowLimit + 3)} />
              )}
            </>
          )}
        </Section>
      )}

      {/* EXPIRING SOON */}
      {showExpiry && (
        <Section
          className="bg-gray-300"
          title="Expiring Soon"
          badge={`${expiringSoon.length} Items Expiring Soon`}
          badgeColor="bg-orange-100 text-orange-700"
        >
          {expiringSoon.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {expiringSoon.slice(0, expLimit).map((m) => (
                <ExpiryCard
                  key={m.medicineId}
                  medicine={m}
                  days={daysLeft(m.expiryDate)}
                />
              ))}
              {expLimit < expiringSoon.length && (
                <SeeMore onClick={() => setExpLimit(expLimit + 3)} />
              )}
            </>
          )}
        </Section>
      )}
    </>
  );
};

export default StockAlerts;

/* ================= UI COMPONENTS ================= */

const SummaryCard = ({ title, value, icon, iconBg }) => (
  <div className="bg-white rounded-lg border border-gray-300 p-4 flex md:flex-c justify-between items-center shadow">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    <div className={`p-3 border border-gray-300 rounded-lg ${iconBg}`}>
      {icon}
    </div>
  </div>
);

const Section = ({ title, badge, badgeColor, children }) => (
  <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6 shadow">
    <div className="flex justify-between items-center mb-4">
      <p className="font-semibold text-lg">{title}</p>
      <span className={`text-sm px-3 py-1 rounded-lg ${badgeColor}`}>
        {badge}
      </span>
    </div>
    <div className="space-y-5">{children}</div>
  </div>
);

const StockCard = ({ medicine, severity }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`border rounded-lg p-5 ${
        severity === "Critical" ? "border-red-300" : "border-yellow-300"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div>
            <div className="flex gap-2">
              <div
                className={`${
                  severity === "Critical"
                    ? "bg-red-200 border border-red-300 rounded p-3"
                    : " bg-yellow-200 border p-3 rounded border-yellow-300"
                }`}
              >
                <FaExclamationTriangle
                  className={`${
                    severity === "Critical" ? "text-red-600" : "text-yellow-600"
                  } text-xl`}
                />
              </div>
              <p className="font-semibold text-lg mt-2">
                {medicine.medicineName} {medicine.strength}
              </p>
            </div>

            <p className="text-md text-gray-500">
              {medicine.medicineId} • {medicine.category}
            </p>
          </div>
        </div>

        <span
          className={`text-md px-3 py-1 rounded-lg ${
            severity === "Critical"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {severity}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-md mt-4">
        <Info
          label="Current Stock"
          value={`${medicine.quantity} units`}
          danger
        />
        <Info
          label="Minimum Required"
          value={`${medicine.minimumThreshold} units`}
        />
        <Info label="Supplier" value={medicine.supplierName} />
        <Info label="Expiry Date" value={medicine.expiryDate} />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={() =>
            navigate("/create-purchase-order", {
              state: { medicineId: medicine.medicineId },
            })
          }
          className="flex cursor-pointer items-center gap-2 bg-fuchsia-900 hover:bg-fuchsia-800 text-white px-4 py-2 rounded-md text-sm"
        >
          <FaShoppingCart />
          Create Purchase Order
        </button>

        <button
          onClick={() => navigate(`/medicine-details/${medicine.medicineId}`)}
          className="flex cursor-pointer items-center gap-2 border border-gray-400 text-fuchsia-800 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
        >
          <FaEye />
          View Details
        </button>
      </div>
    </div>
  );
};

const ExpiryCard = ({ medicine, days }) => {
  const navigate = useNavigate();

  return (
    <div className="border border-orange-300 rounded-lg p-5">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div>
            <div className="flex gap-2">
              <div className="p-3 border border-orange-300 bg-orange-200 rounded-lg">
                <FaCalendarAlt className="text-orange-600 text-xl" />
              </div>
              <p className="font-semibold text-xl mt-2">
                {medicine.medicineName} {medicine.strength}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {medicine.medicineId} • {medicine.batchNumber}
            </p>
          </div>
        </div>

        <span className="bg-orange-100 text-orange-700 text-md px-3 py-2 rounded-lg">
          {days} days left
        </span>
      </div>

      {/* DETAILS (MATCHES OTHER CARDS STRUCTURE) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-md mt-4">
        <Info label="Current Stock" value={`${medicine.quantity} units`} />
        <Info label="Expiry Date" value={medicine.expiryDate} danger />
        <Info label="Category" value={medicine.category} />
      </div>

      {/* ACTION */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate(`/medicine-details/${medicine.medicineId}`)}
          className="flex items-center gap-2 border border-gray-400 text-fuchsia-800 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
        >
          <FaEye />
          View Details
        </button>
      </div>
    </div>
  );
};

const Info = ({ label, value, danger }) => (
  <div>
    <p className="text-sm pb-2 text-gray-500">{label}</p>
    <p className={`font-medium ${danger ? "text-red-600" : ""}`}>{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
    <FaBoxOpen className="mx-auto text-6xl text-gray-400 mb-2" />
    <p className="text-xl text-gray-500">No items found</p>
  </div>
);

const SeeMore = ({ onClick }) => (
  <div className="text-center">
    <button
      onClick={onClick}
      className="text-sm border p-2 cursor-pointer rounded hover:bg-gray-300 text-fuchsia-700"
    >
      See more
    </button>
  </div>
);
