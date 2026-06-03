import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const CustomLoading = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Loading Animation */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="relative inline-block">
            <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black">
              <span className="relative inline-block animate-bounce text-orange-600">L</span>
              <span
                className="relative inline-block animate-bounce text-amber-600"
                style={{ animationDelay: '0.1s' }}
              >
                o
              </span>
              <span
                className="relative inline-block animate-bounce text-orange-500"
                style={{ animationDelay: '0.2s' }}
              >
                a
              </span>
              <span
                className="relative inline-block animate-bounce text-amber-500"
                style={{ animationDelay: '0.3s' }}
              >
                d
              </span>
              <span
                className="relative inline-block animate-bounce text-orange-600"
                style={{ animationDelay: '0.4s' }}
              >
                i
              </span>
              <span
                className="relative inline-block animate-bounce text-amber-600"
                style={{ animationDelay: '0.5s' }}
              >
                n
              </span>
              <span
                className="relative inline-block animate-bounce text-orange-500"
                style={{ animationDelay: '0.6s' }}
              >
                g
              </span>
              <span
                className="relative inline-block animate-bounce text-amber-500"
                style={{ animationDelay: '0.7s' }}
              >
                .
              </span>
              <span
                className="relative inline-block animate-bounce text-orange-600"
                style={{ animationDelay: '0.8s' }}
              >
                .
              </span>
              <span
                className="relative inline-block animate-bounce text-amber-600"
                style={{ animationDelay: '0.9s' }}
              >
                .
              </span>
            </div>
          </div>
        </div>

        {/* Main Spinner */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-orange-100 rounded-full"></div>
            
            {/* Animated spinner */}
            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-orange-500 border-t-amber-500 border-r-orange-400 border-b-amber-400 rounded-full absolute top-0 left-0 animate-spin"></div>
            
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-orange-500 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Optional: Loading text with gradient */}
        <div className="mt-4 sm:mt-6">
          <p className="text-sm sm:text-base md:text-lg font-medium bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent animate-pulse">
            Please wait...
          </p>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
          display: inline-block;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

export default CustomLoading;