import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Truck, RefreshCw, Award, Clock, Users } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: '2-Year Warranty',
    description: 'Complete peace of mind with our comprehensive warranty coverage.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on all orders over $50. Fast and secure delivery.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: RefreshCw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return your purchase within 30 days for a full refund.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Only the finest materials and components in every device.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for all your needs.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  {
    icon: Users,
    title: '500k+ Happy Customers',
    description: 'Join our community of satisfied customers worldwide.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
];

const Features: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PhoneMax?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best mobile experience through exceptional products and unmatched service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;