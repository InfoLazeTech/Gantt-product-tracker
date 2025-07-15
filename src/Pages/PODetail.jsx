// import React from "react";

// const dateRange = [
//   "Jan 15", "Jan 16", "Jan 17", "Jan 18", "Jan 19", "Jan 20", "Jan 21",
//   "Jan 22", "Jan 23", "Jan 24", "Jan 25", "Jan 26", "Jan 27", "Jan 28"
// ];

// const tasks = [
//   { name: "Material Preparation", code: "p1", start: 1, duration: 1, status: "completed" },
//   { name: "Primary Processing", code: "p2", start: 2, duration: 2, status: "completed" },
//   { name: "Quality Control", code: "p3", start: 4, duration: 1, status: "inprogress" },
//   { name: "Final Assembly", code: "p4", start: 5, duration: 2, status: "pending" },
//   { name: "Packaging & Shipping", code: "p5", start: 7, duration: 1, status: "pending" },
// ];

// const statusColor = {
//   completed: "bg-green-500",
//   inprogress: "bg-blue-500",
//   pending: "bg-gray-400",
// };

// export default function PODetail() {
//   return (
//     <div className="p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mt-2 mb-4">
//         <h2 className="text-2xl font-bold text-gray-800">Purchase Order Details</h2>
//       </div>

//       {/* Filters Section */}
//       <div className="p-4 bg-white rounded-md shadow border flex flex-wrap items-center gap-4 mb-6">
//         {/* Search Input */}
//         <div className="flex-grow min-w-[200px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Search PO Number or Customer
//           </label>
//           <input
//             type="text"
//             placeholder="Enter PO number or customer name..."
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Recipe Dropdown */}
//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Recipe</label>
//           <select className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option>Select Recipe</option>
//             <option>Recipe A</option>
//             <option>Recipe B</option>
//             <option>Recipe C</option>
//           </select>
//         </div>

//         {/* Start Date */}
//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//           <input
//             type="date"
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* End Date */}
//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//           <input
//             type="date"
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* View Filter */}
//         <div className="min-w-[120px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
//           <select className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
//             <option>Days</option>
//             <option>Weeks</option>
//             <option>Months</option>
//             <option>Years</option>
//           </select>
//         </div>

//         {/* Apply Filters Button */}
//         <div className="flex items-end">
//           <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
//             &#x1F50D; Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* Timeline Card */}
//       <div className="p-6 bg-white rounded-xl shadow space-y-6">
//         {/* PO Header */}
//         <div className="flex justify-between items-center border-b pb-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">PO-2024-001</h2>
//             <p className="text-gray-600">Acme Manufacturing</p>
//             <div className="text-sm text-gray-500 mt-1">
//               <span className="font-medium">Start:</span> Jan 16 &nbsp;|&nbsp;
//               <span className="font-medium">Est. Delivery:</span> Jan 25
//             </div>
//           </div>
//           <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
//             Active
//           </span>
//         </div>

//         {/* Date Header (Aligned) */}
//         <div className="flex mb-4 border-b pb-2">
//           {/* Spacer to align with task label */}
//           <div className="w-60"></div>

//           {/* Date Row */}
//          <div className="overflow-x-auto">
//   <div className="grid grid-cols-14 text-xs text-gray-500 min-w-[840px]">
//     {dateRange.map((date, i) => (
//       <div
//         key={i}
//         className="text-center whitespace-nowrap px-2"
//         style={{ minWidth: "60px" }}
//       >
//         {date}
//       </div>
//     ))}
//   </div>
// </div>
//         </div>

//         {/* Task Rows */}
//         <div className="space-y-4">
//           {tasks.map((task, i) => (
//             <div key={i} className="flex items-center">
//               {/* Task Name & Status */}
//               <div className="w-60 flex items-center gap-2 text-sm">
//                 {task.status === "completed" && <span className="text-green-600">&#x2713;</span>}
//                 {task.status === "inprogress" && <span className="text-blue-500">&#x25B6;</span>}
//                 {task.status === "pending" && <span className="text-gray-400">&#x25CB;</span>}

//                 <div>
//                   <div className="text-gray-800 font-medium">{task.name}</div>
//                   <div className="text-gray-500 text-xs">{task.code}</div>
//                 </div>
//               </div>

//               {/* Timeline Bar */}
//               <div className="relative w-full grid grid-cols-14 bg-gray-100 h-6 rounded overflow-hidden">
//                 <div
//                   className={`absolute h-full ${statusColor[task.status]} text-white text-xs flex items-center justify-center rounded`}
//                   style={{
//                     left: `${(task.start / dateRange.length) * 100}%`,
//                     width: `${(task.duration / dateRange.length) * 100}%`,
//                   }}
//                 >
//                   {task.duration}d
//                 </div>
//               </div>

//               {/* Date Range */}
//               <div className="w-32 text-right text-sm text-gray-500 pl-4">
//                 {dateRange[task.start]} – {dateRange[task.start + task.duration - 1]}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";

