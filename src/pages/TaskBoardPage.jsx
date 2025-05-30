import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentProject, selectTasksByStatus } from '@store/projectsSlice';
import TaskBoardLayout from '@components/projects/TaskBoardLayout';
import TaskBoardHeader from '@components/projects/TaskBoardHeader';
import TaskBoardFilters from '@components/projects/TaskBoardFilters';
import TaskTable from '@components/projects/TaskTable';
import TaskBoardAddTask from '@components/projects/TaskBoardAddTask';

const TaskBoardPage = () => {
  const currentProject = useSelector(selectCurrentProject);
  const tasksByStatus = useSelector(selectTasksByStatus);
  const [activeView, setActiveView] = useState('list');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  if (!currentProject) {
    return (
      <TaskBoardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Project Selected</h2>
            <p className="text-gray-600 mb-4">Choose a project from the sidebar to get started</p>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create New Project</button>
          </div>
        </div>
      </TaskBoardLayout>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'list':
        return (
          <div className="p-6">
            {/* Pending Tasks */}
            <TaskTable
              tasks={tasksByStatus.pending}
              status="pending"
              statusLabel="Pending"
              statusIcon="bg-yellow-400"
            />

            {/* In Progress Tasks */}
            <TaskTable
              tasks={tasksByStatus.inProgress}
              status="in-progress"
              statusLabel="In Progress"
              statusIcon="bg-blue-500"
            />

            {/* Completed Tasks */}
            <TaskTable
              tasks={tasksByStatus.completed}
              status="completed"
              statusLabel="Completed"
              statusIcon="bg-green-500"
            />

            {/* Empty state */}
            {tasksByStatus.pending.length === 0 && tasksByStatus.inProgress.length === 0 && tasksByStatus.completed.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl text-gray-300 mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                <p className="text-gray-600 mb-4">Create your first task to get started</p>
                <button
                  onClick={handleAddTask}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Add Task
                </button>
              </div>
            )}
          </div>
        );

      case 'board':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Board View</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Files View</h3>
              <p className="text-gray-600">Coming soon...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📈</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Overview</h3>
              <p className="text-gray-600">Project overview coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <TaskBoardLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <TaskBoardHeader
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Filters */}
        <TaskBoardFilters onAddTask={handleAddTask} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">{renderContent()}</div>

        {/* Add Task Modal */}
        {showAddTaskModal && (
          <TaskBoardAddTask
            isOpen={showAddTaskModal}
            onClose={() => setShowAddTaskModal(false)}
          />
        )}
      </div>
    </TaskBoardLayout>
  );
};

export default TaskBoardPage;
