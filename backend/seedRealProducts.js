require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Real product data with proper image URLs
const realProducts = [
  // Mobile Phones
  {
    name: 'iPhone 14 Pro Max',
    brand: 'Apple',
    price: 1099,
    originalPrice: 1199,
    description: 'The most advanced iPhone ever with Pro cameras, A16 Bionic chip, and Dynamic Island.',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-deep-purple-select?wid=470&hei=556&fmt=png-alpha&.v=1663703841896',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-back-deep-purple-select?wid=470&hei=556&fmt=png-alpha&.v=1663703841896'
    ],
    specifications: {
      display: '6.7" Super Retina XDR',
      processor: 'A16 Bionic Chip',
      memory: '6GB RAM',
      storage: '128GB',
      camera: '48MP Pro Camera System',
      battery: '4323mAh',
      os: 'iOS 16',
    },
    category: 'mobiles',
    subcategory: 'premium',
    stock: 50,
    rating: 4.8,
    reviews: [],
    featured: true,
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    brand: 'Samsung',
    price: 999,
    originalPrice: 1199,
    description: 'The ultimate Galaxy experience with S Pen built-in and 200MP camera.',
    images: [
      'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-s918-sm-s918bzkcins-534856516?$650_519_PNG$',
      'https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-s918-sm-s918bzkcins-534856517?$650_519_PNG$'
    ],
    specifications: {
      display: '6.8" Dynamic AMOLED 2X',
      processor: 'Snapdragon 8 Gen 2',
      memory: '12GB RAM',
      storage: '256GB',
      camera: '200MP Quad Camera',
      battery: '5000mAh',
      os: 'Android 13',
    },
    category: 'mobiles',
    subcategory: 'premium',
    stock: 35,
    rating: 4.7,
    reviews: [],
    featured: true,
  },
  {
    name: 'Google Pixel 7 Pro',
    brand: 'Google',
    price: 699,
    originalPrice: 799,
    description: 'The most helpful phone with Google Tensor G2 and advanced AI photography.',
    images: [
      'https://lh3.googleusercontent.com/yVcYzTU8PO1sF0XH9fE-L6Fmw7BwWmKuHtL6xZnTZnGKjc8iZhGCEWwbKWKcS1vQfTN=s400',
      'https://lh3.googleusercontent.com/2yTzQgO9KtBIzk3SbqC8FJKZjKLl_KBvZVZoGv0AEkNcEowL6FxSYcZZXUcZcZc=s400'
    ],
    specifications: {
      display: '6.7" LTPO OLED',
      processor: 'Google Tensor G2',
      memory: '12GB RAM',
      storage: '128GB',
      camera: '50MP Triple Camera',
      battery: '5000mAh',
      os: 'Android 13',
    },
    category: 'mobiles',
    subcategory: 'premium',
    stock: 25,
    rating: 4.6,
    reviews: [],
    featured: true,
  },
  
  // Laptops
  {
    name: 'MacBook Pro 14" M2',
    brand: 'Apple',
    price: 1999,
    originalPrice: 2299,
    description: 'Supercharged by M2 Pro or M2 Max chip for demanding workflows.',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=470&hei=556&fmt=png-alpha&.v=1671304673202',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-gallery2-202301?wid=470&hei=556&fmt=png-alpha&.v=1671477502724'
    ],
    specifications: {
      display: '14.2" Liquid Retina XDR',
      processor: 'Apple M2 Pro',
      memory: '16GB Unified Memory',
      storage: '512GB SSD',
      camera: '1080p FaceTime HD',
      battery: '70Wh',
      os: 'macOS Ventura',
    },
    category: 'laptops',
    subcategory: 'professional',
    stock: 15,
    rating: 4.9,
    reviews: [],
    featured: true,
  },
  {
    name: 'Dell XPS 13 Plus',
    brand: 'Dell',
    price: 1299,
    originalPrice: 1499,
    description: 'Premium ultrabook with 12th Gen Intel processors and stunning InfinityEdge display.',
    images: [
      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9320/media-gallery/xs13-9320-cnb-00055lf130-gy.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402',
      'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9320/media-gallery/notebook-xps-13-9320-gallery-2.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402'
    ],
    specifications: {
      display: '13.4" OLED InfinityEdge',
      processor: 'Intel Core i7-1260P',
      memory: '16GB LPDDR5',
      storage: '512GB SSD',
      camera: '720p HD Webcam',
      battery: '55Wh',
      os: 'Windows 11',
    },
    category: 'laptops',
    subcategory: 'ultrabook',
    stock: 20,
    rating: 4.5,
    reviews: [],
    featured: false,
  },

  // AirPods/Earbuds
  {
    name: 'AirPods Pro (2nd Gen)',
    brand: 'Apple',
    price: 249,
    originalPrice: 279,
    description: 'Adaptive Transparency, Personalized Spatial Audio, and up to 2x more Active Noise Cancellation.',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=470&hei=556&fmt=png-alpha&.v=1660803972361',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-gallery-2?wid=470&hei=556&fmt=png-alpha&.v=1660803946694'
    ],
    specifications: {
      display: 'N/A',
      processor: 'H2 Chip',
      memory: 'N/A',
      storage: 'N/A',
      camera: 'N/A',
      battery: '30 hours total',
      os: 'iOS/iPadOS/macOS',
    },
    category: 'airbuds',
    subcategory: 'premium',
    stock: 75,
    rating: 4.8,
    reviews: [],
    featured: true,
  },
  {
    name: 'Sony WF-1000XM4',
    brand: 'Sony',
    price: 199,
    originalPrice: 279,
    description: 'Industry-leading noise canceling truly wireless earbuds with exceptional sound quality.',
    images: [
      'https://www.sony.com/image/5d02da5df552836db894263b8ad3c4b4?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
      'https://www.sony.com/image/b926ac1c1e747b0bb25b5edf756a5b6e?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF'
    ],
    specifications: {
      display: 'N/A',
      processor: 'V1 Processor',
      memory: 'N/A',
      storage: 'N/A',
      camera: 'N/A',
      battery: '24 hours total',
      os: 'Universal',
    },
    category: 'airbuds',
    subcategory: 'premium',
    stock: 40,
    rating: 4.6,
    reviews: [],
    featured: false,
  },

  // Smartwatches
  {
    name: 'Apple Watch Series 8',
    brand: 'Apple',
    price: 399,
    originalPrice: 449,
    description: 'Advanced health features, Crash Detection, and temperature sensing capabilities.',
    images: [
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s8-aluminum-midnight-nc-45?wid=470&hei=556&fmt=png-alpha&.v=1661972673519',
      'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s8-aluminum-midnight-nc-45-sport-loop-midnight-nc?wid=470&hei=556&fmt=png-alpha&.v=1661837925979'
    ],
    specifications: {
      display: '1.9" Always-On Retina',
      processor: 'S8 SiP',
      memory: '32GB',
      storage: '32GB',
      camera: 'N/A',
      battery: '18 hours',
      os: 'watchOS 9',
    },
    category: 'smartwatches',
    subcategory: 'fitness',
    stock: 60,
    rating: 4.7,
    reviews: [],
    featured: true,
  },

  // Power Banks
  {
    name: 'Anker PowerCore 26800',
    brand: 'Anker',
    price: 65,
    originalPrice: 79,
    description: 'Ultra-high capacity portable charger with PowerIQ and VoltageBoost technology.',
    images: [
      'https://d2eebagvwr542c.cloudfront.net/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/1/a1277011_1.jpg',
      'https://d2eebagvwr542c.cloudfront.net/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/a/1/a1277011_2.jpg'
    ],
    specifications: {
      display: 'LED Power Indicator',
      processor: 'PowerIQ Technology',
      memory: 'N/A',
      storage: 'N/A',
      camera: 'N/A',
      battery: '26800mAh',
      os: 'Universal',
    },
    category: 'powerbanks',
    subcategory: 'high-capacity',
    stock: 100,
    rating: 4.5,
    reviews: [],
    featured: false,
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(realProducts);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    // Show summary
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          featured: { $sum: { $cond: ['$featured', 1, 0] } }
        }
      }
    ]);

    console.log('\n📊 Product Summary:');
    summary.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products (${cat.featured} featured)`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedProducts();
