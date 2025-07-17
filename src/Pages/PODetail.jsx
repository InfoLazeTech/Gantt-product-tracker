// import React, { useState, useEffect } from "react";
// import {
//   format,
//   addDays,
//   addWeeks,
//   addMonths,
//   addYears,
//   startOfWeek,
//   startOfMonth,
//   startOfYear,
//   isSameDay,
//   differenceInDays,
// } from "date-fns";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRecipe } from "../redux/features/recipeSlice";

// const statusColor = {
//   completed: "bg-green-500",
//   inprogress: "bg-blue-500",
//   pending: "bg-gray-400",
// };

// const tasks = [
//   {
//     name: "Material Preparation",
//     code: "p1",
//     startDate: new Date(2025, 6, 16),
//     duration: 1,
//     status: "completed",
//   },
//   {
//     name: "Primary Processing",
//     code: "p2",
//     startDate: new Date(2025, 6, 17),
//     duration: 2,
//     status: "completed",
//   },
//   {
//     name: "Quality Control",
//     code: "p3",
//     startDate: new Date(2025, 6, 19),
//     duration: 1,
//     status: "inprogress",
//   },
//   {
//     name: "Final Assembly",
//     code: "p4",
//     startDate: new Date(2025, 6, 20),
//     duration: 2,
//     status: "pending",
//   },
//   {
//     name: "Packaging & Shipping",
//     code: "p5",
//     startDate: new Date(2025, 6, 22),
//     duration: 1,
//     status: "pending",
//   },
// ];

// const VIEW_MODES = {
//   Day: { generator: addDays, labelFormat: "MMM d", startOf: (d) => d },
//   Week: { generator: addWeeks, labelFormat: "'Wk' ww", startOf: startOfWeek },
//   Month: {
//     generator: addMonths,
//     labelFormat: "MMM yyyy",
//     startOf: startOfMonth,
//   },
//   Year: { generator: addYears, labelFormat: "yyyy", startOf: startOfYear },
// };

// export default function PODetail() {
//   const dispatch = useDispatch();
//   const { recipes } = useSelector((state) => state.recipe);

//   const [selectedRecipe, setSelectedRecipe] = useState("");
//   const [startDate] = useState(new Date(2025, 6, 15));
//   const [viewMode, setViewMode] = useState("Day");
//   const [dateRange, setDateRange] = useState([]);
//   const [filtersApplied, setFiltersApplied] = useState(false);

//   const today = new Date();

//   useEffect(() => {
//     dispatch(fetchRecipe());
//   }, [dispatch]);

//   useEffect(() => {
//     setDateRange(generateDateRange(viewMode));
//   }, [viewMode]);

//   function generateDateRange(mode) {
//     const { generator, labelFormat, startOf } = VIEW_MODES[mode];
//     const range = [];
//     const base = startOf(startDate);
//     for (let i = 0; i < 14; i++) {
//       const date = generator(base, i);
//       range.push({ label: format(date, labelFormat), date });
//     }
//     return range;
//   }

//   function groupByMonth(range) {
//     if (!range || range.length === 0) return [];

//     const groups = [];
//     let currentMonth = format(range[0].date, "MMMM yyyy");
//     let count = 0;

//     for (let i = 0; i < range.length; i++) {
//       const month = format(range[i].date, "MMMM yyyy");
//       if (month === currentMonth) {
//         count++;
//       } else {
//         groups.push({ label: currentMonth, span: count });
//         currentMonth = month;
//         count = 1;
//       }
//     }
//     groups.push({ label: currentMonth, span: count });
//     return groups;
//   }

//   const monthGroups = groupByMonth(dateRange);

//   function getTaskDurationInView(task, view) {
//     const taskStart = task.startDate;

//     if (view === "Day") return task.duration;

//     const units = new Set();
//     for (let i = 0; i < task.duration; i++) {
//       const current = addDays(taskStart, i);
//       let key;
//       if (view === "Week") key = format(startOfWeek(current), "yyyy-MM-dd");
//       if (view === "Month") key = format(startOfMonth(current), "yyyy-MM");
//       if (view === "Year") key = format(startOfYear(current), "yyyy");
//       units.add(key);
//     }

//     return units.size;
//   }

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mt-2 mb-4">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Purchase Order Details
//         </h2>
//       </div>

