const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample product data with realistic details and working images
const sampleProducts = [
  {
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    price: 1199,
    originalPrice: 1299,
    description: "The most advanced iPhone yet with titanium design, A17 Pro chip, and pro camera system. Features a stunning 6.7-inch Super Retina XDR display with ProMotion technology.",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "6.7-inch Super Retina XDR OLED",
      processor: "A17 Pro Bionic",
      memory: "8GB RAM",
      storage: "256GB",
      camera: "48MP Main + 12MP Ultra Wide + 12MP Telephoto",
      battery: "4441 mAh",
      os: "iOS 17"
    },
    category: "mobiles",
    subcategory: "flagship",
    stock: 25,
    rating: 4.8,
    reviews: [],
    featured: true
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: 1099,
    originalPrice: 1199,
    description: "Ultimate Galaxy experience with S Pen, 200MP camera, and AI-powered features. The most powerful Galaxy smartphone with titanium frame.",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "6.8-inch Dynamic AMOLED 2X",
      processor: "Snapdragon 8 Gen 3",
      memory: "12GB RAM",
      storage: "512GB",
      camera: "200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto",
      battery: "5000 mAh",
      os: "Android 14"
    },
    category: "mobiles",
    subcategory: "flagship",
    stock: 30,
    rating: 4.7,
    reviews: [],
    featured: true
  },
  {
    name: "Google Pixel 8 Pro",
    brand: "Google",
    price: 899,
    originalPrice: 999,
    description: "Pure Android experience with Google AI at its core. Features the most advanced Pixel camera with Magic Eraser and Night Sight.",
    images: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "6.7-inch LTPO OLED",
      processor: "Google Tensor G3",
      memory: "12GB RAM",
      storage: "256GB",
      camera: "50MP Main + 48MP Ultra Wide + 48MP Telephoto",
      battery: "5050 mAh",
      os: "Android 14"
    },
    category: "mobiles",
    subcategory: "flagship",
    stock: 20,
    rating: 4.6,
    reviews: [],
    featured: true
  },
  {
    name: "OnePlus 12",
    brand: "OnePlus",
    price: 699,
    originalPrice: 799,
    description: "Flagship killer with Snapdragon 8 Gen 3, blazing fast charging, and OxygenOS. Experience flagship performance at an incredible price.",
    images: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "6.82-inch LTPO AMOLED",
      processor: "Snapdragon 8 Gen 3",
      memory: "12GB RAM",
      storage: "256GB",
      camera: "50MP Main + 64MP Periscope + 48MP Ultra Wide",
      battery: "5400 mAh",
      os: "OxygenOS 14"
    },
    category: "mobiles",
    subcategory: "performance",
    stock: 35,
    rating: 4.5,
    reviews: [],
    featured: false
  },
  {
    name: "AirPods Pro (3rd Gen)",
    brand: "Apple",
    price: 249,
    originalPrice: 279,
    description: "Next-level AirPods Pro with adaptive audio, personalized spatial audio, and enhanced noise cancellation. USB-C charging case included.",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "N/A",
      processor: "H2 Chip",
      memory: "N/A",
      storage: "N/A",
      camera: "N/A",
      battery: "6 hours + 30 hours with case",
      os: "N/A"
    },
    category: "airbuds",
    subcategory: "wireless",
    stock: 50,
    rating: 4.7,
    reviews: [],
    featured: true
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    brand: "Samsung",
    price: 179,
    originalPrice: 229,
    description: "Premium wireless earbuds with intelligent ANC, 360 Audio, and seamless connectivity. Hi-Fi sound quality with comfort fit.",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "N/A",
      processor: "Dual driver system",
      memory: "N/A",
      storage: "N/A",
      camera: "N/A",
      battery: "5 hours + 18 hours with case",
      os: "N/A"
    },
    category: "airbuds",
    subcategory: "premium",
    stock: 40,
    rating: 4.5,
    reviews: [],
    featured: false
  },
  {
    name: "Anker PowerCore 26800",
    brand: "Anker",
    price: 59,
    originalPrice: 79,
    description: "Ultra-high capacity portable charger with PowerIQ technology. Charge your devices multiple times with fast charging support.",
    images: [
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "LED Indicators",
      processor: "PowerIQ 2.0",
      memory: "N/A",
      storage: "N/A",
      camera: "N/A",
      battery: "26800 mAh",
      os: "N/A"
    },
    category: "powerbanks",
    subcategory: "high-capacity",
    stock: 60,
    rating: 4.5,
    reviews: [],
    featured: false
  },
  {
    name: "RAVPower 20000mAh PD Power Bank",
    brand: "RAVPower",
    price: 45,
    originalPrice: 65,
    description: "Fast charging power bank with USB-C PD and QC 3.0. Compact design with premium build quality for all your devices.",
    images: [
      "https://images.unsplash.com/photo-1558618734-648c9fab24b1?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1542385262-64ba1b77b12f?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "LED Display",
      processor: "PD 3.0 + QC 3.0",
      memory: "N/A",
      storage: "N/A",
      camera: "N/A",
      battery: "20000 mAh",
      os: "N/A"
    },
    category: "powerbanks",
    subcategory: "fast-charging",
    stock: 45,
    rating: 4.4,
    reviews: [],
    featured: false
  },
  {
    name: "MacBook Pro 14\" M3",
    brand: "Apple",
    price: 1999,
    originalPrice: 2199,
    description: "Revolutionary MacBook Pro with M3 chip, stunning Liquid Retina XDR display, and professional performance for demanding workflows.",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "14.2-inch Liquid Retina XDR",
      processor: "Apple M3",
      memory: "16GB RAM",
      storage: "512GB SSD",
      camera: "1080p FaceTime HD",
      battery: "18 hours",
      os: "macOS Sonoma"
    },
    category: "laptops",
    subcategory: "professional",
    stock: 10,
    rating: 4.8,
    reviews: [],
    featured: true
  },
  {
    name: "Dell XPS 13 Plus",
    brand: "Dell",
    price: 1299,
    originalPrice: 1499,
    description: "Ultra-premium laptop with stunning InfinityEdge display, latest Intel processors, and exceptional build quality for professionals.",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "13.4-inch 4K+ OLED",
      processor: "Intel Core i7-1360P",
      memory: "16GB LPDDR5",
      storage: "512GB PCIe SSD",
      camera: "720p HD",
      battery: "12 hours",
      os: "Windows 11"
    },
    category: "laptops",
    subcategory: "ultrabook",
    stock: 15,
    rating: 4.6,
    reviews: [],
    featured: false
  },
  {
    name: "Apple Watch Series 9",
    brand: "Apple",
    price: 399,
    originalPrice: 449,
    description: "Most advanced Apple Watch with S9 SiP, Double Tap gesture, and comprehensive health tracking. Stay connected and healthy.",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "1.9-inch Always-On Retina",
      processor: "S9 SiP",
      memory: "1GB RAM",
      storage: "64GB",
      camera: "N/A",
      battery: "18 hours",
      os: "watchOS 10"
    },
    category: "smartwatches",
    subcategory: "premium",
    stock: 40,
    rating: 4.6,
    reviews: [],
    featured: false
  },
  {
    name: "Samsung Galaxy Watch6 Classic",
    brand: "Samsung",
    price: 329,
    originalPrice: 399,
    description: "Classic smartwatch design with rotating bezel, comprehensive health monitoring, and long-lasting battery. Perfect blend of style and technology.",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&h=500&fit=crop&crop=center"
    ],
    specifications: {
      display: "1.5-inch Super AMOLED",
      processor: "Exynos W930",
      memory: "2GB RAM",
      storage: "16GB",
      camera: "N/A",
      battery: "24+ hours",
      os: "Wear OS 4"
    },
    category: "smartwatches",
    subcategory: "classic",
    stock: 30,
    rating: 4.4,
    reviews: [],
    featured: true
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products deleted');

    // Insert new products
    console.log('Inserting new products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} products inserted successfully`);

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@phonemax.com' });
    if (!adminExists) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@phonemax.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created (email: admin@phonemax.com, password: admin123)');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample products added:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
