import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [restaurantId, setRestaurantId] = useState(() => {
        return localStorage.getItem('restaurantId') || null;
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        if (restaurantId) {
            localStorage.setItem('restaurantId', restaurantId);
        } else {
            localStorage.removeItem('restaurantId');
        }
    }, [cartItems, restaurantId]);

    const addToCart = (item, resId) => {
        if (restaurantId && restaurantId !== resId) {
            if (window.confirm("Your cart contains items from another restaurant. Do you want to clear the cart and add this item?")) {
                setCartItems([{ ...item, qty: 1 }]);
                setRestaurantId(resId);
            }
            return;
        }

        const existItem = cartItems.find((x) => x._id === item._id);
        if (existItem) {
            setCartItems(cartItems.map((x) => x._id === existItem._id ? { ...existItem, qty: existItem.qty + 1 } : x));
        } else {
            setCartItems([...cartItems, { ...item, qty: 1 }]);
            setRestaurantId(resId);
        }
    };

    const removeFromCart = (id) => {
        const updatedCart = cartItems.filter(x => x._id !== id);
        setCartItems(updatedCart);
        if (updatedCart.length === 0) setRestaurantId(null);
    };

    const updateQuantity = (id, check) => {
        const existItem = cartItems.find((x) => x._id === id);
        if (existItem) {
            if (check === 'increase') {
                setCartItems(cartItems.map((x) => x._id === id ? { ...x, qty: x.qty + 1 } : x));
            } else {
                if (existItem.qty === 1) {
                    removeFromCart(id);
                } else {
                    setCartItems(cartItems.map((x) => x._id === id ? { ...x, qty: x.qty - 1 } : x));
                }
            }
        }
    }

    const clearCart = () => {
        setCartItems([]);
        setRestaurantId(null);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, restaurantId, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
};
