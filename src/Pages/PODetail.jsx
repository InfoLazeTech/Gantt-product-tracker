import React, { useEffect, useRef, useState } from "react";
import {
  addDays,
  // differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  // min,
  max,
} from "date-fns";
import { FiPackage } from "react-icons/fi";
import {
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaGripVertical,
  FaRegClock,
  FaRegEdit,
  FaSearch,
  FaTrash,
  FaUser,
} from "react-icons/fa";
import { LuFactory } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePo,
  fetchProduct,
  updatePo,
  updateProcessItem,
} from "../redux/features/productSlice";
import { toast } from "react-toastify";
import FullPageLoader from "../components/Loader/Loader";
import { fetchRecipe } from "../redux/features/recipeSlice";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function PODetail() {
  const dispatch = useDispatch();
  const { poDetails, loading } = useSelector((state) => state.product);
  console.log("podetails", poDetails);
  const recipes = useSelector((state) => state.recipe.recipes || []);

  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    startDate: "",
    endDate: "",
    recipe: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    itemId: "",
    PONumber: "",
    customerName: "",
    startDate: "",
    estimatedEndDate: "",
    recipeId: "",
    processes: [],
  });

  const [processes, setProcesses] = useState([]);

  const [selectedPO, setSelectedPO] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [allChartDates, setAllChartDates] = useState([]);
  const [formErrors, setFormErrors] = useState({
    start: "",
    end: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPOId, setSelectedPOId] = useState(null);

  const todayRef = useRef(null);
  const dayWidth = 60;

  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(fetchRecipe());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedPO?.startDate) {
      setAllChartDates([]);
      return;
    }

    const poStart = new Date(selectedPO.startDate);
    const poEstimateEnd = selectedPO.estimatedEndDate
      ? new Date(selectedPO.estimatedEndDate)
      : null;

    // Collect all valid process end dates
    const validProcessDates = processes
      ?.map((p) => p.endDateTime)
      .filter(Boolean)
      .map((date) => new Date(date))
      .filter((date) => !isNaN(date));

    // 1. Default to estimatedEndDate or poStart + 10
    let chartEnd =
      poEstimateEnd && !isNaN(poEstimateEnd)
        ? poEstimateEnd
        : addDays(poStart, 10);

    // 2. If any process end date is AFTER estimatedEndDate, use the latest one
    if (validProcessDates.length > 0) {
      const latestProcessEnd = max(validProcessDates);
      if (latestProcessEnd > chartEnd) {
        chartEnd = latestProcessEnd;
      }
    }

    const dates = eachDayOfInterval({
      start: poStart,
      end: chartEnd,
    });

    setAllChartDates(dates);
  }, [selectedPO, processes]);

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [allChartDates]);

  const filteredPOs = poDetails.filter((po) => {
    const searchText = filters.search.toLowerCase();

    if (searchText) {
      // If search text exists, only filter by search
      return (
        po.PONumber?.toLowerCase().includes(searchText) ||
        po.customerName?.toLowerCase().includes(searchText)
      );
    } else {
      // If no search text, use date filters
      const poStart = new Date(po.startDate);
      const poEnd = new Date(po.estimatedEndDate || po.endDate || po.startDate);
      const filterStart = filters.startDate
        ? new Date(filters.startDate)
        : null;
      const filterEnd = filters.endDate ? new Date(filters.endDate) : null;

      const matchesStartDate = !filterStart || poStart >= filterStart;
      const matchesEndDate = !filterEnd || poEnd <= filterEnd;

      return matchesStartDate && matchesEndDate;
    }
  });

  const safeFormat = (dateStr, formatStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? "Invalid date" : format(date, formatStr);
  };

  const updateTask = (field, value) => {
    setEditTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (selectedPO?._id && poDetails.length > 0) {
      const updated = poDetails.find((po) => po._id === selectedPO._id);
      if (updated) {
        setSelectedPO(updated);
        setProcesses(
          updated.processes?.map((p) => ({
            _id: p.processId?._id || p._id,
            name: p.processId?.name || p.name,
            startDateTime: p.startDateTime,
            endDateTime: p.endDateTime,
            status: p.status || p.processId?.status || "Not Started",
          })) || []
        );
      }
    }
  }, [poDetails]);

  const handleEdit = (process) => {
    setEditTask(process);
  };

  const handleSaveEdit = async () => {
    const newStart = new Date(editTask.start);
    const newEnd = new Date(editTask.end);
    const poStart = new Date(selectedPO.startDate);
    const poStartFormatted = format(poStart, "dd/MM/yyyy");

    let hasError = false;
    const errors = { start: "", end: "" };

    if (newStart < poStart) {
      errors.start = `Start date cannot be before PO start date (${poStartFormatted})`;
      hasError = true;
    }

    if (newEnd < newStart) {
      errors.end = `End date cannot be before Start date`;
      hasError = true;
    }

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({ start: "", end: "" }); // clear old errors

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
      toast.success(response.message || "Process updated");
      await dispatch(fetchProduct());
      setEditTask(null);
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast.error(err || "Update failed");
    }
  };
  const handleEditOrUpdate = async (po = null, isSubmit = false) => {
    if (!isSubmit && po) {
      const fullProcesses =
        po.processes?.map((p) => ({
          _id: p.processId?._id || p._id,
          name: p.processId?.name || p.name,
          startDateTime: p.startDateTime,
          endDateTime: p.endDateTime,
          status: p.status,
        })) || [];

      const updateData = {
        itemId: po.itemId,
        PONumber: po.PONumber,
        customerName: po.customerName,
        startDate: po.startDate?.slice(0, 10),
        estimatedEndDate: po.estimatedEndDate?.slice(0, 10),
        recipeId: po.recipeId?._id || "",
        processes: fullProcesses.map((proc) => ({ processId: proc._id })),
      };

      setFormData(updateData);
      setProcesses(fullProcesses);
      setIsEdit(true);
      console.log("Edit mode started:", updateData);
    }

    if (isSubmit) {
      if (!formData.recipeId) {
        toast.error("Please select a recipe before updating.");
        return;
      }

      try {
        await dispatch(
          updatePo({
            itemId: formData.itemId,
            data: {
              ...formData,
              processes: processes.map((p) => ({ processId: p._id })),
            },
          })
        ).unwrap();
        dispatch(fetchProduct());
        toast.success("PO updated successfully");
        setIsEdit(false);
      } catch (err) {
        toast.error("Update failed: " + err.message);
      }
    }
  };

  const handleDelete = (itemId) => {
    if (!itemId) return;

    dispatch(deletePo({ itemId }))
      .unwrap()
      .then(() => {
        toast.success("Production Order deleted successfully");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        toast.error("Delete failed");
      })
      .finally(() => {
        setShowDeleteConfirm(false);
        setSelectedPOId(null);
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(processes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setProcesses(reordered);
  };

  const handleRecipeChange = (e) => {
    const recipeId = e.target.value;
    const selectedRecipe = recipes.find((r) => r._id === recipeId);

    setFormData((prev) => ({
      ...prev,
      recipeId,
      processes: selectedRecipe
        ? selectedRecipe.processes.map((p) => ({ processId: p._id }))
        : [],
    }));

    setProcesses(selectedRecipe?.processes || []);
  };

  return (
    <div className="p-2 sm:p-4 space-y-4 max-w-full text-sm sm:text-xs">
      <div className="mb-6">
        <h1 className="font-semibold text-xl text-center text-gray-800">
          Production Order Tracker
        </h1>
        <p className="text-sm text-center text-gray-500">
          Track your manufacturing progress in real-time
        </p>
      </div>

      {/* Filters */}
      <div className=" p-3 sm:p-5 shadow  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4 mb-6">
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
              className="border border-gray-300 rounded px-2 py-2 w-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="border border-gray-300 rounded mt-2 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded mt-2 px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PO List */}
        {loading ? (
          <div>
            <FullPageLoader />
          </div>
        ) : (
          <>
            <div className=" mt-10 p-5 rounded border">
              <h3 className="text-lg font-bold text-gray-600 mb-6 text-start">
                All Production Orders
              </h3>

              <div className="overflow-y-auto custom-scrollbar border border-gray-200 rounded-md min-h-[12rem] max-h-[12rem]">
                {filteredPOs.length === 0 ? (
                  <p className="text-gray-500 text-center">
                    No production orders found.
                  </p>
                ) : (
                  <ul className="space-y-3 px-1 py-2">
                    {filteredPOs.map((po) => (
                      <li
                        key={po._id}
                        className={`py-4 px-4 flex items-center justify-between gap-4 rounded-md
              cursor-pointer transition-all duration-200 ease-in-out
              ${
                selectedPO?._id === po._id
                  ? "bg-blue-50 border-l-4 border-blue-600 shadow-sm"
                  : "hover:border-l-4 hover:border-blue-400 hover:shadow-md hover:bg-white"
              }`}
                        onClick={() => setSelectedPO(po)}
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-4 flex-wrap">
                            <p className="text-base font-semibold text-blue-600">
                              {po.PONumber}
                            </p>
                            <p className="text-sm text-gray-700">
                              {po.customerName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <button
                            className="rounded-full p-1 bg-sky-100 hover:bg-sky-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditOrUpdate(po);
                            }}
                          >
                            <FaEdit className="text-sky-600" size={14} />
                          </button>
                          <button
                            className="rounded-full p-1 bg-red-100 hover:bg-red-200 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPOId(po.itemId);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <FaTrash className="text-red-500" size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {isEdit && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl border border-gray-200 relative">
                  <h2 className="text-lg font-bold text-sky-600 mb-4">
                    <span className="text-red-500 text-xl font-bold mr-2">
                      {isEdit ? "✎" : "+"}
                    </span>
                    Edit PO Details
                  </h2>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="PONumber"
                      value={formData.PONumber}
                      disabled
                      onChange={(e) =>
                        setFormData({ ...formData, PONumber: e.target.value })
                      }
                      className="border rounded px-2 py-2"
                    />
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-2"
                    />
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      className="border rounded px-2 py-2"
                    />
                    <input
                      type="date"
                      name="estimatedEndDate"
                      value={formData.estimatedEndDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedEndDate: e.target.value,
                        })
                      }
                      className="border rounded px-2 py-2"
                    />
                    <select
                      name="recipeId"
                      value={formData.recipeId}
                      onChange={handleRecipeChange}
                      className="border rounded px-2 py-2 col-span-2"
                    >
                      <option value="">-- Select Recipe --</option>
                      {recipes.length === 0 ? (
                        <option disabled>No recipes found</option>
                      ) : (
                        recipes.map((recipe) => (
                          <option key={recipe._id} value={recipe._id}>
                            {recipe.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
                      Processes
                    </h3>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="processes">
                        {(provided) => (
                          <div
                            className="bg-slate-50 border border-dashed border-slate-200 rounded min-h-[34px] flex flex-col gap-1 p-1"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {processes.length === 0 ? (
                              <div className="text-slate-300 text-xs text-center mt-1">
                                No processes added yet.
                              </div>
                            ) : (
                              processes.map((proc, idx) => (
                                <Draggable
                                  key={proc._id}
                                  draggableId={proc._id}
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      className={`flex items-center gap-2 bg-white rounded border border-slate-100 px-2 py-1 text-xs ${
                                        snapshot.isDragging ? "shadow-lg" : ""
                                      }`}
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <FaGripVertical className="text-slate-300 text-xs" />
                                      <span className="flex-1 text-slate-700 py-1">
                                        {proc.name}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    <div className="text-xs text-slate-400 mt-1 pl-1">
                      Select a recipe or add processes manually.
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setIsEdit(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditOrUpdate(null, true)}
                      className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                    >
                      Update PO
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
                <div className="bg-white rounded-xl shadow w-full max-w-xs p-3 border border-slate-200">
                  <h3 className="text-base font-bold text-red-500 mb-2">
                    Are you sure you want to delete this recipe?
                  </h3>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setSelectedPOId(null);
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(selectedPOId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gantt Chart */}
            {selectedPO && (
              <div className="bg-white p-2 sm:p-4 rounded-md shadow-md border mt-20">
                <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2 flex items-center gap-2 ">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                  Production Order:{" "}
                  <span className="text-blue-600">{selectedPO.PONumber}</span>
                </h2>

                <div className="flex flex-wrap justify-between w-full text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <FaUser />
                    <span>
                      <strong>Customer:</strong>{" "}
                      <span className="text-blue-600">
                        {selectedPO.customerName}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>
                      <strong>Start:</strong>{" "}
                      {safeFormat(selectedPO.startDate, "dd MMM yyyy")}
                    </span>
                  </div>
                  <div>
                    <strong>Delivery:</strong>{" "}
                    {safeFormat(selectedPO.estimatedEndDate, "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>Refernce Number:</strong>
                    <span className="text-blue-600">
                      {selectedPO?.RefNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuFactory />
                    <span>
                      <strong>Progress:</strong> {selectedPO.progress}%
                    </span>
                  </div>
                </div>

                {/* Chart Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th
                          className="w-32 sm:w-48 sticky left-0 bg-gray-100 z-10 text-left px-2 py-2 border-r"
                          rowSpan={2}
                        >
                          Task Name
                        </th>
                        <th
                          className="text-center px-2 py-2 border-r bg-gray-100 font-semibold"
                          colSpan={allChartDates.length}
                        >
                          {safeFormat(selectedPO.startDate, "dd MMM yyyy")} –{" "}
                          {safeFormat(
                            selectedPO.estimatedEndDate,
                            "dd MMM yyyy"
                          )}
                        </th>
                      </tr>
                      <tr className="bg-gray-100">
                        {allChartDates.map((date, idx) => {
                          const isTodayCol = isToday(date);
                          return (
                            <th
                              key={idx}
                              ref={isTodayCol ? todayRef : null}
                              className={`text-[10px] px-1 py-1 border-r text-center whitespace-nowrap ${
                                isTodayCol ? "bg-blue-200 font-bold" : ""
                              }`}
                              style={{ minWidth: `40px`, maxWidth: `60px` }}
                            >
                              {safeFormat(date, "dd MMM")}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO?.processes
                        ?.filter(
                          (p) =>
                            filters.status === "All" ||
                            p.processId.status === filters.status
                        )
                        .map((p) => {
                          const process = p.processId;
                          if (isEdit && editTask?._id === p._id) {
                            console.log("Hiding graph for:", p._id);
                            return null;
                          }

                          const start = new Date(p.startDateTime);
                          const end = new Date(p.endDateTime);
                          const startIndex = allChartDates.findIndex((date) =>
                            isSameDay(start, date)
                          );
                          const endIndex = allChartDates.findIndex((date) =>
                            isSameDay(end, date)
                          );

                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          const startDate = new Date(start);
                          startDate.setHours(0, 0, 0, 0);

                          const endDate = new Date(end);
                          endDate.setHours(0, 0, 0, 0);

                          let barColor = "bg-gray-400";
                          let status = "Not Started";

                          if (
                            isSameDay(today, startDate) ||
                            isSameDay(today, endDate) ||
                            (startDate < today && endDate > today)
                          ) {
                            //  Today is inside process range
                            barColor = "bg-yellow-300";
                            status = "In Progress";
                          } else if (endDate < today) {
                            // ✅ Already finished
                            barColor = "bg-green-500";
                            status = "Completed";
                          }

                          return (
                            <tr key={p._id} className="h-10 border-t relative">
                              <td
                                className="sticky left-0 bg-white border-r px-1 z-10 text-xs font-medium whitespace-nowrap group cursor-pointer hover:bg-blue-50 transition"
                                onClick={() => {
                                  const startDate = p.startDateTime
                                    ? safeFormat(
                                        new Date(p.startDateTime),
                                        "yyyy-MM-dd"
                                      )
                                    : "";
                                  const endDate = p.endDateTime
                                    ? safeFormat(
                                        new Date(p.endDateTime),
                                        "yyyy-MM-dd"
                                      )
                                    : "";

                                  setEditTask({
                                    ...p,
                                    name: process.name,
                                    start: startDate,
                                    end: endDate,
                                  });
                                }}
                              >
                                <div className="flex items-center justify-between group-hover:bg-blue-50 px-1 py-1 rounded transition-all duration-200">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                        process.status === "Completed"
                                          ? "bg-green-100 text-green-700"
                                          : process.status === "In Progress"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {process.status}
                                    </span>

                                    <span className="font-medium text-gray-700 group-hover:text-blue-700 transition">
                                      {process.name}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleEdit(process)}
                                    className="text-gray-400 hover:text-blue-600 transition-all transform hover:scale-110 duration-200"
                                    title="Edit process"
                                  >
                                    <FaRegEdit className="text-lg" />
                                  </button>
                                </div>
                              </td>
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
                                        className={`h-6 ${barColor} rounded cursor-pointer group`}
                                      >
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

                {/* Edit Modal */}
                {editTask && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-md shadow p-4 w-[95%] max-w-xs text-xs">
                      <h3 className="font-semibold text-lg mb-2">Edit Task</h3>
                      <p className="text-md font-bold mb-4 p-4 border rounded bg-blue-100">
                        {editTask.name}
                      </p>

                      {/* Start Date */}
                      <label className="block text-xs mb-1">Start Date</label>
                      <input
                        type="date"
                        value={safeFormat(
                          new Date(editTask.start),
                          "yyyy-MM-dd"
                        )}
                        // min={safeFormat(new Date(selectedPO.startDate), "yyyy-MM-dd")}
                        onChange={(e) => updateTask("start", e.target.value)}
                        className="border p-2 rounded w-full mb-1"
                      />
                      {formErrors.start && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.start}
                        </p>
                      )}

                      {/* End Date */}
                      <label className="block text-xs mb-1 mt-4">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editTask.end}
                        min={editTask.start}
                        onChange={(e) => updateTask("end", e.target.value)}
                        className="border p-2 rounded w-full mb-1"
                      />
                      {formErrors.end && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.end}
                        </p>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditTask(null)}
                          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
