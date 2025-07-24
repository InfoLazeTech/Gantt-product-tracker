import React, { useEffect, useState } from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaUser,
  FaHashtag,
  FaTrash,
  FaGripVertical,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../redux/features/productSlice";
import { fetchRecipe } from "../redux/features/recipeSlice";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

const ProductionOrderForm = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRecipe());
  }, [dispatch]);
  const { recipes } = useSelector((state) => state.recipe);


  const [formData, setFormData] = useState({
    poNumber: "",
    customerName: "",
    startDate: "",
    estimatedDate: "",
    recipe: "",
  });

  const [processes, setProcesses] = useState([]);

  const { loading, error, message } = useSelector((state) => state.product);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === "recipe") {
      const selectedRecipe = recipes.find((r) => r._id === value);
      if (selectedRecipe) {
        const recipeProcesses = selectedRecipe.processes.map((p) => p);
        setProcesses(recipeProcesses); // 👈 Set the process names
        console.log(recipeProcesses);
      } else {
        setProcesses([]);
        console.warn("Selected recipe has no processes or is invalid", selectedRecipe);
      }
    }
  };


  // const handleRemoveProcess = (index) => {
  //   setProcesses(processes.filter((_, i) => i !== index));
  // };

  const handleCreateProduct = (e) => {
    e.preventDefault();

    const payload = {
      PONumber: formData.poNumber,
      customerName: formData.customerName,
      startDate: formData.startDate,
      estimatedEndDate: formData.estimatedDate,
      recipeId: formData.recipe, // ensure this is the ObjectId
      processes: processes.map((p) => ({
        processId: p?._id, // This assumes you're passing process IDs
      })),
    };

    dispatch(createProduct(payload));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(processes);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setProcesses(reordered);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-2 sm:py-4 pb-24">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow border border-slate-300 p-2 sm:p-4">
        <div className="px-4 pt-4 pb-2 border-b border-slate-100 text-center">
          <h2 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
            <FaClipboardList className="text-sky-400" />
            New Production Order
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Start tracking your manufacturing process efficiently.
          </p>
        </div>
        <form className="px-0 sm:px-4 py-4 space-y-6" onSubmit={handleCreateProduct}>
          {/* Order Details */}
          <div>
            <h3 className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
              Order Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="poNumber" className="block text-xs text-slate-500 font-medium mb-1">
                  PO Number
                </label>
                <div className="relative">
                  <FaHashtag className="absolute left-2 top-2 text-slate-300 text-xs" />
                  <input
                    type="text"
                    id="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    placeholder="PO Number"
                    required
                    className="pl-6 pr-2 py-1.5 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="customerName" className="block text-xs text-slate-500 font-medium mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-2 top-2 text-slate-300 text-xs" />
                  <input
                    type="text"
                    id="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Customer Name"
                    required
                    className="pl-6 pr-2 py-1.5 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
              Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-xs text-slate-500 font-medium mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2 text-slate-300 text-xs" />
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="pl-6 pr-2 py-1.5 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="estimatedDate" className="block text-xs text-slate-500 font-medium mb-1">
                  Estimated Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2 text-slate-300 text-xs" />
                  <input
                    type="date"
                    id="estimatedDate"
                    value={formData.estimatedDate}
                    onChange={handleInputChange}
                    className="pl-6 pr-2 py-1.5 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="recipe" className="block text-xs text-slate-500 font-medium mb-1">
                Recipe
              </label>
              <div className="relative">
                <FaClipboardList className="absolute left-2 top-2 text-slate-300 text-xs" />
                <select
                  id="recipe"
                  value={formData.recipe}
                  onChange={handleInputChange}
                  required
                  className="pl-6 pr-2 py-1.5 border border-slate-200 rounded-md w-full bg-slate-50 text-slate-900 text-xs"
                >
                  <option value="">-- Select Recipe --</option>
                  {recipes?.map((recipe) => (
                    <option key={recipe._id} value={recipe._id}>
                      {recipe.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Processes */}
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
                        <Draggable key={proc._id} draggableId={proc._id} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              className={`flex items-center gap-2 bg-white rounded border border-slate-100 px-2 py-1 text-xs ${snapshot.isDragging ? "shadow-lg" : ""}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <FaGripVertical className="text-slate-300 text-xs" />
                              <span className="flex-1 text-slate-700 py-1">{proc.name}</span>
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
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-sky-400 text-white font-semibold text-xs shadow hover:bg-sky-500 transition"
          >
            {loading ? "Creating..." : "Create Production Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
