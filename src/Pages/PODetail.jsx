import React, { useEffect, useState } from "react";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
} from "date-fns";
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
import {
  fetchProduct,
  updateProcessItem,
} from "../redux/features/productSlice";
import { min, max } from "date-fns";
import { toast } from "react-toastify";

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
  console.log("select:", selectedPO);

  const [editTask, setEditTask] = useState(null);
  console.log("edit:", editTask);
  const [chartStartDate, setChartStartDate] = useState(new Date());
  const [chartEndDate, setChartEndDate] = useState(new Date());
  console.log("chartenddate");
  const [dayCount, setDayCount] = useState(1);
  const dayWidth = 80; // Customize this width as needed

  useEffect(() => {
    const allDates = selectedPO?.recipe?.processes
      ? selectedPO.recipe.processes.flatMap((p) =>
          p.start && p.end ? [new Date(p.start), new Date(p.end)] : []
        )
      : [];

    const start =
      Array.isArray(allDates) && allDates.length ? min(allDates) : new Date();
    const maxNaturalEnd =
      Array.isArray(allDates) && allDates.length ? max(allDates) : start;

    const minEnd = addDays(start, 19); // minimum 20-day window
    const end = maxNaturalEnd > minEnd ? maxNaturalEnd : minEnd;

    setChartStartDate(start);
    setChartEndDate(end);
    setDayCount(differenceInCalendarDays(end, start) + 1);
  }, [selectedPO]);
  const filteredPOs = poDetails.filter((po) => {
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
    setEditTask((prev) => ({
      ...prev,
      [field]: value,
    }));
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

  // const allProcessDates = selectedPO?.recipe?.processes?.flatMap((p) => [
  //   new Date(p.start),
  //   new Date(p.end),
  // ]);

  // const chartStartDate = allProcessDates?.length
  //   ? min(allProcessDates)
  //   : new Date(); // fallback to today

  // const chartEndDate = allProcessDates?.length
  //   ? max(allProcessDates)
  //   : new Date(); // fallback to today
  // const dayCount = differenceInCalendarDays(chartEndDate, chartStartDate) + 1;

  const handleSaveEdit = async () => {
    if (!editTask?._id || !selectedPO?._id) {
      toast.error("Missing itemId or processId");
      return;
    }

    const payload = {
      itemId: selectedPO._id,
      processId: editTask?.processId?._id,
      updateItemData: {
        startDateTime: editTask.start,
        endDateTime: editTask.end,
      },
    };

    try {
      const response = await dispatch(updateProcessItem(payload)).unwrap();
      console.log("📦 Sending payload to backend:", {
        itemId: selectedPO?._id,
        processId: editTask?.processId?._id,
        startDateTime: editTask?.start,
        endDateTime: editTask?.end,
      });
      console.log("✅ Backend Response:", response);
      toast.success(response.message || "Process updated");

      const updatedProcesses = selectedPO.processes.map((p) =>
        p._id === editTask._id
          ? {
              ...p,
              startDateTime: editTask.start,
              endDateTime: editTask.end,
            }
          : p
      );

      setSelectedPO((prev) => ({
        ...prev,
        processes: updatedProcesses,
      }));

      setEditTask(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error(err || "Update failed");
    }
  };
  const chartStartsDate = selectedPO?.startDate
    ? new Date(selectedPO.startDate)
    : new Date();

  const chartEndsDate = selectedPO?.estimatedEndDate
    ? new Date(selectedPO.estimatedEndDate)
    : new Date();
  const headers = [];
  for (let d = chartStartsDate; d <= chartEndsDate; d = addDays(d, 1)) {
    headers.push(new Date(d)); // Keep raw Date f
    // or formatting in JSX
  }
  const allChartDates =
    selectedPO && selectedPO.startDate && selectedPO.estimatedEndDate
      ? eachDayOfInterval({
          start: new Date(selectedPO.startDate),
          end: new Date(selectedPO.estimatedEndDate),
        })
      : [];
  const today = new Date();
  const todayIndex = allChartDates.findIndex(
    (d) => format(d, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
  );

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
            {selectedPO && (
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2 px-2">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <p>
                    <strong>PO Created:</strong>{" "}
                    {selectedPO.startDate
                      ? format(new Date(selectedPO.startDate), "dd MMM yyyy")
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
            <div className="overflow-x-auto">
              <div className="min-w-[240px]">
                {/* Timeline Header: Start - End Date */}
                <div className="flex border-b text-sm font-semibold bg-gray-100 sticky top-0 z-10">
                  <div
                    className="text-center border-r"
                    style={{ width: `${14 * dayWidth}px` }}
                  >
                    {selectedPO.startDate
                      ? format(new Date(selectedPO.startDate), "dd MMM yyyy")
                      : "N/A"}{" "}
                    -{" "}
                    {selectedPO.estimatedEndDate
                      ? format(
                          new Date(selectedPO.estimatedEndDate),
                          "dd MMM yyyy"
                        )
                      : "N/A"}
                  </div>
                </div>

                {/* Tasks */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-100">
                        <th
                          className="w-48 sticky left-0 bg-gray-100 z-10 text-left px-2 py-2 border-r"
                          rowSpan={2}
                        >
                          Task Name
                        </th>
                        <th
                          className="text-center px-2 py-2 border-r bg-gray-100 font-semibold"
                          colSpan={allChartDates.length}
                        >
                          {selectedPO.startDate &&
                          selectedPO.estimatedEndDate ? (
                            <>
                              {format(
                                new Date(selectedPO.startDate),
                                "dd MMM yyyy"
                              )}{" "}
                              –{" "}
                              {format(
                                new Date(selectedPO.estimatedEndDate),
                                "dd MMM yyyy"
                              )}
                            </>
                          ) : (
                            "Timeline"
                          )}
                        </th>
                      </tr>

                      {/* Row 2: All Dates */}
                      <tr className="bg-gray-100">
                        {allChartDates.map((date, idx) => (
                          <th
                            key={idx}
                            className={`text-xs px-2 py-1 border-r text-center whitespace-nowrap ${
                              isToday(date) ? "bg-yellow-100 font-bold" : ""
                            }`}
                            style={{ minWidth: `${dayWidth}px` }}
                          >
                            {format(new Date(date), "dd MMM")}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {selectedPO?.processes
                        ?.filter(
                          (p) =>
                            filters.status === "All" ||
                            p.processId.status === filters.status
                        )
                        .map((p, idx) => {
                          const process = p.processId;
                          const start = new Date(p.startDateTime);
                          const end = new Date(p.endDateTime);
                          const startIndex = allChartDates.findIndex((date) =>
                            isSameDay(start, date)
                          );
                          const endIndex = allChartDates.findIndex((date) =>
                            isSameDay(end, date)
                          );
                          const today = new Date();

                          let barColor = "bg-gray-400"; // default
                          if (end < today)
                            barColor = "bg-green-600"; // Completed
                          else if (start <= today && end >= today)
                            barColor = "bg-yellow-500"; // In Progress

                          return (
                            <tr key={p._id} className="h-10 border-t relative">
                              {/* Sticky Task Name Column */}
                              {/* <td className="sticky left-0 bg-white border-r px-2 z-10 text-sm font-medium whitespace-nowrap" onClick={() =>
                                          setEditTask({
                                            ...p,
                                            name: process.name,
                                            start: p.startDateTime,
                                            end: p.endDateTime,
                                          })
                                        }>
                                <span className="mr-1">
                                  {statusDot(process.status)}
                                </span>
                                {process.name}
                              </td> */}

                              <td
                                className="sticky left-0 bg-white border-r px-2 z-10 text-sm font-medium whitespace-nowrap group cursor-pointer hover:bg-blue-50 transition"
                                onClick={() =>
                                  setEditTask({
                                    ...p,
                                    name: process.name,
                                    start: p.startDateTime,
                                    end: p.endDateTime,
                                  })
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-1">
                                    <span className="mr-1">
                                      {statusDot(process.status)}
                                    </span>
                                    <span className="group-hover:text-blue-600">
                                      {process.name}
                                    </span>
                                  </div>

                                  {/* Edit Icon shows only on hover */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-600 transition duration-200"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6H9v-2z"
                                    />
                                  </svg>
                                </div>
                              </td>

                              {/* Date Columns with Bar */}
                              {allChartDates.map((_, dayIdx) => {
                                const isInBar =
                                  dayIdx >= startIndex && dayIdx <= endIndex;

                                return (
                                  <td
                                    key={dayIdx}
                                    className="relative border-r"
                                    style={{ minWidth: `${dayWidth}px` }}
                                  >
                                    {isInBar && (
                                      <div
                                        className={`h-6 ${barColor} rounded cursor-pointer hover:opacity-90 group transition-all duration-200`}
                                        // onClick={() =>
                                        //   setEditTask({
                                        //     ...p,
                                        //     name: process.name,
                                        //     start: p.startDateTime,
                                        //     end: p.endDateTime,
                                        //   })
                                        // }
                                      >
                                        {/* Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-50 -top-10 left-1/2 transform -translate-x-1/2 transition-all duration-200 pointer-events-none">
                                          <div className="font-semibold">
                                            {process.name}
                                          </div>
                                          <div>
                                            {safeFormat(
                                              p.startDateTime,
                                              "dd MMM"
                                            )}{" "}
                                            –{" "}
                                            {safeFormat(
                                              p.endDateTime,
                                              "dd MMM"
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
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

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditTask(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Save
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
