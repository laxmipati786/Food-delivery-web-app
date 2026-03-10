import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Logged in successfully');
            navigate('/');
        } catch (error) {
            if (error.response?.data?.requiresVerification) {
                toast.error(error.response.data.message);
                navigate(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                toast.error(error.response?.data?.message || 'Invalid credentials');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 -mt-20">
            <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <Link to="/forgot-password" className="text-xs text-primary font-bold hover:underline">Forgot Password?</Link>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md mt-4">
                        Login
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline font-bold">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
