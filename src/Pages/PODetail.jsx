import React from "react";
import { FaBoxOpen, FaSearch, FaCalendarAlt } from "react-icons/fa";

const staticPOs = [
  {
    id: "PO-001",
    customer: "Acme Corp",
    estDelivery: "N/A",
    selected: true,
  },
  {
    id: "PO-002",
    customer: "Globex Inc",
    estDelivery: "N/A",
    selected: false,
  },
];

const poDetail = {
  id: "PO-001",
  customer: "Acme Corp",
  productionStart: "Jul 1, 2024",
  estDelivery: "Jul 15, 2024",
  progress: 33,
  created: "Jul 1, 2024",
  delivered: "Jul 15, 2024",
  processes: [
    {
      name: "Design",
      status: "completed",
      width: "30%",
      icon: <span className="mr-2">✓</span>,
    },
    {
      name: "Material Procurement",
      status: "completed",
      width: "50%",
      icon: <span className="mr-2">✓</span>,
    },
    {
      name: "Assembly",
      status: "inprogress",
      width: "80%",
      icon: <span className="mr-2">⏳</span>,
    },
    {
      name: "Quality Control",
      status: "notstarted",
      width: "40%",
      icon: <span className="mr-2">•</span>,
    },
    {
      name: "Packaging",
      status: "notstarted",
      width: "30%",
      icon: <span className="mr-2">•</span>,
    },
    {
      name: "Shipping",
      status: "notstarted",
      width: "20%",
      icon: <span className="mr-2">•</span>,
    },
  ],
};

const statusColors = {
  completed: "bg-green-500 text-white",
  inprogress: "bg-yellow-400 text-gray-900",
  notstarted: "bg-gray-200 text-gray-500",
};
const statusLabels = {
  completed: "Completed",
  inprogress: "In Progress",
  notstarted: "Not Started",
};

export default function PODetail() {
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Search/Filter Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <FaSearch className="text-blue-600 text-lg" />
          <span className="font-semibold text-gray-700 text-lg">Find Your Production Order</span>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by PO Number..."
            className="border border-gray-300 rounded px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              className="border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              className="border border-gray-300 rounded px-3 py-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded overflow-hidden">
          {staticPOs.map((po) => (
            <div
              key={po.id}
              className={`px-4 py-2 flex items-center cursor-pointer border-b last:border-b-0 ${
                po.selected
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-blue-50 text-gray-800"
              }`}
            >
              <span className="mr-2">{po.id}</span> - {po.customer} (Est. Delivery: {po.estDelivery})
            </div>
          ))}
        </div>
      </div>

      {/* Main PO Card */}
      <div className="bg-white rounded-lg shadow p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <FaBoxOpen className="text-blue-600 text-2xl" />
          <span className="text-xl font-bold text-gray-800">Production Order: {poDetail.id}</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
          <span>
            <span className="font-medium">Customer:</span> <span className="text-blue-700 font-semibold">{poDetail.customer}</span>
          </span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" />
            Production Start: <span className="font-semibold text-gray-800">{poDetail.productionStart}</span>
          </span>
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-gray-400" />
            <span className="underline text-blue-700 font-semibold">Estimated Delivery:</span> {poDetail.estDelivery}
          </span>
          <span>
            Overall Progress: <span className="text-blue-700 font-semibold">{poDetail.progress}%</span>
          </span>
        </div>
        <hr className="mb-4" />
        {/* Legend */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
            <span className="text-sm text-gray-700">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-yellow-400 inline-block"></span>
            <span className="text-sm text-gray-700">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-gray-200 border border-gray-400 inline-block"></span>
            <span className="text-sm text-gray-700">Not Started</span>
          </div>
        </div>
        {/* Gantt Chart */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-xs text-gray-500 mb-2">
            PO Created ({poDetail.created})
            <span className="float-right">Delivered (Est. {poDetail.delivered})</span>
          </div>
          <div className="space-y-3">
            {poDetail.processes.map((proc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={`rounded h-8 flex items-center pl-4 font-semibold ${statusColors[proc.status]}`}
                  style={{ width: proc.width, minWidth: 120 }}
                >
                  {proc.icon}
                  {proc.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
