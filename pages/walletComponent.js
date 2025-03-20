"use client"; // For Next.js App Router

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createWallet, removeWallet, fetchWallets } from "@/src/redux/slices/walletSlice";
import Swal from "sweetalert2"; // Import SweetAlert2 for confirmation
import NavBar from "@/components/NavBar";

const WalletComponent = () => {
    const dispatch = useDispatch();
    const { wallets, loading } = useSelector((state) => state.wallet);

    // State for form modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [walletData, setWalletData] = useState({ name: "", balance: "" });

    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);

    // Handle input change in the form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setWalletData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission to add a new wallet
    const handleAddWallet = (e) => {
        e.preventDefault();
        if (!walletData.name || walletData.balance === "") {
            Swal.fire("Error", "Please enter both wallet name and balance", "error");
            return;
        }
        dispatch(createWallet({ name: walletData.name, balance: Number(walletData.balance) }));
        setIsModalOpen(false);
        setWalletData({ name: "", balance: "" });
    };

    // Handle delete with confirmation
    const handleDelete = (walletId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to recover this wallet!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(removeWallet(walletId));
                Swal.fire("Deleted!", "Your wallet has been deleted.", "success");
            }
        });
    };

    return (
        <>
            <NavBar />
            <div className="p-4 w-[90%] mx-auto">
                <h2 className="text-lg lg:text-xl font-bold mb-4">Wallets</h2>
                {loading && <p>Loading...</p>}

                {/* Add Wallet Button */}
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 mb-4">
                    Add Wallet
                </button>

                {/* Wallet List */}
                <div>
                    {wallets.map((wallet) => (
                        <div key={wallet._id} className="border p-2 mb-2 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{wallet.name}</h3>
                                <div className="text-base lg:text-lg">
                                    <span>Balance: </span>₹{wallet.balance}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(wallet._id)}
                                className="bg-red-500 text-white px-4 py-2"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Wallet Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-bold mb-4">Add Wallet</h2>
                            <form onSubmit={handleAddWallet} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium">Wallet Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={walletData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Balance</label>
                                    <input
                                        type="number"
                                        name="balance"
                                        value={walletData.balance}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-400 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded"
                                    >
                                        Add Wallet
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WalletComponent;
