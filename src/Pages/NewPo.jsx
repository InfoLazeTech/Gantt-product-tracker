import React, { useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaHashtag,
  FaTrash,
  FaGripVertical,
} from "react-icons/fa";

const ProductionOrderForm = () => {
  const [processes, setProcesses] = useState([]);

  const handleRemoveProcess = (idx) => {
    setProcesses(processes.filter((_, i) => i !== idx));
  };

  // Placeholder for drag-and-drop logic

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-400 p-0 transition-all duration-200 hover:shadow-2xl hover:border-gray-600">
        {/* Header */}
        <div className="px-6 pt-6 pb-3 border-b border-gray-100 text-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaClipboardList className="text-green-500" /> New Production Order
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Start tracking your manufacturing process efficiently.
          </p>
        </div>
        {/* Form */}
        <form className="px-6 py-6 space-y-6">
          {/* PO Details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Order Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1" htmlFor="po-number">
                  PO Number
                </label>
                <div className="relative">
                  <FaHashtag className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="text"
                    id="po-number"
                    placeholder="PO Number"
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800 text-sm transition-colors duration-150 hover:border-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1" htmlFor="customer-name">
                  Customer Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="text"
                    id="customer-name"
                    placeholder="Customer Name"
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800 text-sm transition-colors duration-150 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Schedule</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1" htmlFor="start-date">
                  Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="date"
                    id="start-date"
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800 text-sm transition-colors duration-150 hover:border-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 font-medium mb-1" htmlFor="est-date">
                  Estimated Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="date"
                    id="est-date"
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800 text-sm transition-colors duration-150 hover:border-gray-400"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1 mt-4" htmlFor="recipe">
                Recipe
              </label>
              <div className="relative">
                <FaClipboardList className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                <select
                  id="recipe"
                  className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800 text-sm transition-colors duration-150 hover:border-gray-400"
                >
                  <option value="">--Select Recipe--</option>
                  {/* Dynamic options */}
                </select>
              </div>
            </div>
          </div>
          {/* Processes Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Processes</h3>
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md min-h-[40px] flex flex-col gap-1 p-2">
              {processes.length === 0 ? (
                <div className="text-gray-300 text-xs text-center">
                  No processes added yet.
                </div>
              ) : (
                processes.map((proc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white rounded border border-gray-100 px-2 py-1 text-sm transition-all duration-150 hover:bg-gray-100 hover:border-gray-400"
                  >
                    <FaGripVertical className="text-gray-300 cursor-move text-xs" />
                    <span className="flex-1 text-gray-700">{proc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProcess(idx)}
                      className="text-gray-400 hover:text-blue-500 transition"
                      title="Remove"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1 pl-1">
              Select a recipe or add processes manually. (Drag-and-drop coming soon)
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition-all duration-150"
          >
            Create Production Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
