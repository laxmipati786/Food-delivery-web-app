import { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${baseUrl}/api/restaurants`);
                setRestaurants(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const popularDishes = [
        { name: 'Pizza', image: '/images/margherita.jpg' },
        { name: 'Burgers', image: '/images/vegwhopper.jpg' },
        { name: 'Biryani', image: '/images/chickenbiryani.jpg' },
        { name: 'Chinese', image: '/images/hakka.jpg' },
        { name: 'Desserts', image: '/images/chocolava.jpg' },
        { name: 'North Indian', image: '/images/thali.jpg' },
        { name: 'Snacks', image: '/images/rajkachori.jpg' },
        { name: 'Chicken', image: '/images/hotcrispy.jpg' }
    ];

    const offerBanners = [
        { id: 1, code: 'WELCOME50', desc: '50% OFF Up to ₹100', color: 'from-orange-500 to-red-500', img: '🍔' },
        { id: 2, code: 'TRYNEW', desc: 'Flat ₹150 OFF', color: 'from-blue-500 to-cyan-500', img: '🍕' },
        { id: 3, code: 'PAYTM', desc: 'Cashback up to ₹100', color: 'from-purple-500 to-pink-500', img: '💰' },
        { id: 4, code: 'FREEDEL', desc: 'Free Delivery on ₹500+', color: 'from-green-500 to-teal-500', img: '🛵' },
    ];

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const topChains = restaurants.filter(r => r.rating >= 4.5).slice(0, 10);
    // If we have restaurants but none above 4.5, just take the first 5 so the section is visible
    if (topChains.length === 0 && restaurants.length > 0) {
        topChains.push(...[...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 5));
    }

    const skeletonCards = Array(8).fill(0);

    const handleSearchClick = () => {
        const resultsSection = document.getElementById('restaurant-list');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden py-16"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop')] bg-cover bg-center opacity-30 z-0 mix-blend-overlay border-b-4 border-primary"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

                <div className="z-10 text-center text-white px-4 max-w-4xl w-full">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-black mb-6 drop-shadow-2xl font-serif"
                    >
                        Food you love, <br />
                        <span className="text-primary italic tracking-tight">delivered fresh.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-2xl p-2 flex shadow-2xl items-center focus-within:ring-4 ring-primary/30 transform transition-all"
                    >
                        <input
                            type="text"
                            placeholder="Search for restaurant, cuisine or a dish..."
                            className="w-full px-6 py-4 text-lg rounded-xl focus:outline-none text-gray-800 font-medium placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="bg-primary hover:bg-orange-600 transition-all text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/30"
                        >
                            Search
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Best Offers Section */}
                <div className="mb-14">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                        <span>Best Offers for You</span>
                        <span className="inline-block px-2 py-1 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-900 text-[10px] rounded text-white uppercase tracking-wider font-extrabold shadow-sm">New Deals</span>
                    </h2>
                    <div className="flex gap-6 overflow-x-auto pb-6 snap-x -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
                        {offerBanners.map((offer) => (
                            <motion.div
                                key={offer.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className={`min-w-[280px] md:min-w-[320px] h-40 rounded-[28px] bg-gradient-to-br ${offer.color} p-6 text-white font-bold relative overflow-hidden shadow-xl shadow-gray-200 cursor-pointer snap-center group`}
                            >
                                <div className="absolute -right-4 -bottom-4 text-[100px] leading-none opacity-40 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
                                    {offer.img}
                                </div>
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <span className="bg-white/25 backdrop-blur-md self-start px-3 py-1 rounded-xl text-xs border border-white/50 uppercase tracking-widest font-black shadow-sm">{offer.code}</span>
                                    <div className="mt-4">
                                        <div className="text-2xl leading-tight w-4/5 text-shadow-sm font-black">{offer.desc}</div>
                                        <div className="text-xs text-white/80 font-semibold mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                                            Explore Now <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Popular Dishes Section */}
                <div className="mb-14 border-t-2 border-dashed border-gray-200 pt-10">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
                        What's on your mind?
                    </h2>
                    <div className="flex gap-6 overflow-x-auto pb-6 snap-x -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
                        {popularDishes.map((dish, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex flex-col items-center gap-4 cursor-pointer snap-center min-w-[100px] md:min-w-[130px] group"
                                onClick={() => {
                                    setSearchTerm(dish.name);
                                    handleSearchClick();
                                }}
                            >
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md group-hover:shadow-2xl border-4 border-transparent group-hover:border-primary transition-all duration-300 relative bg-gray-100">
                                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <span className="font-extrabold text-gray-700 md:text-lg text-center group-hover:text-primary transition-colors">{dish.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Top Restaurant Chains in Delhi (Horizontal Scroll) */}
                {!loading && topChains.length > 0 && (
                    <div className="mb-14 border-t-2 border-dashed border-gray-200 pt-10">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                            Top restaurant chains in your city
                        </h2>
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: 'none' }}>
                            {topChains.map((restaurant) => (
                                <div key={restaurant._id} className="min-w-[280px] sm:min-w-[320px] snap-center">
                                    <RestaurantCard restaurant={restaurant} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div id="restaurant-list" className="border-t-2 border-dashed border-gray-200 pt-10 mb-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">
                        Restaurants with online food delivery
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            skeletonCards.map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-3xl p-4 h-80 shadow-sm border border-gray-100">
                                    <div className="bg-gray-200 h-40 rounded-2xl mb-4"></div>
                                    <div className="bg-gray-200 h-6 w-3/4 rounded-md mb-3"></div>
                                    <div className="bg-gray-200 h-4 w-1/2 rounded-md mb-2"></div>
                                    <div className="bg-gray-200 h-4 w-full rounded-md mt-4"></div>
                                </div>
                            ))
                        ) : (
                            <AnimatePresence>
                                {filteredRestaurants.length > 0 ? (
                                    filteredRestaurants.map(r => (
                                        <RestaurantCard key={r._id} restaurant={r} />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm border border-gray-100"
                                    >
                                        <div className="text-6xl mb-6">🍽️</div>
                                        <h3 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">No matches found</h3>
                                        <p className="text-gray-500 text-lg w-3/4 mx-auto">We couldn't find anything for "{searchTerm}". Try searching for something else like "Pizza" or "Biryani".</p>
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="mt-8 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30"
                                        >
                                            Clear Search
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