const statusColor = {
  completed: "bg-green-500",
  inprogress: "bg-blue-500",
  pending: "bg-gray-400",
};

const tasks = [
  {
    name: "Material Preparation",
    code: "p1",
    start: 1,
    duration: 1,
    status: "completed",
  },
  {
    name: "Primary Processing",
    code: "p2",
    start: 2,
    duration: 2,
    status: "completed",
  },
  {
    name: "Quality Control",
    code: "p3",
    start: 4,
    duration: 1,
    status: "inprogress",
  },
  {
    name: "Final Assembly",
    code: "p4",
    start: 5,
    duration: 2,
    status: "pending",
  },
  {
    name: "Packaging & Shipping",
    code: "p5",
    start: 7,
    duration: 1,
    status: "pending",
  },
];

const VIEW_MODES = {
  Day: { generator: addDays, format: "EEE dd", startOf: (d) => d },
  Week: { generator: addWeeks, format: "'Wk' ww", startOf: startOfWeek },
  Month: { generator: addMonths, format: "MMM yyyy", startOf: startOfMonth },
  Year: { generator: addYears, format: "yyyy", startOf: startOfYear },
};


export default function PODetail() {
  const [startDate] = useState(new Date(2025, 6, 15)); // July 15, 2025
  const [viewMode, setViewMode] = useState("Day");
  const [dateRange, setDateRange] = useState(generateDateRange("Day"));

  

  function generateDateRange(mode) {
    const { generator, format, startOf } = VIEW_MODES[mode];
    const range = [];
    const base = startOf(startDate);
    for (let i = 0; i < 14; i++) {
      const date = generator(base, i);
      range.push({ label: formatDate(date, format), date });
    }
    return range;
  }

  function formatDate(date, formatStr) {
    return format(date, formatStr);
  }

  function handleViewChange(mode) {
    setViewMode(mode);
    setDateRange(generateDateRange(mode));
  }

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Purchase Order Details
        </h2>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-md shadow border flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-grow min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search PO Number or Customer
          </label>
          <input
            type="text"
            placeholder="Enter PO number or customer name..."
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipe
          </label>
          <select className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Recipe</option>
            <option>Recipe A</option>
            <option>Recipe B</option>
            <option>Recipe C</option>
          </select>
        </div>
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            View
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleViewChange(e.target.value)}
          >
            {Object.keys(VIEW_MODES).map((view) => (
              <option key={view}>{view}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
            🔍 Apply Filters
          </button>
        </div>
      </div>

      {/* PO Detail Card */}
      <div className="p-6 bg-white rounded-xl shadow space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">PO-2024-001</h2>
            <p className="text-gray-600">Acme Manufacturing</p>
            <div className="text-sm text-gray-500 mt-1">
              <span className="font-medium">Start:</span> Jul 16 &nbsp;|&nbsp;
              <span className="font-medium">Est. Delivery:</span> Jul 25
            </div>
          </div>
          <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex justify-end">
          <div className="bg-gray-500 rounded-md flex gap-1 px-2 py-1 items-center">
            {Object.keys(VIEW_MODES).map((view) => (
              <button
                key={view}
                onClick={() => handleViewChange(view)}
                className={`text-sm px-3 py-1 rounded ${
                  viewMode === view
                    ? "bg-white text-gray-500 font-semibold"
                    : "bg-gray-500 text-white hover:bg-gray-400"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Header */}
        <div className="flex border-b pb-2 overflow-x-auto">
          <div className="w-60 flex-shrink-0"></div>
          <div className="flex space-x-2 min-w-full">
            {dateRange.map((dateObj, i) => (
              <div
                key={i}
                className="text-center text-xs text-gray-600 py-1 border-r border-gray-200 min-w-[60px]"
              >
                {dateObj.label}
              </div>
            ))}
          </div>
        </div>

        {/* Task Rows */}
        <div className="space-y-4">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center">
              {/* Task Name + Code */}
              <div className="w-60 flex items-center gap-2 text-sm">
                {task.status === "completed" && (
                  <span className="text-green-600">✔</span>
                )}
                {task.status === "inprogress" && (
                  <span className="text-blue-500">▶</span>
                )}
                {task.status === "pending" && (
                  <span className="text-gray-400">○</span>
                )}
                <div>
                  <div className="text-gray-800 font-medium">{task.name}</div>
                  <div className="text-gray-500 text-xs">{task.code}</div>
                </div>
              </div>

              {/* Timeline Bar */}
              <div className="relative w-full h-6 bg-gray-100 rounded overflow-hidden">
                <div
                  className={`absolute h-full ${
                    statusColor[task.status]
                  } text-xs flex items-center justify-center text-white`}
                  style={{
                    left: `${(task.start / dateRange.length) * 100}%`,
                    width: `${(task.duration / dateRange.length) * 100}%`,
                  }}
                >
                  {task.duration}d
                </div>
              </div>

              {/* Date Label */}
              <div className="w-32 text-right text-sm text-gray-500 pl-4">
                {dateRange[task.start]?.label} –{" "}
                {dateRange[task.start + task.duration - 1]?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
