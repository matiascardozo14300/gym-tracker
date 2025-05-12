// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1) Quitar 'svg' de los assetExts
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// 2) Añadir 'svg' a los sourceExts
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// 3) Indicar el transformer para SVG
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

module.exports = config;
