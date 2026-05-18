// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Add support for TFLite / MediaPipe / ML models
  config.resolver.assetExts.push(
    'tflite',
    'lite',
    'bin',
    'task',
    'mlmodel',
    'mlmodelc'
  );

  // Ensure Swift native modules (MLBridge, ReplayKit) resolve correctly
  config.resolver.sourceExts.push('swift');

  return config;
})();
