const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

//module.exports = mergeConfig(getDefaultConfig(__dirname), config);
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  const customConfig = {
    resolver: {
      // Spread existing assetExts and add 'pte' and 'bin'
      assetExts: [...defaultConfig.resolver.assetExts, 'pte', 'bin'],
      // Preserve existing sourceExts (optional: add more if needed)
      sourceExts: [...defaultConfig.resolver.sourceExts],
    },
  };

  return mergeConfig(defaultConfig, customConfig);
})();