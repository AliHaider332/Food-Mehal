import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DeliverySideOrderTracking = ({
  shopLocation,
  deliveryLocation,
  deliveryBoyLocation,
  status,
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const shopMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  const shopIcon = L.icon({
    iconUrl: '/shop.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const deliveryIcon = L.icon({
    iconUrl: '/delivery.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const customerIcon = L.icon({
    iconUrl: '/customer.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Initialize Map
  useEffect(() => {
    if (mapInstanceRef.current || !mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView([33.6844, 73.0479], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstanceRef.current);

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Shop Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !shopLocation?.coordinates) return;

    const [lng, lat] = shopLocation.coordinates;

    if (!shopMarkerRef.current) {
      shopMarkerRef.current = L.marker([lat, lng], {
        icon: shopIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('🏪 Shop');
    } else {
      shopMarkerRef.current.setLatLng([lat, lng]);
    }
  }, [shopLocation]);

  // Customer Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !deliveryLocation?.coordinates) return;

    const [lng, lat] = deliveryLocation.coordinates;

    if (!customerMarkerRef.current) {
      customerMarkerRef.current = L.marker([lat, lng], {
        icon: customerIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('🏠 Customer');
    } else {
      customerMarkerRef.current.setLatLng([lat, lng]);

      customerMarkerRef.current.setIcon(customerIcon);
    }
  }, [deliveryLocation]);

  // Delivery Boy Marker
  useEffect(() => {
    if (!mapInstanceRef.current || !deliveryBoyLocation?.coordinates) return;

    const [lng, lat] = deliveryBoyLocation.coordinates;

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = L.marker([lat, lng], {
        icon: deliveryIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('🛵 Delivery Boy');
    } else {
      driverMarkerRef.current.setLatLng([lat, lng]);

      driverMarkerRef.current.setIcon(deliveryIcon);
    }
  }, [deliveryBoyLocation]);

  // Route Tracking
  useEffect(() => {
    let cancelled = false;

    const drawRoute = async () => {
      if (!mapInstanceRef.current || !deliveryBoyLocation?.coordinates) return;

      const start = deliveryBoyLocation.coordinates;

      const end =
        status === 'picked'
          ? deliveryLocation?.coordinates
          : status === 'delivered'
          ? null
          : shopLocation?.coordinates;

      if (!end) {
        routeLineRef.current?.remove();
        routeLineRef.current = null;

        return;
      }

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`
        );

        const data = await response.json();

        if (cancelled || data.code !== 'Ok' || !data.routes?.length) return;

        const routeCoords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        if (!routeLineRef.current) {
          routeLineRef.current = L.polyline(routeCoords, {
            color: '#f59e0b',
            weight: 5,
          }).addTo(mapInstanceRef.current);
        } else {
          routeLineRef.current.setLatLngs(routeCoords);
        }

        mapInstanceRef.current.fitBounds(routeLineRef.current.getBounds(), {
          padding: [50, 50],
        });
      } catch (error) {
        console.log(error);
      }
    };

    drawRoute();

    return () => {
      cancelled = true;
    };
  }, [deliveryBoyLocation, shopLocation, deliveryLocation, status]);

  return (
    <div
      ref={mapRef}
      className="w-full relative"
      style={{
        height: '450px',
        minHeight: '450px',
        maxHeight: '450px',
        overflow: 'hidden',
        zIndex: 0,
        position: 'relative',
      }}
    />
  );
};

export default DeliverySideOrderTracking;
