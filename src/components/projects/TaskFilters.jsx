import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskFilters, setTaskSort, selectTaskFilters, selectTaskSort, selectUsers } from '../../store/projectsSlice';

const TaskFilters = () => {
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

  return (
    <div className="flex flex-wrap items-center space-x-4 space-y-2 sm:space-y-0">
      {/* Assignee Filter */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="assignee-filter"
          className="text-sm font-medium text-gray-700">
          Assignee:
        </label>
        <select
          id="assignee-filter"
          value={filters.assignee}
          onChange={(e) => handleFilterChange('assignee', e.target.value)}
          className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
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
        <label
          htmlFor="priority-filter"
          className="text-sm font-medium text-gray-700">
          Priority:
        </label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Sort Option */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="sort-select"
          className="text-sm font-medium text-gray-700">
          Sort by:
        </label>
        <select
          id="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
          <option value="createdAt">Date Created</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="date-filter"
          className="text-sm font-medium text-gray-700">
          Due Date:
        </label>
        <select
          id="date-filter"
          value={filters.dateRange ? 'custom' : 'all'}
          onChange={(e) => {
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
          }}
          className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="all">Any Time</option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          dispatch(
            setTaskFilters({
              dateRange: null,
              assignee: 'all',
              priority: 'all',
            })
          );
        }}
        className="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-900 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
        Reset
      </button>
    </div>
  );
};

export default TaskFilters;