//       {/* Filters */}
//       <div className="p-4 bg-white rounded-md shadow border flex flex-wrap items-center gap-4 mb-6">
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

//         {/* ✅ Recipe Dropdown */}
//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Recipe
//           </label>
//           <select
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={selectedRecipe}
//             onChange={(e) => setSelectedRecipe(e.target.value)}
//           >
//             <option value="">-- Select Recipe --</option>{" "}
//             {/* 👈 Default placeholder option */}
//             {recipes?.map((r) => (
//               <option key={r._id} value={r._id}>
//                 {r.recipeName || r.name || "Unnamed Recipe"}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Start Date
//           </label>
//           <input
//             type="date"
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="min-w-[160px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             End Date
//           </label>
//           <input
//             type="date"
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div className="min-w-[120px]">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             View
//           </label>
//           <select
//             className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={viewMode}
//             onChange={(e) => setViewMode(e.target.value)}
//           >
//             {Object.keys(VIEW_MODES).map((view) => (
//               <option key={view}>{view}</option>
//             ))}
//           </select>
//         </div>
//         <div className="flex items-end">
//           <button
//             className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//             onClick={() => setFiltersApplied(true)}
//           >
//             🔍 Apply Filters
//           </button>
//         </div>
//       </div>

//       {/* Chart only visible after Apply Filters */}
//       {filtersApplied && (
//         <div className="p-6 bg-white rounded-xl shadow space-y-6">
//           <div className="flex justify-between items-center border-b pb-4">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800">
//                 PO-2024-001
//               </h2>
//               <p className="text-gray-600">Acme Manufacturing</p>
//               <div className="text-sm text-gray-500 mt-1">
//                 <span className="font-medium">Start:</span> Jul 16 &nbsp;|&nbsp;
//                 <span className="font-medium">Est. Delivery:</span> Jul 25
//               </div>
//             </div>
//             <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
//               Active
//             </span>
//           </div>

//           {/* Timeline */}
//           <div className="relative overflow-x-auto border rounded-md">
//             <div className="min-w-max relative">
//               {/* Grouped Header */}
//               <div className="flex border-b bg-gray-100 text-xs font-medium text-gray-700">
//                 <div className="w-60 flex-shrink-0"></div>
//                 {monthGroups.map((group, i) => (
//                   <div
//                     key={i}
//                     className="text-center border-r border-gray-300 py-1"
//                     style={{ minWidth: `${group.span * 80}px` }}
//                   >
//                     {group.label}
//                   </div>
//                 ))}
//               </div>

//               {/* Date Header */}
//               <div className="flex border-b sticky top-0 z-10">
//                 <div className="w-60 flex-shrink-0 bg-white"></div>
//                 {dateRange.map((d, i) => {
//                   const isToday = isSameDay(d.date, today);
//                   return (
//                     <div
//                       key={i}
//                       className={`min-w-[80px] text-center py-2 px-1 text-xs border-r ${
//                         isToday
//                           ? "bg-yellow-200 font-semibold text-black border-yellow-400"
//                           : "bg-white text-gray-700"
//                       }`}
//                     >
//                       {d.label}
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Task Rows */}
//               {tasks.map((task, i) => {
//                 const offsetDays =
//                   dateRange.length > 0 && task.startDate
//                     ? differenceInDays(task.startDate, dateRange[0].date)
//                     : 0;

//                 const columnWidth = 80;
//                 const offsetLeft = offsetDays * columnWidth;
//                 const visibleDuration = getTaskDurationInView(task, viewMode);
//                 const barWidth = visibleDuration * columnWidth;
//                 const taskEnd = addDays(task.startDate, task.duration - 1);

//                 return (
//                   <div key={i} className="flex items-center border-b py-2">
//                     {/* Left: Task name and status */}
//                     <div className="w-60 flex-shrink-0 px-2">
//                       <div className="flex items-center gap-2 text-sm">
//                         <span
//                           className={
//                             task.status === "completed"
//                               ? "text-green-600"
//                               : task.status === "inprogress"
//                               ? "text-blue-500"
//                               : "text-gray-400"
//                           }
//                         >
//                           {task.status === "completed"
//                             ? "✔"
//                             : task.status === "inprogress"
//                             ? "▶"
//                             : "○"}
//                         </span>
//                         <div>
//                           <div className="text-gray-800 font-medium">
//                             {task.name}
//                           </div>
//                           <div className="text-gray-500 text-xs">
//                             {task.code}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Middle: Task bar */}
//                     <div className="relative flex-grow h-6 bg-gray-100 rounded overflow-hidden min-w-max">
//                       <div
//                         className={`absolute h-full ${
//                           statusColor[task.status]
//                         } text-xs flex items-center justify-center text-white`}
//                         style={{
//                           left: `${offsetLeft}px`,
//                           width: `${barWidth}px`,
//                         }}
//                       >
//                         {task.duration}
//                       </div>
//                     </div>

