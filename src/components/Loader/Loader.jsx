import React from "react";

const FullPageLoader = () => {
  return (
    <div className="flex items-center justify-center h-[90vh] bg-white">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-spin border-t-blue-600"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-600 rounded-full animate-ping transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default FullPageLoader;
