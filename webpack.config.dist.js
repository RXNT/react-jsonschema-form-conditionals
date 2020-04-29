var webpack = require("webpack");
var path = require("path");

module.exports = {
  mode: 'production',
  cache: true,
  context: __dirname + "/src",
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    filename: "rjsf-conditionals.js",
    library: "JSONSchemaForm",
    libraryTarget: "umd"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  devtool: "source-map",
  externals: {
    react: {
      root: "React",
      commonjs: "react",
      commonjs2: "react",
      amd: "react"
    },
    'react-dom': {
      root: "ReactDOM",
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: [
          path.join(__dirname, "src", "__mocks__"),
          path.join(__dirname, "node_modules", "core-js"),
          path.join(__dirname, "node_modules", "babel-runtime"),
        ],
      }
    ]
  }
};
