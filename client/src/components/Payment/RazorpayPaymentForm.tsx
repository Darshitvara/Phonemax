import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, IndianRupee } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { api } from '../../utils/api';

// Extend the Window interface to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentFormProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  customerData?: {
    name: string;
    email: string;
    phone: string;
  };
  shippingData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  isProcessing,
  setIsProcessing,
  customerData,
  shippingData,
}) => {
  const { addNotification } = useNotifications();
  const [message, setMessage] = useState<string>('');

  // Determine customer info from either prop
  const customerInfo = customerData || (shippingData ? {
    name: `${shippingData.firstName} ${shippingData.lastName}`,
    email: shippingData.email,
    phone: shippingData.phone,
  } : {
    name: 'Guest User',
    email: '',
    phone: '',
  });

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setMessage('');

    try {
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      // Create order on backend
      const orderData = await api.post('/payments/create-razorpay-order', {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      // Razorpay payment options
      const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
      if (!keyId) {
        const msg = 'Missing VITE_RAZORPAY_KEY_ID in frontend env (.env)';
        setMessage(msg);
        onError(msg);
        setIsProcessing(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PhoneMax Store',
        description: 'Payment for your order',
        image: '/logo.png', // Add your logo here
        order_id: orderData.id,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          order_id: orderData.id,
        },
        theme: {
          color: '#2563eb',
        },
        handler: function (response: any) {
          // Payment successful
          setMessage('Payment successful!');
          onSuccess({
            orderId: orderData.id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            ...response,
          });
          addNotification({
            type: 'success',
            title: 'Payment Successful!',
            message: 'Your payment has been processed successfully.',
            duration: 5000,
          });
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setMessage('Payment cancelled');
            addNotification({
              type: 'info',
              title: 'Payment Cancelled',
              message: 'You cancelled the payment process.',
              duration: 3000,
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response: any) {
        setMessage('Payment failed. Please try again.');
        onError(response.error.description || 'Payment failed');
        addNotification({
          type: 'error',
          title: 'Payment Failed',
          message: response.error.description || 'Payment failed. Please try again.',
          duration: 5000,
        });
        setIsProcessing(false);
      });

      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setMessage(errorMessage);
      onError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Payment Error',
        message: errorMessage,
        duration: 5000,
      });
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          <p className="text-sm text-gray-600">Secure payment powered by Razorpay</p>
        </div>
      </div>

      {/* Customer Information Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Billing Information</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Name:</strong> {customerInfo.name}</p>
          <p><strong>Email:</strong> {customerInfo.email}</p>
          <p><strong>Phone:</strong> {customerInfo.phone}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <CreditCard className="w-6 h-6 mx-auto mb-1 text-gray-600" />
            <span className="text-xs text-gray-600">Cards</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-lg font-bold text-purple-600">UPI</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-xs font-semibold text-blue-600">Net Banking</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <span className="text-xs font-semibold text-green-600">Wallets</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total Amount:</span>
          <div className="flex items-center space-x-1">
            <IndianRupee className="w-5 h-5 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">
              {amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Error/Success Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-4 ${
            message.includes('successful') 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : message.includes('cancelled')
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.includes('successful') ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}

      {/* Payment Button */}
      <motion.button
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            <IndianRupee className="w-5 h-5" />
            <span>Pay {amount.toFixed(2)} Securely</span>
          </>
        )}
      </motion.button>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mt-4">
        <Lock className="w-4 h-4" />
        <span>Secured by Razorpay • All payments are encrypted</span>
      </div>

      {/* Razorpay Branding */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-400">
          Powered by <span className="text-blue-600 font-semibold">Razorpay</span>
        </p>
      </div>
    </motion.div>
  );
};

export default RazorpayPaymentForm;