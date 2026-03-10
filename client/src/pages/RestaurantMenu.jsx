import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function RestaurantMenu() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${baseUrl}/api/restaurants/${id}`);
                setRestaurant(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-24 text-center text-xl text-gray-600 font-bold loading-pulse">Loading menu...</div>;
    if (!restaurant) return <div className="min-h-screen pt-24 text-center font-bold text-red-500">Restaurant not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 overflow-hidden relative"
            >
                <div className="flex-1 z-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{restaurant.name}</h1>
                    <p className="text-gray-500 text-sm mb-1">{restaurant.tags.join(', ')}</p>
                    <p className="text-gray-500 text-sm mb-4">{restaurant.address} • {restaurant.deliveryTime}</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded-md text-sm font-bold shadow-sm">
                            <Star className="w-4 h-4 fill-white" />
                            {restaurant.rating}
                        </div>
                        <div className="text-sm font-bold text-gray-600 px-3 py-1 bg-gray-100 rounded-md">
                            Delivery: {restaurant.priceRange}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="mb-6 border-b-2 border-gray-200 pb-2 flex justify-between items-center text-gray-800">
                <h2 className="text-2xl font-bold">Recommended</h2>
            </div>

            <div className="space-y-8">
                <AnimatePresence>
                    {restaurant.menu.map((item, index) => {
                        const cartItem = cartItems.find((x) => x._id === item._id);
                        return (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex justify-between items-start pb-8 border-b border-gray-200 group"
                            >
                                <div className="flex-1 pr-6">
                                    <div className={`w-4 h-4 rounded-sm border mb-2 flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-gray-900 font-semibold mb-3">₹{item.price}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                                </div>

                                <div className="relative w-32 md:w-40 flex-shrink-0">
                                    <div className="w-full h-32 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                    </div>

                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-lg rounded-xl overflow-hidden bg-white min-w-[100px] border border-gray-200">
                                        {cartItem ? (
                                            <div className="flex justify-between items-center text-green-700 font-bold px-2 py-2">
                                                <button onClick={() => updateQuantity(item._id, 'decrease')} className="text-gray-600 hover:bg-gray-100 p-1 rounded transition-colors"><Minus className="w-4 h-4" /></button>
                                                <span className="w-6 text-center">{cartItem.qty}</span>
                                                <button onClick={() => updateQuantity(item._id, 'increase')} className="text-green-600 hover:bg-gray-100 p-1 rounded transition-colors"><Plus className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    addToCart(item, restaurant._id);
                                                    toast.success('Added to Cart!');
                                                }}
                                                className="w-full py-2 px-6 font-extrabold text-green-600 hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                ADD
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default RestaurantMenu;
