import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProcess, fetchProcess } from '../redux/features/processSlice';
import { toast } from 'react-toastify';
import { FaTrash,FaEdit } from 'react-icons/fa';

export default function Process() {
  const dispatch = useDispatch();
  const { process, loading, error, message } = useSelector((state) => state.process);
  const [showModal, setShowModal] = useState(false);
  const [processName, setProcessName] = useState('');
  const [description, setDescription] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => {
    dispatch(fetchProcess());
  }, [dispatch]);

  console.log(process); 

  const handleAddProcess = async () => {
    const resultAction = await dispatch(addProcess({
      name: processName,
      description: description,
      day: days
    }));

    // Check if the action was fulfilled (success)
    if (addProcess.fulfilled.match(resultAction)) {
      dispatch(fetchProcess());
      setShowModal(false);
      setProcessName('');
      setDescription('');
      setDays('');
      toast.success('Process created successfully!');
    } else {
      // Show error toast with backend error message if available
      const errorMsg = resultAction.error?.message || 'Failed to create process';
      toast.error(errorMsg);
    }
  };  

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Process</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
          onClick={() => setShowModal(true)}
        >
          + Add
        </button>
      </div>

      {/* Table Design */}
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
        <table className="min-w-full text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">#</th>
              <th className="px-4 py-3 border-b">Process ID</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Description</th>
              <th className="px-4 py-3 border-b">Days</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(process.processes) && process.processes.length > 0 ? (
              process.processes.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-gray-50 text-gray-800">
                  <td className="px-4 py-3 border-b">{idx + 1}</td>
                  <td className="px-4 py-3 border-b">{item.processId || '-'}</td>
                  <td className="px-4 py-3 border-b">{item.name}</td>
                  <td className="px-4 py-3 border-b">{item.description}</td>
                  <td className="px-4 py-3 border-b">{item.day || '-'}</td>
                  <td className="px-4 py-3 border-b">
                    <button
                      className="rounded-full p-2 bg-blue-100 hover:bg-blue-200 transition-colors mr-2"
                      title="Edit"
                     
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                    <button
                      className="rounded-full p-2 bg-red-100 hover:bg-red-200 transition-colors"
                      title="Delete"
                     
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-400">
                  No process data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl w-full max-w-2xl shadow-lg space-y-6 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-700">Add New Process</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-red-600 text-2xl leading-none font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Process Name"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Days"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                onClick={handleAddProcess}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
