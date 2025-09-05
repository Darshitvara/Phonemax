const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id }).populate('product');
    
    const cart = {
      items: cartItems,
      total: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
    
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity = 1, selectedColor, selectedStorage } = req.body;
  
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    let cartItem = await CartItem.findOne({ 
      userId: req.user.id, 
      product: productId,
      selectedColor: selectedColor || null,
      selectedStorage: selectedStorage || null
    });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    } else {
      cartItem = new CartItem({
        userId: req.user.id,
        product: productId,
        quantity,
        selectedColor,
        selectedStorage
      });
    }
    
    await cartItem.save();
    await cartItem.populate('product');
    
    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  
  try {
    const cartItem = await CartItem.findOne({
      userId: req.user.id,
      product: req.params.productId
    }).populate('product');
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    if (quantity <= 0) {
      await CartItem.findByIdAndDelete(cartItem._id);
      return res.json({ message: 'Item removed from cart' });
    }
    
    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    
    cartItem.quantity = quantity;
    await cartItem.save();
    
    res.json(cartItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
      userId: req.user.id,
      product: req.params.productId
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    await CartItem.findByIdAndDelete(cartItem._id);
    
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};