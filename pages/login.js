import { useState } from "react";
import { useRouter } from "next/router";
import { forgotPassword, loginUser, resetPassword } from "@/src/services/accountApi";
import { ClipLoader } from "react-spinners";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isResetPassword, setIsResetPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            localStorage.setItem("token", data.token);
            router.push("/settings/account");
        } catch (error) {
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            setIsForgotPassword(false);
            setIsResetPassword(true);
            alert("OTP sent to your email");
        } catch (error) {
            alert("Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resetPassword(email, otp, newPassword);
            alert("Password reset successful");
            setIsResetPassword(false);
        } catch (error) {
            alert("Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {isResetPassword ? "Reset Password" : isForgotPassword ? "Forgot Password" : "Login"}
                </h1>
                <div className="pb-2">
                    {isResetPassword ? "" : isForgotPassword ? "" : "Don't have an account yet?"}
                    <button className="underline text-green-500 pl-2" onClick={() => router.push('/signup')}>
                        {isResetPassword ? "" : isForgotPassword ? "" : "Signup Here"}
                    </button>
                </div>
                {!isForgotPassword && !isResetPassword && (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 border rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Login"}
                        </button>
                        <button
                            type="button"
                            className="w-full mt-4 text-blue-500 hover:underline"
                            onClick={() => setIsForgotPassword(true)}
                            disabled={loading}
                        >
                            Forgot Password?
                        </button>
                    </form>
                )}

                {isForgotPassword && !isResetPassword && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Send OTP"}
                        </button>
                        <button
                            type="button"
                            className="w-full mt-4 text-blue-500 hover:underline"
                            onClick={() => setIsForgotPassword(false)}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {isResetPassword && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="otp">OTP</label>
                            <input
                                type="text"
                                id="otp"
                                className="w-full px-3 py-2 border rounded"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2" htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full px-3 py-2 border rounded"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Reset Password"}
                        </button>
                        <button
                            type="button"
                            className="w-full mt-4 text-blue-500 hover:underline"
                            onClick={() => setIsResetPassword(false)}
                            disabled={loading}
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
