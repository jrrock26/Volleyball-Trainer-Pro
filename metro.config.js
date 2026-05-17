// metro.config.js
const { getDefaultConfig } = require('metro-config');

console.log("🔍 METRO CONFIG LOADED FROM:", __filename);

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  console.log("🔍 DEFAULT RESOLVER FROM RN:", defaultConfig.resolver);

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      // Explicitly set asset registry path to avoid missing-asset-registry-path
      assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
    },
    resolver: {
      ...defaultConfig.resolver,
      assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav'],
    },
  };
})();

