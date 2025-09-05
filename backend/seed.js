require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

// Mock data from frontend
const mockProducts = [
  // Mobile Phones
  {
    name: 'PhoneMax Pro 15',
    brand: 'PhoneMax',
    price: 999,
    originalPrice: 1199,
    description: 'The ultimate smartphone experience with cutting-edge technology and premium design.',
    images: [
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: '6.7" Super Retina XDR',
      processor: 'A17 Pro Chip',
      memory: '8GB RAM',
      storage: '256GB',
      camera: '48MP Triple Camera',
      battery: '4500mAh',
      os: 'iOS 17',
    },
    category: 'mobiles',
    subcategory: 'premium',
    stock: 25,
    rating: 4.8,
    reviews: [],
    featured: true,
  },
  {
    name: 'PhoneMax Ultra 14',
    brand: 'PhoneMax',
    price: 799,
    originalPrice: 899,
    description: 'Professional-grade mobile device with exceptional performance and sleek design.',
    images: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: '6.5" OLED Display',
      processor: 'Snapdragon 8 Gen 2',
      memory: '12GB RAM',
      storage: '512GB',
      camera: '50MP Quad Camera',
      battery: '5000mAh',
      os: 'Android 14',
    },
    category: 'mobiles',
    subcategory: 'flagship',
    stock: 15,
    rating: 4.6,
    reviews: [],
    featured: true,
  },
  {
    name: 'PhoneMax Lite 13',
    brand: 'PhoneMax',
    price: 399,
    description: 'Affordable excellence with premium features at an accessible price point.',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: '6.1" LCD Display',
      processor: 'MediaTek Dimensity 9000',
      memory: '6GB RAM',
      storage: '128GB',
      camera: '32MP Dual Camera',
      battery: '4000mAh',
      os: 'Android 13',
    },
    category: 'mobiles',
    subcategory: 'budget',
    stock: 40,
    rating: 4.3,
    reviews: [],
    featured: false,
  },
  // AirBuds
  {
    name: 'PhoneMax AirBuds Pro',
    brand: 'PhoneMax',
    price: 199,
    originalPrice: 249,
    description: 'Premium wireless earbuds with active noise cancellation and spatial audio.',
    images: [
      'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/4790268/pexels-photo-4790268.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: 'LED Status Indicator',
      processor: 'H2 Audio Chip',
      memory: '32MB',
      storage: '32MB',
      camera: 'N/A',
      battery: '30 hours with case',
      os: 'PhoneMax Audio OS',
    },
    category: 'airbuds',
    subcategory: 'premium',
    stock: 50,
    rating: 4.7,
    reviews: [],
    featured: true,
  },
  // Power Banks
  {
    name: 'PhoneMax PowerBank Ultra 20K',
    brand: 'PhoneMax',
    price: 79,
    originalPrice: 99,
    description: 'High-capacity 20,000mAh power bank with fast charging and multiple ports.',
    images: [
      'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/163117/phone-old-year-built-1955-163117.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: 'Digital Display',
      processor: 'Power Management IC',
      memory: 'N/A',
      storage: 'N/A',
      camera: 'N/A',
      battery: '20,000mAh',
      os: 'N/A',
    },
    category: 'powerbanks',
    subcategory: 'high-capacity',
    stock: 35,
    rating: 4.6,
    reviews: [],
    featured: true,
  },
  // Laptops
  {
    name: 'PhoneMax Laptop Pro 16',
    brand: 'PhoneMax',
    price: 1899,
    originalPrice: 2199,
    description: 'Professional laptop with powerful performance for creators and professionals.',
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: '16" 4K Retina Display',
      processor: 'Intel Core i9',
      memory: '32GB RAM',
      storage: '1TB SSD',
      camera: '1080p FaceTime HD',
      battery: '12 hours',
      os: 'macOS Sonoma',
    },
    category: 'laptops',
    subcategory: 'professional',
    stock: 12,
    rating: 4.8,
    reviews: [],
    featured: true,
  },
  // Smart Watches
  {
    name: 'PhoneMax Watch Pro',
    brand: 'PhoneMax',
    price: 399,
    originalPrice: 449,
    description: 'Advanced smartwatch with health monitoring and fitness tracking capabilities.',
    images: [
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1034063/pexels-photo-1034063.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    specifications: {
      display: '1.9" Always-On Display',
      processor: 'S9 SiP',
      memory: '64GB',
      storage: '64GB',
      camera: 'N/A',
      battery: '18 hours',
      os: 'watchOS 10',
    },
    category: 'smartwatches',
    subcategory: 'premium',
    stock: 25,
    rating: 4.7,
    reviews: [],
    featured: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@phonemax.com',
      phone: '+1234567890',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create products
    await Product.insertMany(mockProducts);
    console.log('Products created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();