import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { memberAPI } from './memberAPI';

export const fetchMembers = createAsyncThunk('members/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await memberAPI.getAll(params);
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch members'); }
});

export const fetchMemberById = createAsyncThunk('members/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await memberAPI.getById(id);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch member'); }
});

export const createMember = createAsyncThunk('members/create', async (data, { rejectWithValue }) => {
  try {
    const res = await memberAPI.create(data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create member'); }
});

export const updateMember = createAsyncThunk('members/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await memberAPI.update(id, data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update member'); }
});

export const deleteMember = createAsyncThunk('members/delete', async (id, { rejectWithValue }) => {
  try {
    await memberAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete member'); }
});

export const uploadMemberPhoto = createAsyncThunk('members/uploadPhoto', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await memberAPI.uploadPhoto(id, formData);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to upload photo'); }
});

const memberSlice = createSlice({
  name: 'members',
  initialState: { items: [], item: null, loading: false, error: null, pagination: {} },
  reducers: {
    clearMemberError: (state) => { state.error = null; },
    clearSelectedMember: (state) => { state.item = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMembers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMemberById.pending, (state) => { state.loading = true; })
      .addCase(fetchMemberById.fulfilled, (state, action) => { state.loading = false; state.item = action.payload; })
      .addCase(fetchMemberById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createMember.pending, (state) => { state.loading = true; })
      .addCase(createMember.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createMember.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateMember.pending, (state) => { state.loading = true; })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateMember.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteMember.fulfilled, (state, action) => { state.items = state.items.filter(m => m._id !== action.payload); })
      .addCase(uploadMemberPhoto.fulfilled, (state, action) => {
        state.item = action.payload;
        const idx = state.items.findIndex(m => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export const { clearMemberError, clearSelectedMember } = memberSlice.actions;
export default memberSlice.reducer;
