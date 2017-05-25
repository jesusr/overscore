var webpack = require('webpack');
var packageJson = require('./package.json');
var path = require('path');
var BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
  entry: ['./overscore.js'],
  output: {
    filename: './' + packageJson.name + '.es5.minimal.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    library: 'overscore'
  },

  // Turn on sourcemaps
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js'],
    modules: [
      './src',
      'node_modules'
    ],
    alias: {
      modules: path.join(__dirname, 'node_modules')
    }
  },
  externals: {
    // Use external version of jQuery
    jquery: 'jQuery'
  },
  // Add minification
  plugins: [
    new BabiliPlugin({}, {}),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
      PACKAGE_NAME: JSON.stringify(packageJson.name)
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'source-map-loader',
      enforce: 'pre'
    }, {
      test: /\.js$/,
      exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
      }
    }, {
      test: /\.hbs$/,
      exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
      loader: 'handlebars-template-loader'
    }, {
      test: /\.json$/,
      include: /(src\/data)/,
      exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
      loader: 'json-loader'
    }]
  },
  node: {
    fs: 'empty' // avoids error messages
  }
};
