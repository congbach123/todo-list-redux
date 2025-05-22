import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTasksByStatus, selectUsers, updateTask } from '../../store/projectsSlice';

const ProjectBoard = () => {
  const dispatch = useDispatch();
  const tasksByStatus = useSelector(selectTasksByStatus);
  const users = useSelector(selectUsers);

  // Get user by ID
  const getUserById = (userId) => {
    if (!userId) return null;
    return users.find((user) => user.id === userId) || null;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    if (taskId) {
      dispatch(updateTask({ id: taskId, status }));
    }
  };

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-6">
      {/* Pending column */}
      <div
        className="flex-1 bg-gray-50 rounded-lg p-4 "
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'pending')}>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <span className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></span>
          Pending
          <span className="ml-2 text-sm text-gray-500">({tasksByStatus.pending.length})</span>
        </h3>

        <div className="space-y-3 overflow-auto max-h-[500px]">
          {tasksByStatus.pending.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-yellow-200 rounded-lg shadow-sm p-3 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}>
              <h4 className="font-medium text-gray-800">{task.title}</h4>

              {task.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>}

              <div className="mt-2 flex items-center justify-between">
                <div>
                  {task.assigneeId && (
                    <span className="inline-flex items-center">
                      <span className="inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100">
                        {getUserById(task.assigneeId)?.avatar ? (
                          <img
                            src={getUserById(task.assigneeId).avatar}
                            alt={getUserById(task.assigneeId).name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs font-medium text-indigo-700">{getUserById(task.assigneeId).name.charAt(0)}</span>
                        )}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  {task.priority === 'high' && <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">High</span>}

                  {task.dueDate && <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>}
                </div>
              </div>
            </div>
          ))}

          {tasksByStatus.pending.length === 0 && <div className="text-center py-8 px-4 text-sm text-gray-500">No pending tasks</div>}
        </div>
      </div>

      {/* In Progress column */}
      <div
        className="flex-1 bg-gray-50 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'in-progress')}>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <span className="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
          In Progress
          <span className="ml-2 text-sm text-gray-500">({tasksByStatus.inProgress.length})</span>
        </h3>

        <div className="space-y-3 overflow-auto max-h-[500px]">
          {tasksByStatus.inProgress.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-blue-200 rounded-lg shadow-sm p-3 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}>
              <h4 className="font-medium text-gray-800">{task.title}</h4>

              {task.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{task.description}</p>}

              <div className="mt-2 flex items-center justify-between">
                <div>
                  {task.assigneeId && (
                    <span className="inline-flex items-center">
                      <span className="inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100">
                        {getUserById(task.assigneeId)?.avatar ? (
                          <img
                            src={getUserById(task.assigneeId).avatar}
                            alt={getUserById(task.assigneeId).name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs font-medium text-indigo-700">{getUserById(task.assigneeId).name.charAt(0)}</span>
                        )}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  {task.priority === 'high' && <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">High</span>}

                  {task.dueDate && <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>}
                </div>
              </div>
            </div>
          ))}

          {tasksByStatus.inProgress.length === 0 && <div className="text-center py-8 px-4 text-sm text-gray-500">No tasks in progress</div>}
        </div>
      </div>

      {/* Completed column */}
      <div
        className="flex-1 bg-gray-50 rounded-lg p-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'completed')}>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
          Completed
          <span className="ml-2 text-sm text-gray-500">({tasksByStatus.completed.length})</span>
        </h3>

        <div className="space-y-3 overflow-auto max-h-[500px]">
          {tasksByStatus.completed.map((task) => (
            <div
              key={task.id}
              className="bg-white border border-green-200 rounded-lg shadow-sm p-3 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}>
              <h4 className="font-medium text-gray-500 line-through">{task.title}</h4>

              {task.description && <p className="mt-1 text-sm text-gray-400 line-clamp-2">{task.description}</p>}

              <div className="mt-2 flex items-center justify-between">
                <div>
                  {task.assigneeId && (
                    <span className="inline-flex items-center">
                      <span className="inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-100">
                        {getUserById(task.assigneeId)?.avatar ? (
                          <img
                            src={getUserById(task.assigneeId).avatar}
                            alt={getUserById(task.assigneeId).name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-indigo-100 text-xs font-medium text-indigo-700">{getUserById(task.assigneeId).name.charAt(0)}</span>
                        )}
                      </span>
                    </span>
                  )}
                </div>

                {task.completedAt && <span className="text-xs text-gray-500">Completed {new Date(task.completedAt).toLocaleDateString()}</span>}
              </div>
            </div>
          ))}

          {tasksByStatus.completed.length === 0 && <div className="text-center py-8 px-4 text-sm text-gray-500">No completed tasks</div>}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;
