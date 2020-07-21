const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const webpack = require("webpack");

rules.push({
  test: /\.css$/,
  use: [
    "style-loader",
    { loader: "css-loader", options: { importLoaders: 1 } },
    "postcss-loader",
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: [...plugins, new webpack.ExternalsPlugin("commonjs", ["electron"])],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
