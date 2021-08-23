const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


let htmlPageNames = [];
let htmlWebpackPluginPages = [];

const getEntries = () =>
  glob.sync("./src/pages/**/*.entry.js").reduce((acc, item) => {
    const path = item.split("/");
    path.pop();
    const name = path.pop();
    acc[name] = item;
    htmlPageNames.push(name);

    htmlPageNames.forEach((page) =>
      htmlWebpackPluginPages.push(
        new HtmlWebpackPlugin({
          template: `./src/pages/${page}/${page}.html`,
          chunks: [`${page}`],
          inject: 'body',
          hash: false,
          filename: `${page}.html`,
          meta: {
            viewport: "width=device-width, initial-scale=1, shrink-to-fit=no",

          }
        })
      )
    );
    return acc;
  }, {});

module.exports = {
  entry: getEntries(),
  output: {
    filename: "scripts/[name].scripts.js",
    path: path.resolve(__dirname, "../docs"),
    assetModuleFilename: "assets/[name][ext]",
    clean: true,
    compareBeforeEmit: false
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              sourceMap: true,
              url: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webm|mp4|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].styles.css",
    }),
    new CleanWebpackPlugin(),
    ...htmlWebpackPluginPages,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ],
};