import Order from '../models/Order.js';

// Helper to simulate order status changes based on time elapsed
const updateOrderStatusSimulation = async (orders) => {
    const isArray = Array.isArray(orders);
    const ordersList = isArray ? orders : [orders];

    for (let order of ordersList) {
        if (!order.createdAt) continue; // Safety check
        const diffMins = Math.floor((new Date() - new Date(order.createdAt)) / 60000);
        let newStatus = order.status;

        // Prevent regressing statuses if manually updated, but let time push it forward
        const statusFlow = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        const currentIndex = statusFlow.indexOf(order.status);

        let targetIndex = 0; // pending
        if (diffMins >= 10) targetIndex = 4; // delivered
        else if (diffMins >= 6) targetIndex = 3; // out_for_delivery
        else if (diffMins >= 3) targetIndex = 2; // preparing
        else if (diffMins >= 1) targetIndex = 1; // confirmed

        if (targetIndex > currentIndex) {
            newStatus = statusFlow[targetIndex];
            order.status = newStatus;
            await Order.updateOne({ _id: order._id }, { $set: { status: newStatus } });
        }
    }
    return isArray ? ordersList : ordersList[0];
};

export const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            deliveryCharge,
            totalPrice,
            restaurant
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            restaurant,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            deliveryCharge,
            totalPrice,
            status: 'pending'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        let orders = await Order.find({ user: req.user._id }).populate('restaurant', 'name').sort({ createdAt: -1 });
        orders = await updateOrderStatusSimulation(orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id).populate('user', 'name email').populate('restaurant', 'name address');
        if (order) {
            order = await updateOrderStatusSimulation(order);
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            if (req.body.deliveryAgent) {
                order.deliveryAgent = req.body.deliveryAgent;
            }
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
