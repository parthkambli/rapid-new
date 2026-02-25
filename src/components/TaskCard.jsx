import React from 'react';

const TaskCard = ({ task, isEditable = false, onEdit, onStatusChange, allowStatusChange = true }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg p-5 bg-gray-50 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{task.title}</h3>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {task.status}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 whitespace-pre-line">{task.description}</p>

      {task.images && task.images.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-gray-700">
              Attached Images ({task.images.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {task.images.map((img, idx) => {
              // Construct image URL properly using the API base URL from environment
              const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Default fallback
              const imageUrl = img.startsWith('http') ? img : `${API_BASE_URL}${img}`;

              return (
                <div key={idx} className="relative group">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <img
                      src={imageUrl}
                      className="w-full h-48 object-cover rounded-lg border shadow hover:shadow-lg transition-shadow cursor-pointer"
                      alt={`Task - Image ${idx+1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        {isEditable && (
          <button
            onClick={() => onEdit && onEdit(task)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Edit
          </button>
        )}

        {onStatusChange && task.status === 'pending' && allowStatusChange && (
          <button
            onClick={() => onStatusChange('completed')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;