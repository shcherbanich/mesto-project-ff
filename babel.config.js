const presets = [
  ['@babel/preset-env', {
    targets: '> 0.25%, not dead',
    corejs: "3",
    useBuiltIns: "entry",
  }]
];

module.exports = { presets };