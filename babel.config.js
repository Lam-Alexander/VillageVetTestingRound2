module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: "defaults", // Or specify the environments you want to support
        modules: 'auto', // Let Babel handle modules correctly
      },
    ],
    '@babel/preset-react',
  ],
};
