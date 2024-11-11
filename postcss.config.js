const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    autoprefixer({ overrideBrowserslist: ['> 0.25%', 'not dead'] }),
    cssnano({ preset: 'default' }),
  ]
};