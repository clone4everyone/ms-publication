import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const API_URL = '/api/emails';

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const initialState = {
  emails: [],
  unreadCount: 0,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Send email
export const sendEmail = createAsyncThunk(
  'emails/send',
  async ({ submissionId, subject, body, images }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const formData = new FormData();
      formData.append('submissionId', submissionId);
      formData.append('subject', subject);
      formData.append('body', body);
      
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      }

      const response = await api.post(
        `${API_URL}/send`,
        formData,
        {
          ...getConfig(token),
          headers: {
            ...getConfig(token).headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data.email;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get submission emails
export const getSubmissionEmails = createAsyncThunk(
  'emails/getSubmissionEmails',
  async (submissionId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/submission/${submissionId}`, getConfig(token));
      return response.data.data.emails;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Mark as read
export const markAsRead = createAsyncThunk(
  'emails/markAsRead',
  async (emailId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${API_URL}/${emailId}/read`, {}, getConfig(token));
      return response.data.data.email;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get unread count
export const getUnreadCount = createAsyncThunk(
  'emails/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/unread/count`, getConfig(token));
      return response.data.data.count;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'emails',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Send email
      .addCase(sendEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emails.push(action.payload);
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get submission emails
      .addCase(getSubmissionEmails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubmissionEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emails = action.payload;
      })
      .addCase(getSubmissionEmails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.emails.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.emails[index] = action.payload;
        }
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const { reset } = emailSlice.actions;
export default emailSlice.reducer;