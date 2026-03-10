import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    isVeg: { type: Boolean, default: true }
});

const restaurantSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    deliveryTime: { type: String },
    priceRange: { type: String },
    tags: [String],
    address: { type: String },
    menu: [menuItemSchema]
}, {
    timestamps: true,
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
