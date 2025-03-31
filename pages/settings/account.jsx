import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import axios from "axios";
import blankProfile from './../../src/assets/blankprofile.png';
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from '@/src/redux/slices/accountSlice';
import { useRouter } from 'next/router';
import withAuth from '../hoc/withAuth';

const Account = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.account);

    const [formData, setFormData] = useState({
        avatar: null,
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        country: "",
        language: "",
    });

    const [preview, setPreview] = useState(null);

    // Fetch user data
    useEffect(() => {
        dispatch(getUser());
        if (error) {
            localStorage.removeItem("token");
            router.push("/login");
        }
    }, [dispatch]);

    // Update form when user data is fetched
    useEffect(() => {
        if (user) {
            setFormData(user);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatar: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
                form.append(key, formData[key]);
            }
        });
        dispatch(updateUser(form));
        alert("PRofile updated")
    };

    return (
        <Layout className="min-h-screen p-6">
            <div className=" h-full p-6">
                <h2 className="text-2xl mb-4">Account Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block">Avatar Image</label>
                        {preview ? (
                            <img src={preview} alt="Avatar Preview" className="mt-2 w-32 h-32 object-cover rounded-full border" />
                        ) : (
                            <img
                                src={formData.avatar ? formData?.avatar?.url : blankProfile}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full"
                            />
                        )}
                        <input type="file" name="avatar" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <div>
                        <label className="block">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block">Gender (Optional)</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 w-full">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block">Date of Birth (Optional)</label>
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="border p-2 w-full" />
                    </div>
                    <div>
                        <label className="block">Country</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="border p-2 w-full" required />
                    </div>
                    <div>
                        <label className="block">Language</label>
                        <input type="text" name="language" value={formData.language} onChange={handleChange} className="border p-2 w-full" required />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2">Update Profile</button>
                </form>
            </div>
        </Layout>
    );
};

export default withAuth(Account);