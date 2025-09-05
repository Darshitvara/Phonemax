const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, cartController.getCart);

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, cartController.addToCart);

// @route   PUT api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put('/:productId', auth, cartController.updateCartItem);

// @route   DELETE api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/:productId', auth, cartController.removeFromCart);

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, cartController.clearCart);

module.exports = router;