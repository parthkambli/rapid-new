import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '../services/apiClient';

const EditTaskModal = ({ task, isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'pending');
      setImages(task.images || []);
    } else {
      resetForm();
    }
  }, [task]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
    setImages([]);
    setNewImages([]);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length > 10) {
      toast.error("Max 10 images allowed");
      return;
    }
    setNewImages(prev => [...prev, ...files]);
  };

  const removeImage = (index, fromExisting = false) => {
    if (fromExisting) {
      // This would require API call to remove specific image
      toast.info("Image removal from server not implemented in this demo");
    } else {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title required");
    if (!description.trim()) return toast.error("Description required");
    if (!task?._id) return toast.error("Task ID not found");

    setLoading(true);
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('status', status);

      // Add new images
      newImages.forEach(img => {
        formData.append('images', img);
      });

      const response = await apiClient.put(`/salesman-targets/tasks/${task._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Task updated successfully!");
        onSave(response.data.task);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !task) return null;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';

    if (imgPath.startsWith('http')) {
      return imgPath;
    }

    if (imgPath.startsWith('/')) {
      return `${API_BASE_URL}${imgPath}`;
    }

    return `${API_BASE_URL}/uploads/tasks/${imgPath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button onClick={onClose} className="text-3xl hover:text-red-600">&times;</button>
        </div>

        <div className="p-6">
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
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Existing Images */}
          {images.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Existing Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={getImageUrl(img)}
                      className="w-full h-32 object-cover rounded-lg border"
                      alt={`Existing ${idx+1}`}
                    />
                    <button
                      onClick={() => removeImage(idx, true)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images to Add */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Add New Images (Max 10, 5MB each)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />

            {newImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {newImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={URL.createObjectURL(img)} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(i, false)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition"
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
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;