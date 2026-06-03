import React from 'react';
import {
  FaStore,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaArrowRight,
  FaChartLine ,
  FaUsers,
  FaBriefcase,
} from 'react-icons/fa';

const PremiumFeatureCard = ({ icon, title, description, gradient }) => (
  <div className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent">
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
    ></div>
    <div className="relative">
      <div
        className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
      >
        <div className="text-white text-xl">{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center gap-1 text-orange-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span>Learn more</span>
        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);
const SellerHeroPage = ({ setShowForm }) => {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
        <div className="relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative px-6 py-16 md:px-12 md:py-20 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative inline-flex items-center justify-center p-5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-xl">
                <FaStore className="text-4xl text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Launch Your Restaurant
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mt-2">
                on Our Platform
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the fastest-growing food delivery network and connect with
              thousands of hungry customers. Start accepting orders in less than
              24 hours.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaChartLine className="text-2xl text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    5,000+
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Active Restaurants
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    ↑ 124% growth
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaUsers className="text-2xl text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    100,000+
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Happy Customers
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    4.9 ★ average rating
                  </div>
                </div>
              </div>

              <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaBriefcase className="text-2xl text-orange-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    50,000+
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Orders Delivered
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    99.9% on-time
                  </div>
                </div>
              </div>
            </div>

            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <button
                onClick={() => setShowForm(true)}
                className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>Begin Registration</span>
                <FaArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-sm" />
                <span className="text-sm text-gray-600">No setup fees</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-sm" />
                <span className="text-sm text-gray-600">Cancel anytime</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500 text-sm" />
                <span className="text-sm text-gray-600">
                  24/7 priority support
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-100 px-6 py-12 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
              <FaCheckCircle className="text-orange-600 text-xs" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Platform Benefits
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Thrive
            </h2>
            <p className="text-gray-600">
              Comprehensive tools and resources to help your restaurant grow and
              succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PremiumFeatureCard
              icon={<FaStore />}
              title="Quick Setup"
              description="Get your restaurant online in minutes with our streamlined onboarding process"
              gradient="from-orange-500 to-red-500"
            />
            <PremiumFeatureCard
              icon={<FaChartLine />}
              title="Zero Commission"
              description="First 30 days commission-free. Pay only 5% after, competitive industry rates"
              gradient="from-amber-500 to-yellow-500"
            />
            <PremiumFeatureCard
              icon={<FaUsers />}
              title="Analytics Suite"
              description="Real-time insights into sales, customer behavior, and performance metrics"
              gradient="from-emerald-500 to-teal-500"
            />
            <PremiumFeatureCard
              icon={<FaTruck />}
              title="Marketing Tools"
              description="Built-in promotions, loyalty programs, and customer engagement features"
              gradient="from-purple-500 to-pink-500"
            />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <FaClock className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    24/7 Support
                  </div>
                  <div className="text-xs text-gray-500">
                    Dedicated account manager
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    Secure Payments
                  </div>
                  <div className="text-xs text-gray-500">
                    Weekly settlements in PKR
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  <FaTruck className="text-gray-400" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">
                    Delivery Network
                  </div>
                  <div className="text-xs text-gray-500">
                    Partner with top drivers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHeroPage;
