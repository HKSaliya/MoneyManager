import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTransaction, fetchTransactions, filterTransactions } from "@/src/redux/slices/transactionSlice";

const TransactionForm = ({ onClose, dateRange, WalletId }) => {
    const dispatch = useDispatch();
    const today = new Date().toISOString().split("T")[0];

    const { wallets } = useSelector((state) => state.wallet);
    const { incomeList, expenseList } = useSelector((state) => state.categories);

    const [formData, setFormData] = useState({
        amount: "",
        type: "income",
        walletId: WalletId || "",
        categoryId: "",
        date: today,
        note: "",
        label: "",
        photo: "",
    });

    // Category Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategoryType, setSelectedCategoryType] = useState("expense"); // Default: Expense
    const dropdownRef = useRef(null);

    // Handle Outside Click to Close Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update walletId in formData if WalletId prop changes
    useEffect(() => {
        if (WalletId) {
            setFormData((prev) => ({ ...prev, walletId: WalletId }));
        }
    }, [WalletId]);

    const handleChange = useCallback((e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);

    const handleCategorySelect = (categoryId) => {
        setFormData((prev) => ({ ...prev, categoryId }));
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        let { amount, walletId, categoryId, date, label } = formData;

        if (!amount || !walletId || !categoryId || !date || !label) {
            alert("Please fill all required fields");
            return;
        }

        amount = Math.abs(amount);
        const type = selectedCategoryType; // Dynamically set the type based on category selection
        if (type === "expense") {
            amount = -amount;
        }

        try {
            await dispatch(createTransaction({ ...formData, amount, type })).unwrap();
            alert("Transaction added successfully!");

            setFormData({
                amount: "",
                walletId: WalletId || "",
                categoryId: "",
                date: today,
                note: "",
                label: "",
                photo: "",
            });

            dispatch(fetchTransactions()).then(() => dispatch(filterTransactions(dateRange)));
            onClose();

            // Refresh the page after successful transaction
            window.location.reload();
        } catch (error) {
            alert(`Error: ${error}`);
        }
    }, [dispatch, formData, dateRange, onClose, WalletId, selectedCategoryType]); // Dependency updated

    const categoryList = selectedCategoryType === "income" ? incomeList || [] : expenseList || [];

    return (
        <div className="border p-4 bg-white shadow-lg rounded-md">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Enter amount" className="border p-2" />

                    {/* Custom Category Selection Dropdown */}
                    <div className="relative w-full" ref={dropdownRef}>
                        <input
                            type="text"
                            placeholder="Select Category"
                            value={categoryList.find(cat => cat._id === formData.categoryId)?.name || ""}
                            readOnly
                            className="border p-2 w-full cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        />
                        {isDropdownOpen && (
                            <div className="absolute left-0 right-0 bg-white border shadow-lg rounded-md mt-1 z-10">
                                {/* Tabs for Expense & Income */}
                                <div className="flex border-b">
                                    <button
                                        type="button"  // Prevents form submission
                                        className={`flex-1 p-2 ${selectedCategoryType === "expense" ? "bg-gray-200" : "bg-white"}`}
                                        onClick={() => setSelectedCategoryType("expense")}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"  // Prevents form submission
                                        className={`flex-1 p-2 ${selectedCategoryType === "income" ? "bg-gray-200" : "bg-white"}`}
                                        onClick={() => setSelectedCategoryType("income")}
                                    >
                                        Income
                                    </button>
                                </div>
                                {/* Category List */}
                                <div className="max-h-40 overflow-auto p-2">
                                    {[...categoryList].sort((a, b) => a.name.localeCompare(b.name)).map((category) => (
                                        <div
                                            key={category._id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleCategorySelect(category._id)}
                                        >
                                            {category.name} {category.icon ? `(${category.icon})` : ""}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="border p-2 w-full" />
                    <input type="text" name="label" value={formData.label} onChange={handleChange} placeholder="Enter label (required)" className="border p-2 w-full" />
                    <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Enter note (optional)" className="border p-2 w-full" />
                    <input type="text" name="photo" value={formData.photo} onChange={handleChange} placeholder="Enter photo URL (optional)" className="border p-2 w-full" />
                </div>
                <div className="flex justify-between mt-4">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Add Transaction</button>
                    <button type="button" onClick={onClose} className="bg-gray-400 text-white p-2 rounded-md">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
