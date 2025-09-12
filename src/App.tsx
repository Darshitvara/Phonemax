import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import { initializeMockData } from './data/mockData';
import Layout from './components/Layout/Layout';
import GlobalLoader from './components/Loader/GlobalLoader';
import NotificationContainer from './components/Notifications/NotificationContainer';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BuyNow = lazy(() => import('./pages/BuyNow'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const LoginForm = lazy(() => import('./components/Auth/LoginForm'));
// const LoginForm = import( './components/Auth/LoginForm') ;
const RegisterForm = lazy(() => import('./components/Auth/RegisterForm'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminRoute = lazy(() => import('./components/Auth/AdminRoute'));
const ProtectedRoute = lazy(() => import('./components/Auth/ProtectedRoute'));

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <AppProviders>
      <Router>
        <Suspense fallback={<GlobalLoader />}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              <Route path="buy-now/:productId" element={
                <ProtectedRoute>
                  <BuyNow />
                </ProtectedRoute>
              } />
              <Route path="wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="order-confirmation/:orderId" element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              } />
              <Route path="track-order/:orderId" element={
                <ProtectedRoute>
                  <TrackOrder />
                </ProtectedRoute>
              } />
              <Route path="contact" element={<Contact />} />
              <Route path="profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="admin/products" element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
        <NotificationContainer />
      </Router>
    </AppProviders>
  );
}

export default App;