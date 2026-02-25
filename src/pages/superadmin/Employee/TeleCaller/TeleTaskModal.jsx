import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TaskModal = ({ isOpen, onClose, task, employee, isEditMode, onSave, onDelete, onEdit }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);

  // Check if task is an array (multiple tasks) or single task
  const isMultipleTasks = Array.isArray(task);

  useEffect(() => {
    if (isMultipleTasks) {
      setDescription('');
      setFile(null);
      setFileName('');
      setSelectedTaskForEdit(null);
    } else if (task) {
      setDescription(task.description || '');
      setFileName(task.fileName || '');
      setSelectedTaskForEdit(task);
    } else {
      setDescription('');
      setFile(null);
      setFileName('');
      setSelectedTaskForEdit(null);
    }
  }, [task, isMultipleTasks]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Please upload PDF, DOC, DOCX, or image files only');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSave = () => {
    if (!description.trim()) {
      toast.error('Task description cannot be empty');
      return;
    }

    onSave({
      description: description.trim(),
      fileName: fileName
    }, file, selectedTaskForEdit);
  };

  const handleDelete = (taskToDelete) => {
    if (taskToDelete && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(taskToDelete._id);
    }
  };

  // Handle Edit Task from multiple view
  const handleEditTask = (taskToEdit) => {
    onClose();
    setTimeout(() => {
      if (onEdit) {
        onEdit(taskToEdit, true);
      }
    }, 300);
  };

  // Handle Add New Task from multiple view
  const handleAddNewTask = () => {
    onClose();
    setTimeout(() => {
      if (onEdit) {
        onEdit(null, true);
      }
    }, 300);
  };

  // Handle View Single Task from multiple view
  const handleViewSingleTask = (taskToView) => {
    onClose();
    setTimeout(() => {
      if (onEdit) {
        onEdit(taskToView, false);
      }
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${isMultipleTasks ? 'w-full max-w-4xl' : 'w-full max-w-md'} max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isMultipleTasks ? `All Tasks - ${employee?.fullName} (${employee?.employeeId})` : (selectedTaskForEdit ? (isEditMode ? 'Edit Task' : 'View Task') : 'Add Task')}
          </h2>
          {employee && !isMultipleTasks && (
            <p className="text-sm text-gray-600 mt-1">
              For: {employee.fullName} ({employee.employeeId})
            </p>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Show multiple tasks list */}
          {isMultipleTasks ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-700">Task Summary</h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Completed: {task.filter(t => t.status === 'completed').length}
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                    Pending: {task.filter(t => t.status === 'pending').length}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    In Progress: {task.filter(t => t.status === 'in_progress').length}
                  </span>
                </div>
              </div>

              {task.map((singleTask, index) => (
                <div key={singleTask._id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer" 
                      onClick={() => handleViewSingleTask(singleTask)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 text-lg">{singleTask.title}</h4>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            singleTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                            singleTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {singleTask.status?.replace('_', ' ') || 'pending'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            singleTask.priority === 'high' ? 'bg-red-100 text-red-800' :
                            singleTask.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {singleTask.priority}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{singleTask.description}</p>
                      
                      {/* Telecaller Specific Data */}
                      {singleTask.telecallerData && (
                        <div className="bg-white p-3 rounded border border-gray-200 mb-3">
                          <h5 className="font-medium text-gray-700 mb-2">Task Details:</h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {singleTask.telecallerData.dailyCallTarget && (
                              <div>
                                <span className="text-gray-600">Daily Target:</span>
                                <span className="ml-2 text-gray-800">{singleTask.telecallerData.dailyCallTarget}</span>
                              </div>
                            )}
                            {singleTask.telecallerData.callType && (
                              <div>
                                <span className="text-gray-600">Call Type:</span>
                                <span className="ml-2 text-gray-800">{singleTask.telecallerData.callType}</span>
                              </div>
                            )}
                            {singleTask.telecallerData.deadline && (
                              <div>
                                <span className="text-gray-600">Deadline:</span>
                                <span className="ml-2 text-gray-800">
                                  {new Date(singleTask.telecallerData.deadline).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(singleTask.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Scheduled: {new Date(singleTask.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditTask(singleTask)}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(singleTask)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Single task view/edit form */
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!isEditMode && selectedTaskForEdit}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  placeholder="Enter task description..."
                />
              </div>

              {/* Telecaller Specific Data Display */}
              {selectedTaskForEdit?.telecallerData && (
                <div className="bg-gray-50 p-4 rounded border border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-3">Telecaller Task Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {selectedTaskForEdit.telecallerData.dailyCallTarget && (
                      <div>
                        <span className="text-gray-600">Daily Call Target:</span>
                        <span className="ml-2 text-gray-800">{selectedTaskForEdit.telecallerData.dailyCallTarget}</span>
                      </div>
                    )}
                    {selectedTaskForEdit.telecallerData.callType && (
                      <div>
                        <span className="text-gray-600">Call Type:</span>
                        <span className="ml-2 text-gray-800">{selectedTaskForEdit.telecallerData.callType}</span>
                      </div>
                    )}
                    {selectedTaskForEdit.telecallerData.renewalMonth && (
                      <div>
                        <span className="text-gray-600">Renewal Month:</span>
                        <span className="ml-2 text-gray-800">{selectedTaskForEdit.telecallerData.renewalMonth}</span>
                      </div>
                    )}
                    {selectedTaskForEdit.telecallerData.serviceCallType && (
                      <div>
                        <span className="text-gray-600">Service Call Type:</span>
                        <span className="ml-2 text-gray-800">{selectedTaskForEdit.telecallerData.serviceCallType}</span>
                      </div>
                    )}
                    {selectedTaskForEdit.telecallerData.deadline && (
                      <div>
                        <span className="text-gray-600">Deadline:</span>
                        <span className="ml-2 text-gray-800">
                          {new Date(selectedTaskForEdit.telecallerData.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div className="flex items-center gap-3">
                  <label className={`flex-1 cursor-pointer ${!isEditMode && selectedTaskForEdit ? 'opacity-50' : ''}`}>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      disabled={!isEditMode && selectedTaskForEdit}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <div className="px-4 py-2 border border-gray-300 rounded text-center text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      Choose File
                    </div>
                  </label>
                  {fileName && (
                    <span className="text-sm text-gray-600 truncate flex-1" title={fileName}>
                      {fileName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          {isMultipleTasks ? (
            <>
              <button
                onClick={handleAddNewTask}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Add New Task
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </>
          ) : selectedTaskForEdit && !isEditMode ? (
            // View Mode
            <>
              <button
                onClick={() => handleEditTask(selectedTaskForEdit)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedTaskForEdit)}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </>
          ) : (
            // Add/Edit Mode
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                {selectedTaskForEdit ? 'Update' : 'Save'}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;






