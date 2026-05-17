// metro.config.js
const { getDefaultConfig } = require('metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'mp3', 'wav'],
  },
};