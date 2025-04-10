import { createSlice } from '@reduxjs/toolkit';

const loadUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const loadUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadUser(),
    isAuthenticated: !!loadUser(),
    error: null,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const login = (credentials) => (dispatch) => {
  dispatch(loginStart());

  try {
    const users = loadUsers();
    const user = users.find((u) => u.username === credentials.username && u.password === credentials.password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      dispatch(loginSuccess(userWithoutPassword));
      return true;
    } else {
      dispatch(loginFailure('Invalid username or password'));
      return false;
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return false;
  }
};

export const register = (userData) => (dispatch) => {
  dispatch(registerStart());

  try {
    const users = loadUsers();

    const existingUser = users.find((u) => u.username === userData.username || u.email === userData.email);

    if (existingUser) {
      dispatch(registerFailure('Username or email already exists'));
      return false;
    }

    // Add new user
    const newUser = {
      ...userData,
      id: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password, confirmPassword, ...userWithoutPassword } = newUser;
    dispatch(registerSuccess(userWithoutPassword));
    return true;
  } catch (error) {
    dispatch(registerFailure(error.message));
    return false;
  }
};

export const { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;
