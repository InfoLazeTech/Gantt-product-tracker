import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipe, addRecipe } from "../redux/features/recipeSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchProcess } from "../redux/features/processSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Recipe() {
  const dispatch = useDispatch();
  const { recipe, loading, error, message } = useSelector((state) => state.recipe);
  const { process } = useSelector((state) => state.process);
  const [showModal, setShowModal] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState([]);

  useEffect(() => {
    dispatch(fetchRecipe());
    dispatch(fetchProcess());
  }, [dispatch]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedProcesses((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedProcesses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedProcesses(items);
  };

  const handleCreateRecipe = async () => {
    if (!recipeName.trim()) {
      toast.error("Recipe name is required.");
      return;
    }
    const payload = {
      name: recipeName,
      description,
      processId: selectedProcesses,
    };
    try {
      const result = await dispatch(addRecipe(payload));
      console.log("result",result);
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Recipe created successfully");
        dispatch(fetchRecipe());
        setShowModal(false);
        setRecipeName("");
        setDescription("");
        setSelectedProcesses([]);
      }
    } catch (err) {
      toast.error("Failed to create recipe");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Recipe</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          + Add Recipe
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
              <th className="px-4 py-3 border-b">Action</th>
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
                  <td className="px-4 py-3 border-b">
                    {item.processes.map((p) => p.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <button className="rounded-full p-2 bg-blue-100 hover:bg-blue-200 transition-colors mr-2" title="Edit">
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button className="rounded-full p-2 bg-red-100 hover:bg-red-200 transition-colors" title="Delete">
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400">
                  No recipe data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
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

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-4 space-y-5 flex-1">
              {/* Recipe Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter recipe name"
                />
              </div>

              {/* Recipe Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description here..."
                />
              </div>

              {/* Available Processes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Processes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {process?.processes?.map((process) => (
                    <label key={process._id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={process._id}
                        checked={selectedProcesses.includes(process._id)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span>{process.name}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Selected Processes */}
              <div className="bg-white rounded-xl shadow p-5">
                <label className="block text-base font-semibold text-gray-800 mb-3">
                  Processes in Recipe <span className="text-sm text-gray-500">(Drag to Reorder)</span>
                </label>

                <div className="border rounded-md bg-gray-50 p-3">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="selectedProcesses">
                      {(provided) => (
                        <ul
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2"
                        >
                          {selectedProcesses.length === 0 ? (
                            <li className="text-gray-400 italic px-2 py-1">
                              No processes selected. Please select from above.
                            </li>
                          ) : (
                            selectedProcesses.map((procId, i) => {
                              const procObj = process?.processes?.find((p) => p._id === procId);
                              return (
                                <Draggable key={procId} draggableId={procId} index={i}>
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center justify-between bg-white border border-gray-200 rounded-md px-4 py-2 shadow-sm hover:shadow-md transition duration-200 ease-in-out cursor-move"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-lg">☰</span>
                                        <span className="text-gray-800 font-medium">
                                          {procObj ? procObj.name : procId}
                                        </span>
                                      </div>
                                    </li>
                                  )}
                                </Draggable>
                              );
                            })
                          )}
                          {provided.placeholder}
                        </ul>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRecipe}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create Recipe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
