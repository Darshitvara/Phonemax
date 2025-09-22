import React from 'react';
import { ArrowRight, Play, Sparkles, Zap, Shield, Truck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 border border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              New Generation Technology
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Hello to the
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Future
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Discover cutting-edge smartphones, accessories, and tech that redefine your digital lifestyle. Premium quality, unbeatable prices.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                Shop Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 flex items-center justify-center">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Fast Delivery</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Secure Payment</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-700">Free Shipping</p>
              </div>
            </div>
          </div>

          {/* Right Content - Mobile Image */}
          <div className="relative flex justify-center items-center animate-fade-in-up animation-delay-300">
            <div className="relative">
              {/* Main Phone Image Container */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <div className="w-80 h-96 bg-gradient-to-br from-gray-900 to-gray-700 rounded-[3rem] p-2 shadow-2xl">
                  <div className="w-full h-full bg-black rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=400" 
                      alt="Latest Smartphone" 
                      className="w-full h-full object-cover rounded-[2.5rem]"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                5G
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs text-gray-500">Active Users</p>
                    <p className="font-bold text-gray-900">2.5M+</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-float animation-delay-1000">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Global Reach</p>
                  <p className="font-bold text-gray-900">50+ Countries</p>
                </div>
              </div>

              {/* Decorative Sparkles */}
              <Sparkles className="absolute top-8 left-8 w-6 h-6 text-yellow-400 animate-pulse" />
              <Sparkles className="absolute bottom-16 right-16 w-4 h-4 text-blue-400 animate-pulse animation-delay-500" />
              <Sparkles className="absolute top-32 -left-8 w-5 h-5 text-purple-400 animate-pulse animation-delay-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;