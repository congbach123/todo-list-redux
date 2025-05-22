import { createSlice, createSelector } from '@reduxjs/toolkit';

// Initial state for project management
const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [
      {
        id: 'project-1',
        name: 'Design Project',
        description: 'Website redesign project',
        createdAt: Date.now(),
      },
      {
        id: 'project-2',
        name: 'Main Project',
        description: 'Core application development',
        createdAt: Date.now() - 86400000,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        projectId: 'project-1',
        title: 'Solutions Pages',
        description: 'Create solutions page designs',
        status: 'pending', // pending, in-progress, completed
        priority: 'normal', // low, normal, high
        assigneeIds: ['user-1'], // Changed from assigneeId to assigneeIds array
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now() - 345600000,
      },
      {
        id: 'task-2',
        projectId: 'project-1',
        title: 'Company pages',
        description: 'Design company information pages',
        status: 'pending',
        priority: 'low',
        assigneeIds: [], // Empty array instead of null
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now() - 259200000,
      },
      {
        id: 'task-3',
        projectId: 'project-1',
        title: 'Help Center Pages',
        description: 'Create help center interface',
        status: 'pending',
        priority: 'low',
        assigneeIds: [],
        dueDate: null,
        createdAt: Date.now() - 172800000,
      },
      {
        id: 'task-4',
        projectId: 'project-1',
        title: 'Icon Custom',
        description: 'Design custom icons for the application',
        status: 'pending',
        priority: 'low',
        assigneeIds: [],
        dueDate: null,
        createdAt: Date.now() - 86400000,
      },
      {
        id: 'task-5',
        projectId: 'project-1',
        title: 'Solutions Pages',
        description: 'Implement solution pages',
        status: 'pending',
        priority: 'low',
        assigneeIds: ['user-1'],
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now(),
      },
      {
        id: 'task-6',
        projectId: 'project-1',
        title: 'Order Flow',
        description: 'Design the order flow process',
        status: 'in-progress',
        priority: 'high',
        assigneeIds: ['user-1', 'user-2'], // Multiple assignees
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now() - 432000000,
      },
      {
        id: 'task-7',
        projectId: 'project-1',
        title: 'New Work Flow',
        description: 'Implement new workflow for task assignment',
        status: 'in-progress',
        priority: 'high',
        assigneeIds: ['user-2'],
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now() - 518400000,
      },
      {
        id: 'task-8',
        projectId: 'project-1',
        title: 'About Us Illustration',
        description: 'Create illustrations for about us page',
        status: 'completed',
        priority: 'normal',
        assigneeIds: ['user-1'],
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        createdAt: Date.now() - 604800000,
        completedAt: Date.now() - 86400000,
      },
    ],
    users: [
      {
        id: 'user-1',
        name: 'Sarah Thompson',
        email: 'sarah@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: 'user-2',
        name: 'David Chen',
        email: 'david@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
      // Add more sample users for testing
      {
        id: 'user-3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      {
        id: 'user-4',
        name: 'Michael Johnson',
        email: 'michael@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      {
        id: 'user-5',
        name: 'Jessica Lee',
        email: 'jessica@example.com',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    ],
    currentProject: 'project-1',
    taskFilters: {
      dateRange: null, // { start: date, end: date }
      assignee: 'all', // 'all' or userId
      priority: 'all', // 'all', 'low', 'normal', or 'high'
    },
    taskSort: 'dueDate', // 'dueDate', 'priority', 'title', 'status'
    taskView: 'list', // 'list', 'board', 'calendar'
  },
  reducers: {
    // Project actions
    addProject: (state, action) => {
      const newProject = {
        id: `project-${Date.now()}`,
        createdAt: Date.now(),
        ...action.payload,
      };
      state.items.push(newProject);
      state.currentProject = newProject.id;
    },
    updateProject: (state, action) => {
      const index = state.items.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteProject: (state, action) => {
      state.items = state.items.filter((project) => project.id !== action.payload);
      // Remove tasks associated with this project
      state.tasks = state.tasks.filter((task) => task.projectId !== action.payload);
      // If current project is deleted, set to first available
      if (state.currentProject === action.payload && state.items.length > 0) {
        state.currentProject = state.items[0].id;
      }
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },

    // Task actions
    addTask: (state, action) => {
      const newTask = {
        id: `task-${Date.now()}`,
        projectId: state.currentProject,
        status: 'pending',
        priority: 'normal',
        assigneeIds: [], // Initialize as empty array
        dueDate: null,
        createdAt: Date.now(),
        ...action.payload,
      };
      state.tasks.push(newTask);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };

        // Add completedAt timestamp when status is changed to completed
        if (action.payload.status === 'completed' && state.tasks[index].status !== 'completed') {
          state.tasks[index].completedAt = Date.now();
        }

        // Remove completedAt when task is moved out of completed
        if (action.payload.status && action.payload.status !== 'completed' && state.tasks[index].completedAt) {
          delete state.tasks[index].completedAt;
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    // Filters
    setTaskFilters: (state, action) => {
      state.taskFilters = { ...state.taskFilters, ...action.payload };
    },
    setTaskSort: (state, action) => {
      state.taskSort = action.payload;
    },
    setTaskView: (state, action) => {
      state.taskView = action.payload;
    },

    // User actions
    addUser: (state, action) => {
      const newUser = {
        id: `user-${Date.now()}`,
        ...action.payload,
      };
      state.users.push(newUser);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      // Remove user from all task assignments
      state.tasks = state.tasks.map((task) => ({
        ...task,
        assigneeIds: task.assigneeIds.filter((id) => id !== action.payload),
      }));
    },
  },
});

// Export actions
export const { addProject, updateProject, deleteProject, setCurrentProject, addTask, updateTask, deleteTask, setTaskFilters, setTaskSort, setTaskView, addUser, updateUser, deleteUser } = projectsSlice.actions;

// Selectors
export const selectProjects = (state) => state.projects.items;
export const selectCurrentProject = (state) => state.projects.items.find((project) => project.id === state.projects.currentProject) || null;
export const selectCurrentProjectId = (state) => state.projects.currentProject;

export const selectAllTasks = (state) => state.projects.tasks;
export const selectProjectTasks = createSelector([selectAllTasks, selectCurrentProjectId], (tasks, projectId) => tasks.filter((task) => task.projectId === projectId));

export const selectUsers = (state) => state.projects.users;
export const selectTaskFilters = (state) => state.projects.taskFilters;
export const selectTaskSort = (state) => state.projects.taskSort;
export const selectTaskView = (state) => state.projects.taskView;

// Filtered task selectors
export const selectFilteredTasks = createSelector([selectProjectTasks, selectTaskFilters, selectTaskSort], (tasks, filters, sort) => {
  // Apply filters
  let filteredTasks = [...tasks];

  // Filter by assignee - updated for multiple assignees
  if (filters.assignee !== 'all') {
    filteredTasks = filteredTasks.filter((task) => task.assigneeIds.includes(filters.assignee));
  }

  // Filter by priority
  if (filters.priority !== 'all') {
    filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
  }

  // Filter by date range
  if (filters.dateRange) {
    filteredTasks = filteredTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= new Date(filters.dateRange.start) && taskDate <= new Date(filters.dateRange.end);
    });
  }

  // Apply sorting
  switch (sort) {
    case 'dueDate':
      return filteredTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'priority':
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'title':
      return filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
      return filteredTasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    default:
      return filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  }
});

// Tasks by status
export const selectTasksByStatus = createSelector([selectFilteredTasks], (tasks) => {
  return {
    pending: tasks.filter((task) => task.status === 'pending'),
    inProgress: tasks.filter((task) => task.status === 'in-progress'),
    completed: tasks.filter((task) => task.status === 'completed'),
  };
});

// Task statistics - updated for multiple assignees
export const selectTaskStats = createSelector([selectProjectTasks], (tasks) => {
  return {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    inProgress: tasks.filter((task) => task.status === 'in-progress').length,
    completed: tasks.filter((task) => task.status === 'completed').length,
    highPriority: tasks.filter((task) => task.priority === 'high').length,
    assigned: tasks.filter((task) => task.assigneeIds.length > 0).length,
    unassigned: tasks.filter((task) => task.assigneeIds.length === 0).length,
    dueSoon: tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    }).length,
    overdue: tasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== 'completed';
    }).length,
  };
});

export default projectsSlice.reducer;
