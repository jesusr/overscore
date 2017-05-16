var path = require('path');
module.exports = function(config) {
  config.set({
    files: [
      'node_modules/sinon/pkg/sinon.js',
      'overscore.spec.js'
    ],
    frameworks: ['mocha'],
    preprocessors: {
      '*.js': ['webpack', 'sourcemap']
    },
    client: {
      chai: {
        includeStack: true
      }
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'build/coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text' },
        { type: 'text-summary' },
        { type: 'lcov', subdir: 'report-lcov' },
      ]
    },
    webpack: {
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
            presets: ['es2015'],
            plugins: [
              ['transform-es2015-classes', {
                'loose': true
              }]
            ]
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
        }, {
          test: /\.js$/,
          exclude: /(node_modules)|(Gulpfile\.tmp)|(assets)/,
          loader: 'istanbul-instrumenter-loader',
          query: {
            esModules: true
          }
        }]
      },
      resolve: {
        extensions: ['.webpack.js', '.web.js', '.js'],
        modules: [
          './snw-widget/src',
          'node_modules'
        ],
        alias: {
          modules: path.join(__dirname, 'node_modules'),
          underscore: path.join(__dirname, 'src/helpers/overscore.js')
        }
      },
      target: 'node',
      devtool: 'inline-source-map'
    },
    plugins: [
      require('karma-webpack'),
      require('istanbul-instrumenter-loader'),
      require('karma-mocha'),
      require('karma-coverage'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter'),
      require('karma-sourcemap-loader')
    ],
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: '50000'
  });
};
