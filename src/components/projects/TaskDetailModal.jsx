import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../../store/projectsSlice';
import UserAssignmentModal from './UserAssignmentModal';

const TaskDetailModal = ({ isOpen, onClose, task, users, onSave }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    dueDate: '',
    assigneeIds: [],
    status: 'pending',
  });

  // Initialize edit data when modal opens or task changes
  useEffect(() => {
    if (task) {
      setEditData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'normal',
        dueDate: task.dueDate || '',
        assigneeIds: task.assigneeIds || [],
        status: task.status || 'pending',
      });
    }
  }, [task]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (task) {
      dispatch(
        updateTask({
          id: task.id,
          ...editData,
        })
      );
      onSave && onSave();
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(task.id));
      onClose();
    }
  };

  const handleAssignmentSave = (selectedUserIds) => {
    setEditData((prev) => ({
      ...prev,
      assigneeIds: selectedUserIds,
    }));
    setShowAssignmentModal(false);
  };

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen || !task) return null;

  const displayData = isEditing ? editData : task;
  const assignedUsers = getUsersByIds(displayData.assigneeIds);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-4/5 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">{isEditing ? 'Edit Task' : 'Task Details'}</h3>
              <div className="flex space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPriorityColor(displayData.priority)}`}>{displayData.priority.charAt(0).toUpperCase() + displayData.priority.slice(1)} Priority</span>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(displayData.status)}`}>
                  {displayData.status === 'in-progress' ? 'In Progress' : displayData.status.charAt(0).toUpperCase() + displayData.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-indigo-600 focus:outline-none">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 focus:outline-none">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isEditing ? (
              // Edit Mode
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleChange}
                    rows="4"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Task description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={editData.priority}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={editData.dueDate}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Assignees section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignees</label>
                  <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md bg-gray-50">
                    <div className="flex items-center space-x-3">
                      {editData.assigneeIds.length === 0 ? (
                        <span className="text-gray-500">No assignees</span>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <div className="flex -space-x-2">
                            {getUsersByIds(editData.assigneeIds)
                              .slice(0, 5)
                              .map((user) => (
                                <img
                                  key={user.id}
                                  src={user.avatar}
                                  alt={user.name}
                                  className="h-8 w-8 rounded-full border-2 border-white"
                                  title={user.name}
                                />
                              ))}
                            {editData.assigneeIds.length > 5 && (
                              <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">+{editData.assigneeIds.length - 5}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{editData.assigneeIds.length} assigned</span>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAssignmentModal(true)}
                      className="px-4 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {editData.assigneeIds.length === 0 ? 'Assign Users' : 'Edit Assignment'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h4>
                  {task.description && <p className="text-gray-600 leading-relaxed">{task.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Due Date</h5>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className={`${task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Created</h5>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-gray-900">
                        {new Date(task.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignees */}
                {assignedUsers.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Assigned to</h5>
                    <div className="flex flex-wrap gap-3">
                      {assignedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        users={users}
        selectedUserIds={editData.assigneeIds}
        onSave={handleAssignmentSave}
      />
    </>
  );
};

export default TaskDetailModal;
