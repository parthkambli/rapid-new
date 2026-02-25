import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient, { apiEndpoints } from '../../services/apiClient';
import { toast } from 'react-toastify';
import TasksTabs from '../../components/TasksTabs';

const SalesmanTasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ pending: [], completed: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [completedPage, setCompletedPage] = useState(1);
  const completedTasksPerPage = 10;

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log("User object:", user); // Debug log

      // Use the employee ID from the user object - typically user.employee, user.employeeId, or user._id
      // Based on the API response, the employee ID is likely in user.employee or user._id
      const employeeId = user?.employee || user?.employeeId || user?._id || user?.id;
      console.log("Using employeeId:", employeeId); // Debug log

      if (!employeeId) {
        throw new Error("No employee ID found in user object");
      }

      const response = await apiClient.get(apiEndpoints.salesmanTasks.getTasks(employeeId));
      console.log("API Response:", response.data); // Debug log

      if (response.data.success) {
        // Separate tasks into pending and completed based on status
        const allTasks = response.data.tasks || [];
        const pendingTasks = allTasks.filter(task => task.status === 'pending');
        const completedTasks = allTasks.filter(task => task.status === 'completed');

        setTasks({
          pending: pendingTasks,
          completed: completedTasks
        });

        console.log("Set tasks:", { pending: pendingTasks, completed: completedTasks }); // Debug log
      } else {
        toast.error(response.data.message || "Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await apiClient.put(apiEndpoints.salesmanTasks.updateStatus(taskId), { status: newStatus });
      
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

  // Salesman should not be able to edit tasks - removing edit functionality
  // const handleEditTask = (task) => {
  //   setSelectedTask(task);
  //   setEditModalOpen(true);
  // };

  // const handleSaveTask = (updatedTask) => {
  //   setTasks(prev => {
  //     const updatedTasks = { ...prev };

  //     // Update in pending array
  //     const pendingIndex = updatedTasks.pending.findIndex(t => t._id === updatedTask._id);
  //     if (pendingIndex !== -1) {
  //       updatedTasks.pending[pendingIndex] = updatedTask;
  //     }

  //     // Update in completed array
  //     const completedIndex = updatedTasks.completed.findIndex(t => t._id === updatedTask._id);
  //     if (completedIndex !== -1) {
  //       updatedTasks.completed[completedIndex] = updatedTask;
  //     }

  //     return updatedTasks;
  //   });
  // };

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
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-600">Manage and track your assigned tasks</p>
      </div>

      <TasksTabs
        pendingTasks={tasks.pending}
        completedTasks={tasks.completed}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onStatusChange={handleStatusChange}
        completedPage={completedPage}
        completedTasksPerPage={completedTasksPerPage}
        setCompletedPage={setCompletedPage}
        allowStatusChange={true} // Allow status change for salesman
      />
    </div>
  );
};

export default SalesmanTasksPage;