import React, { useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaHashtag,
  FaPlus,
  FaTrash,
  FaGripVertical,
} from "react-icons/fa";

const ProductionOrderForm = () => {
  const [processes, setProcesses] = useState([]);
  const [newProcess, setNewProcess] = useState("");

  const handleAddProcess = () => {
    if (newProcess.trim()) {
      setProcesses([...processes, newProcess.trim()]);
      setNewProcess("");
    }
  };

  const handleRemoveProcess = (idx) => {
    setProcesses(processes.filter((_, i) => i !== idx));
  };

  // Placeholder for drag-and-drop logic

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 border-b border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaClipboardList className="text-gray-400" /> New Production Order
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Start tracking your manufacturing process efficiently.
          </p>
        </div>
        {/* Form */}
        <form className="px-8 py-8 space-y-8">
          {/* PO Details */}
          <div>
            <h3 className="text-base font-semibold text-gray-600 mb-2">Order Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <FaHashtag className="absolute left-3 top-3 text-gray-300" />
                <input
                  type="text"
                  placeholder="PO Number"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800"
                />
              </div>
              <div className="relative">
                <FaUser className="absolute left-3 top-3 text-gray-300" />
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800"
                />
              </div>
            </div>
          </div>
          {/* Date & Recipe */}
          <div>
            <h3 className="text-base font-semibold text-gray-600 mb-2">Schedule & Recipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-300" />
                <input
                  type="date"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-md w-full focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800"
                />
              </div>
              <div>
                <select className="border border-gray-200 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-gray-400 focus:outline-none bg-gray-50 text-gray-800">
                  <option value="">Select Recipe</option>
                  {/* Dynamic options */}
                </select>
              </div>
            </div>
          </div>
          {/* Processes Section */}
          <div>
            <h3 className="text-base font-semibold text-gray-600 mb-2">Processes</h3>
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-md min-h-[60px] flex flex-col gap-2 p-4">
              {processes.length === 0 ? (
                <div className="text-gray-300 text-sm text-center">No processes added yet.</div>
              ) : (
                processes.map((proc, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white rounded shadow-sm px-3 py-2 border border-gray-100">
                    <FaGripVertical className="text-gray-300 cursor-move" />
                    <span className="flex-1 text-gray-700">{proc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProcess(idx)}
                      className="text-gray-400 hover:text-red-500"
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
            className="w-full py-3 rounded-md bg-gray-900 text-white font-semibold text-base shadow hover:bg-black transition"
          >
            Create Production Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
