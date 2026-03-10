import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';

const STATUS_STAGES = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
];

const getStatusBadge = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'preparing': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'out_for_delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
        case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const OrderProgressBar = ({ currentStatus }) => {
    const currentIndex = STATUS_STAGES.findIndex(s => s.key === currentStatus);

    return (
        <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Live Order Tracking</h4>
            <div className="flex items-center justify-between relative px-4 sm:px-12">
                {/* Background Line */}
                <div className="absolute left-[8%] right-[8%] sm:left-[12%] sm:right-[12%] top-3 -translate-y-1/2 h-1 bg-gray-200 rounded-full"></div>

                {/* Active Line Progress */}
                <div
                    className="absolute left-[8%] sm:left-[12%] top-3 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${(currentIndex / (STATUS_STAGES.length - 1)) * 100}%`, maxWidth: 'calc(100% - 16% - 8%)' }}
                ></div>

                {STATUS_STAGES.map((stage, idx) => {
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                        <div key={stage.key} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center transition-colors duration-500 ${isCompleted ? 'bg-primary border-orange-200' : 'bg-white border-gray-300'} ${isCurrent ? 'ring-4 ring-orange-100 scale-125' : ''}`}>
                                {isCompleted && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className={`text-[10px] sm:text-xs font-bold absolute -bottom-7 whitespace-nowrap transition-colors duration-500 ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                {stage.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="h-4"></div> {/* Bottom margin space for labels */}
        </div>
    );
};

function Dashboard() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${baseUrl}/api/orders`, config);
                setOrders(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Polling to update order status simulation every 15 seconds
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, [user, navigate]);

    if (loading) return <div className="min-h-screen pt-24 text-center text-xl text-primary font-black loading-pulse">Fetching your details...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Hello, {user?.name}!</h1>
                    <p className="text-gray-500 font-medium break-all">{user?.email}</p>
                    {user?.phone && <p className="text-gray-500 font-bold mt-1">📞 +91 {user?.phone}</p>}
                </div>
                <div className="bg-orange-50 text-primary px-6 py-3 rounded-2xl font-bold border border-orange-100">
                    {user?.role.toUpperCase()}
                </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-7 h-7 text-primary" /> Your Recent Orders
            </h2>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-lg mb-4 font-medium">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => {
                        const currentStatusLabel = STATUS_STAGES.find(s => s.key === order.status)?.label || order.status;

                        return (
                            <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="border-b border-gray-100 bg-gray-50/50 p-6 flex flex-wrap justify-between items-center gap-4 rounded-t-3xl">
                                    <div>
                                        <p className="text-gray-900 font-black text-xl mb-1">{order.restaurant.name}</p>
                                        <p className="text-gray-500 text-sm flex items-center gap-1 font-bold"><Clock className="w-4 h-4 text-primary" /> {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm uppercase tracking-wide border ${getStatusBadge(order.status)}`}>
                                            {currentStatusLabel}
                                        </span>
                                        <span className="font-black text-2xl text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                                            <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Order Items</h4>
                                            <ul className="space-y-3">
                                                {order.orderItems.map((item, idx) => (
                                                    <li key={idx} className="flex justify-between items-center text-gray-800 font-bold border-b border-gray-200 border-dashed pb-3 last:border-0 last:pb-0">
                                                        <span className="flex items-center gap-3">
                                                            <span className="bg-white border border-gray-200 text-gray-900 px-2 py-0.5 rounded text-xs">x{item.qty}</span>
                                                            {item.name}
                                                        </span>
                                                        <span>₹{item.price * item.qty}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2"><MapPin className="w-4 h-4 text-primary" /> Delivery Details</h4>
                                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <p className="text-gray-900 font-bold">{order.shippingAddress.fullName || user?.name}</p>
                                                    <p className="text-gray-600 font-medium text-sm mt-1">{order.shippingAddress.address}, {order.shippingAddress.city} - {order.shippingAddress.postalCode}</p>
                                                    {order.shippingAddress.deliveryInstructions && (
                                                        <p className="text-primary text-xs font-bold mt-2 bg-orange-50 p-2 rounded-lg break-words">Instructions: {order.shippingAddress.deliveryInstructions}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2"><CreditCard className="w-4 h-4 text-primary" /> Payment Method</h4>
                                                <p className="text-gray-900 font-bold text-sm bg-gray-50 p-4 rounded-2xl border border-gray-100">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <OrderProgressBar currentStatus={order.status} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
