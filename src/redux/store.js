import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slices/accountSlice";
import categoryReducer from "./slices/categorySlice";
import walletReducer from './slices/walletSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
    reducer: {
        account: accountReducer,
        categories: categoryReducer,
        wallet: walletReducer,
        transactions: transactionReducer,
    },
    // devTools: process.env.NODE_ENV !== "production",
});

export default store;
