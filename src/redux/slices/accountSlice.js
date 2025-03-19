import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData, updateUserData } from "@/src/services/accountApi";

// Thunks
export const getUser = createAsyncThunk("account/getUser", async (_, { rejectWithValue }) => {
    try {
        const response = await fetchUserData();
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const updateUser = createAsyncThunk("account/updateUser", async (formData, { rejectWithValue }) => {
    try {
        const response = await updateUserData(formData);
        return response;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Initial state
const initialState = {
    user: null,
    loading: false,
    error: null,
};

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default accountSlice.reducer;
