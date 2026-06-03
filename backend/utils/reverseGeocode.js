import axios from 'axios';

export const getAddressFromCoords = async (lng, lat) => {
  try {
    const res = await axios.get(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      {
        params: {
          latitude: lat,
          longitude: lng,
          localityLanguage: 'en',
        },
      }
    );

    const city = res.data.city || res.data.locality || '';
    const country = res.data.countryName || '';

    return `${city}, ${country}`.trim();
  } catch (err) {
    console.log('Geocoding failed:', err.message);
    return '';
  }
};
