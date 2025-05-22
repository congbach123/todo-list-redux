import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentProject, selectTasksByStatus, selectTaskStats, selectUsers, updateTask, deleteTask, setTaskFilters, setTaskSort } from '../store/projectsSlice';
import TaskList from '@components/projects/TaskList';
import TaskFilters from '@components/projects/TaskFilters';
import TaskStats from '@components/projects/TaskStats';
import AddTask from '@components/projects/AddTask';
import ProjectHeader from '@components/projects/ProjectHeader';
import ProjectCalendar from '@components/projects/ProjectCalendar';
import ProjectBoard from '@components/projects/ProjectBoard';

const ProjectPage = () => {
  const dispatch = useDispatch();
  const currentProject = useSelector(selectCurrentProject);
  const tasksByStatus = useSelector(selectTasksByStatus);
  const taskStats = useSelector(selectTaskStats);
  const users = useSelector(selectUsers);
  const [view, setView] = useState('list'); // list, board, calendar

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Project Selected</h1>
          <p className="text-gray-600 mb-4">Please select a project or create a new one.</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors">Create New Project</button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({ id: taskId, status: newStatus }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ProjectHeader
          project={currentProject}
          activeView={view}
          onViewChange={setView}
        />

        <div className="mt-6 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <TaskFilters />
                <AddTask />
              </div>

              <TaskStats stats={taskStats} />

              {view === 'list' && (
                <div className="mt-8">
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
                      Pending
                      <span className="ml-2 text-sm text-gray-500">({tasksByStatus.pending.length})</span>
                    </h3>
                    <TaskList
                      tasks={tasksByStatus.pending}
                      onStatusChange={handleStatusChange}
                      users={users}
                    />
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
                      In Progress
                      <span className="ml-2 text-sm text-gray-500">({tasksByStatus.inProgress.length})</span>
                    </h3>
                    <TaskList
                      tasks={tasksByStatus.inProgress}
                      onStatusChange={handleStatusChange}
                      users={users}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                      Completed
                      <span className="ml-2 text-sm text-gray-500">({tasksByStatus.completed.length})</span>
                    </h3>
                    <TaskList
                      tasks={tasksByStatus.completed}
                      onStatusChange={handleStatusChange}
                      users={users}
                    />
                  </div>
                </div>
              )}

              {view === 'board' && <ProjectBoard />}
              {view === 'calendar' && <ProjectCalendar />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
