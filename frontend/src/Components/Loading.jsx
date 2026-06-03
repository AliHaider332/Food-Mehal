import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const Loading = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-amber-50 to-red-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Loading Animation */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="relative inline-block">
            <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-gray-800">
              <span className="relative inline-block animate-bounce">L</span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.1s' }}
              >
                o
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.2s' }}
              >
                a
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.3s' }}
              >
                d
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.4s' }}
              >
                i
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.5s' }}
              >
                n
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.6s' }}
              >
                g
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.7s' }}
              >
                .
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.8s' }}
              >
                .
              </span>
              <span
                className="relative inline-block animate-bounce"
                style={{ animationDelay: '0.9s' }}
              >
                .
              </span>
            </div>
          </div>
        </div>

        {/* Spinner */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-gray-200 rounded-full"></div>
            <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-[#FF3B30] border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
