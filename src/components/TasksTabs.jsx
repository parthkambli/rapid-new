import React from 'react';
import TaskCard from './TaskCard';

const TasksTabs = ({ pendingTasks, completedTasks, activeTab, onTabChange, onStatusChange, completedPage, completedTasksPerPage, setCompletedPage, allowStatusChange = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onTabChange('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending ({pendingTasks.length})
          </button>
          <button
            onClick={() => onTabChange('completed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </nav>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'pending' && (
          <div>
            {pendingTasks.length > 0 ? (
              <div className="space-y-4">
                {pendingTasks.map((task, index) => (
                  <TaskCard
                    key={task._id || index}
                    task={task}
                    isEditable={false}
                    onStatusChange={(status) => onStatusChange(task._id, status)}
                    allowStatusChange={allowStatusChange}
                  />
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
            {completedTasks.length > 0 ? (
              <div>
                <div className="space-y-4">
                  {completedTasks
                    .slice((completedPage - 1) * completedTasksPerPage, completedPage * completedTasksPerPage)
                    .map((task, index) => (
                      <TaskCard
                        key={task._id || index}
                        task={task}
                        isEditable={false}
                        allowStatusChange={allowStatusChange}
                      />
                    ))}
                </div>

                {/* Pagination Controls for Completed Tasks */}
                {completedTasks.length > completedTasksPerPage && (
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => setCompletedPage(prev => Math.max(prev - 1, 1))}
                      disabled={completedPage === 1}
                      className={`px-4 py-2 rounded ${completedPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      Previous
                    </button>

                    <span className="text-gray-600">
                      Page {completedPage} of {Math.ceil(completedTasks.length / completedTasksPerPage)}
                    </span>

                    <button
                      onClick={() => setCompletedPage(prev => Math.min(prev + 1, Math.ceil(completedTasks.length / completedTasksPerPage)))}
                      disabled={completedPage >= Math.ceil(completedTasks.length / completedTasksPerPage)}
                      className={`px-4 py-2 rounded ${completedPage >= Math.ceil(completedTasks.length / completedTasksPerPage) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
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
  );
};

export default TasksTabs;