// Utils/deliveryUtils.js
export const calculateDistance = (coord1, coord2) => {
  if (!coord1?.[0] || !coord2?.[0]) return null;

  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;

  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatOrderId = (id) => {
  return `#${id.slice(-8).toUpperCase()}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  });
};

export const getOrderStatusConfig = (status) => {
  const configs = {
    'delivery-accepted': {
      label: 'Order Accepted',
      color: 'blue',
      step: 1,
      trackingMessage: 'Heading to restaurant',
      action: 'Pick Up Order',
    },
    picked: {
      label: 'Order Picked',
      color: 'orange',
      step: 2,
      trackingMessage: 'On the way to customer',
      action: 'Mark as Delivered',
    },
    delivered: {
      label: 'Order Delivered',
      color: 'green',
      step: 3,
      trackingMessage: 'Order Completed',
      action: null,
    },
  };
  return configs[status] || configs['delivery-accepted'];
};


export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};