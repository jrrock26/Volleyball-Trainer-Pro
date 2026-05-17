// metro.config.js
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav'],
    },
  };
})();
