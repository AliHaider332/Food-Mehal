import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTruck, FaFire } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { GiForkKnifeSpoon } from 'react-icons/gi';
const HomeSliderState = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  
  // Slider Functions
  const sliderImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      title: 'Delicious Food',
      subtitle: 'Order your favorite meals',
      cta: 'Order Now',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      title: 'Fast Delivery',
      subtitle: 'Get your food in minutes',
      cta: 'Learn More',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
      title: 'Best Restaurants',
      subtitle: 'Discover top-rated restaurants',
      cta: 'Explore',
    },
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + sliderImages.length) % sliderImages.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  // Auto-slide for hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <div className="relative mb-16">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
          style={{ height: '500px' }}
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          {sliderImages.map((image, index) => (
            <div
              key={image.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{
                opacity: index === currentSlide ? 1 : 0,
                zIndex: index === currentSlide ? 10 : 0,
              }}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent">
                <div className="flex items-center h-full px-8 md:px-16">
                  <div className="text-white max-w-2xl animate-fade-in-up">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                      {image.title}
                    </h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                      {image.subtitle}
                    </p>
                    <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      {image.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          {showArrows && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-20 hover:scale-110"
              >
                <FaChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 z-20 hover:scale-110"
              >
                <FaChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-8 bg-orange-500'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                } h-2 rounded-full`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdRestaurant className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">50+</h3>
          <p className="text-gray-600">Restaurants</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTruck className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">100+</h3>
          <p className="text-gray-600">Available Dishes</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaFire className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">10000+</h3>
          <p className="text-gray-600">Happy Customers</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <GiForkKnifeSpoon className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">200+</h3>
          <p className="text-gray-600">Cuisines</p>
        </div>
      </div>
    </>
  );
};

export default HomeSliderState;
