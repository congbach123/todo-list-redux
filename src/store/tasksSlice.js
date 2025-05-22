import { createSlice } from '@reduxjs/toolkit';

// Helper function to load tasks from localStorage
const loadTasks = () => {
  try {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : initialTasks;
  } catch (error) {
    console.error('Error loading tasks from localStorage', error);
    return initialTasks;
  }
};

// Helper function to save tasks to localStorage
const saveTasks = (tasks) => {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage', error);
  }
};

// Sample initial tasks
const initialTasks = [
  {
    id: 'task-1',
    title: 'Solutions Pages',
    description: 'Create solutions page layouts',
    projectId: 'design-project',
    status: 'pending',
    priority: 'normal',
    dueDate: '2025-03-17T09:00:00',
    assignee: {
      id: 'user-1',
      name: 'Sarah Thompson',
      avatar: null,
    },
    createdAt: Date.now(),
  },
  {
    id: 'task-2',
    title: 'Company Pages',
    description: 'Design company profile pages',
    projectId: 'design-project',
    status: 'pending',
    priority: 'normal',
    dueDate: '2025-03-17T09:00:00',
    assignee: null,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'task-3',
    title: 'Help Center Pages',
    description: 'Create help documentation pages',
    projectId: 'design-project',
    status: 'pending',
    priority: 'normal',
    dueDate: null,
    assignee: null,
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'task-4',
    title: 'Icon Custom',
    description: 'Design custom icon set',
    projectId: 'design-project',
    status: 'pending',
    priority: 'normal',
    dueDate: null,
    assignee: null,
    createdAt: Date.now() - 259200000,
  },
  {
    id: 'task-5',
    title: 'Solutions Pages',
    description: 'Create secondary solutions pages',
    projectId: 'design-project',
    status: 'pending',
    priority: 'normal',
    dueDate: '2025-03-18T00:00:00',
    assignee: {
      id: 'user-1',
      name: 'Sarah Thompson',
      avatar: null,
    },
    createdAt: Date.now() - 345600000,
  },
  {
    id: 'task-6',
    title: 'Order Flow',
    description: 'Design order process flow',
    projectId: 'design-project',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-03-17T09:00:00',
    assignee: {
      id: 'user-1',
      name: 'Sarah Thompson',
      avatar: null,
    },
    createdAt: Date.now() - 432000000,
  },
  {
    id: 'task-7',
    title: 'New Work Flow',
    description: 'Create new workflow diagrams',
    projectId: 'design-project',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2025-03-17T09:00:00',
    assignee: {
      id: 'user-2',
      name: 'David Smith',
      avatar: null,
    },
    createdAt: Date.now() - 518400000,
  },
  {
    id: 'task-8',
    title: 'About Us Illustration',
    description: 'Create illustration for about page',
    projectId: 'design-project',
    status: 'completed',
    priority: 'normal',
    dueDate: '2025-03-17T09:00:00',
    assignee: {
      id: 'user-1',
      name: 'Sarah Thompson',
      avatar: null,
    },
    createdAt: Date.now() - 604800000,
    completedAt: Date.now() - 86400000,
  },
];

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: loadTasks(),
    filter: 'all', // all, pending, in-progress, completed
    searchText: '',
    sortOption: 'default',
    dateRange: null,
    priorityFilter: null, // null, normal, high
    assigneeFilter: null,
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: `task-${Date.now()}`,
        status: 'pending',
        priority: 'normal',
        createdAt: Date.now(),
        ...action.payload,
      };
      state.items.push(newTask);
      saveTasks(state.items);
    },
    updateTask: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex((task) => task.id === id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
        };

        // If status changes to completed, add completedAt timestamp
        if (updates.status === 'completed' && !state.items[index].completedAt) {
          state.items[index].completedAt = Date.now();
        }
        // If status changes from completed, remove completedAt
        if (updates.status !== 'completed' && state.items[index].completedAt) {
          state.items[index].completedAt = undefined;
        }

        saveTasks(state.items);
      }
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
      saveTasks(state.items);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
    },
    setPriorityFilter: (state, action) => {
      state.priorityFilter = action.payload;
    },
    setAssigneeFilter: (state, action) => {
      state.assigneeFilter = action.payload;
    },
    clearFilters: (state) => {
      state.filter = 'all';
      state.searchText = '';
      state.dateRange = null;
      state.priorityFilter = null;
      state.assigneeFilter = null;
    },
  },
});

export const { addTask, updateTask, deleteTask, setFilter, setSearchText, setSortOption, setDateRange, setPriorityFilter, setAssigneeFilter, clearFilters } = tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.items;

export const selectTasksByProject = (state, projectId) => {
  return state.tasks.items.filter((task) => task.projectId === projectId);
};

export const selectFilteredTasks = (state, projectId) => {
  const { items, filter, searchText, dateRange, priorityFilter, assigneeFilter } = state.tasks;

  // First filter by project
  let filteredItems = items.filter((task) => task.projectId === projectId);

  // Filter by status
  if (filter !== 'all') {
    filteredItems = filteredItems.filter((task) => task.status === filter);
  }

  // Filter by search text
  if (searchText) {
    const search = searchText.toLowerCase();
    filteredItems = filteredItems.filter((task) => task.title.toLowerCase().includes(search) || (task.description && task.description.toLowerCase().includes(search)));
  }

  // Filter by date range
  if (dateRange && dateRange.start && dateRange.end) {
    const start = new Date(dateRange.start).getTime();
    const end = new Date(dateRange.end).getTime();
    filteredItems = filteredItems.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).getTime();
      return taskDate >= start && taskDate <= end;
    });
  }

  // Filter by priority
  if (priorityFilter) {
    filteredItems = filteredItems.filter((task) => task.priority === priorityFilter);
  }

  // Filter by assignee
  if (assigneeFilter) {
    filteredItems = filteredItems.filter((task) => task.assignee && task.assignee.id === assigneeFilter);
  }

  // Apply sorting
  const { sortOption } = state.tasks;
  switch (sortOption) {
    case 'alphabetical':
      return filteredItems.sort((a, b) => a.title.localeCompare(b.title));
    case 'date-asc':
      return filteredItems.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'date-desc':
      return filteredItems.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
    case 'priority-high':
      return filteredItems.sort((a, b) => (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0));
    case 'recently-created':
      return filteredItems.sort((a, b) => b.createdAt - a.createdAt);
    case 'recently-updated':
      return filteredItems.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
    default:
      return filteredItems;
  }
};

export const selectTasksCountByStatus = (state, projectId) => {
  const tasks = state.tasks.items.filter((task) => task.projectId === projectId);
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
  };
};

export const selectTaskById = (state, taskId) => {
  return state.tasks.items.find((task) => task.id === taskId);
};

export default tasksSlice.reducer;
