import React from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <FaLock className="text-red-600" size={28} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mx-auto bg-fuchsia-800 text-white px-5 py-2.5 rounded-xl
          hover:bg-fuchsia-900 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <FaArrowLeft />
          Go Back
        </button>

      </div>
    </div>
  );
}

export default AccessDenied;