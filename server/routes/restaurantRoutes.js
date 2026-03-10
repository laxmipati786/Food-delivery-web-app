import express from 'express';
import { getRestaurants, getRestaurantById, addRestaurant } from '../controllers/restaurantController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getRestaurants)
    .post(protect, admin, addRestaurant);

router.route('/:id')
    .get(getRestaurantById);

export default router;
