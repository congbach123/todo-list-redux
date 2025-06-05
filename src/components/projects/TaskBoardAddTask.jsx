import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, selectUsers } from '@store/projectsSlice';
import UserAssignmentModal from '@components/projects/UserAssignmentModal';

const TaskBoardAddTask = ({ isOpen, onClose, preSelectedStatus }) => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal',
    dueDate: '',
    assigneeIds: [],
    status: 'pending', // Add status field
  });

  // Set the pre-selected status when component mounts or preSelectedStatus changes
  useEffect(() => {
    if (preSelectedStatus) {
      setFormData((prev) => ({
        ...prev,
        status: preSelectedStatus,
      }));
    }
  }, [preSelectedStatus]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        priority: 'normal',
        dueDate: '',
        assigneeIds: [],
        status: preSelectedStatus || 'pending', // Use preSelectedStatus or default to pending
      });
    }
  }, [isOpen, preSelectedStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    dispatch(
      addTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || null,
        assigneeIds: formData.assigneeIds,
        status: formData.status, // Include status in the task creation
      })
    );

    onClose();
  };

  const handleAssignmentSave = (selectedUserIds) => {
    setFormData((prev) => ({
      ...prev,
      assigneeIds: selectedUserIds,
    }));
    setShowAssignmentModal(false);
  };

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const assignedUsers = getUsersByIds(formData.assigneeIds);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Task{preSelectedStatus ? ` to ${getStatusLabel(preSelectedStatus)}` : ''}</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none">
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

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter task title"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add task description (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {preSelectedStatus && <p className="text-xs text-gray-500 mt-1">Pre-selected from {getStatusLabel(preSelectedStatus)} column</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to</label>
                <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                  <div className="flex items-center space-x-2">
                    {formData.assigneeIds.length === 0 ? (
                      <span className="text-gray-500 text-sm">No assignees</span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {assignedUsers.slice(0, 3).map((user) => (
                            <img
                              key={user.id}
                              src={user.avatar}
                              alt={user.name}
                              className="h-6 w-6 rounded-full border-2 border-white"
                              title={user.name}
                            />
                          ))}
                          {formData.assigneeIds.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-600">+{formData.assigneeIds.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{formData.assigneeIds.length} assigned</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAssignmentModal(true)}
                    className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {formData.assigneeIds.length === 0 ? 'Assign' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        users={users}
        selectedUserIds={formData.assigneeIds}
        onSave={handleAssignmentSave}
      />
    </>
  );
};

export default TaskBoardAddTask;
