


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient, { apiEndpoints } from '../../../../services/apiClient';
import EditTaskModal from '../../../../components/EditTaskModal';

const TaskModal = ({ isOpen, onClose, employee, task, isEditMode: initialEditMode }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(''); // Add title state
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // ✅ Environment variable for base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  console.log("API Base URL:", API_BASE_URL);

  const isViewMode = task && !initialEditMode;
  const isMultiple = Array.isArray(task);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setImages([]);
    }
  }, [isOpen]);

  // ✅ Function to get complete image URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    
    if (imgPath.startsWith('http')) {
      return imgPath;
    }
    
    if (imgPath.startsWith('/')) {
      // Absolute path like "/uploads/tasks/filename.jpg"
      return `${API_BASE_URL}${imgPath}`;
    }
    
    // Relative path like "filename.jpg"
    return `${API_BASE_URL}/uploads/tasks/${imgPath}`;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      toast.error("Max 10 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title required");
    if (!description.trim()) return toast.error("Description required");
    if (!employee?._id) return toast.error("Employee not selected");

    setLoading(true);
    const formData = new FormData();
    formData.append('employeeId', employee._id);
    formData.append('title', title.trim());
    formData.append('description', description);

    images.forEach((img) => {
      formData.append('images', img);
    });

    try {
      const response = await apiClient.post('/salesman-targets/add-task', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("✅ Task added response:", response.data);

      if (response.data.success) {
        toast.success("✅ Task added successfully!");
        onClose(true); // This will trigger a refresh in the parent component
      } else {
        toast.error(response.data.message || "Failed to add task");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      toast.error("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(`/salesman-targets/tasks/${taskId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success(`Task marked as ${newStatus}`);
        // Refresh data to reflect changes
        onClose(true);
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to update task status');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
      return false;
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleSaveEditedTask = (updatedTask) => {
    // Update the task in the local state
    // Since we're passing tasks as props, we need to trigger a refresh
    onClose(true); // Close and refresh parent
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isMultiple ? 'All Tasks' : isViewMode ? 'View Task' : 'Add New Task'}
          </h2>
          <div className="flex gap-2">
            {isMultiple && employee && (
              <button
                onClick={() => navigate(`/admin/employee/salesperson/${employee._id}/task-summary`)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
              >
                Task Summary
              </button>
            )}
            <button onClick={() => onClose(false)} className="text-3xl hover:text-red-600">&times;</button>
          </div>
        </div>

        <div className="p-6">
          {employee && (
            <p className="text-lg font-medium mb-4 p-3 bg-blue-50 rounded-lg">
              Salesman: <span className="text-blue-600 font-bold">{employee.fullName}</span> 
              <span className="text-gray-600 ml-2">({employee.employeeId})</span>
            </p>
          )}

          {isMultiple ? (
            <div className="space-y-4">
              {task.filter(t => t.status !== 'completed').length === 0 ? (
                <p className="text-center text-gray-500 py-10">No pending tasks found</p>
              ) : (
               [ ...task.filter(t => t.status !== 'completed') ] // Only show pending tasks
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
                .map((t, i) => (
                  <div key={i} className="border rounded-lg p-5 bg-gray-50 mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg">{t.title}</h3>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          t.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(t.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 whitespace-pre-line">{t.description}</p>

                    {/* ✅ FIXED IMAGE DISPLAY */}
                    {t.images?.length > 0 ? (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-700">
                            Attached Images ({t.images.length})
                          </h4>
                          <span className="text-xs text-gray-500">
                            Click to view full size
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {t.images.map((img, idx) => {
                            const imageUrl = getImageUrl(img);
                            console.log(`Image ${idx}:`, { original: img, fullUrl: imageUrl });

                            return (
                              <div key={idx} className="relative group">
                                <img
                                  src={imageUrl}
                                  className="w-full h-48 object-cover rounded-lg border shadow hover:shadow-lg transition-shadow"
                                  alt={`Task ${i+1} - Image ${idx+1}`}
                                  onError={(e) => {
                                    console.error(`❌ Image failed to load: ${imageUrl}`);
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                    e.target.className = 'w-full h-48 object-cover rounded-lg border bg-gray-100 flex items-center justify-center';
                                  }}
                                  onLoad={() => console.log(`✅ Image loaded: ${img}`)}
                                />

                                <a
                                  href={imageUrl}
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
                                  {idx + 1}/{t.images.length}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                          <div className="mt-2 text-xs text-gray-500">
                            Image paths: {t.images.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-400">No images attached</p>
                      </div>
                    )}

                    {/* Action buttons for admin */}
                    <div className="mt-4 flex justify-end gap-2">
                      {t.status !== 'completed' ? (
                        <>
                          <button
                            onClick={() => handleEditTask(t)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Edit
                          </button>
                         
                        </>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(t._id, 'pending')}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Task Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task details..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Upload Images (Max 10, 5MB each)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(img)} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 text-xs opacity-0 group-hover:opacity-100 transition"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => onClose(false)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={selectedTask}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEditedTask}
      />
    </div>
  );
};

export default TaskModal;