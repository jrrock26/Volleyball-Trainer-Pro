// metro.config.js
const { getDefaultConfig } = require('metro-config');

/**
 * Metro configuration
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig | Promise<import('metro-config').MetroConfig>}
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    resolver: {
      assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav'],
    },
  };
})();
