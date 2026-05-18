module.exports = function (api) {
  api.cache(true);

  const isExpo = process.env.EXPO_ROUTER_APP_ROOT !== undefined;

  return {
    presets: [
      isExpo ? 'babel-preset-expo' : 'module:metro-react-native-babel-preset'
    ],
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
