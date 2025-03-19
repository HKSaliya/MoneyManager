import Layout from '@/components/Layout'
import { createCategory, deleteCategory, fetchExpenseCategories, fetchIncomeCategories, updateCategory } from '@/src/redux/slices/categorySlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUtensils, FaBus, FaFilm, FaShoppingCart, FaChevronDown } from "react-icons/fa";

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
const allcategories = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [type, setType] = useState("expense");
    const [selectedIcon, setSelectedIcon] = useState(ICONS[0]); // Default icon
    const [selectedColor, setSelectedColor] = useState(COLORS[0]); // Default color
    const [showIconDropdown, setShowIconDropdown] = useState(false);
    const [showColorDropdown, setShowColorDropdown] = useState(false);

    // Add these new states
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        dispatch(fetchIncomeCategories());
        dispatch(fetchExpenseCategories());
    }, [dispatch]);

    // Select data safely
    const incomeList = useSelector((state) => state.categories?.incomeList || []);
    const expenseList = useSelector((state) => state.categories?.expenseList || []);
    const status = useSelector((state) => state.categories?.status || "idle");
    const error = useSelector((state) => state.categories?.error || null);

    // New function to handle edit button click
    const handleEdit = (category) => {
        setIsEditing(true);
        setEditingCategoryId(category._id);
        setName(category.name);
        setType(category.type);

        // Find the selected icon and color from predefined arrays
        const matchedIcon = ICONS.find(icon => icon.name === category.icon);
        const matchedColor = COLORS.find(color => color.hex === category.color);

        if (matchedIcon) setSelectedIcon(matchedIcon);
        if (matchedColor) setSelectedColor(matchedColor);
    };

    // New function to reset form
    const resetForm = () => {
        setName("");
        setIsEditing(false);
        setEditingCategoryId(null);
        setType("expense");
        setSelectedIcon(ICONS[0]);
        setSelectedColor(COLORS[0]);
    };
    // Modified handleSubmit to handle both create and update
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !type || !selectedIcon || !selectedColor) {
            alert("Please fill all fields");
            return;
        }

        const categoryData = {
            name,
            type,
            icon: selectedIcon.name,
            color: selectedColor.hex,
        };

        if (isEditing) {
            dispatch(updateCategory({ id: editingCategoryId, updatedData: categoryData }))
                .then(() => {
                    // Reset form after successful update
                    // Refresh categories
                    dispatch(fetchIncomeCategories());
                    dispatch(fetchExpenseCategories());
                    resetForm();
                });
        } else {
            dispatch(createCategory(categoryData));
        }
    };


    // Modified handleDelete to reset form if deleting the edited category
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            dispatch(deleteCategory(id)).then(() => {
                if (id === editingCategoryId) {
                    resetForm();
                }
            });
        }
    };

    return (
        <Layout className='min-h-screen p-6'>
            <div className='grid grid-cols-2 min-h-4 items-center justify-center'>
                <div>Logo</div>
                <div className='text-right'>
                    <div>image</div>
                    <div>name</div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="mx-auto p-4 bg-white shadow-md rounded-lg">
                <h2 className='font-semibold text-lg'>Create a new category</h2>
                <div className='w-full flex justify-center gap-4'>
                    {/* Icon Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Icon</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowIconDropdown(!showIconDropdown)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <div className="flex items-center">
                                    <selectedIcon.component size={20} color={selectedColor.hex} />
                                    {/* <span className="ml-2">{selectedIcon.name}</span> */}
                                </div>
                                <FaChevronDown size={14} />
                            </button>
                            {showIconDropdown && (
                                <div className="absolute z-10 mt-1 w-16 bg-white border border-gray-300 rounded-md shadow-lg">
                                    {ICONS.map((icon) => (
                                        <div
                                            key={icon.id}
                                            onClick={() => {
                                                setSelectedIcon(icon);
                                                setShowIconDropdown(false);
                                            }}
                                            className="px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                                        >
                                            <icon.component size={20} color={selectedColor.hex} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Color Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Color</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowColorDropdown(!showColorDropdown)}
                                className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <div className="flex items-center">
                                    <div
                                        className="w-5 h-5 rounded-full"
                                        style={{ backgroundColor: selectedColor.hex }}
                                    />
                                    <span className="ml-2">{selectedColor.name}</span>
                                </div>
                                <FaChevronDown size={14} />
                            </button>
                            {showColorDropdown && (
                                <div className="absolute z-10 mt-1 w-24 bg-white border border-gray-300 rounded-md shadow-lg">
                                    {COLORS.map((color) => (
                                        <div
                                            key={color.id}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setShowColorDropdown(false);
                                            }}
                                            className="px-3 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="ml-2">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Name Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter category name"
                            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Type Dropdown */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className='flex items-end py-5'>
                        <button
                            type="submit"
                            className="h-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create Category
                        </button>
                    </div>
                </div>
            </form>
            {status === "loading" && <p>Loading categories...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="py-4">
                {/* Income Categories */}
                <div className="p-4 border rounded shadow">
                    <h3 className="text-lg font-semibold text-green-600">Income Categories</h3>
                    <div>
                        {incomeList.length > 0 ? (
                            incomeList.map((category) => {
                                // Find the matching icon component
                                const IconComponent = ICONS.find(icon => icon.name === category.icon)?.component;

                                return (
                                    <div key={category._id} className="mt-2 space-x-4 flex items-center">
                                        {IconComponent ? <IconComponent style={{ color: category.color, fontSize: "24px" }} /> : <p>Icon not found</p>}
                                        <p>{category.name}</p>
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="bg-blue-500 text-white px-2 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(category._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No income categories found.</p>
                        )}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="p-4 border rounded shadow">
                    <h3 className="text-lg font-semibold text-red-600">Expense Categories</h3>
                    <div>
                        {expenseList.length > 0 ? (
                            expenseList.map((category) => {
                                // Find the matching icon component
                                const IconComponent = ICONS.find(icon => icon.name === category.icon)?.component;

                                return (
                                    <div key={category._id} className="mt-2 space-x-4 flex items-center">
                                        {IconComponent ? <IconComponent style={{ color: category.color, fontSize: "24px" }} /> : <p>Icon not found</p>}
                                        <p>{category.name}</p>
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="bg-blue-500 text-white px-2 py-1"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(category._id)} className="bg-red-500 text-white px-2 py-1">Delete</button>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No expense categories found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default allcategories