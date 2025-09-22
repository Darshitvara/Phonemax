import React from 'react';
import { Smartphone } from 'lucide-react';

const GlobalLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">PM</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">PhoneMax</span>
        </div>

        {/* Loading Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
            <Smartphone className="w-10 h-10 text-blue-600" />
          </div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <div className="text-xl font-semibold text-gray-700 mb-2">Loading...</div>
        <div className="text-sm text-gray-500">Setting up your mobile experience</div>
      </div>
    </div>
  );
};

export default GlobalLoader;
