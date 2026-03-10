import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

function Checkout() {
    const { cartItems, restaurantId, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [deliveryInstructions, setDeliveryInstructions] = useState('');

    // PIN Code State
    const [localities, setLocalities] = useState([]);
    const [isCheckingPin, setIsCheckingPin] = useState(false);
    const [pinError, setPinError] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill user's name if available
    useEffect(() => {
        if (user && user.name && !fullName) {
            setFullName(user.name);
        }
    }, [user, fullName]);

    const handlePinChange = async (e) => {
        const pin = e.target.value.replace(/\D/g, '');
        setPostalCode(pin);

        if (pin.length === 6) {
            setIsCheckingPin(true);
            setPinError('');
            try {
                const res = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
                if (res.data && res.data[0].Status === 'Success') {
                    const postOffices = res.data[0].PostOffice;
                    // Auto-fill City/District
                    const fetchedCity = postOffices[0].District || postOffices[0].Region;
                    setCity(fetchedCity);

                    // Get all localities
                    const areas = postOffices.map(po => po.Name);
                    setLocalities(areas);

                    toast.success(`PIN verified: ${fetchedCity}`, { icon: '📍', duration: 2000 });
                } else {
                    setPinError('Invalid Postal Code');
                    setCity('');
                    setLocalities([]);
                }
            } catch (error) {
                setPinError('Error Fetching Postal Data');
                setCity('');
                setLocalities([]);
            } finally {
                setIsCheckingPin(false);
            }
        } else {
            setLocalities([]);
            setPinError('');
        }
    };

    const tax = cartTotal * 0.05;
    const deliveryFee = 40;
    const finalTotal = cartTotal > 0 ? cartTotal + tax + deliveryFee : 0;

    const placeOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }
        if (!fullName || !address || !city || !postalCode) {
            toast.error('Please fill in all mandatory address details');
            return;
        }

        if (pinError) {
            toast.error('Please enter a valid postal code');
            return;
        }

        try {
            setLoading(true);

            // Address validation using OpenStreetMap Nominatim API 
            toast.loading('Verifying your address...', { id: 'addressCheck' });
            try {
                const query = encodeURIComponent(`${address}, ${city}, ${postalCode}, India`);
                const geoQuery = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
                const geoRes = await axios.get(geoQuery, {
                    headers: { 'User-Agent': 'FoodieApp/1.0' }
                });

                if (!geoRes.data || geoRes.data.length === 0) {
                    // Just show a warning, don't block order placement for minor spelling/village names
                    toast('Location approximate. Using provided PIN Code.', { id: 'addressCheck', icon: '⚠️', duration: 4000 });
                } else {
                    toast.success('Address verified!', { id: 'addressCheck' });
                }
            } catch (err) {
                // If the geolocation API fails (e.g., rate limited), we just allow it to bypass or warn
                toast.dismiss('addressCheck');
            }

            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };

            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id
                })),
                shippingAddress: { address, city, postalCode, fullName, deliveryInstructions },
                paymentMethod: 'Cash on Delivery',
                itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
                taxPrice: tax,
                deliveryCharge: deliveryFee,
                totalPrice: finalTotal,
                restaurant: restaurantId
            };

            await axios.post('http://localhost:5000/api/orders', orderData, config);
            clearCart();
            toast.success('Order Placed Successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Error placing order');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md text-center">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="bg-primary text-white px-8 py-3 rounded-md font-bold hover:bg-orange-600 transition-colors shadow-lg">
                    Browse Restaurants
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col - Address */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                    >
                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">📍</span>
                            Delivery Address
                        </h2>

                        <form className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none bg-gray-50 focus:bg-white"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none bg-gray-50 focus:bg-white"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="House No, Building, Street Area"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Postal Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-shadow outline-none bg-gray-50 focus:bg-white ${pinError ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:ring-primary'}`}
                                            value={postalCode}
                                            onChange={handlePinChange}
                                            placeholder="e.g. 110001"
                                            maxLength="6"
                                            required
                                        />
                                        {isCheckingPin && (
                                            <div className="absolute right-3 top-3.5 flex items-center gap-2 text-xs text-gray-400 font-bold">
                                                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                            </div>
                                        )}
                                        {pinError && <p className="text-red-500 text-xs mt-1.5 font-bold absolute -bottom-5 left-1">{pinError}</p>}
                                    </div>
                                </div>
                                <div className={`${pinError ? 'mt-4 sm:mt-0' : ''}`}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none disabled:bg-gray-100 disabled:text-gray-600 disabled:font-medium"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Auto-filled from PIN"
                                        disabled={!!localities.length} // Disable manual entry if auto-filled
                                        required
                                    />
                                </div>
                            </div>

                            {/* Dropdown for localities populated from PIN API */}
                            <AnimatePresence>
                                {localities.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <label className="block text-sm font-semibold text-primary mb-1 mt-1">Suggested Area / Locality</label>
                                        <select
                                            className="w-full px-4 py-3 border-2 border-primary/30 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none bg-orange-50/30 text-gray-800 font-medium cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.value && !address.includes(e.target.value)) {
                                                    setAddress(prev => prev ? `${prev}, ${e.target.value}` : e.target.value);
                                                    toast.success(`Added ${e.target.value} to address`);
                                                }
                                            }}
                                        >
                                            <option value="">Select your area to append to street address...</option>
                                            {localities.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Instructions (Optional)</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow outline-none resize-none bg-gray-50 focus:bg-white"
                                    placeholder="Add instructions for delivery partner (e.g., Ring the bell, call on arrival, leave at gate)."
                                    value={deliveryInstructions}
                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Right Col - Order Summary */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24"
                    >
                        <h2 className="text-xl font-black text-gray-900 mb-6 border-b-2 border-dashed pb-4 block">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-start text-sm group">
                                    <div className="flex items-start gap-3 flex-grow pr-4">
                                        <div className={`mt-0.5 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-800 line-clamp-2">{item.name}</span>
                                            <div className="text-xs text-gray-500 font-bold mt-1 bg-gray-100 px-2 py-0.5 rounded-md inline-block">QTY: {item.qty}</div>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-800 whitespace-nowrap mt-0.5">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-dashed border-gray-200 pt-5 space-y-3 mb-6 bg-gray-50/50 -mx-8 px-8 pb-4">
                            <div className="flex justify-between text-sm text-gray-600 font-bold">
                                <span>Item Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 font-bold">
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 font-bold">
                                <span>Taxes (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-black text-xl text-gray-900 border-t pt-4 mt-2">
                                <span>To Pay</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={placeOrder}
                            disabled={loading || !!pinError || !postalCode || postalCode.length !== 6}
                            className={`w-full bg-primary hover:bg-orange-600 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-orange-500/30 transition-all ${loading || !!pinError || !postalCode || postalCode.length !== 6 ? 'opacity-50 cursor-not-allowed grayscale-[30%]' : 'hover:-translate-y-1'}`}
                        >
                            {loading ? 'Processing...' : `Place Order • ₹${finalTotal.toFixed(2)}`}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
