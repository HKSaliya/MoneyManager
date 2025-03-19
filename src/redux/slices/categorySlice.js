import { createNewCategory, deleteCategoryApi, expenseCategories, incomeCategories, updateCategoryApi } from "@/src/services/accountApi";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchIncomeCategories = createAsyncThunk(
    "categories/fetchAllIncome",
    async (_, { rejectWithValue }) => {
        try {
            const data = await incomeCategories();
            return Array.isArray(data) ? data : [data]; // Ensure it's always an array
        } catch (error) {
            console.error("Error fetching income categories:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const fetchExpenseCategories = createAsyncThunk(
    "categories/fetchAllExpense",
    async (_, { getState, rejectWithValue }) => {
        try {
            const data = await expenseCategories();
            return data;
        } catch (error) {
            console.error("Error fetching expense categories:", error);
            return rejectWithValue(error.message);
        }
    }
);


// Async action: Create category
export const createCategory = createAsyncThunk(
    "categories/createCategory",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createNewCategory(data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Update Category
export const updateCategory = createAsyncThunk(
    "categories/updateCategory",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await updateCategoryApi(id, updatedData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
    "categories/deleteCategory",
    async (id, { rejectWithValue }) => {
        try {
            await deleteCategoryApi(id);
            return id; // Return ID to remove it from state
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const categorySlice = createSlice({
    name: "categories",
    initialState: {
        incomeList: [],
        expenseList: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Income Categories
            .addCase(fetchIncomeCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchIncomeCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.incomeList = action.payload; // This should now be an array
            })
            .addCase(fetchIncomeCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Expense Categories
            .addCase(fetchExpenseCategories.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.expenseList = action.payload || []; // Store fetched expense categories
            })
            .addCase(fetchExpenseCategories.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Create Category
            .addCase(createCategory.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.status = "succeeded";

                // Append new category to the correct list based on its type
                if (action.payload.type === "income") {
                    state.incomeList.push(action.payload);
                } else if (action.payload.type === "expense") {
                    state.expenseList.push(action.payload);
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            // Update Category
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedCategory = action.payload;
                if (updatedCategory.type === "income") {
                    state.incomeList = state.incomeList.map(cat =>
                        cat._id === updatedCategory._id ? updatedCategory : cat
                    );
                } else {
                    state.expenseList = state.expenseList.map(cat =>
                        cat._id === updatedCategory._id ? updatedCategory : cat
                    );
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.incomeList = state.incomeList.filter(cat => cat._id !== deletedId);
                state.expenseList = state.expenseList.filter(cat => cat._id !== deletedId);
            })
    },
});

export default categorySlice.reducer;
