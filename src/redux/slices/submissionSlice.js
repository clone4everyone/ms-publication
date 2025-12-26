
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../utils/api"

const API_URL = '/api/submissions';
const EDITOR_URL = '/api/editor';
const REVIEWER_URL = '/api/reviewer';

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

const initialState = {
  submissions: [],
  currentSubmission: null,
  journalStats: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  canEdit: false,
};

// Create submission
export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (data, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.post(API_URL, data, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Upload document
export const uploadDocument = createAsyncThunk(
  'submissions/uploadDocument',
  async ({ id, file }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await api.post(
        `${API_URL}/${id}/upload`,
        formData,
        {
          ...getConfig(token),
          headers: {
            ...getConfig(token).headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add metadata
export const addMetadata = createAsyncThunk(
  'submissions/addMetadata',
  async ({ id, metadata }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${API_URL}/${id}/metadata`, metadata, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Confirm submission
export const confirmSubmission = createAsyncThunk(
  'submissions/confirm',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${API_URL}/${id}/confirm`, {}, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get my submissions
export const getMySubmissions = createAsyncThunk(
  'submissions/getMy',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/my-submissions`, getConfig(token));
      return response.data.data.submissions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get single submission
export const getSubmission = createAsyncThunk(
  'submissions/getOne',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/${id}`, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get submissions by journal
export const getSubmissionsByJournal = createAsyncThunk(
  'submissions/getByJournal',
  async ({ journal, status }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const query = status ? `?status=${status}` : '';
      const response = await api.get(`${API_URL}/journal/${journal}${query}`, getConfig(token));
      return response.data.data.submissions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get journal stats
export const getJournalStats = createAsyncThunk(
  'submissions/getStats',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/stats/journals`, getConfig(token));
      return response.data.data.stats;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Editor actions
export const approveSubmission = createAsyncThunk(
  'submissions/approve',
  async ({ id, editorNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${EDITOR_URL}/submissions/${id}/approve`, { editorNotes }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const rejectSubmission = createAsyncThunk(
  'submissions/reject',
  async ({ id, rejectionReason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${EDITOR_URL}/submissions/${id}/reject`, { rejectionReason }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const moveToReviewer = createAsyncThunk(
  'submissions/moveToReviewer',
  async ({ id, reviewerId, editorNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(
        `${EDITOR_URL}/submissions/${id}/move-to-reviewer`, 
        { reviewerId, editorNotes }, 
        getConfig(token)
      );
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const schedulePublication = createAsyncThunk(
  'submissions/schedule',
  async ({ id, publicationDate }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${EDITOR_URL}/submissions/${id}/schedule`, { publicationDate }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reviewer actions
export const reviewerApprove = createAsyncThunk(
  'submissions/reviewerApprove',
  async ({ id, reviewerNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${REVIEWER_URL}/submissions/${id}/approve`, { reviewerNotes }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const reviewerReject = createAsyncThunk(
  'submissions/reviewerReject',
  async ({ id, rejectionReason }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${REVIEWER_URL}/submissions/${id}/reject`, { rejectionReason }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateSubmissionMetadata = createAsyncThunk(
  'submissions/updateMetadata',
  async ({ id, metadata }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${API_URL}/${id}/update-metadata`, metadata, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const updateSubmissionDocument = createAsyncThunk(
  'submissions/updateDocument',
  async ({ id, file }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await api.put(
        `${API_URL}/${id}/update-document`,
        formData,
        {
          ...getConfig(token),
          headers: {
            ...getConfig(token).headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const canEditSubmission = createAsyncThunk(
  'submissions/canEdit',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.get(`${API_URL}/${id}/can-edit`, getConfig(token));
      return response.data.data.canEdit;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Reviewer send back to editor
export const reviewerSendBack = createAsyncThunk(
  'submissions/reviewerSendBack',
  async ({ id, reviewerNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(`${REVIEWER_URL}/submissions/${id}/send-back`, { reviewerNotes }, getConfig(token));
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const editorSendBack = createAsyncThunk(
  'submissions/editorSendBack',
  async ({ id, editorNotes }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;
      const response = await api.put(
        `${EDITOR_URL}/submissions/${id}/send-back`, 
        { editorNotes }, 
        getConfig(token)
      );
      return response.data.data.submission;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createSubmission.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSubmission = action.payload;
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get my submissions
      .addCase(getMySubmissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMySubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.submissions = action.payload;
      })
      .addCase(getMySubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get one
      .addCase(getSubmission.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })
      // Get by journal
      .addCase(getSubmissionsByJournal.fulfilled, (state, action) => {
        state.submissions = action.payload;
      })
      // Get stats
      .addCase(getJournalStats.fulfilled, (state, action) => {
        state.journalStats = action.payload;
      })
      // Upload document
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })
      // Add metadata
      .addCase(addMetadata.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })
      // Confirm
      .addCase(confirmSubmission.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
        state.isSuccess = true;
      })
      .addCase(updateSubmissionMetadata.pending, (state) => {
  state.isLoading = true;
})
.addCase(updateSubmissionMetadata.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.currentSubmission = action.payload;
})
.addCase(updateSubmissionMetadata.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
})
.addCase(updateSubmissionDocument.pending, (state) => {
  state.isLoading = true;
})
.addCase(updateSubmissionDocument.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.currentSubmission = action.payload;
})
.addCase(updateSubmissionDocument.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
})
.addCase(canEditSubmission.fulfilled, (state, action) => {
  state.canEdit = action.payload;
})
.addCase(reviewerSendBack.pending, (state) => {
  state.isLoading = true;
})
.addCase(reviewerSendBack.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.currentSubmission = action.payload;
})
.addCase(reviewerSendBack.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
})
.addCase(editorSendBack.pending, (state) => {
  state.isLoading = true;
})
.addCase(editorSendBack.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.currentSubmission = action.payload;
})
.addCase(editorSendBack.rejected, (state, action) => {
  state.isLoading = false;
  state.isError = true;
  state.message = action.payload;
});
      
  },
});

export const { reset, clearCurrentSubmission } = submissionSlice.actions;
export default submissionSlice.reducer;