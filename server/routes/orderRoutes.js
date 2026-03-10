import express from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, getUserOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, updateOrderStatus); // update by admin/delivery

export default router;
