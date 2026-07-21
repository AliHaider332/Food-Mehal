// CustomerHome.jsx - Navigate to menu on View All
import React from 'react';

import CustomerHomeShop from './CustomerHomeShop';
import ComponentLoading from '../../ComponentLoading';
import HomeSliderState from './HomeSliderState';
import { useGetFrontPageShopsQuery } from '../../../services/customer.api';
import CustomerItemPortion from './CustomerItemPortion';

const CustomerHome = () => {
  // Fetch shops
  const { data: shopsData, isLoading: isShopsLoading } =
    useGetFrontPageShopsQuery();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HomeSliderState />

      {/* Recommended Shops Section */}
      {shopsData?.shops && shopsData.shops.length && !isShopsLoading > 0 ? (
        <CustomerHomeShop shops={shopsData.shops} />
      ) : (
        <ComponentLoading />
      )}

      {/* Popular Dishes Section */}
      <CustomerItemPortion />

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse"></div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Order Your Favorite Food?
          </h2>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Join thousands of happy customers and get delicious food delivered
            to your doorstep
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Ordering
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CustomerHome;
