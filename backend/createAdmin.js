require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@phonemax.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@phonemax.com');
      console.log('Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'PhoneMax',
      email: 'admin@phonemax.com',
      password: 'admin123', // Will be hashed automatically
      phone: '1234567890',
      address: 'PhoneMax HQ',
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@phonemax.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
    console.log('\nYou can now login and access /admin/products');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdminUser();
