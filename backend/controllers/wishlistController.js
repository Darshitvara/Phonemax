const WishlistItem = require('../models/WishlistItem');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlistItems = await WishlistItem.find({ userId: req.user.id }).populate('product');
    
    const wishlist = {
      items: wishlistItems.map(item => item.product),
      itemCount: wishlistItems.length
    };
    
    res.json(wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const existingItem = await WishlistItem.findOne({
      userId: req.user.id,
      product: productId
    });
    
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    const wishlistItem = new WishlistItem({
      userId: req.user.id,
      product: productId
    });
    
    await wishlistItem.save();
    await wishlistItem.populate('product');
    
    res.json(wishlistItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await WishlistItem.findOne({
      userId: req.user.id,
      product: req.params.productId
    });
    
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    
    await WishlistItem.findByIdAndDelete(wishlistItem._id);
    
    res.json({ message: 'Item removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    await WishlistItem.deleteMany({ userId: req.user.id });
    res.json({ message: 'Wishlist cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Check if product is in wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const wishlistItem = await WishlistItem.findOne({
      userId: req.user.id,
      product: req.params.productId
    });
    
    res.json({ isInWishlist: !!wishlistItem });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};