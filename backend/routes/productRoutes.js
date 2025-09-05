const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @route   GET api/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

// @route   POST api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', auth, admin, productController.createProduct);

// @route   GET api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   PUT api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', auth, admin, productController.updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', auth, admin, productController.deleteProduct);

// @route   PATCH api/products/:id/stock
// @desc    Update product stock (Admin only)
// @access  Private/Admin
router.patch('/:id/stock', auth, admin, productController.updateStock);

// @route   POST api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, productController.addReview);

module.exports = router;