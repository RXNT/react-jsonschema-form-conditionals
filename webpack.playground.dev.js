const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // https://webpack.js.org/configuration/mode/
  mode: 'development',

  // This option controls if and how source maps are generated.
  // https://webpack.js.org/configuration/devtool/
  devtool: 'eval-cheap-module-source-map',

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './playground/page-index/index.js',
    sum: './playground/page-sum/index.js',
    'field-removal': './playground/page-field-removal/index.js'
  },

  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
          // Please note we are not running postcss here
        ]
      }
    ]
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080,
    writeToDisk: false // https://webpack.js.org/configuration/dev-server/#devserverwritetodisk-
  },

  // https://webpack.js.org/plugins/html-webpack-plugin/
  plugins: [
    new HtmlWebpackPlugin({
      template: './playground/page-index/tmpl.html',
      chunks: ['index'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './playground/page-sum/tmpl.html',
      chunks: ['sum'],
      filename: 'sum.html'
    }),
    new HtmlWebpackPlugin({
      template: './playground/page-field-removal/tmpl.html',
      chunks: ['field-removal'],
      filename: 'field-removal.html'
    })
  ]
};
