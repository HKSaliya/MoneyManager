import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { modifyWalletBalance } from "./walletSlice";
import { createTransactionRecord, fetchTransactionRecords } from "@/src/services/accountApi";

// Fetch transactions with filters
export const fetchTransactions = createAsyncThunk(
    "transactions/fetchAll",
    async (filters = {}, { rejectWithValue }) => {
        try {
            return await fetchTransactionRecords(filters);
        } catch (error) {
            console.error("Fetch transactions error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error fetching transactions");
        }
    }
);

// Create transaction
export const createTransaction = createAsyncThunk(
    "transactions/create",
    async (transactionData, { dispatch, rejectWithValue }) => {
        try {
            const data = await createTransactionRecord(transactionData);
            console.log(data)
            // Update wallet balance after transaction
            dispatch(modifyWalletBalance({
                walletId: data.wallet,
                amount: data.amount
            }));
            console.log("Transaction created:", data);
            return data;
        } catch (error) {
            console.error("Transaction error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error creating transaction");
        }
    }
);

// Update transaction
export const updateTransaction = createAsyncThunk(
    "transactions/update",
    async ({ transactionId, updatedData }, { dispatch, getState, rejectWithValue }) => {
        try {
            const { data } = await axios.put(`/api/transactions/${transactionId}`, updatedData);
            const state = getState();

            const oldTransaction = state.transactions.items.find(t => t._id === transactionId);
            if (!oldTransaction) return rejectWithValue("Transaction not found");

            const difference = updatedData.amount - oldTransaction.amount;
            const amountChange = updatedData.type === "income" ? difference : -difference;

            dispatch(modifyWalletBalance({
                walletId: updatedData.walletId,
                amount: amountChange
            }));

            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating transaction");
        }
    }
);

// Delete transaction
export const deleteTransaction = createAsyncThunk(
    "transactions/delete",
    async (transactionId, { rejectWithValue }) => {
        try {
            await axios.delete(`/api/transactions/${transactionId}`);
            return transactionId; // Return ID to remove from state
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting transaction");
        }
    }
);


const transactionSlice = createSlice({
    name: "transactions",
    initialState: {
        items: [],
        filteredItems: [],
        status: "idle",
        error: null
    },
    reducers: {
        filterTransactions: (state, action) => {
            const { startDate, endDate } = action.payload;
            state.filteredItems = state.items.filter(transaction => {
                const transactionDate = new Date(transaction.date);
                return transactionDate >= new Date(startDate) &&
                    transactionDate <= new Date(endDate);
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                console.log("Fetched transactions:", action.payload);
                state.status = "succeeded";
                state.items = action.payload;
                state.filteredItems = action.payload;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.filteredItems.unshift(action.payload);
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.items.findIndex(t => t._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                    state.filteredItems[index] = action.payload;
                }
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.items = state.items.filter(t => t._id !== action.payload);
                state.filteredItems = state.filteredItems.filter(t => t._id !== action.payload);
            });
    }
});

export const { filterTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;