import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ministryAPI } from './ministryAPI';

export const fetchMinistries = createAsyncThunk('ministries/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.getAll(params);
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch ministries'); }
});

export const fetchMinistryById = createAsyncThunk('ministries/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.getById(id);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch ministry'); }
});

export const createMinistry = createAsyncThunk('ministries/create', async (data, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.create(data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create ministry'); }
});

export const updateMinistry = createAsyncThunk('ministries/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.update(id, data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update ministry'); }
});

export const deleteMinistry = createAsyncThunk('ministries/delete', async (id, { rejectWithValue }) => {
  try {
    await ministryAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete ministry'); }
});

export const assignMemberToMinistry = createAsyncThunk('ministries/assignMember', async ({ ministryId, memberId }, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.assignMember(ministryId, memberId);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeMemberFromMinistry = createAsyncThunk('ministries/removeMember', async ({ ministryId, memberId }, { rejectWithValue }) => {
  try {
    const res = await ministryAPI.removeMember(ministryId, memberId);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const ministrySlice = createSlice({
  name: 'ministries',
  initialState: { items: [], item: null, loading: false, error: null, pagination: {} },
  reducers: {
    clearMinistryError: (state) => { state.error = null; },
    clearSelectedMinistry: (state) => { state.item = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMinistries.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMinistries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMinistries.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMinistryById.fulfilled, (state, action) => { state.item = action.payload; })
      .addCase(createMinistry.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      .addCase(createMinistry.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateMinistry.fulfilled, (state, action) => {
        state.item = action.payload;
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteMinistry.fulfilled, (state, action) => { state.items = state.items.filter(m => m._id !== action.payload); })
      .addCase(assignMemberToMinistry.fulfilled, (state, action) => { state.item = action.payload; })
      .addCase(removeMemberFromMinistry.fulfilled, (state, action) => { state.item = action.payload; });
  },
});

export const { clearMinistryError, clearSelectedMinistry } = ministrySlice.actions;
export default ministrySlice.reducer;
