const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/orders
// @desc    Create new order
// @access  Private
router.post('/', auth, orderController.createOrder);

// @route   GET api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, orderController.getUserOrders);

// @route   GET api/orders/:orderId
// @desc    Get single order by ID
// @access  Private
router.get('/:orderId', auth, orderController.getOrderById);

// @route   PUT api/orders/:orderId/status
// @desc    Update order status (admin only)
// @access  Private
router.put('/:orderId/status', auth, orderController.updateOrderStatus);

// @route   PUT api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put('/:orderId/cancel', auth, orderController.cancelOrder);

module.exports = router;