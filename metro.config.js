// metro.config.js
const { getDefaultConfig } = require('metro-config');

/**
 * @type {import('metro-config').MetroConfig | Promise<import('metro-config').MetroConfig>}
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      // This is the critical line: tell Metro where the asset registry lives.
      assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
    },
    resolver: {
      ...defaultConfig.resolver,
      assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav'],
    },
  };
})();
