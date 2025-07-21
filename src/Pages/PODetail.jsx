import React, { useEffect, useState } from "react";
import { format, isToday } from "date-fns";
import { FiPackage } from "react-icons/fi";
import {
  FaCalendarAlt,
  FaClock,
  FaRegClock,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { LuFactory } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../redux/features/productSlice";
import { min, max } from "date-fns";

const allPOs = [
  {
    id: "PO-001",
    customerName: "ABC Ltd",
    tasks: [
      {
        name: "Project Planning",
        start: "2025-07-01",
        end: "2025-07-05",
        progress: 50,
        status: "In Progress",
      },
      {
        name: "Requirements Gathering",
        start: "2025-07-02",
        end: "2025-07-08",
        progress: 25,
        status: "In Progress",
      },
      {
        name: "Design Phase",
        start: "2025-07-08",
        end: "2025-07-10",
        progress: 30,
        status: "In Progress",
      },
      {
        name: "Development - Frontend",
        start: "2025-07-09",
        end: "2025-07-18",
        progress: 20,
        status: "Pending",
      },
      {
        name: "Development - Backend",
        start: "2025-07-20",
        end: "2025-07-24",
        progress: 10,
        status: "Pending",
      },
      {
        name: "Client Feedback",
        start: "2025-07-11",
        end: "2025-07-14",
        progress: 90,
        status: "Completed",
      },
    ],
  },
  {
    id: "PO-002",
    customerName: "XYZ Corp",
    tasks: [
      {
        name: "Testing",
        start: "2025-07-10",
        end: "2025-07-14",
        progress: 20,
        status: "In Progress",
      },
      {
        name: "Deployment",
        start: "2025-07-15",
        end: "2025-07-18",
        progress: 0,
        status: "Pending",
      },
    ],
  },
];

const dayWidth = 80;

export default function PODetail() {
  const dispatch = useDispatch();
  const { poDetails } = useSelector((state) => state.product);

  console.log("PO Details:", poDetails);

  useEffect(() => {
    // Fetch production order details if needed
    dispatch(fetchProduct());
  }, [dispatch]);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    startDate: "",
    endDate: "",
    recipe: "",
  });

  const [selectedPO, setSelectedPO] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const filteredPOs = allPOs.filter((po) => {
    const searchText = filters.search.toLowerCase();

    const matchesSearch =
      po.poNumber?.toLowerCase().includes(searchText) ||
      po.customerName?.toLowerCase().includes(searchText);

    const matchesStartDate =
      !filters.startDate ||
      new Date(po.startDate) >= new Date(filters.startDate);

    const matchesEndDate =
      !filters.endDate || new Date(po.endDate) <= new Date(filters.endDate);

    return matchesSearch && matchesStartDate && matchesEndDate;
  });
  const searchText = filters.search.trim().toLowerCase();

  const updateTask = (field, value) => {
    const updatedTasks = selectedPO.tasks.map((t) =>
      t.name === editTask.name ? { ...t, [field]: value } : t
    );
    setSelectedPO({ ...selectedPO, tasks: updatedTasks });
  };

  const statusDot = (status) => {
    if (status === "Completed") return "🟢";
    if (status === "In Progress") return "🟡";
    if (status === "Pending") return "⚪";
    return "";
  };
  const safeFormat = (dateStr, formatStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "Invalid date" : format(date, formatStr);
  };

  const allProcessDates = selectedPO?.recipe?.processes?.flatMap((p) => [
    new Date(p.start),
    new Date(p.end),
  ]);

  const chartStartDate = allProcessDates?.length
    ? min(allProcessDates)
    : new Date(); // fallback to today

  const chartEndDate = allProcessDates?.length
    ? max(allProcessDates)
    : new Date(); // fallback to today

  const dayCount =
    Math.ceil((chartEndDate - chartStartDate) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="p-4 space-y-6 max-w-screen">
      <div className="mb-6">
        <h1 className="font-bold text-3xl text-center text-gray-800">
          Production Order Tracker
        </h1>
        <p className="text-md text-center text-gray-600">
          Track your manufacturing progress in real-time
        </p>
      </div>
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-md border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <div className="col-span-1 sm:col-span-2">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <span className="text-blue-500 text-base">
                <FaSearch />
              </span>
              <span className="font-semibold text-lg">
                Find Your Production Order
              </span>
            </label>
           
            <input
              type="text"
              placeholder="PO Number or Customer Name"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PO List */}
        <div className="bg-gray-50 mt-10 p-4 rounded max-h-96 overflow-y-auto border">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            All Production Orders
          </h3>
          <div className="space-y-2">
            {poDetails.map((po) => (
              <div
                key={po._id}
                onClick={() => setSelectedPO(po)} // ✅ FULL po object passed here
                className="p-3 border rounded bg-white"
              >
                <strong className="text-blue-600">{po.PONumber}</strong> -{" "}
                {po.customerName}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Chart */}

      {selectedPO && (
        <div className="bg-white p-4 rounded-md shadow-md border">
          <div>
            <h2 className="text-2xl font-bold mt-6 mb-2 flex items-center gap-2 ">
              <FiPackage className="w-5 h-5 text-blue-600" />
              Production Order: {selectedPO.PONumber}
            </h2>
            <div className="flex flex-wrap justify-between w-full text-sm text-gray-600 mb-4">
              {/* Customer */}
              <div className="flex items-center text-sm gap-2">
                <FaUser />
                <span>
                  <strong>Customer:</strong> {selectedPO.customerName}
                </span>
              </div>

              {/* Start Date */}
              <div className="flex items-center text-sm gap-2">
                <FaCalendarAlt />
                <span>
                  <strong>Production Start:</strong>{" "}
                  {selectedPO.startDate
                    ? format(new Date(selectedPO.startDate), "dd MMM yyyy")
                    : "N/A"}
                </span>
              </div>

              {/* Estimated Date */}
              <span>
                <strong>Estimated Delivery:</strong>{" "}
                {selectedPO.estimatedEndDate
                  ? format(new Date(selectedPO.estimatedEndDate), "dd MMM yyyy")
                  : "N/A"}
              </span>

              {/* Progress */}
              <div className="flex items-center text-sm gap-2">
                <LuFactory />
                <span>
                  <strong>Overall Progress:</strong> {selectedPO.progress}%
                </span>
              </div>
            </div>

            <div className="flex justify-center text-sm text-center gap-4 mb-4">
              {[
                { label: "Pending", icon: "⚪" },
                { label: "In Progress", icon: "🟡" },
                { label: "Completed", icon: "🟢" },
              ].map((s) => (
                <div
                  key={s.label}
                  onClick={() => setFilters({ ...filters, status: s.label })}
                  className={`cursor-pointer select-none ${
                    filters.status === s.label
                      ? "text-blue-600 font-semibold underline"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  <span className="mr-1">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[240px]">
                {/* Timeline Header: Start - End Date */}
                <div className="flex border-b text-sm font-semibold bg-gray-100 sticky top-0 z-10">
                  <div
                    className="text-center border-r"
                    style={{ width: `${14 * dayWidth}px` }}
                  >
                    {format(chartStartDate, "MMM dd")} -{" "}
                    {format(
                      new Date(chartStartDate.getTime() + 14 * 86400000),
                      "MMM dd, yyyy"
                    )}
                  </div>
                </div>

                {/* Daily Dates Row */}
                <div className="flex text-sm font-semibold bg-gray-100 border-b sticky top-0 z-10">
                  <div className="w-40 bg-gray-100 border-r px-2 py-1 sticky left-0 z-10">
                    Task Name
                  </div>
                  {Array.from({ length: dayCount }).map((_, i) => {
                    const date = new Date(chartStartDate);
                    date.setDate(date.getDate() + i);
                    const prevDate = new Date(chartStartDate);
                    prevDate.setDate(prevDate.getDate() + i - 1);
                    const isNewMonth =
                      i === 0 || date.getMonth() !== prevDate.getMonth();
                    return isNewMonth ? (
                      <div
                        key={`month-${i}`}
                        className="text-center border-r bg-gray-200 py-1"
                        style={{ width: `${dayWidth}px` }}
                      >
                        {format(date, "MMMM yyyy")}
                      </div>
                    ) : (
                      <div
                        key={`month-${i}`}
                        style={{ width: `${dayWidth}px` }}
                      />
                    );
                  })}
                </div>

                {/* Daily Header */}
                <div className="flex border-b text-xs bg-gray-50">
                  <div className="w-40 bg-gray-50 border-r px-2 py-1 font-medium sticky left-0 z-10"></div>
                  {Array.from({ length: dayCount }).map((_, i) => {
                    const date = new Date(chartStartDate);
                    date.setDate(date.getDate() + i);
                    return (
                      <div
                        key={i}
                        className={`w-[${dayWidth}px] text-center border-r py-1 ${
                          isToday(date) ? "bg-yellow-200 font-semibold" : ""
                        }`}
                      >
                        {format(date, "MMM dd")}
                      </div>
                    );
                  })}
                </div>

                {selectedPO && (
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <p>
                        <strong>PO Created:</strong>{" "}
                        {selectedPO.startDate
                          ? format(
                              new Date(selectedPO.startDate),
                              "dd MMM yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="text-gray-400" />
                      <p>
                        <strong>Delivered (Est.):</strong>{" "}
                        {selectedPO.estimatedEndDate
                          ? format(
                              new Date(selectedPO.estimatedEndDate),
                              "dd MMM yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}
                {/* Tasks */}
                {selectedPO?.processes?.length > 0 &&
                  selectedPO.processes
                    .filter(
                      (p) =>
                        filters.status === "All" ||
                        p.processId.status === filters.status
                    )
                    .map((p) => {
                      const process = p.processId;

                      const startIndex =
                        (new Date(process.start).getTime() -
                          chartStartDate.getTime()) /
                        (1000 * 60 * 60 * 24);

                      const duration =
                        (new Date(process.end).getTime() -
                          new Date(process.start).getTime()) /
                          (1000 * 60 * 60 * 24) +
                        1;

                      return (
                        <div
                          key={p._id}
                          className="flex items-center h-12 border-b relative"
                        >
                          {/* Process Name + Status Dot */}
                          <div className="absolute left-0 w-40 pl-2 text-sm font-medium text-gray-700">
                            <span className="mr-1">
                              {statusDot(process.status)}
                            </span>
                            {process.name}
                          </div>

                          {/* Bar */}
                          <div className="flex-1 ml-40 flex relative">
                            <div
                              className="relative group"
                              style={{
                                marginLeft: `${startIndex * dayWidth}px`,
                              }}
                            >
                              <div
                                className="h-6 bg-gray-300 rounded overflow-hidden cursor-pointer relative hover:opacity-90"
                                style={{ width: `${duration * dayWidth}px` }}
                                onClick={() => setEditTask(process)}
                              >
                                {/* Progress Fill */}
                                <div
                                  className={`h-full text-white text-xs flex items-center justify-center transition ${
                                    process.status === "Completed"
                                      ? "bg-green-600"
                                      : process.status === "In Progress"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                  }`}
                                  style={{ width: `${process.progress || 0}%` }}
                                >
                                  {process.progress || 0}%
                                </div>

                                {/* Tooltip */}
                                <div className="absolute opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 group-hover:flex flex-col bg-black text-white text-xs px-3 py-2 rounded shadow-lg z-50 whitespace-nowrap top-full mt-1 left-1/2 -translate-x-1/2 transition-all duration-200">
                                  <div className="font-semibold">
                                    {process.name}
                                  </div>
                                  <div>
                                    {duration} day{duration > 1 ? "s" : ""}
                                  </div>
                                  <div>
                                    {safeFormat(process.start, "MMM dd")} –{" "}
                                    {safeFormat(process.end, "MMM dd")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>

            {/* Edit Modal */}
            {editTask && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-opacity duration-300 ease-out animate-fade-in">
                <div className="bg-white rounded-lg shadow-md p-6 w-[90%] max-w-md transform transition-all duration-300 ease-out scale-95 animate-modal-in">
                  <h3 className="font-semibold text-lg mb-2">Edit Task</h3>
                  <p className="text-md font-bold mb-4 p-4 border rounded bg-blue-100">
                    {editTask.name}
                  </p>

                  <label className="block text-xs mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editTask.start}
                    onChange={(e) => updateTask("start", e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  />

                  <label className="block text-xs mb-1">End Date</label>
                  <input
                    type="date"
                    value={editTask.end}
                    onChange={(e) => updateTask("end", e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditTask(null)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
