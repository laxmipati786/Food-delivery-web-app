import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Search, MapPin, X, Target } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
    const { cartItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const { location, setLocation } = useContext(LocationContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const predefinedLocations = [
        'Connaught Place, New Delhi',
        'Saket, New Delhi',
        'Cyber Hub, Gurgaon',
        'Vasant Kunj, New Delhi',
        'Chandni Chowk, New Delhi',
        'Nehru Place, New Delhi',
        'Koramangala, Bangalore',
        'Bandra West, Mumbai',
        'Salt Lake, Kolkata',
    ];

    const filteredLocations = predefinedLocations.filter(loc =>
        loc.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleSelectLocation = (loc) => {
        setLocation(loc);
        setIsSidebarOpen(false);
        setSearchInput('');
    };

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocation('Locating...');
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                    headers: { 'User-Agent': 'FoodieApp/1.0' }
                });
                const data = await response.json();

                if (data && data.address) {
                    const place = data.address.suburb || data.address.neighborhood || data.address.city_district || data.address.city || data.address.town || data.address.village || 'Unknown Area';
                    const state = data.address.state || data.address.region || '';
                    setLocation(`${place}, ${state}`);
                } else {
                    setLocation('Current Location (Detected)');
                }
            } catch (error) {
                console.error('Error fetching location data', error);
                setLocation('Current Location (Detected)');
            } finally {
                setIsSidebarOpen(false);
                setSearchInput('');
            }
        }, () => {
            alert('Unable to retrieve your location. Please ensure location permissions are granted.');
            setLocation('Select location...');
        });
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-6">
                            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
                                <ShoppingBag className="w-8 h-8" />
                                <span>Foodie</span>
                            </Link>

                            {/* Location Selector Button */}
                            <div
                                className="hidden md:flex items-center text-sm font-medium hover:text-primary cursor-pointer transition-colors border-b-2 border-transparent hover:border-primary pb-1 group"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <span className="text-gray-900 border-b-2 border-primary mr-2 group-hover:text-primary transition-colors">Home</span>
                                <span className="text-gray-500 max-w-[200px] truncate group-hover:text-gray-900 transition-colors flex items-center gap-1">
                                    {location} <MapPin className="w-3 h-3" />
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 md:gap-8">
                            {/* Mobile Location Icon */}
                            <button
                                className="md:hidden flex items-center text-gray-700 hover:text-primary"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <MapPin className="w-5 h-5" />
                            </button>

                            <Link to="/" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium">
                                        <User className="w-5 h-5" />
                                        <span className="hidden sm:block truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                                    </Link>
                                    <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer hidden sm:block">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium">
                                    <User className="w-5 h-5" />
                                    <span className="hidden sm:block">Sign In</span>
                                </Link>
                            )}

                            <Link to="/checkout" className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium relative hover:scale-105">
                                <span className="relative">
                                    <ShoppingBag className="w-6 h-6" />
                                    {cartItemsCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                            {cartItemsCount}
                                        </span>
                                    )}
                                </span>
                                <span className="hidden sm:block">Cart</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Location Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 cursor-pointer"
                        />

                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-gray-900 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <h2 className="text-xl font-bold text-gray-900">Get your location</h2>
                                </div>
                            </div>

                            <div className="p-6 flex-grow overflow-y-auto">
                                <div className="relative mb-6">
                                    <input
                                        type="text"
                                        placeholder="Search for your city or area"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full pl-10 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>

                                <button
                                    onClick={handleGetCurrentLocation}
                                    className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors mb-6 group"
                                >
                                    <Target className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                    <div className="text-left">
                                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">Get current location</h3>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">Using GPS</p>
                                    </div>
                                </button>

                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Saved & Recent Locations</h3>
                                    <div className="space-y-1">
                                        {filteredLocations.length > 0 ? (
                                            filteredLocations.map((loc, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleSelectLocation(loc)}
                                                    className="w-full flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                >
                                                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{loc.split(',')[0]}</p>
                                                        <p className="text-sm text-gray-500">{loc}</p>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-center py-8">No locations found</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default Navbar;
