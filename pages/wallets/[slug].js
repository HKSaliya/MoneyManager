import { fetchWallets } from "@/src/redux/slices/walletSlice";
import { fetchTransactions, filterTransactions } from "@/src/redux/slices/transactionSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenseCategories, fetchIncomeCategories } from "@/src/redux/slices/categorySlice";
import TransactionForm from "@/components/TransactionForm";
import { useRouter } from "next/router";
import { FaUtensils, FaBus, FaFilm, FaShoppingCart, FaChevronDown } from "react-icons/fa";
import NavBar from "@/components/NavBar";

// Predefined options
const ICONS = [
    { id: 1, component: FaUtensils, name: "Utensils" },
    { id: 2, component: FaBus, name: "Bus" },
    { id: 3, component: FaFilm, name: "Film" },
    { id: 4, component: FaShoppingCart, name: "Shopping Cart" },
];

const COLORS = [
    { id: 1, hex: "#FF6B6B", name: "Red" },
    { id: 2, hex: "#4ECDC4", name: "Teal" },
    { id: 3, hex: "#45B7D1", name: "Blue" },
    { id: 4, hex: "#96CEB4", name: "Green" },
];

const WalletDetail = () => {
    const router = useRouter();
    const { slug } = router.query; // Get walletId from URL
    const walletId = slug;
    const dispatch = useDispatch();

    const { wallets, loading: walletsLoading } = useSelector((state) => state.wallet);
    const { filteredItems: transactions, status } = useSelector((state) => state.transactions);
    // Filter transactions based on walletId
    const filteredTransactions = transactions.filter(transaction => transaction.wallet === walletId);

    const today = new Date().toISOString().split("T")[0];
    const [dateRange, setDateRange] = useState({ startDate: today, endDate: today });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        dispatch(fetchWallets());
        dispatch(fetchTransactions()).then(() => {
            dispatch(filterTransactions(dateRange));
        });
        dispatch(fetchIncomeCategories());
        dispatch(fetchExpenseCategories());
        // console.log(slug);
    }, [dispatch]);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyDateFilter = () => {
        console.log("Applying date filter:", dateRange);
        dispatch(fetchTransactions(dateRange)).then(() => {
            dispatch(filterTransactions(dateRange)); // Ensure transactions are re-filtered after fetching
        });
    };

    if (walletsLoading || status === "loading") {
        return <p>Loading...</p>;
    }

    // Find the selected wallet based on walletId from the URL
    const selectedWallet = wallets.find(wallet => wallet._id === walletId);

    return (
        <>
            <NavBar />
            <div className="min-h-screen p-8 lg:p-16">
                <div className="flex items-center justify-between">
                    {selectedWallet ? (
                        <div key={selectedWallet._id} className="border p-2 mb-2">
                            <h3 className="font-semibold">{selectedWallet.name}</h3>
                            <div><span>Balance :</span> ₹{selectedWallet.balance}</div>
                        </div>
                    ) : (
                        <p>No wallet found.</p> // Message if wallet doesn't exist
                    )}

                    <div className="flex gap-4 mt-4">
                        <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} className="border p-2" />
                        <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} className="border p-2" />
                        <button
                            onClick={applyDateFilter}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 text-white p-2 mt-6 rounded-md"
                >
                    Add Transaction
                </button>

                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowForm(false)}
                    >
                        <div
                            className="bg-white p-6 rounded-lg shadow-lg relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
                        >
                            <TransactionForm onClose={() => setShowForm(false)} dateRange={dateRange} WalletId={walletId} />
                        </div>
                    </div>
                )}

                <h2 className="mt-6">Transactions</h2>
                {filteredTransactions.length > 0 ? (
                    <ul className="mt-4">
                        {filteredTransactions.map((transaction) => {
                            // Find the corresponding icon from the ICONS array
                            const matchingIcon = ICONS.find(icon => icon.name === transaction.category.icon);

                            return (
                                <li key={transaction._id} className="border p-2 mb-2">
                                    <div className="text-sm font-medium"> {new Date(transaction.date).toLocaleDateString()}</div>

                                    <div className="flex gap-4 justify-between ">
                                        <div className="text-xl flex gap-4 items-center">
                                            {matchingIcon ? <matchingIcon.component color={transaction.category.color} /> : "❓"} {/* Show icon if found, otherwise show a placeholder */}
                                            <strong>{transaction.label}</strong>
                                        </div>
                                        <div className={`${transaction.category.type === "expense" ? "text-red-500" : "text-green-500"} font-semibold text-lg`}>₹{transaction.amount}</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>No transactions found.</p>
                )}
            </div>
        </>
    );
};

export default WalletDetail;
