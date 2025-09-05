const Product = require('../models/Product');

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      search,
      minPrice,
      maxPrice,
      sortBy = 'name',
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (subcategory && subcategory !== 'all') {
      filter.subcategory = subcategory;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    // Only show products that are in stock
    filter.stock = { $gt: 0 };

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'rating':
        sort = { rating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'name':
      default:
        sort = { name: 1 };
    }

    const skip = (page - 1) * limit;
    
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    const total = await Product.countDocuments(filter);
    
    // Transform products to include id field for frontend compatibility
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      const transformed = {
        ...productObj,
        id: product._id.toString()
      };
      // Remove _id field to avoid confusion
      delete transformed._id;
      return transformed;
    });
    
    res.json({
      products: transformedProducts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Transform product to include id field and remove _id
    const productObj = product.toObject();
    const transformedProduct = {
      ...productObj,
      id: product._id.toString()
    };
    
    // Remove _id field to avoid confusion
    delete transformedProduct._id;
    
    res.json(transformedProduct);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server error');
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      stock: { $gt: 0 } // Only show featured products that are in stock
    }).limit(8);
    
    // Transform products to include id field
    const transformedProducts = products.map(product => ({
      ...product.toObject(),
      id: product._id.toString()
    }));
    
    res.json(transformedProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Create a new product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      price,
      originalPrice,
      description,
      images,
      specifications,
      category,
      subcategory,
      stock,
      featured
    } = req.body;

    // Validation
    if (!name || !brand || !price || !description || !images || !category || !subcategory || stock === undefined) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, brand, price, description, images, category, subcategory, stock' 
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    const product = new Product({
      name,
      brand,
      price,
      originalPrice,
      description,
      images,
      specifications,
      category,
      subcategory,
      stock,
      featured: featured || false
    });

    const savedProduct = await product.save();
    
    // Transform product to include id field
    const transformedProduct = {
      ...savedProduct.toObject(),
      id: savedProduct._id.toString()
    };
    
    res.status(201).json({
      message: 'Product created successfully',
      product: transformedProduct
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error while creating product' });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    console.log('Update product request:', {
      id: req.params.id,
      body: req.body,
      user: req.user?.email,
      userRole: req.user?.role
    });

    const {
      name,
      brand,
      price,
      originalPrice,
      description,
      images,
      specifications,
      category,
      subcategory,
      stock,
      featured
    } = req.body;

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Found product:', product.name);

    // Update fields
    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (description) product.description = description;
    if (images) product.images = images;
    if (specifications) product.specifications = specifications;
    if (category) product.category = category;
    if (subcategory) product.subcategory = subcategory;
    if (stock !== undefined) product.stock = stock;
    if (featured !== undefined) product.featured = featured;

    const updatedProduct = await product.save();
    console.log('Product updated successfully:', updatedProduct.name);
    
    // Transform product to include id field
    const transformedProduct = {
      ...updatedProduct.toObject(),
      id: updatedProduct._id.toString()
    };
    
    res.json({
      message: 'Product updated successfully',
      product: transformedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while updating product' });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    console.log('Attempting to delete product with ID:', req.params.id);
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      console.log('Product not found in database');
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log('Product found, deleting:', product.name);
    await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted successfully');
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while deleting product' });
  }
};

// @desc    Update product stock (Admin only)
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Valid stock quantity is required' });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock = stock;
    await product.save();

    res.json({
      message: 'Stock updated successfully',
      product: {
        _id: product._id,
        id: product._id.toString(),
        name: product.name,
        stock: product.stock
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error while updating stock' });
  }
};

// Add product review
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.userId.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const newReview = {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment
    };
    
    product.reviews.push(newReview);
    
    // Update product rating
    const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};