//                     {/* Right: Date range */}
//                     <div className="w-32 text-sm text-gray-500 pl-2">
//                       {format(task.startDate, "MMM d")} –{" "}
//                       {format(taskEnd, "MMM d")}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// PODetail.jsx - Fully dynamic Gantt chart with recipe selection

import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
  isSameDay,
  differenceInDays,
} from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipe } from "../redux/features/recipeSlice";

const statusColor = {
  completed: "bg-green-500",
  inprogress: "bg-blue-500",
  pending: "bg-gray-400",
};

const VIEW_MODES = {
  Day: { generator: addDays, labelFormat: "MMM d", startOf: (d) => d },
  Week: { generator: addWeeks, labelFormat: "'Wk' ww", startOf: startOfWeek },
  Month: {
    generator: addMonths,
    labelFormat: "MMM yyyy",
    startOf: startOfMonth,
  },
  Year: { generator: addYears, labelFormat: "yyyy", startOf: startOfYear },
};

export default function PODetail() {
  const dispatch = useDispatch();
  const { recipes } = useSelector((state) => state.recipe);

  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [viewMode, setViewMode] = useState("Day");
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("");
  const [selectedRecipeData, setSelectedRecipeData] = useState(null);
  const today = new Date();

  useEffect(() => {
    dispatch(fetchRecipe());
  }, [dispatch]);

  const generateDateRange = (mode, start, end) => {
    const { generator, labelFormat, startOf } = VIEW_MODES[mode];
    const range = [];
    let current = startOf(new Date(start));

    while (current <= end) {
      range.push({ label: format(current, labelFormat), date: current });
      current = generator(current, 1);
    }

    return range;
  };

  const groupByMonth = (range) => {
    if (!range || range.length === 0) return [];

    const groups = [];
    let currentMonth = format(range[0].date, "MMMM yyyy");
    let count = 0;

    for (let i = 0; i < range.length; i++) {
      const month = format(range[i].date, "MMMM yyyy");
      if (month === currentMonth) {
        count++;
      } else {
        groups.push({ label: currentMonth, span: count });
        currentMonth = month;
        count = 1;
      }
    }
    groups.push({ label: currentMonth, span: count });
    return groups;
  };

  const getTaskDurationInView = (task, view) => {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    const duration = differenceInDays(taskEnd, taskStart) + 1;

    if (view === "Day") return duration;

    const units = new Set();
    for (let i = 0; i < duration; i++) {
      const current = addDays(taskStart, i);
      let key;
      if (view === "Week") key = format(startOfWeek(current), "yyyy-MM-dd");
      if (view === "Month") key = format(startOfMonth(current), "yyyy-MM");
      if (view === "Year") key = format(startOfYear(current), "yyyy");
      units.add(key);
    }

    return units.size;
  };

  const handleApplyFilters = () => {
    if (!selectedRecipe || !startDateInput || !endDateInput) return;

    const recipe = recipes.find((r) => r._id === selectedRecipe);
    if (!recipe) return;

    const filterStart = new Date(startDateInput);
    const filterEnd = new Date(endDateInput);

    const filtered =
      recipe.tasks?.filter((task) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        return taskStart <= filterEnd && taskEnd >= filterStart;
      }) || [];

    const updatedTasks = filtered.map((task) => ({
      ...task,
      duration:
        differenceInDays(new Date(task.endDate), new Date(task.startDate)) + 1,
    }));

    setSelectedRecipeData({ ...recipe, tasks: updatedTasks });
    setDateRange(generateDateRange(viewMode, filterStart, filterEnd));
    setFiltersApplied(true);
    console.log("Selected Recipe:", recipe);
    console.log("Filtered Tasks:", filtered);
    console.log("Updated Tasks:", updatedTasks);
  };

  const monthGroups = groupByMonth(dateRange);
  const filteredTasks = selectedRecipeData?.tasks || [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mt-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Purchase Order Details
        </h2>
      </div>

      <div className="p-4 bg-white rounded-md shadow border flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search PO Number or Customer"
          className="w-full sm:w-auto flex-grow border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipe
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRecipe}
            onChange={(e) => setSelectedRecipe(e.target.value)}
          >
            <option value="">-- Select Recipe --</option>
            {recipes?.map((r) => (
              <option key={r._id} value={r._id}>
                {r.recipeName || r.name || "Unnamed Recipe"}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            View
          </label>
          <select
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            {Object.keys(VIEW_MODES).map((view) => (
              <option key={view}>{view}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={handleApplyFilters}
          >
            🔍 Apply Filters
          </button>
        </div>
      </div>

      {filtersApplied && selectedRecipeData && (
        <div className="p-6 bg-white rounded-xl shadow space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedRecipeData.orderNumber || "PO-XXXX-XXX"}
              </h2>
              <p className="text-gray-600">
                {selectedRecipeData.recipeName ||
                  selectedRecipeData.name ||
                  "Unnamed Recipe"}
              </p>
              <div className="text-sm text-gray-500 mt-1">
                <span className="font-medium">Start:</span>{" "}
                {format(new Date(startDateInput), "MMM d")} &nbsp;|&nbsp;
                <span className="font-medium">Est. Delivery:</span>{" "}
                {format(new Date(endDateInput), "MMM d")}
              </div>
            </div>
            <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="relative overflow-x-auto border rounded-md">
            <div className="min-w-max relative">
              {/* Month headers */}
              <div className="flex border-b bg-gray-100 text-xs font-medium text-gray-700">
                <div className="w-60 flex-shrink-0"></div>
                {monthGroups.map((group, i) => (
                  <div
                    key={i}
                    className="text-center border-r border-gray-300 py-1"
                    style={{ minWidth: `${group.span * 80}px` }}
                  >
                    {group.label}
                  </div>
                ))}
              </div>

              {/* Date headers */}
              <div className="flex border-b sticky top-0 z-10">
                <div className="w-60 flex-shrink-0 bg-white"></div>
                {dateRange.map((d, i) => {
                  const isToday = isSameDay(d.date, today);
                  return (
                    <div
                      key={i}
                      className={`min-w-[80px] text-center py-2 px-1 text-xs border-r ${
                        isToday
                          ? "bg-yellow-200 font-semibold text-black border-yellow-400"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      {d.label}
                    </div>
                  );
                })}
              </div>

              {/* Tasks */}
              {filteredTasks.map((task, i) => {
                const offsetDays =
                  dateRange.length > 0
                    ? differenceInDays(
                        new Date(task.startDate),
                        dateRange[0].date
                      )
                    : 0;
                const columnWidth = 80;
                const offsetLeft = offsetDays * columnWidth;
                const visibleDuration = getTaskDurationInView(task, viewMode);
                const barWidth = visibleDuration * columnWidth;
                const taskEnd = addDays(
                  new Date(task.startDate),
                  task.duration - 1
                );

                return (
                  <div key={i} className="flex items-center border-b py-2">
                    <div className="w-60 flex-shrink-0 px-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span
                          className={
                            task.status === "completed"
                              ? "text-green-600"
                              : task.status === "inprogress"
                              ? "text-blue-500"
                              : "text-gray-400"
                          }
                        >
                          {task.status === "completed"
                            ? "✔"
                            : task.status === "inprogress"
                            ? "▶"
                            : "○"}
                        </span>
                        <div>
                          <div className="text-gray-800 font-medium">
                            {task.name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {task.code}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-grow h-6 bg-gray-100 rounded overflow-hidden min-w-max">
                      <div
                        className={`absolute h-full ${
                          statusColor[task.status]
                        } text-xs flex items-center justify-center text-white`}
                        style={{
                          left: `${offsetLeft}px`,
                          width: `${barWidth}px`,
                        }}
                      >
                        {task.duration}
                      </div>
                    </div>

                    <div className="w-32 text-sm text-gray-500 pl-2">
                      {format(new Date(task.startDate), "MMM d")} –{" "}
                      {format(taskEnd, "MMM d")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
