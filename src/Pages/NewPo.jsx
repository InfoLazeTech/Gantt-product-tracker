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
      const recipeProcesses = selectedRecipe.processes.map((p) => p );
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
        processId: p?._id, // This assumes you’re passing process IDs
      })),
    };

    dispatch(createProduct(payload));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg border border-gray-400 p-0">
        <div className="px-6 pt-6 pb-3 border-b border-gray-100 text-center">
          <h2 className="text-lg font-bold text-gray-800 flex items-center justify-center gap-2">
            <FaClipboardList className="text-green-500" />
            New Production Order
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Start tracking your manufacturing process efficiently.
          </p>
        </div>

        <form className="px-6 py-6 space-y-6" onSubmit={handleCreateProduct}>
          {/* Order Details */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Order Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="poNumber"
                  className="block text-xs text-gray-500 font-medium mb-1"
                >
                  PO Number
                </label>
                <div className="relative">
                  <FaHashtag className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="text"
                    id="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    placeholder="PO Number"
                    required
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full bg-gray-50 text-gray-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs text-gray-500 font-medium mb-1"
                >
                  Customer Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="text"
                    id="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Customer Name"
                    required
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full bg-gray-50 text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Schedule
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs text-gray-500 font-medium mb-1"
                >
                  Start Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full bg-gray-50 text-gray-800 text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="estimatedDate"
                  className="block text-xs text-gray-500 font-medium mb-1"
                >
                  Estimated Date
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                  <input
                    type="date"
                    id="estimatedDate"
                    value={formData.estimatedDate}
                    onChange={handleInputChange}
                    className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full bg-gray-50 text-gray-800 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="recipe"
                className="block text-xs text-gray-500 font-medium mb-1"
              >
                Recipe
              </label>
              <div className="relative">
                <FaClipboardList className="absolute left-2 top-2.5 text-gray-300 text-xs" />
                <select
                  id="recipe"
                  value={formData.recipe}
                  onChange={handleInputChange}
                  required
                  className="pl-7 pr-2 py-1.5 border border-gray-200 rounded-md w-full bg-gray-50 text-gray-800 text-sm"
                >
                  <option value="">-- Select Recipe --</option>{" "}
                  {/* ✅ Add default option */}
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
            <h3 className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
              Processes
            </h3>
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md min-h-[40px] flex flex-col gap-1 p-2">
              {processes.length === 0 ? (
                <div className="text-gray-300 text-xs text-center">
                  No processes added yet.
                </div>
              ) : (
                processes.map((proc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white rounded border border-gray-100 px-2 py-1 text-sm"
                  >
                    <FaGripVertical className="text-gray-300 text-xs" />
                    <span className="flex-1 text-gray-700">{proc.name}</span>
                    {/* <button
                      type="button"
                      // onClick={() => handleRemoveProcess(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTrash />
                    </button> */}
                  </div>
                ))
              )}
            </div>
            <div className="text-xs text-gray-400 mt-1 pl-1">
              Select a recipe or add processes manually.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold text-sm shadow hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Production Order"}
          </button>

          {/* Feedback */}
          {message && (
            <div className="text-green-600 text-sm text-center mt-2">
              {message}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm text-center mt-2">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProductionOrderForm;
