var webpack = require('webpack');
var packageJson = require('./package.json');
var path = require('path');

module.exports = {
  entry: ['./overscore.js'],
  output: {
    filename: './' + packageJson.name + '.es5.complete.js',
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
  // Add minification
  plugins: [
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
