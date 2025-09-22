import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, X, ArrowRight } from 'lucide-react';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  message?: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  message = "You need to be logged in to perform this action"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Login Required</h3>
                  <p className="text-blue-100 text-sm">Join the PhoneMax family!</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {message}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Create an account or sign in to continue shopping and access exclusive features!
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-center">Why join PhoneMax?</h4>
                <div className="space-y-2">
                  {[
                    "💚 Save items to your wishlist",
                    "🛒 Secure & easy checkout",
                    "📦 Track your orders",
                    "🎁 Exclusive member deals"
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
