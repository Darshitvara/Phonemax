import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
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
    // Defer mock data initialization to idle time and only in development
    if (import.meta.env.DEV) {
      const run = () => {
        import('./data/mockData')
          .then((m) => m.initializeMockData())
          .catch(() => {/* noop in prod builds */});
      };

      // Use requestIdleCallback when available, else fallback to timeout
      const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void) => number);
      if (typeof ric === 'function') {
        ric(run);
      } else {
        setTimeout(run, 0);
      }
    }

    // Prefetch popular lazy routes after idle to speed up subsequent navigation
    const prefetch = () => {
      import('./pages/Products');
      import('./components/Auth/LoginForm');
      import('./components/Auth/RegisterForm');
    };
    const ric2 = (window as any).requestIdleCallback as undefined | ((cb: () => void) => number);
    if (typeof ric2 === 'function') {
      ric2(prefetch);
    } else {
      setTimeout(prefetch, 1500);
    }
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