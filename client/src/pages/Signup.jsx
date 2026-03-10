import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

    // OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    // Timer logic for Resend OTP
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const setupRecaptcha = () => {
        // Clear any orphaned recaptcha instances caused by React re-renders
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }

        // Re-initialize a fresh instance bound to the current DOM
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
        });
    };

    const handleSendOTP = async () => {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Please enter a valid 10-digit Indian phone number.');
            return;
        }

        setIsSendingOTP(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = `+91${phone}`;

            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;

            setOtpSent(true);
            setResendTimer(30);
            toast.success('OTP sent successfully to your phone.');
        } catch (error) {
            console.error('Firebase OTP Error:', error);
            toast.error(`Error: ${error.message}`, { duration: 6000 });
        } finally {
            setIsSendingOTP(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) {
            toast.error('Please enter a valid 6-digit OTP.');
            return;
        }

        setIsVerifyingOTP(true);
        try {
            const confirmationResult = window.confirmationResult;
            await confirmationResult.confirm(otp);
            setIsPhoneVerified(true);
            toast.success('Phone verified successfully!');
        } catch (error) {
            console.error('Firebase Verify Error:', error);
            toast.error('Invalid OTP');
        } finally {
            setIsVerifyingOTP(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPhoneVerified) {
            toast.error('Please verify your phone number first!');
            return;
        }

        try {
            const data = await signup(name, email, password, phone);
            toast.success(data.message || 'Signup successful (verification email sent)');
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error signing up');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPhoneVerified}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isPhoneVerified}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 font-bold text-sm">
                                +91
                            </span>
                            <input
                                type="tel"
                                className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:bg-gray-100 disabled:text-gray-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                placeholder="9876543210"
                                maxLength="10"
                                disabled={otpSent || isPhoneVerified}
                                required
                            />
                        </div>

                        {/* Phone action button */}
                        {!isPhoneVerified && !otpSent && (
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={isSendingOTP || phone.length !== 10}
                                className="mt-2 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
                            >
                                {isSendingOTP ? 'Sending OTP...' : 'Get OTP'}
                            </button>
                        )}
                    </div>

                    {/* OTP Section visually distinct */}
                    {otpSent && !isPhoneVerified && (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-3">
                            <div>
                                <label className="block text-sm font-semibold text-orange-900 mb-1">Enter 6-digit OTP</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-center tracking-[0.5em] font-bold text-lg"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    placeholder="------"
                                    maxLength="6"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={handleVerifyOTP}
                                    disabled={isVerifyingOTP || otp.length !== 6}
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 shadow text-sm"
                                >
                                    {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <div className="text-center text-xs mt-1">
                                    {resendTimer > 0 ? (
                                        <span className="text-gray-500">Resend OTP in <span className="font-bold text-orange-600">{resendTimer}s</span></span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            className="text-primary hover:text-orange-700 font-bold hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {isPhoneVerified && (
                        <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-center flex items-center justify-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">✓</div>
                            <span className="text-green-800 font-bold text-sm">Phone Number Verified!</span>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none disabled:bg-gray-100"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isPhoneVerified}
                            required
                            minLength="6"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!isPhoneVerified}
                        className="w-full bg-primary hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 mt-6 disabled:opacity-50 disabled:hover:bg-primary disabled:hover:shadow-none disabled:cursor-not-allowed"
                    >
                        Sign Up
                    </button>
                    <div id="recaptcha-container"></div>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                    Already have an account? <Link to="/login" className="text-primary hover:underline font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
