"use client"; // Use this if using Next.js App Router

import { createWallet, deleteWallet, fetchWallets } from "@/src/redux/slices/walletSlice";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

const WalletComponent = () => {
    const dispatch = useDispatch();
    const { wallets, loading, error } = useSelector((state) => state.wallet);

    // State to manage custom amounts for each wallet
    const [amounts, setAmounts] = useState({});

    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);

    const handleAddWallet = () => {
        const walletData = { name: "New Wallet", balance: 100 };
        dispatch(createWallet(walletData));
    };

    const handleDelete = (walletId) => {
        dispatch(deleteWallet(walletId));
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4" onClick={() => console.log(wallets)}>Wallets</h2>
            {loading && <p>Loading...</p>}
            {/* {error && <p className="text-red-500">{error}</p>} */}
            {/* {(wallets.length === 0) && */}
            <button onClick={handleAddWallet} className="bg-blue-500 text-white px-4 py-2 mb-4">
                Add Wallet
            </button>
            <button onClick={handleDelete} className="bg-blue-500 text-white px-4 py-2 mb-4">
                Delete Wallet
            </button>
            {/* } */}
            <div className="">
                {
                    wallets.map((wallet) => (
                        <div key={wallet._id} className="border p-2 mb-2 ">
                            <h3 className="font-semibold">{wallet.name}</h3>
                            <div><span>Balance :</span> ₹{wallet.balance}</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default WalletComponent;
