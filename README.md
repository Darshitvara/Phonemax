# 📱 PhoneMax - Modern Electronics E-Commerce Platform

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-blue.svg)](https://tailwindcss.com/)

## 🚀 Project Overview

PhoneMax is a full-stack e-commerce platform specialized in electronics, featuring a modern React frontend with TypeScript and a robust Node.js backend. The platform offers a seamless shopping experience with advanced features like user authentication, shopping cart management, wishlist functionality, and order tracking.

## ✨ Key Features

### 🎨 Frontend Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Performance Optimized**: Code splitting and lazy loading for fast initial load
- **Interactive Animations**: Smooth transitions using Framer Motion
- **Real-time Notifications**: Toast notifications for cart operations
- **Advanced Product Filtering**: Search, category, price range, and sorting
- **Shopping Cart**: Add, remove, update quantities with persistent storage
- **Wishlist Management**: Save favorite products for later
- **User Authentication**: Login/Register with JWT token management
- **Order Management**: Place orders, track status, view history
- **Responsive Design**: Mobile-first approach with full responsiveness

### 🛠️ Backend Features
- **RESTful API**: Clean API architecture with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based secure authentication
- **Data Validation**: Input validation and error handling
- **CORS Enabled**: Cross-origin resource sharing configured
- **Product Management**: CRUD operations for products
- **Cart Management**: Persistent cart functionality
- **Order Processing**: Complete order lifecycle management

## 🏗️ Architecture Overview

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication forms
│   ├── Home/           # Homepage components
│   ├── Layout/         # Layout components (Header, Footer)
│   ├── Loader/         # Loading components
│   ├── Notifications/  # Toast notification system
│   └── Products/       # Product-related components
├── contexts/           # React Context providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── WishlistContext.tsx
│   └── NotificationContext.tsx
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── data/               # Mock data and helpers
```

### Backend Architecture
```
backend/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── productController.js
│   └── wishlistController.js
├── middleware/         # Custom middleware
│   └── authMiddleware.js
├── models/             # MongoDB schemas
│   ├── CartItem.js
│   ├── Order.js
│   ├── Product.js
│   ├── User.js
│   └── WishlistItem.js
├── routes/             # API routes
└── server.js           # Express server setup
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: React.lazy() for route-based code splitting
- **Lazy Loading**: Dynamic imports for better initial load times
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Optimization**: Vite build tool for fast bundling
- **Caching**: Local storage for cart and user preferences

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **API Pagination**: Efficient data loading for large datasets
- **Error Handling**: Comprehensive error management
- **Response Compression**: Optimized API responses

## 🎨 Design System

### Color Palette
- **Primary**: Blue to Purple gradient (`from-blue-600 to-purple-600`)
- **Background**: Light gradients (`from-blue-50 via-indigo-50 to-purple-50`)
- **Text**: Gray scale for optimal readability
- **Accent**: Green for success, Red for errors, Yellow for warnings

### Typography
- **Font**: System fonts with fallbacks
- **Hierarchy**: Clear heading structure (h1-h6)
- **Responsive**: Adaptive font sizes across devices

### Components
- **Consistent Spacing**: Tailwind CSS spacing scale
- **Interactive Elements**: Hover and focus states
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **MongoDB**: v6.x or higher (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phonemax-ecommerce
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Setup**
   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/phonemax
   JWT_SECRET=your-secret-key-here
   ```

5. **Seed Database**
   ```bash
   cd backend
   npm run seed
   ```

6. **Start Development Servers**
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   npm run dev
   ```

### 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item
- `DELETE /api/cart/:productId` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd backend
npm run test
```

## 📦 Build & Deployment

### Frontend Build
```bash
npm run build
```

### Backend Production
```bash
cd backend
npm start
```

## 🔮 Future Enhancements

- [ ] **Payment Integration**: Stripe/PayPal integration
- [ ] **Advanced Search**: Elasticsearch implementation
- [ ] **Product Reviews**: Rating and review system
- [ ] **Admin Dashboard**: Product and order management
- [ ] **Email Notifications**: Order confirmations and updates
- [ ] **Social Authentication**: Google/Facebook login
- [ ] **Progressive Web App**: PWA features
- [ ] **Real-time Chat**: Customer support chat
- [ ] **Analytics**: User behavior tracking
- [ ] **Multi-language**: Internationalization support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **MongoDB** for the flexible database solution

## 📞 Support

For support and questions, please reach out to:
- **Email**: support@phonemax.com
- **Issues**: GitHub Issues page

---

**Built with ❤️ by the PhoneMax Team**

*Making technology accessible to everyone, one device at a time.*
