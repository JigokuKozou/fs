const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcPath = path.resolve(__dirname, 'web/src'); 
const distPath = path.resolve(__dirname, 'web/dist'); 

module.exports = {
    entry: path.resolve(srcPath, 'index.js'),
    output: {
        path: path.resolve(distPath),
        filename: 'index.[contenthash].js',
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              use: ['babel-loader'],
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
              ],
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: path.resolve(srcPath, 'template.html'),
          filename: 'index.html',
        }),
        new FileManagerPlugin({
          events: {
            onStart: {
              delete: [distPath],
            },
          },
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
    ],
    devServer: {
        watchFiles: distPath,
        port: 9000,
    },
};