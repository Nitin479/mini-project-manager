import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user || null;
      state.token = token || null;
      state.isAuthenticated = !!token;
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
    },
    loadFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
          try {
            state.token = token;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch (e) {
            console.error('Failed to parse user from localStorage:', e);
            localStorage.removeItem('user');
            state.user = null;
          }
        } else if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  },
});

export const { setCredentials, loadFromStorage, logout } = authSlice.actions;
export default authSlice.reducer;
