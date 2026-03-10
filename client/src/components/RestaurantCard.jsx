import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

function RestaurantCard({ restaurant }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Link to={`/restaurant/${restaurant._id}`} className="block w-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group relative">
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        {restaurant.rating > 4.4 && (
                            <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-md shadow flex items-center gap-1">
                                TOP RATED
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 font-extrabold text-white text-xl uppercase drop-shadow-lg tracking-wider bg-black/40 px-2 py-1 rounded">
                            {restaurant.priceRange && `${restaurant.priceRange} FOR TWO`}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-5 relative bg-white">
                        <h3 className="text-xl font-bold text-gray-900 truncate mb-1">{restaurant.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                                <Star className="w-3 h-3 fill-white" />
                                {restaurant.rating}
                            </span>
                            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">• {restaurant.deliveryTime}</span>
                        </div>
                        <p className="text-gray-500 text-sm truncate">{restaurant.tags.join(', ')}</p>
                        <p className="text-gray-500 text-sm truncate">{restaurant.address}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default RestaurantCard;
