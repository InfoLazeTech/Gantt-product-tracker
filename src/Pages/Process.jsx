import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProcess,
  deleteProcess,
  fetchProcess,
  updateProcess,
} from "../redux/features/processSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import FullPageLoader from "../components/Loader/Loader";

export default function Process() {
  const dispatch = useDispatch();
  const { process, loading } = useSelector((state) => state.process);
  const [showModal, setShowModal] = useState(false);
  const [processName, setProcessName] = useState("");
  const [description, setDescription] = useState("");
  const [days, setDays] = useState(""); // initialize as empty string
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState(null);

  useEffect(() => {
    dispatch(fetchProcess());
  }, [dispatch]);

  console.log(process);

  const resetForm = () => {
    setShowModal(false);
    setProcessName("");
    setDescription("");
    setDays("");
    setIsEditMode(false);
    setEditId(null);
  };

  const handleSubmitProcess = () => {
    if (!processName || !description || !days) {
      toast.error("All fields are required");
      return;
    }

    const processData = {
      name: processName,
      description,
      day: days,
    };

    if (isEditMode && editId) {
      dispatch(updateProcess({ id: editId, updatedProcess: processData }))
        .unwrap()
        .then(() => {
          dispatch(fetchProcess()); // ✅ refresh list after update
          resetForm();
          // toast.success("Process updated successfully");
        })
        .catch((error) => {
          console.error("Update failed:", error);
          toast.error("Update failed");
        });
    } else {
      dispatch(addProcess(processData))
        .unwrap()
        .then(() => {
          dispatch(fetchProcess()); // ✅ refresh list after add
          resetForm();
          toast.success("Process added successfully");
        })
        .catch((error) => {
          console.error("Add failed:", error);
          toast.error("Add failed");
        });
    }
  };

  const confirmDeleteProcess = () => {
    if (!selectedProcessId) return;

    dispatch(deleteProcess(selectedProcessId))
      .unwrap()
      .then(() => {
        dispatch(fetchProcess());
        toast.success("Process deleted successfully");
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
        <h2 className="text-xl font-bold text-slate-900">Process</h2>
        <button
          className="bg-slate-900 hover:bg-slate-500 text-white px-3 py-1.5 rounded-md shadow text-sm font-semibold transition-colors"
          onClick={() => setShowModal(true)}
        >
          + Add Process
        </button>
      </div>

      {/* Table Design */}
      <div className="overflow-x-auto bg-white p-4 rounded-xl shadow border border-slate-200">
        <table className="min-w-full text-left text-xs border border-slate-200">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-2 py-2 border-b">#</th>
              <th className="px-2 py-2 border-b">Process ID</th>
              <th className="px-2 py-2 border-b">Name</th>
              <th className="px-2 py-2 border-b">Description</th>
              <th className="px-2 py-2 border-b">Days</th>
              <th className="px-2 py-2 border-b">Actions</th>
            </tr>
          </thead>
          {loading ?
            (
              <tr>
                <td colSpan="6">
                  <div className="flex justify-center items-center">
                    <FullPageLoader />
                  </div>
                </td>
              </tr>
            ) :
            (
              <tbody>
                {Array.isArray(process.processes) &&
                  process.processes.length > 0 ? (
                  process.processes.map((item, idx) => (
                    <tr
                      key={item._id || idx}
                      className="hover:bg-sky-50 text-slate-800 transition-colors text-xs"
                    >
                      <td className="px-2 py-2 border-b">{idx + 1}</td>
                      <td className="px-2 py-2 border-b">{item.processId || "-"}</td>
                      <td className="px-2 py-2 border-b font-semibold text-sky-700">{item.name}</td>
                      <td className="px-2 py-2 border-b">{item.description}</td>
                      <td className="px-2 py-2 border-b">{item.day || "-"}</td>
                      <td className="px-2 py-2 border-b">
                        <button
                          className="rounded-full p-1 bg-sky-100 hover:bg-sky-200 transition-colors mr-1"
                          onClick={() => {
                            setProcessName(item.name ?? "");
                            setDescription(item.description ?? "");
                            setDays(item.day?.toString() ?? "");
                            setEditId(item.processId);
                            setIsEditMode(true);
                            setShowModal(true);
                          }}
                        >
                          <FaEdit className="text-sky-600" size={14} />
                        </button>
                        <button
                          className="rounded-full p-1 bg-red-100 hover:bg-red-200 transition-colors"
                          onClick={() => {
                            setSelectedProcessId(item.processId);
                            setShowDeleteConfirm(true);
                          }}
                        >
                          <FaTrash className="text-red-500" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-3 text-slate-400 text-xs">
                      No process data found.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-xl space-y-4 relative border border-slate-200">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold text-sky-700">{isEditMode ? "Edit Process" : "Add New Process"}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 text-xl leading-none font-bold transition-colors"
              >
                ×
              </button>
            </div>
            <div className="grid gap-2">
              <input
                type="text"
                placeholder="Process Name"
                value={processName ?? ""}
                onChange={(e) => setProcessName(e.target.value)}
                className="border border-slate-300 px-3 py-1.5 rounded focus:ring-2 focus:ring-sky-400 text-sm"
              />
              <input
                type="text"
                placeholder="Description"
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-slate-300 px-3 py-1.5 rounded focus:ring-2 focus:ring-sky-400 text-sm"
              />
              <input
                type="number"
                placeholder="Days"
                value={days ?? ""}
                onChange={(e) => setDays(e.target.value)}
                className="border border-slate-300 px-3 py-1.5 rounded focus:ring-2 focus:ring-sky-400 text-sm"
              />
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded mr-2 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-1.5 rounded text-xs font-semibold transition-colors"
                onClick={handleSubmitProcess}
              >
                {isEditMode ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-xl w-full max-w-xs shadow-xl space-y-3 border border-slate-200">
            <h3 className="text-base font-bold text-red-500">Confirm Deletion</h3>
            <p className="text-slate-600 text-xs">Are you sure you want to delete this process?</p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedProcessId(null);
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-1.5 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProcess}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors"
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
