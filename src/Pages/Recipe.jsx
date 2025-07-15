import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipe } from "../redux/features/recipeSlice";

export default function Recipe() {
  const dispatch = useDispatch();
  const { recipe, loading, error, message } = useSelector((state) => state.recipe);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRecipe());
  }, [dispatch]);

  console.log(recipe);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recipe</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          + Add
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
        <table className="min-w-full text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Recipe ID</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Description</th>
              <th className="px-4 py-3 border-b">Processes</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(recipe.recipes) && recipe.recipes.length > 0 ? (
              recipe.recipes.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 text-gray-800">
                  <td className="px-4 py-3 border-b">{idx + 1}</td>
                  <td className="px-4 py-3 border-b">{item.recipeId}</td>
                  <td className="px-4 py-3 border-b">{item.name}</td>
                  <td className="px-4 py-3 border-b">{item.description}</td>
                  <td className="px-4 py-3 border-b">{item.processes.map((process) => process.name).join(', ')}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No recipe data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-lg space-y-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-800">
                <span className="text-blue-600 text-2xl font-bold mr-2">+</span>
                Create New Recipe
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Recipe Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipe Name
              </label>
              <input
                type="text"
                placeholder=""
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Available Processes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Processes
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
                {[
                  "Design",
                  "Assembly",
                  "Packaging",
                  "Material Procurement",
                  "Quality Control",
                  "Shipping",
                ].map((process, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>{process}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Processes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Processes in Recipe (Drag to Reorder)
              </label>
              <div className="min-h-[80px] border border-gray-200 rounded-lg px-4 py-3 text-gray-500">
                No processes selected. Add some from above.
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Create Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
