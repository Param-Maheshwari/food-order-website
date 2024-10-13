const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');

const router = express.Router();

// Define routes
router.get('/', getOrders); // GET all food items
router.post('/', createOrder); // Create new order

module.exports = router;
