import { addWallet, getWallets, updateWalletBalance } from "@/src/services/accountApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch Wallets
export const fetchWallets = createAsyncThunk(
    "wallet/fetchWallets",
    async (userId, { rejectWithValue }) => {
        try {
            return await getWallets(userId);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching wallets");
        }
    }
);

// Add Wallet
export const createWallet = createAsyncThunk(
    "wallet/addWallet",
    async (walletData, { rejectWithValue }) => {
        try {
            return await addWallet(walletData);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error adding wallet");
        }
    }
);

// Update Wallet Balance
export const modifyWalletBalance = createAsyncThunk(
    "wallet/updateWalletBalance",
    async ({ walletId, amount }, { rejectWithValue }) => {
        console.log(walletId, amount, "wallet info")
        try {
            return await updateWalletBalance(walletId, amount);
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating balance");
        }
    }
);

const walletSlice = createSlice({
    name: "wallet",
    initialState: {
        wallets: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWallets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWallets.fulfilled, (state, action) => {
                state.loading = false;
                state.wallets = action.payload;
            })
            .addCase(fetchWallets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createWallet.fulfilled, (state, action) => {
                state.wallets.push(action.payload);
            })
            .addCase(modifyWalletBalance.fulfilled, (state, action) => {
                const index = state.wallets.findIndex((wallet) => wallet._id === action.payload._id);
                if (index !== -1) {
                    state.wallets[index] = action.payload;
                }
            });
    },
});

export default walletSlice.reducer;
