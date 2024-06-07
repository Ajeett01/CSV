// babel.config.js
module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      // Ensure 'react-native-reanimated/plugin' is last
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-export-namespace-from'
    ],
};