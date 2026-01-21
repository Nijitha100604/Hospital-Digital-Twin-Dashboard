import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center w-full">
      {/* Spinner Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Outer Ring (Spinning) */}
        <div className="w-16 h-16 border-4 border-fuchsia-100 border-t-fuchsia-800 rounded-full animate-spin"></div>
        
        {/* Inner Dot (Pulsing) */}
        <div className="absolute w-3 h-3 bg-fuchsia-800 rounded-full animate-pulse"></div>
      
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-gray-500 font-medium text-sm tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default Loading;