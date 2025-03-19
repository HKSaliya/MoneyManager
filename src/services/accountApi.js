import api from "./api";

// Fetch user data
export const fetchUserData = async () => {
    const response = await api.get("/auth/update");
    return response.data;
};

// Update user data
export const updateUserData = async (formData) => {
    const response = await api.put("/auth/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};


//create category
export const createNewCategory = async (data) => {
    try {
        // console.log("Sending category data:", categoryData);
        const response = await api.post("/category/categories", {
            name: data.name,
            type: data.type,
            icon: data.icon,
            color: data.color
        });
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("API Error Details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        throw error;
    }
};
//fetch expense category
export const expenseCategories = async () => {
    const response = await api.get("/Category/categories?type=expense");
    return response.data;
}
//fetch income category
export const incomeCategories = async () => {
    const response = await api.get("/Category/categories?type=income");
    return response.data;
}
// Update Category
export const updateCategoryApi = async (id, updatedData) => {
    const response = await api.put(`/Category/${id}`, updatedData);
    return response.data;
};
// Delete Category
export const deleteCategoryApi = async (id) => {
    await api.delete(`/Category/${id}`);
};

// Fetch Wallets by User ID
export const getWallets = async () => {
    const response = await api.get(`/wallets/getWallets`);
    return response.data.wallets;
};

// Add New Wallet
export const addWallet = async (walletData) => {
    const response = await api.post("/wallets/add-wallet", walletData);
    return response.data;
};

//delete wallet
export const deleteWallet = async (id) => {
    await api.delete(`/wallet/deleteWallet/${id}`);
}

// Update Wallet Balance
export const updateWalletBalance = async (walletId, amount) => {
    const response = await api.patch("/wallets/update-wallet", { walletId, amount });
    return response.data;
};

// fetch transactions
export const fetchTransactionRecords = async (filters = {}) => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Set default startDate and endDate if not provided
    if (!filters.startDate && !filters.endDate) {
        filters.startDate = today;
        filters.endDate = today;
    }

    // Convert filters to query parameters
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/transfer/getTransaction?${params}`);
    return response.data;
};

//create transaction
export const createTransactionRecord = async (transactionData) => {
    const response = await api.post("/transfer/addTransaction", transactionData);
    return response.data;
};

