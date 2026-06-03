import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineSearch,
} from 'react-icons/hi';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Main Container */}
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 Section */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            {/* Background blur effect */}
            <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-3xl"></div>

            {/* 404 Numbers */}
            <div className="relative flex items-center justify-center gap-2 sm:gap-4">
              <span
                className="text-8xl sm:text-9xl font-black text-gray-800 animate-bounce"
                style={{ animationDelay: '0ms' }}
              >
                4
              </span>
              <div className="relative">
                <span className="text-8xl sm:text-9xl font-black text-orange-500 relative inline-block animate-pulse">
                  0
                </span>
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-ping opacity-75"></div>
              </div>
              <span
                className="text-8xl sm:text-9xl font-black text-gray-800 animate-bounce"
                style={{ animationDelay: '200ms' }}
              >
                4
              </span>
            </div>
          </div>
        </div>

  

        {/* Message Section */}
        <div className="mb-10 space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-500 text-base sm:text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="h-1 w-20 bg-orange-500 rounded-full mx-auto mt-4"></div>
        </div>

    

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <HiOutlineHome className="text-xl" />
            Back to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <HiOutlineArrowLeft className="text-xl" />
            Go Back
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-12">
          <p className="text-xs text-gray-400">Error 404 • Page not found</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .animate-bounce {
            animation-duration: 0.8s;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
