import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask, selectUsers } from '../../store/projectsSlice';

const TaskDrawer = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  if (!task) return null;

  const getUserById = (userId) => {
    if (!userId) return null;
    return users.find((user) => user.id === userId) || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high':
        return { color: 'text-red-600', bg: 'bg-red-100', text: 'High' };
      case 'normal':
        return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Normal' };
      case 'low':
        return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Low' };
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Normal' };
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' };
      case 'in-progress':
        return { color: 'text-blue-600', bg: 'bg-blue-100', text: 'In Progress' };
      case 'completed':
        return { color: 'text-green-600', bg: 'bg-green-100', text: 'Completed' };
      default:
        return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Pending' };
    }
  };

  const priority = getPriorityDisplay(task.priority);
  const status = getStatusDisplay(task.status);
  const assignee = getUserById(task.assigneeId);

  const handleStatusChange = (newStatus) => {
    dispatch(updateTask({ id: task.id, status: newStatus }));
  };

  const handlePriorityChange = (newPriority) => {
    dispatch(updateTask({ id: task.id, priority: newPriority }));
  };

  const handleAssigneeChange = (assigneeId) => {
    dispatch(updateTask({ id: task.id, assigneeId: assigneeId || null }));
  };

  return (
    <div className="fixed inset-0 flex z-50 overflow-hidden bg-gray-500 bg-opacity-75">
      <div className="relative flex-1 flex flex-col max-w-md w-full pt-5 pb-4 bg-white shadow-xl">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 h-0 overflow-y-auto p-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
              {task.description && <p className="mt-1 text-sm text-gray-500">{task.description}</p>}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-1">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Priority</h4>
                  <div className="mt-1">
                    <select
                      value={task.priority}
                      onChange={(e) => handlePriorityChange(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
                  <p className="mt-1 text-sm text-gray-900">{task.dueDate ? formatDate(task.dueDate) : 'Not set'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(new Date(task.createdAt))}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-500">Assigned To</h4>
              <div className="mt-1">
                <select
                  value={task.assigneeId || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {task.status === 'completed' && task.completedAt && (
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-500">Completed</h4>
                <p className="mt-1 text-sm text-gray-900">{formatDate(new Date(task.completedAt))}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDrawer;
