import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import apiClient, { apiEndpoints } from '../services/apiClient';

// Create a constant empty array to ensure consistent reference
const EMPTY_PERMISSIONS_ARRAY = [];

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(apiEndpoints.auth.login, {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        return { user, token };
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Network error during login';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching current user data
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(apiEndpoints.auth.me);
      
      if (response.data.success) {
        return response.data.user;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for refreshing comprehensive panel permissions
export const refreshPermissions = createAsyncThunk(
  'auth/refreshPermissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(apiEndpoints.users.panelPermissions);
      
      if (response.data.success) {
        // Return the comprehensive permissions data structure
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch permissions');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch permissions';
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  permissionsLoading: false,
  permissionsError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserPermissions: (state, action) => {
      if (state.user) {
        state.user.permissions = action.payload;
      }
    },
    // Restore user from localStorage (for initial load)
    restoreUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Fetch current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Refresh permissions
    builder
      .addCase(refreshPermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(refreshPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        if (state.user) {
          // The comprehensive API returns nested userPermissions, flatten them for useAuth compatibility
          const flattenedPermissions = (action.payload.permissions || []).map(perm => ({
            formName: perm.formName,
            read: perm.userPermissions?.read || false,
            write: perm.userPermissions?.write || false,
            edit: perm.userPermissions?.edit || false,
            delete: perm.userPermissions?.delete || false,
            full: perm.userPermissions?.full || false
          }));

          state.user.permissions = flattenedPermissions;
          // Also store panel and role info
          state.user.panel = action.payload.panel;
          state.user.role = action.payload.role;
        }
      })
      .addCase(refreshPermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload;
      });

    // Handle REHYDRATE from redux-persist
    builder.addCase(REHYDRATE, (state, action) => {
      if (action.payload && action.payload.auth) {
        const { user, token, isAuthenticated } = action.payload.auth;
        
        // Restore state from persisted data
        state.user = user;
        state.token = token;
        state.isAuthenticated = isAuthenticated || (user && token);
        state.loading = false;
        state.error = null;
        
        // Ensure token is in localStorage
        if (token) {
          localStorage.setItem('token', token);
        }
        
      }
    });
  },
});

// Export actions
export const { logout, clearError, updateUserPermissions, restoreUser } = authSlice.actions;

// Selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectLoading = (state) => state.auth.loading;
export const selectError = (state) => state.auth.error;

export const selectPermissions = (state) => state.auth.user?.permissions || EMPTY_PERMISSIONS_ARRAY;

export const selectUserRole = (state) => state.auth.user?.role;
export const selectPermissionsLoading = (state) => state.auth.permissionsLoading;

// Permission checker helpers
export const selectHasPermission = (state, formName, action = 'read') => {
  const user = state.auth.user;
  if (!user) return false;

  const permissions = user.permissions || EMPTY_PERMISSIONS_ARRAY;
  if (!Array.isArray(permissions)) {
    return false;
  }

  const permission = permissions.find(p => p.formName === formName);
  if (!permission) return false;

  return permission.full || permission[action];
};

export default authSlice.reducer;

