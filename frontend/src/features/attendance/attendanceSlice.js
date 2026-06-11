import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceAPI } from './attendanceAPI';

export const fetchAttendance = createAsyncThunk('attendance/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await attendanceAPI.getAll(params);
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch attendance'); }
});

export const recordAttendance = createAsyncThunk('attendance/record', async (data, { rejectWithValue }) => {
  try {
    const res = await attendanceAPI.record(data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to record attendance'); }
});

export const updateAttendance = createAsyncThunk('attendance/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await attendanceAPI.update(id, data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update attendance'); }
});

export const deleteAttendance = createAsyncThunk('attendance/delete', async (id, { rejectWithValue }) => {
  try {
    await attendanceAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete attendance'); }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: { items: [], item: null, loading: false, error: null, pagination: {} },
  reducers: { clearAttendanceError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAttendance.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(recordAttendance.pending, (state) => { state.loading = true; })
      .addCase(recordAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(recordAttendance.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateAttendance.fulfilled, (state, action) => {
        const idx = state.items.findIndex(a => a._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteAttendance.fulfilled, (state, action) => {
        state.items = state.items.filter(a => a._id !== action.payload);
      });
  },
});

export const { clearAttendanceError } = attendanceSlice.actions;
export default attendanceSlice.reducer;
