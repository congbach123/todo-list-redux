import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    filter: 'all', // all, active, completed
    searchText: '',
    sortOption: 'default',
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        title: action.payload.title,
        text: action.payload.text,
        dueDate: action.payload.dueDate,
        completed: false,
        createdAt: Date.now(),
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.items.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter((todo) => !todo.completed);
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo, setFilter, clearCompleted, setSearchText, setSortOption } = todosSlice.actions;
export const selectFilteredTodos = (state) => {
  const { items, filter, searchText, sortOption } = state.todos;

  // filter status
  let filteredItems = [...items];

  if (filter === 'active') {
    filteredItems = filteredItems.filter((todo) => !todo.completed);
  } else if (filter === 'completed') {
    filteredItems = filteredItems.filter((todo) => todo.completed);
  }

  // filter search
  // if (searchText) {
  //   const search = searchText.toLowerCase();
  //   filteredItems = filteredItems.filter((todo) => todo.text.toLowerCase().includes(search));
  // }

  if (searchText) {
    const search = searchText.toLowerCase();
    filteredItems = filteredItems.filter((todo) => todo.title.toLowerCase().includes(search) || (todo.text && todo.text.toLowerCase().includes(search)));
  } // filter search with both title and text

  // sort
  switch (sortOption) {
    case 'alphabetical':
      return filteredItems.sort((a, b) => a.text.localeCompare(b.text));
    case 'alphabetical-reverse':
      return filteredItems.sort((a, b) => b.text.localeCompare(a.text));
    case 'completed-first':
      return filteredItems.sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));
    case 'active-first':
      return filteredItems.sort((a, b) => (a.completed ? 1 : 0) - (b.completed ? 1 : 0));
    case 'due-date':
      return [...filteredItems].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    default:
      // Sort by newest first (createdAt)
      return filteredItems.sort((a, b) => b.id - a.id);
  }
};

export const selectTodosCount = (state) => {
  const items = state.todos.items;
  return {
    total: items.length,
    active: items.filter((todo) => !todo.completed).length,
    completed: items.filter((todo) => todo.completed).length,
  };
};

export default todosSlice.reducer;
