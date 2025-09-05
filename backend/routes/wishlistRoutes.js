const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, wishlistController.getWishlist);

// @route   POST api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/', auth, wishlistController.addToWishlist);

// @route   DELETE api/wishlist/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/:productId', auth, wishlistController.removeFromWishlist);

// @route   DELETE api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete('/', auth, wishlistController.clearWishlist);

// @route   GET api/wishlist/:productId/check
// @desc    Check if product is in wishlist
// @access  Private
router.get('/:productId/check', auth, wishlistController.isInWishlist);

module.exports = router;