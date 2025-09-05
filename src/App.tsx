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
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const BuyNow = lazy(() => import('./pages/BuyNow'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Contact = lazy(() => import('./pages/Contact'));
const LoginForm = lazy(() => import('./components/Auth/LoginForm'));
const RegisterForm = lazy(() => import('./components/Auth/RegisterForm'));

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
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="buy-now/:productId" element={<BuyNow />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="orders" element={<Orders />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="track-order/:orderId" element={<TrackOrder />} />
              <Route path="contact" element={<Contact />} />
            </Route>
          </Routes>
        </Suspense>
        <NotificationContainer />
      </Router>
    </AppProviders>
  );
}

export default App;