const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ensure the JWT secret used to VERIFY matches the one used to SIGN tokens
// authController.generateToken uses process.env.JWT_SECRET || 'your-secret-key'
// Keep the same default here to avoid mismatches during verification
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Debug log
    
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.log('No token found'); // Debug log
      return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    console.log('Token found:', token.substring(0, 20) + '...'); // Debug log

  // Verify token
  const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded); // Debug log

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      console.log('User not found for token'); // Debug log
      return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log('User found:', user.email, 'Role:', user.role); // Debug log

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
