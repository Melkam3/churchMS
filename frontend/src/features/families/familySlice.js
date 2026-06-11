import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { familyAPI } from './familyAPI';

export const fetchFamilies = createAsyncThunk('families/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await familyAPI.getAll(params);
    return { data: res.data.data, pagination: res.data.pagination };
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch families'); }
});

export const fetchFamilyById = createAsyncThunk('families/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await familyAPI.getById(id);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch family'); }
});

export const createFamily = createAsyncThunk('families/create', async (data, { rejectWithValue }) => {
  try {
    const res = await familyAPI.create(data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create family'); }
});

export const updateFamily = createAsyncThunk('families/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await familyAPI.update(id, data);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update family'); }
});

export const deleteFamily = createAsyncThunk('families/delete', async (id, { rejectWithValue }) => {
  try {
    await familyAPI.delete(id);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete family'); }
});

export const addMemberToFamily = createAsyncThunk('families/addMember', async ({ familyId, memberId }, { rejectWithValue }) => {
  try {
    const res = await familyAPI.addMember(familyId, memberId);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add member'); }
});

const familySlice = createSlice({
  name: 'families',
  initialState: { items: [], item: null, loading: false, error: null, pagination: {} },
  reducers: {
    clearFamilyError: (state) => { state.error = null; },
    clearSelectedFamily: (state) => { state.item = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFamilies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFamilies.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFamilyById.fulfilled, (state, action) => { state.loading = false; state.item = action.payload; })
      .addCase(createFamily.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createFamily.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateFamily.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload;
        const idx = state.items.findIndex(f => f._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteFamily.fulfilled, (state, action) => { state.items = state.items.filter(f => f._id !== action.payload); })
      .addCase(addMemberToFamily.fulfilled, (state, action) => { state.item = action.payload; });
  },
});

export const { clearFamilyError, clearSelectedFamily } = familySlice.actions;
export default familySlice.reducer;
