import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../store/projectsSlice';
import UserAssignmentModal from './UserAssignmentModal';

const TaskList = ({ tasks, onStatusChange, users }) => {
  const dispatch = useDispatch();
  const [editingTask, setEditingTask] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [currentTaskForAssignment, setCurrentTaskForAssignment] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assigneeIds: [],
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return '';

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // If it's today or tomorrow, show instead
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStartEdit = (task) => {
    setEditingTask(task.id);
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      assigneeIds: task.assigneeIds || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
  };

  const handleSubmitEdit = (taskId) => {
    dispatch(
      updateTask({
        id: taskId,
        ...editData,
      })
    );
    setEditingTask(null);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleOpenAssignmentModal = (task) => {
    setCurrentTaskForAssignment(task);
    setShowAssignmentModal(true);
  };

  const handleSaveAssignment = (selectedUserIds) => {
    if (currentTaskForAssignment) {
      if (editingTask === currentTaskForAssignment.id) {
        // Update edit data if in edit mode
        setEditData((prev) => ({
          ...prev,
          assigneeIds: selectedUserIds,
        }));
      } else {
        // Update task directly if not in edit mode
        dispatch(
          updateTask({
            id: currentTaskForAssignment.id,
            assigneeIds: selectedUserIds,
          })
        );
      }
    }
    setShowAssignmentModal(false);
    setCurrentTaskForAssignment(null);
  };

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  if (tasks.length === 0) {
    return <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">No tasks available in this category</div>;
  }

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white border rounded-lg shadow-sm ${task.status === 'completed' ? 'border-green-200' : 'border-gray-200 hover:border-indigo-300'} transition-all duration-200`}>
            {editingTask === task.id ? (
              // Edit Mode
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleEditChange}
                    rows="2"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={editData.priority}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={editData.dueDate}
                      onChange={handleEditChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Assignees section in edit mode */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignees</label>
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                    <div className="flex items-center space-x-2">
                      {editData.assigneeIds.length === 0 ? (
                        <span className="text-gray-500 text-sm">No assignees</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {getUsersByIds(editData.assigneeIds)
                              .slice(0, 3)
                              .map((user) => (
                                <img
                                  key={user.id}
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-8 w-8 rounded-full border-2 border-white"
                                  title={user.name}
                                />
                              ))}
                            {editData.assigneeIds.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">+{editData.assigneeIds.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{editData.assigneeIds.length} assigned</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignmentModal(task)}
                      className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {editData.assigneeIds.length === 0 ? 'Assign Users' : 'Edit Assignment'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubmitEdit(task.id)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Save
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.title}</h3>

                    {task.description && <p className={`mt-1 text-sm ${task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>}

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {task.dueDate && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            task.status === 'completed' ? 'bg-gray-100 text-gray-500' : new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {formatDate(task.dueDate)}
                        </span>
                      )}

                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'normal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>

                      {/* Multiple assignees display */}
                      {task.assigneeIds && task.assigneeIds.length > 0 && (
                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-2">
                            {getUsersByIds(task.assigneeIds)
                              .slice(0, 3)
                              .map((user) => (
                                <div
                                  key={user.id}
                                  className="relative group">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-6 w-6 rounded-full border-2 border-white cursor-pointer"
                                  />
                                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                    {user.name}
                                  </div>
                                </div>
                              ))}
                            {task.assigneeIds.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">+{task.assigneeIds.length - 3}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenAssignmentModal(task)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                            {task.assigneeIds.length} assigned
                          </button>
                        </div>
                      )}

                      {/* No assignees */}
                      {(!task.assigneeIds || task.assigneeIds.length === 0) && (
                        <button
                          onClick={() => handleOpenAssignmentModal(task)}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Assign
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      className="text-sm border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      {statusOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleStartEdit(task)}
                      className="p-1 text-gray-500 hover:text-indigo-600 focus:outline-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1 text-gray-500 hover:text-red-600 focus:outline-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setCurrentTaskForAssignment(null);
        }}
        users={users}
        selectedUserIds={editingTask === currentTaskForAssignment?.id ? editData.assigneeIds : currentTaskForAssignment?.assigneeIds || []}
        onSave={handleSaveAssignment}
      />
    </>
  );
};

export default TaskList;
