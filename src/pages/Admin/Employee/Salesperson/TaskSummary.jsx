import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../../../services/apiClient';

const TaskSummary = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    fetchTaskSummary();
  }, [employeeId]);

  const fetchTaskSummary = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get(`/salesman-targets/task-summary/${employeeId}`);
      
      if (response.data.success) {
        setEmployee(response.data.employee);
        setTasks(response.data.pending || []);
        
        // Calculate stats
        const total = response.data.total || 0;
        const completedCount = response.data.completedCount || 0;
        const pendingCount = response.data.pendingCount || 0;
        
        setStats({
          total,
          pending: pendingCount,
          completed: completedCount
        });
      } else {
        toast.error(response.data.message || 'Failed to fetch task summary');
      }
    } catch (err) {
      console.error('Error fetching task summary:', err);
      toast.error('Failed to fetch task summary');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(`/salesman-targets/tasks/${taskId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`Task marked as ${newStatus}`);
        fetchTaskSummary(); // Refresh the data
      } else {
        throw new Error(response.data.message || 'Failed to update task status');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      toast.error('Failed to update task status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Salespersons
        </button>
        
        {employee && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Task Summary for {employee.fullName}
            </h1>
            <p className="text-gray-600">Employee ID: {employee.employeeId}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Pending Tasks</h2>
          <p className="text-gray-600">Tasks that need attention</p>
        </div>

        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg">No pending tasks found</p>
            <p className="text-gray-400">All tasks are completed!</p>
          </div>
        ) : (
          <div className="divide-y">
            {tasks.map((task, index) => (
              <div key={task._id || index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{task.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  
                
                </div>
                
                {task.images && task.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Attached Images:</p>
                    <div className="flex gap-2">
                      {task.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`}
                          className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                          alt={`Task attachment ${idx+1}`}
                          onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${img}`, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSummary;