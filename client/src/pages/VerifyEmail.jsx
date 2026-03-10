import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const initialEmail = searchParams.get('email') || '';

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(30);
    const [isResending, setIsResending] = useState(false);

    const { verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleResendOTP = async () => {
        if (!email) {
            toast.error('Email is required to resend OTP.');
            return;
        }

        setIsResending(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/resend-email-otp', { email });
            toast.success(data.message || 'New OTP Sent!');
            setResendTimer(30); // reset timer
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await verifyOTP(email, otp);
            toast.success('Email Verified Successfully! Welcome!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-20">
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Verify Email</h2>
                <p className="text-gray-500 text-center text-sm mb-6">We sent a 6-digit OTP to {email || 'your email'}. Check your inbox or spam folder.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!initialEmail && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">OTP Code</label>
                        <input
                            type="text"
                            maxLength="6"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-center font-bold tracking-[0.5em] text-xl"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-4">
                        Verify & Proceed
                    </button>

                    <div className="text-center mt-6">
                        {resendTimer > 0 ? (
                            <p className="text-sm text-gray-500">
                                You can request a new OTP in <span className="font-bold text-orange-600">{resendTimer}s</span>
                            </p>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isResending}
                                className="text-sm font-bold text-primary hover:text-orange-700 transition-colors disabled:opacity-50 underline"
                            >
                                {isResending ? 'Resending...' : 'Resend OTP'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VerifyEmail;
