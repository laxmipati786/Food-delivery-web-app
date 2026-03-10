import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery');

const restaurants = [
    {
        name: 'Pizza Hut',
        image: '/images/pizzahut.jpg',
        rating: 4.2,
        deliveryTime: '30-40 min',
        priceRange: '₹300 for two',
        tags: ['Pizzas', 'Italian', 'Fast Food'],
        address: 'Connaught Place, New Delhi',
        menu: [
            { name: 'Margherita Pizza', price: 299, description: 'Classic cheese pizza with a classic tomato sauce base', image: '/images/margherita.jpg', category: 'Main Course', isVeg: true },
            { name: 'Pepperoni Pizza', price: 499, description: 'Spicy pepperoni topping with mozzarella cheese', image: '/images/pepperoni.jpg', category: 'Main Course', isVeg: false },
            { name: 'Garlic Breadsticks', price: 149, description: 'Freshly baked garlic breadsticks with cheese dip', image: '/images/garlicbread.jpg', category: 'Starters', isVeg: true },
            { name: 'Choco Lava Cake', price: 99, description: 'Warm chocolate cake with a gooey center', image: '/images/chocolava.jpg', category: 'Desserts', isVeg: true }
        ]
    },
    {
        name: 'Burger King',
        image: '/images/burgerking.jpg',
        rating: 4.5,
        deliveryTime: '20-30 min',
        priceRange: '₹250 for two',
        tags: ['Burgers', 'American', 'Beverages'],
        address: 'Saket, New Delhi',
        menu: [
            { name: 'Veg Whopper', price: 149, description: 'Our signature Whopper with a flame-grilled veg patty', image: '/images/vegwhopper.jpg', category: 'Main Course', isVeg: true },
            { name: 'Chicken Whopper', price: 199, description: 'Our signature Whopper with a flame-grilled chicken patty', image: '/images/chickenwhopper.jpg', category: 'Main Course', isVeg: false },
            { name: 'French Fries', price: 99, description: 'Crispy golden french fries salted to perfection', image: '/images/fries.jpg', category: 'Starters', isVeg: true },
            { name: 'Cold Coffee', price: 129, description: 'Chilled coffee blended with ice cream', image: '/images/coffee.jpg', category: 'Drinks', isVeg: true }
        ]
    },
    {
        name: 'Biryani Blues',
        image: '/images/biryaniblues.jpg',
        rating: 4.6,
        deliveryTime: '40-50 min',
        priceRange: '₹500 for two',
        tags: ['Biryani', 'Mughlai', 'North Indian'],
        address: 'Cyber Hub, Gurgaon',
        menu: [
            { name: 'Chicken Dum Biryani', price: 349, description: 'Classic dum biryani cooked with slow fire and aromatic spices', image: '/images/chickenbiryani.jpg', category: 'Main Course', isVeg: false },
            { name: 'Paneer Biryani', price: 299, description: 'Classic dum biryani loaded with fresh cottage cheese', image: '/images/paneerbiryani.jpg', category: 'Main Course', isVeg: true },
            { name: 'Chicken Tikka', price: 249, description: 'Boneless chicken chunks marinated in spices and grilled', image: '/images/chickentikka.jpg', category: 'Starters', isVeg: false },
            { name: 'Gulab Jamun', price: 89, description: 'Soft and spongy milk solids dipped in sugar syrup', image: '/images/gulabjamun.jpg', category: 'Desserts', isVeg: true }
        ]
    },
    {
        name: 'KFC',
        image: '/images/kfc.jpg',
        rating: 4.3,
        deliveryTime: '25-35 min',
        priceRange: '₹400 for two',
        tags: ['American', 'Fast Food', 'Chicken'],
        address: 'Vasant Kunj, New Delhi',
        menu: [
            { name: 'Hot & Crispy Chicken', price: 399, description: 'Signature crispy chicken marinated with spicy powder', image: '/images/hotcrispy.jpg', category: 'Main Course', isVeg: false },
            { name: 'Zinger Burger', price: 179, description: 'Premium chicken breast burger with mayo and lettuce', image: '/images/zinger.jpg', category: 'Main Course', isVeg: false },
            { name: 'Popcorn Chicken', price: 149, description: 'Bite-sized crispy chicken pieces', image: '/images/popcorn.jpg', category: 'Starters', isVeg: false },
            { name: 'Pepsi', price: 60, description: 'Chilled bottled beverage', image: '/images/pepsi.jpg', category: 'Drinks', isVeg: true }
        ]
    },
    {
        name: 'Haldiram\'s',
        image: '/images/haldirams.jpg',
        rating: 4.7,
        deliveryTime: '30-45 min',
        priceRange: '₹350 for two',
        tags: ['North Indian', 'Sweets', 'Snacks'],
        address: 'Chandni Chowk, New Delhi',
        menu: [
            { name: 'Chole Bhature', price: 180, description: 'Spicy chickpea curry served with 2 fluffy bhaturas', image: '/images/chole.jpg', category: 'Main Course', isVeg: true },
            { name: 'Raj Kachori', price: 120, description: 'Crispy kachori stuffed with moong dal, yogurt and chutneys', image: '/images/rajkachori.jpg', category: 'Starters', isVeg: true },
            { name: 'Deluxe Thali', price: 320, description: 'A complete meal with dal, paneer, mixed veg, rice, rotis and sweet', image: '/images/thali.jpg', category: 'Main Course', isVeg: true },
            { name: 'Rasmalai', price: 110, description: 'Cottage cheese dumplings soaked in sweetened, thickened milk', image: '/images/rasmalai.jpg', category: 'Desserts', isVeg: true }
        ]
    },
    {
        name: 'Mainland China',
        image: '/images/mainland.jpg',
        rating: 4.4,
        deliveryTime: '45-55 min',
        priceRange: '₹1200 for two',
        tags: ['Chinese', 'Asian', 'Oriental'],
        address: 'Nehru Place, New Delhi',
        menu: [
            { name: 'Hakka Noodles', price: 280, description: 'Stir-fried noodles with assorted vegetables', image: '/images/hakka.jpg', category: 'Main Course', isVeg: true },
            { name: 'Kung Pao Chicken', price: 420, description: 'Spicy chicken stir-fry with peanuts, vegetables, and chili peppers', image: '/images/kungpao.jpg', category: 'Main Course', isVeg: false },
            { name: 'Veg Spring Rolls', price: 210, description: 'Crispy rolls filled with julienned vegetables', image: '/images/springroll.jpg', category: 'Starters', isVeg: true },
            { name: 'Manchow Soup', price: 180, description: 'Dark brown soup prepared with various vegetables and thickened with broth', image: '/images/manchow.jpg', category: 'Starters', isVeg: true }
        ]
    }
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Restaurant.deleteMany();

        await Restaurant.insertMany(restaurants);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
