const path = require('path');

module.exports = {
  entry: [
    "./src/index.js"
  ],
  output: {
    path: path.resolve(__dirname, "../server/rs_core/static/rs_core/js"),
    filename: "index_bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/i, 
        use: [
          "style-loader", 
          "css-loader"
        ]
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(png|jpe?g|gif)$/i, 
        loader: "file-loader"
      }
    ]
  }
};