import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import apiClient from '../../../services/apiClient';
import { toast } from 'react-toastify';
import EditTaskModal from '../../../components/EditTaskModal';

const ViewSalesmanTasks = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [salesman, setSalesman] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/salesman-targets/tasks/${id}`);
      if (response.data.success) {
        const { tasks } = response.data;

        const { pending, completed } = tasks.reduce((acc, task) => {
          if (task.status === 'completed') {
            acc.completed.push(task);
          } else {
            acc.pending.push(task);
          }
          return acc;
        }, { pending: [], completed: [] });

        setTasks({ pending, completed });
        setSalesman(response.data.employee);
      } else {
        toast.error(response.data.message || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(`/salesman-targets/tasks/${taskId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        // Update local state
        setTasks(prev => {
          const updatedTasks = { ...prev };
          
          if (newStatus === 'completed') {
            // Move from pending to completed
            const taskIndex = updatedTasks.pending.findIndex(t => t._id === taskId);
            if (taskIndex !== -1) {
              const [movedTask] = updatedTasks.pending.splice(taskIndex, 1);
              movedTask.status = 'completed';
              updatedTasks.completed.push(movedTask);
            }
          } else {
            // Move from completed to pending
            const taskIndex = updatedTasks.completed.findIndex(t => t._id === taskId);
            if (taskIndex !== -1) {
              const [movedTask] = updatedTasks.completed.splice(taskIndex, 1);
              movedTask.status = 'pending';
              updatedTasks.pending.push(movedTask);
            }
          }
          
          return updatedTasks;
        });
      } else {
        toast.error(response.data.message || "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask) => {
    setTasks(prev => {
      const updatedTasks = { ...prev };

      // Update in pending array
      const pendingIndex = updatedTasks.pending.findIndex(t => t._id === updatedTask._id);
      if (pendingIndex !== -1) {
        updatedTasks.pending[pendingIndex] = updatedTask;
      }

      // Update in completed array
      const completedIndex = updatedTasks.completed.findIndex(t => t._id === updatedTask._id);
      if (completedIndex !== -1) {
        updatedTasks.completed[completedIndex] = updatedTask;
      }

      return updatedTasks;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {salesman ? `Tasks for ${salesman.fullName} (${salesman.employeeId})` : 'Salesman Tasks'}
        </h1>
        <p className="text-gray-600">Manage and track tasks assigned to this salesman</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({tasks.pending.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({tasks.completed.length})
            </button>
          </nav>
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'pending' && (
            <div>
              {tasks.pending.length > 0 ? (
                <div className="space-y-4">
                  {tasks.pending.map((task, index) => (
                    <div key={task._id || index} className="border rounded-lg p-5 bg-gray-50 mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-line">{task.description}</p>

                      {task.images?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Attached Images ({task.images.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {task.images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`}
                                  className="w-full h-48 object-cover rounded-lg border shadow hover:shadow-lg transition-shadow"
                                  alt={`Task ${index+1} - Image ${idx+1}`}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    e.target.className = 'w-full h-48 object-cover rounded-lg border bg-gray-100 flex items-center justify-center';
                                  }}
                                />

                                <a
                                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg"
                                >
                                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0l3-3m-3 3l-3-3" />
                                    </svg>
                                    View Full
                                  </span>
                                </a>

                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                  {idx + 1}/{task.images.length}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusChange(task._id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No pending tasks</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div>
              {tasks.completed.length > 0 ? (
                <div className="space-y-4">
                  {tasks.completed.map((task, index) => (
                    <div key={task._id || index} className="border rounded-lg p-5 bg-green-50 mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            {task.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(task.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-line">{task.description}</p>

                      {task.images?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Attached Images ({task.images.length})
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {task.images.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`}
                                  className="w-full h-48 object-cover rounded-lg border shadow hover:shadow-lg transition-shadow"
                                  alt={`Task ${index+1} - Image ${idx+1}`}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    e.target.className = 'w-full h-48 object-cover rounded-lg border bg-gray-100 flex items-center justify-center';
                                  }}
                                />

                                <a
                                  href={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg"
                                >
                                  <span className="bg-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m0 0l3-3m-3 3l-3-3" />
                                    </svg>
                                    View Full
                                  </span>
                                </a>

                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                  {idx + 1}/{task.images.length}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleStatusChange(task._id, 'pending')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                        >
                          Reopen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Edit Task</h2>
              <button 
                onClick={() => setEditModalOpen(false)} 
                className="text-3xl hover:text-red-600"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={selectedTask.title}
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={selectedTask.description}
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {selectedTask.images && selectedTask.images.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Current Images</label>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedTask.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={`${import.meta.env.VITE_API_URL}${img}`}
                          className="w-full h-32 object-cover rounded-lg border"
                          alt={`Task ${idx+1}`}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleSaveTask(selectedTask);
                    setEditModalOpen(false);
                  }}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Save Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={selectedTask}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default ViewSalesmanTasks;