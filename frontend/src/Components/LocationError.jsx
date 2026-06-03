// src/components/LocationError.jsx

const LocationError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transform transition-all">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v4m0 4h.01"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Location Access Required
        </h2>
        <p className="text-gray-600 mb-6">
          Please allow location access to continue using our services. We need
          your location to provide you with the best experience.
        </p>
        <button
          // onClick={handleReload}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          Allow Location & Reload
        </button>
        <p className="text-sm text-gray-500 mt-4">
          You can enable location access in your browser settings
        </p>
      </div>
    </div>
  );
};

export default LocationError;
