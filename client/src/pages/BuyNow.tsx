import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MapPin, User, Phone, Mail, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RazorpayPaymentForm from '../components/Payment/RazorpayPaymentForm';
import { api } from '../utils/api';
import { Product } from '../types';

const shippingSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
});

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const BuyNow: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (productId) {
      api.get(`/products/${productId}`)
        .then(productData => {
          setProduct(productData);
        })
        .catch(error => {
          console.error('Error loading product:', error);
          // Fallback to localStorage
          const products = JSON.parse(localStorage.getItem('products') || '[]');
          const foundProduct = products.find((p: Product) => p.id === productId);
          setProduct(foundProduct || null);
        });
    }
  }, [productId]);

  // Handle shipping form submission -> move to payment step
  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep('payment');
  };

  // Handle successful Razorpay payment
  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      if (!product) return;

      const orderData = {
        items: [{
          productId: product.id,
          quantity: quantity,
        }],
        total: product.price * quantity * 1.08,
        shippingAddress: `${shippingData?.address}, ${shippingData?.city}, ${shippingData?.state} ${shippingData?.zipCode}`,
        paymentIntentId: paymentData.paymentId || paymentData.id,
      };

      if (isAuthenticated) {
        const order = await api.post('/orders', orderData);
        navigate(`/order-confirmation/${order.id || order._id}`);
      } else {
        // Guest fallback: store locally
        const order = {
          id: paymentData.paymentId || paymentData.id,
          userId: 'guest',
          items: [{ id: Date.now().toString(), product, quantity }],
          total: orderData.total,
          status: 'confirmed' as const,
          shippingAddress: orderData.shippingAddress,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        existingOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(existingOrders));
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  // Handle Razorpay payment error
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">
              The product you're trying to purchase could not be found.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = product.price * quantity;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Buy Now</h1>
          <p className="text-gray-600 mt-2">Complete your purchase quickly and securely</p>
        </motion.div>

        {/* Main grid */}
        {currentStep === 'shipping' ? (
        <form onSubmit={handleSubmit(onShippingSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('firstName')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="First name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('lastName')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      {...register('address')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Street address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      {...register('state')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      {...register('zipCode')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ZIP code"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* No payment form on this step */}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                {/* Product Details */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.brand}</p>
                      <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Continue to Payment
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  We'll collect payment details on the next step
                </p>
              </motion.div>
            </div>
          </div>
        </form>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-2">
              <button
                onClick={() => setCurrentStep('shipping')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Shipping</span>
              </button>
            </div>
            <RazorpayPaymentForm
              amount={finalTotal}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
              shippingData={shippingData || undefined}
            />
          </div>

          {/* Order Summary on payment step */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.brand}</p>
                    <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quantity</span>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button type="button" onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default BuyNow;