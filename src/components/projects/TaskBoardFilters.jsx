import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskFilters, setTaskSort, selectTaskFilters, selectTaskSort, selectUsers } from '@store/projectsSlice';

const TaskBoardFilters = ({ onAddTask }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectTaskFilters);
  const sortOption = useSelector(selectTaskSort);
  const users = useSelector(selectUsers);

  const handleFilterChange = (field, value) => {
    dispatch(setTaskFilters({ [field]: value }));
  };

  const handleSortChange = (e) => {
    dispatch(setTaskSort(e.target.value));
  };

  const handleDateFilterChange = (e) => {
    const value = e.target.value;
    let dateRange = null;

    if (value === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateRange = {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0],
      };
    } else if (value === 'this-week') {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      dateRange = {
        start: startOfWeek.toISOString().split('T')[0],
        end: endOfWeek.toISOString().split('T')[0],
      };
    } else if (value === 'this-month') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      dateRange = {
        start: startOfMonth.toISOString().split('T')[0],
        end: endOfMonth.toISOString().split('T')[0],
      };
    }

    handleFilterChange('dateRange', dateRange);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Assignee Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Assignee:</label>
            <select
              value={filters.assignee}
              onChange={(e) => handleFilterChange('assignee', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All Members</option>
              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}>
                  {user.name}
                </option>
              ))}
              <option value="unassigned">Unassigned</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="status">Status</option>
              <option value="createdAt">Date Created</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Due Date:</label>
            <select
              value={filters.dateRange ? 'custom' : 'all'}
              onChange={handleDateFilterChange}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">Any Time</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>

          {/* Advance Filters Button */}
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
            </svg>
            <span>Advance Filters</span>
          </button>
        </div>

        {/* Add New Task Button */}
        <button
          onClick={onAddTask}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2 text-sm font-medium">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Add New Task</span>
        </button>
      </div>
    </div>
  );
};

export default TaskBoardFilters;
