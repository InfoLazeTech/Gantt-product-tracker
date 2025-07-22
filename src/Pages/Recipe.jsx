import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
} from "../redux/features/recipeSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchProcess } from "../redux/features/processSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function Recipe() {
  const dispatch = useDispatch();
  const { recipes, loading } = useSelector((state) => state.recipe);
  const { process } = useSelector((state) => state.process);

  const [showModal, setShowModal] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState(null);

  useEffect(() => {
    dispatch(fetchRecipe());
    dispatch(fetchProcess());
  }, [dispatch]);

  const resetForm = () => {
    setRecipeName("");
    setDescription("");
    setSelectedProcesses([]);
    setIsEditMode(false);
    setEditingRecipeId(null);
  };

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

  const handleSubmitRecipe = async () => {
    if (!recipeName.trim()) {
      toast.error("Recipe name is required.");
      return;
    }

    const payload = {
      name: recipeName,
      description,
      processes: selectedProcesses,
    };

    try {
      let result;
      if (isEditMode) {
        const selectedRecipe = recipes.find(
          (r) => r._id === editingRecipeId
        );
        if (!selectedRecipe) {
          toast.error("Could not find recipe to update.");
          return;
        }

        console.log("🧩 Selected Recipe for Edit:", selectedRecipe);
        console.log("📦 Updating Recipe with ID:", selectedRecipe.recipeId);

        result = await dispatch(
          updateRecipe({
            id: selectedRecipe.recipeId,
            updateRecipeData: {
              name: recipeName,
              description,
              processes: selectedProcesses,
            },
          })
        );
      } else {
        result = await dispatch(addRecipe(payload));
      }

      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchRecipe());
        setShowModal(false);
        resetForm();
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const handleDeleteRecipe = () => {
    if (!selectedProcessId) return;
    dispatch(deleteRecipe({ id: selectedProcessId }))
      .unwrap()
      .then(() => {
        toast.success("Recipe deleted successfully");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
        toast.error("Delete failed");
      })
      .finally(() => {
        setShowDeleteConfirm(false);
        setSelectedProcessId(null);
      });
  };


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Recipe</h2>
        <button
          className="bg-slate-900 hover:bg-slate-500 text-white px-3 py-1.5 rounded-md shadow text-sm font-semibold transition-colors"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Recipe
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow border border-slate-200">
        <table className="min-w-full text-left text-xs border border-slate-200">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-2 py-2 border-b">#</th>
              <th className="px-2 py-2 border-b">Recipe ID</th>
              <th className="px-2 py-2 border-b">Name</th>
              <th className="px-2 py-2 border-b">Description</th>
              <th className="px-2 py-2 border-b">Processes</th>
              <th className="px-2 py-2 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(recipes) && recipes.length > 0 ? (
              recipes.map((item, idx) => (
                <tr
                  key={item._id || idx}
                  className="hover:bg-sky-50 text-slate-800 transition-colors text-xs"
                >
                  <td className="px-2 py-2 border-b">{idx + 1}</td>
                  <td className="px-2 py-2 border-b">{item.recipeId}</td>
                  <td className="px-2 py-2 border-b font-semibold text-sky-700">{item.name}</td>
                  <td className="px-2 py-2 border-b">{item.description}</td>
                  <td className="px-2 py-2 border-b">
                    {item.processes?.map((p) => p?.name || p)?.join(" -> ") ||
                      "No Process"}
                  </td>
                  <td className="px-2 py-2 border-b">
                    <button
                      className="rounded-full p-1 bg-sky-100 hover:bg-sky-200 transition-colors mr-1"
                      title="Edit"
                      onClick={() => {
                        setIsEditMode(true);
                        setEditingRecipeId(item._id);
                        setRecipeName(item.name);
                        setDescription(item.description);
                        setSelectedProcesses(item.processes.map((p) => p._id));
                        setShowModal(true);
                      }}
                    >
                      <FaEdit className="text-sky-600" size={14} />
                    </button>
                    <button
                      className="rounded-full p-1 bg-pink-100 hover:bg-pink-200 transition-colors"
                      onClick={() => {
                        setSelectedProcessId(item.recipeId);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      <FaTrash className="text-pink-400" size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-3 text-slate-400 text-xs">
                  No recipe data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl shadow w-full max-w-md flex flex-col max-h-[90vh] border border-slate-200">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="text-lg font-bold text-sky-700">
                <span className="text-pink-500 text-xl font-bold mr-2">
                  {isEditMode ? "✎" : "+"}
                </span>
                {isEditMode ? "Edit Recipe" : "Create New Recipe"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-pink-500 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-2 space-y-3 flex-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Recipe Name
                </label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-1.5 rounded focus:ring-2 focus:ring-sky-400 text-xs"
                  placeholder="Enter recipe name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 px-3 py-1.5 rounded focus:ring-2 focus:ring-sky-400 text-xs"
                  placeholder="Enter description here..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Available Processes
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border border-slate-200 rounded p-2 max-h-40 overflow-y-auto">
                  {process?.processes?.map((proc) => (
                    <label
                      key={proc._id}
                      className="flex items-center space-x-1 text-xs"
                    >
                      <input
                        type="checkbox"
                        value={proc._id}
                        checked={selectedProcesses.includes(proc._id)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-3 w-3 text-pink-500 focus:ring-pink-500"
                      />
                      <span>{proc.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded shadow p-2">
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Processes in Recipe <span className="text-xs text-slate-400">(Drag to Reorder)</span>
                </label>
                <div className="border rounded bg-slate-50 p-2">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="selectedProcesses">
                      {(provided) => (
                        <ul
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-1"
                        >
                          {selectedProcesses.length === 0 ? (
                            <li className="text-slate-400 italic px-2 py-1 text-xs">
                              No processes selected. Please select from above.
                            </li>
                          ) : (
                            selectedProcesses.map((procId, i) => {
                              const procObj = process?.processes?.find(
                                (p) => p._id === procId
                              );
                              return (
                                <Draggable
                                  key={procId}
                                  draggableId={procId}
                                  index={i}
                                >
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="flex items-center justify-between bg-white border border-slate-200 rounded px-2 py-1 shadow-sm hover:shadow-md transition duration-200 ease-in-out cursor-move text-xs"
                                    >
                                      <div className="flex items-center gap-1">
                                        <span className="text-pink-400 text-base">☰</span>
                                        <span className="text-slate-800 font-medium">
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
            <div className="px-4 py-2 border-t text-right">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded mr-2 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRecipe}
                className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                {isEditMode ? "Update Recipe" : "Create Recipe"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl shadow w-full max-w-xs p-3 border border-slate-200">
            <h3 className="text-base font-bold text-pink-500 mb-2">Are you sure you want to delete this recipe?</h3>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedProcessId(null);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRecipe}
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
