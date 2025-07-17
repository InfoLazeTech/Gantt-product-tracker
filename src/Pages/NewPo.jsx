// import React from "react";

// const ProductionOrderForm = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">
//             Production Order Tracker
//           </h2>
//           <p className="text-gray-500 text-sm">
//             Track your manufacturing progress in real-time
//           </p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-xl shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-5 flex items-center gap-2 text-blue-600">
//             📅 Create New Production Order Timeline
//           </h3>

//           {/* PO Number and Customer Name */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <input
//               type="text"
//               placeholder="PO Number"
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               placeholder="Customer Name"
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Start Date */}
//           <div className="mb-4">
//             <input
//               type="date"
//               placeholder="dd-mm-yyyy"
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           </div>

//           {/* Recipe Dropdown */}
//           <div className="mb-4">
//             <select className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400">
//               <option value="">-- Select a Recipe --</option>
//               {/* Dynamic options to be added */}
//             </select>
//           </div>

//           {/* Process Section */}
//           <div className="mb-6">
//             <label className="block mb-2 font-medium text-sm text-gray-700">
//               Processes for this PO (Drag to Reorder)
//             </label>
//              <label className="block mb-2  text-sm text-gray-500">
//              Add processes manually or select a recipe.
//             </label>
//             <div className="border-2 border-dotted border-blue-400 rounded-lg  min-h-[50px] :hover bg-blue-50 flex flex-col items-center justify-center text-gray-600">

//               <button className="text-blue-600 font-medium hover:underline">
//                 + Add Manual Process
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button className="bg-blue-600 text-white font-medium w-full py-3 rounded-lg hover:bg-blue-700 transition-all duration-200">
//             Create New Production Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductionOrderForm;

import React from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaHashtag,
  FaPlus,
} from "react-icons/fa";

const ProductionOrderForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Main Form */}
        <div className="flex-1 p-8">
          <form className="space-y-8">
            {/* Title */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Create New Production Order
              </h3>
              <p className="text-gray-400 text-sm">
                Fill in the details to start tracking your order.
              </p>
            </div>

            {/* PO Number & Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaHashtag className="absolute left-3 top-3 text-blue-300" />
                <input
                  type="text"
                  placeholder="PO Number"
                  className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-blue-300" />
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Start Date & Recipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-blue-300" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <select className="border border-blue-200 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none">
                  <option value="">Select Recipe</option>
                  {/* Dynamic options */}
                </select>
              </div>
            </div>

            {/* Processes Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-gray-700 text-sm">
                  Processes{" "}
                  <span className="text-gray-400">(Drag to reorder)</span>
                </label>
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-md text-blue-700 text-xs font-medium hover:bg-blue-200 transition"
                >
                  <FaPlus /> Add Process
                </button>
              </div>
              <div className="bg-blue-50 border border-dashed border-blue-300 rounded-lg min-h-[60px] flex flex-col gap-2 p-4 text-blue-300 text-sm items-center justify-center">
                {/* Render process steps here */}
                No processes added yet.
              </div>
              <div className="text-xs text-blue-400 mt-1 pl-1">
                Select a recipe or add processes manually.
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
            >
              Create Production Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
