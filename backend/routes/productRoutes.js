const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   GET api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, productController.addReview);

module.exports = router;