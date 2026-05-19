module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@screens': './screens',
            '@components': './components',
            '@native': './native',
          },
        },
      ],
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
