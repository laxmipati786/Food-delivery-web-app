import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${baseUrl}/api/auth/forgot-password`, { email });
            toast.success(data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending password reset email');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${baseUrl}/api/auth/reset-password`, {
                email,
                otp,
                newPassword
            });
            toast.success(data.message || 'Password reset successful. Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-20">
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Reset Password</h2>

                {step === 1 && (
                    <>
                        <p className="text-gray-500 text-center text-sm mb-6 font-medium">Enter your registered email address to receive an OTP to reset your password.</p>
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button disabled={loading} type="submit" className={`w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-4 ${loading && 'opacity-70 cursor-not-allowed'}`}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    </>
                )}

                {step === 2 && (
                    <>
                        <p className="text-gray-500 text-center text-sm mb-6 font-medium">Enter the 6-digit OTP sent to <span className="text-primary font-bold">{email}</span> and your new password.</p>
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">OTP Code</label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-center font-bold tracking-[0.5em] text-xl bg-gray-50"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button disabled={loading} type="submit" className={`w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-4 ${loading && 'opacity-70 cursor-not-allowed'}`}>
                                {loading ? 'Resetting...' : 'Verify & Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
