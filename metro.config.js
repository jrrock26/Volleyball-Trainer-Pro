// metro.config.js for React Native 0.73 (no Expo)
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  return config;
})();
