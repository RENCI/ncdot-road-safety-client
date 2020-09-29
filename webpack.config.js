const path = require('path');

var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  filename: "index.html",
  inject: "body"
});

module.exports = {
  entry: [
    "./src/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "../server/rs_core/static/rs_core/js"),
    filename: "index_bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/, 
        use: [
          "style-loader", 
          "css-loader"
        ]
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
};