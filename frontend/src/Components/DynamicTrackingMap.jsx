import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FiMaximize2,
  FiMinimize2,
  FiNavigation,
  FiMapPin,
} from 'react-icons/fi';
import { FaMotorcycle } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DynamicTrackingMap = ({
  shopLocation,
  deliveryLocation,
  deliveryBoyLocation,
  status,
  onRouteCalculated,
  isCustomerView = true,
  onLoad
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastKnownDeliveryLocation, setLastKnownDeliveryLocation] =
    useState(deliveryBoyLocation);
  useEffect(() => {
    if (mapInstanceRef.current && !loading && onLoad) {
      // Give a small delay to ensure everything is rendered
      const timer = setTimeout(() => {
        onLoad();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mapInstanceRef.current, loading, onLoad]);
  useEffect(() => {
    if (routeInfo && onLoad) {
      onLoad();
    }
  }, [routeInfo, onLoad]);
  // Update last known location when delivery boy location changes
  useEffect(() => {
    if (deliveryBoyLocation?.coordinates) {
      setLastKnownDeliveryLocation(deliveryBoyLocation);
    }
  }, [deliveryBoyLocation]);

  // Real-time updates for delivery boy location
  useEffect(() => {
    if (!isCustomerView || status?.toLowerCase() !== 'picked') return;

    const interval = setInterval(() => {
      if (mapInstanceRef.current && lastKnownDeliveryLocation?.coordinates) {
        calculateAndDisplayRoute();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isCustomerView, status, lastKnownDeliveryLocation]);

  // Always use delivery boy location as source and delivery location as destination
  const getRoutePoints = useCallback(() => {
    const source =
      deliveryBoyLocation?.coordinates || lastKnownDeliveryLocation?.coordinates
        ? deliveryBoyLocation || lastKnownDeliveryLocation
        : shopLocation;

    return {
      source: source,
      destination: deliveryLocation,
      routeColor:
        status === 'picked' || status === 'out for delivery'
          ? '#f59e0b'
          : '#3b82f6',
      routeName: 'Tracking Route',
    };
  }, [
    deliveryBoyLocation,
    lastKnownDeliveryLocation,
    shopLocation,
    deliveryLocation,
    status,
  ]);

  // Calculate and display route
  const calculateAndDisplayRoute = useCallback(async () => {
    const { source, destination, routeColor } = getRoutePoints();

    if (!source?.coordinates || !destination?.coordinates) {
      console.log('Missing coordinates:', { source, destination });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${source.coordinates[0]},${source.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const routeData = {
          distance: (route.distance / 1000).toFixed(2),
          duration: (route.duration / 60).toFixed(0),
          geometry: route.geometry,
          source: source,
          destination: destination,
        };
        setRouteInfo(routeData);
        if (onRouteCalculated) onRouteCalculated(routeData);

        // Remove existing route line
        if (window.currentRouteLine && mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(window.currentRouteLine);
        }

        const coordinates = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        const polyline = L.polyline(coordinates, {
          color: routeColor,
          weight: 5,
          opacity: 0.8,
          className: 'route-line',
        }).addTo(mapInstanceRef.current);
        window.currentRouteLine = polyline;

        if (!isFullscreen) {
          const bounds = polyline.getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setLoading(false);
    }
  }, [getRoutePoints, onRouteCalculated, isFullscreen]);

  // Initialize map and markers
  useEffect(() => {
    if (
      !mapRef.current ||
      !shopLocation?.coordinates ||
      !deliveryLocation?.coordinates
    )
      return;

    const { source } = getRoutePoints();
    const centerLat =
      ((source?.coordinates?.[1] || shopLocation.coordinates[1]) +
        deliveryLocation.coordinates[1]) /
      2;
    const centerLng =
      ((source?.coordinates?.[0] || shopLocation.coordinates[0]) +
        deliveryLocation.coordinates[0]) /
      2;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([centerLat, centerLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        className: 'map-tiles',
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 13);
    }

    // Clear existing non-tile layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer) && layer !== mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeLayer(layer);
        } catch (e) {
          console.log(e);
        }
      }
    });

    // Custom markers
    const createCustomMarker = (type, color, icon, label, coordinates) => {
      const iconHtml = `
        <div class="custom-marker">
          <div class="marker-pulse ${type}">
            <div class="marker-icon" style="background: ${color}">
              ${icon}
            </div>
            <div class="marker-label">${label}</div>
          </div>
        </div>
      `;

      const MarkerIcon = L.divIcon({
        className: 'custom-marker-container',
        html: iconHtml,
        iconSize: [40, 40],
        popupAnchor: [0, -20],
      });

      return L.marker([coordinates[1], coordinates[0]], { icon: MarkerIcon });
    };

    // Shop Marker
    const shopIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <rect x="3" y="6" width="18" height="15" rx="2"/>
      <path d="M3 10h18"/>
      <path d="M8 10v4"/>
      <path d="M16 10v4"/>
    </svg>`;

    createCustomMarker(
      'shop',
      'linear-gradient(135deg, #3b82f6, #2563eb)',
      shopIcon,
      'Restaurant',
      shopLocation.coordinates
    )
      .bindPopup('<b>🏪 Restaurant</b><br/>Pickup Location')
      .addTo(mapInstanceRef.current);

    // Customer/Delivery Location Marker
    const customerIcon = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`;

    createCustomMarker(
      'customer',
      'linear-gradient(135deg, #10b981, #059669)',
      customerIcon,
      'Delivery Location',
      deliveryLocation.coordinates
    )
      .bindPopup('<b>📍 Delivery Location</b><br/>Customer Address')
      .addTo(mapInstanceRef.current);

    // Delivery Boy Marker
    const currentDeliveryLocation =
      deliveryBoyLocation || lastKnownDeliveryLocation;
    if (currentDeliveryLocation?.coordinates) {
      const deliveryIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M5 20v-2a7 7 0 0 1 14 0v2"/>
      </svg>`;

      const isActive = status === 'picked' || status === 'out for delivery';
      const label = isCustomerView
        ? isActive
          ? 'Delivery Partner 🛵'
          : 'Delivery Partner'
        : 'Your Location';

      createCustomMarker(
        'delivery',
        'linear-gradient(135deg, #f59e0b, #d97706)',
        deliveryIcon,
        label,
        currentDeliveryLocation.coordinates
      )
        .bindPopup(
          isCustomerView
            ? '<b>🛵 Delivery Partner</b><br/>Tracking from current location'
            : '<b>📍 Your Current Location</b><br/>You are here'
        )
        .addTo(mapInstanceRef.current);
    }

    calculateAndDisplayRoute();

    // Fit bounds to show all markers
    const bounds = L.latLngBounds(
      [shopLocation.coordinates[1], shopLocation.coordinates[0]],
      [deliveryLocation.coordinates[1], deliveryLocation.coordinates[0]]
    );
    if (currentDeliveryLocation?.coordinates) {
      bounds.extend([
        currentDeliveryLocation.coordinates[1],
        currentDeliveryLocation.coordinates[0],
      ]);
    }
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer) => {
          if (
            !(layer instanceof L.TileLayer) &&
            layer !== mapInstanceRef.current
          ) {
            try {
              mapInstanceRef.current.removeLayer(layer);
            } catch (e) {
              console.log(e);
            }
          }
        });
      }
    };
  }, [
    shopLocation,
    deliveryLocation,
    deliveryBoyLocation,
    lastKnownDeliveryLocation,
    status,
    calculateAndDisplayRoute,
    isCustomerView,
  ]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        if (window.currentRouteLine && !isFullscreen) {
          const bounds = window.currentRouteLine.getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    }, 100);
  };

  return (
    <>
      <style>{`
        /* Map Container Styles */
        .dynamic-map-container {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 450px;
          border-radius: 12px;
          overflow: hidden;
          background: #f8fafc;
          isolation: isolate;
        }
        
        .dynamic-map-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9998;
          border-radius: 0;
        }
        
        /* Ensure map doesn't overflow */
        .dynamic-map-container .leaflet-container {
          z-index: 1;
        }
        
        /* Custom Marker Styles */
        .custom-marker-container {
          background: transparent;
          border: none;
        }
        
        .custom-marker {
          position: relative;
          width: 40px;
          height: 40px;
          cursor: pointer;
        }
        
        .marker-pulse {
          position: relative;
        }
        
        .marker-pulse.shop::before,
        .marker-pulse.customer::before,
        .marker-pulse.delivery::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          animation: pulse 1.5s ease-out infinite;
          z-index: -1;
        }
        
        .marker-pulse.delivery::before {
          animation: pulse 1s ease-out infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }
        
        .marker-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          border: 2px solid white;
        }
        
        .marker-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .marker-label {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          background: rgba(255,255,255,0.95);
          padding: 2px 10px;
          border-radius: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          color: #1f2937;
          font-family: sans-serif;
          backdrop-filter: blur(4px);
          pointer-events: none;
          z-index: 10;
        }
        
        /* Route Line Animation */
        .route-line {
          stroke-dasharray: 10;
          animation: dash 0.5s linear forwards;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
        
        /* Map Tiles Style */
        .map-tiles {
          filter: brightness(0.98) contrast(1.05);
        }
        
        /* Leaflet Popup Custom Styling */
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 0;
        }
        
        .leaflet-popup-content {
          margin: 10px 14px;
          font-size: 13px;
          font-weight: 500;
        }
        
        .leaflet-popup-tip {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        /* Control Button Styles - Lower z-index to not interfere with modals */
        .map-control-btn {
          position: absolute;
          background: white;
          border: none;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
          z-index: 100;
        }
        
        .map-control-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        /* ETA Banner Animation */
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .eta-banner {
          animation: slideUp 0.3s ease-out;
        }
        
        /* Loading Overlay */
        .map-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(2px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: inherit;
        }
        
        .loading-spinner {
          background: white;
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #f59e0b;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Fullscreen ETA Card */
        .fullscreen-eta-card {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 200;
        }
        
        /* Normal View ETA Banner */
        .normal-eta-banner {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          z-index: 100;
        }
        
        @media (min-width: 768px) {
          .normal-eta-banner {
            left: auto;
            right: 16px;
            bottom: 16px;
            width: auto;
          }
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .marker-label {
            font-size: 8px;
            bottom: -24px;
            padding: 2px 6px;
          }
          
          .marker-icon {
            width: 32px;
            height: 32px;
          }
          
          .custom-marker {
            width: 32px;
            height: 32px;
          }
        }
        
        /* Fix Leaflet controls z-index */
        .leaflet-control-container .leaflet-control {
          z-index: 50;
        }
        
        .leaflet-control-container .leaflet-control-zoom {
          z-index: 50;
        }
      `}</style>

      <div
        className={`dynamic-map-container ${isFullscreen ? 'fullscreen' : ''}`}
      >
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: '450px' }}
        />

        {/* Fullscreen Toggle Button */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="map-control-btn"
            style={{ top: '12px', right: '12px' }}
            aria-label="Fullscreen"
          >
            <FiMaximize2 className="w-4 h-4 text-gray-700" />
          </button>
        )}

        {/* Fullscreen Mode Controls */}
        {isFullscreen && (
          <>
            <button
              onClick={toggleFullscreen}
              className="map-control-btn"
              style={{ top: '16px', right: '16px' }}
              aria-label="Exit fullscreen"
            >
              <FiMinimize2 className="w-5 h-5 text-gray-700" />
            </button>

            {/* Fullscreen ETA Card */}
            {routeInfo &&
              isCustomerView &&
              status?.toLowerCase() === 'picked' && (
                <div className="fullscreen-eta-card">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                        <FiNavigation className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Distance to you</p>
                        <p className="text-sm font-bold text-gray-800">
                          {routeInfo.distance} km
                        </p>
                      </div>
                      <div className="w-px h-8 bg-gray-200"></div>
                      <div>
                        <p className="text-xs text-gray-500">Est. Arrival</p>
                        <p className="text-sm font-bold text-gray-800">
                          {routeInfo.duration} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="map-loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span className="text-sm text-gray-700">Loading route...</span>
            </div>
          </div>
        )}

        {/* ETA Banner for Normal View */}
        {!isFullscreen &&
          routeInfo &&
          isCustomerView &&
          status?.toLowerCase() === 'picked' && (
            <div className="normal-eta-banner">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 p-1.5 rounded-full">
                    <FaMotorcycle className="text-orange-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Estimated Delivery Time
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {routeInfo.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <FiMapPin className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-bold text-gray-800">
                      {routeInfo.distance} km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default DynamicTrackingMap;
