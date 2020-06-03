const webpack = require("webpack");
const path = require("path");

module.exports = {
  // https://webpack.js.org/configuration/mode/
  mode: 'production',
  // https://webpack.js.org/configuration/other-options/#cache
  cache: true,
  // https://webpack.js.org/configuration/entry-context/
  context: __dirname + "/src",
  entry: {
    main: "./index.js"
  },
  // https://webpack.js.org/concepts/output/
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/",
    filename: "rjsf-conditionals.js",
    library: "JSONSchemaForm",
    libraryTarget: "umd"
  },
  // https://webpack.js.org/concepts/plugins/
  plugins: [
    // https://webpack.js.org/plugins/define-plugin/
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ],
  // https://webpack.js.org/configuration/devtool/
  devtool: "cheap-source-map", // transformed code (lines only)
  // https://webpack.js.org/configuration/externals/
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
  // https://webpack.js.org/configuration/module/
  module: {
    // https://webpack.js.org/configuration/module/#modulerules
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
